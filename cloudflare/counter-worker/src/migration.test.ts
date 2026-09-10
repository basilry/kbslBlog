import { readFileSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"
import { randomUUID } from "node:crypto"
import { afterEach, describe, expect, it, vi } from "vitest"
import worker from "./index"

const original = readFileSync(new URL("../migrations/0001_create_counters.sql", import.meta.url), "utf8")
const migration = readFileSync(new URL("../migrations/0002_count_page_views.sql", import.meta.url), "utf8")
const dailyMigration = readFileSync(new URL("../migrations/0003_daily_site_visitors.sql", import.meta.url), "utf8")

afterEach(() => vi.useRealTimers())

describe("page-view counter migration and atomic increments", () => {
    it("preserves previous totals, counts every new opening, and applies a retried request only once", () => {
        const db = new DatabaseSync(":memory:")
        try {
            db.exec(original)
            db.exec("INSERT INTO all_visitors VALUES ('old-browser', '2026-09-08'); INSERT INTO daily_visitors VALUES ('2026-09-08', 'old-browser', '2026-09-08'); INSERT INTO post_view_dedupe VALUES ('2026-09-08', '/post/one', 'old-browser', '2026-09-08');")
            db.exec(migration)
            const open = db.prepare("INSERT OR IGNORE INTO page_view_events (event_id, day, path, created_at) VALUES (?, ?, ?, ?)")
            const total = () => db.prepare("SELECT views FROM site_totals").get()?.views
            const article = () => db.prepare("SELECT views FROM post_totals WHERE path = '/post/one'").get()?.views
            expect(total()).toBe(1)
            expect(article()).toBe(1)
            open.run("opening-one", "2026-09-08", "/post/one", "2026-09-08")
            open.run("opening-two", "2026-09-08", "/post/one", "2026-09-08")
            expect(total()).toBe(3)
            expect(article()).toBe(3)
            open.run("opening-two", "2026-09-08", "/post/one", "2026-09-08")
            expect(total()).toBe(3)
            open.run("home-opening", "2026-09-08", null, "2026-09-08")
            expect(total()).toBe(4)
            expect(article()).toBe(3)
            open.run("next-day-opening", "2026-09-09", "/post/one", "2026-09-09")
            expect(total()).toBe(5)
            expect(article()).toBe(4)
            expect(db.prepare("SELECT views FROM daily_totals WHERE day = '2026-09-09'").get()?.views).toBe(1)
            expect(db.prepare("SELECT views FROM daily_totals WHERE day = '2026-09-08'").get()?.views).toBe(4)
            db.exec(migration)
            expect(total()).toBe(5)
            expect(article()).toBe(4)
            db.exec("DELETE FROM page_view_events WHERE day < '2026-09-09'")
            expect(total()).toBe(5)
            expect(article()).toBe(4)
        } finally {
            db.close()
        }
    })
})

describe("daily browser visitors with repeatable post views", () => {
    it("preserves historical aggregates and makes only new daily browser inserts increase site totals", () => {
        const db = new DatabaseSync(":memory:")
        try {
            db.exec(original)
            db.exec("INSERT INTO all_visitors VALUES ('old-browser', '2026-09-08'); INSERT INTO daily_visitors VALUES ('2026-09-08', 'old-browser', '2026-09-08'); INSERT INTO post_view_dedupe VALUES ('2026-09-08', '/post/one', 'old-browser', '2026-09-08');")
            db.exec(migration)
            db.exec("INSERT INTO page_view_events VALUES ('previous-view', '2026-09-08', '/post/one', '2026-09-08')")
            const total = () => db.prepare("SELECT views FROM site_totals").get()?.views
            const article = () => db.prepare("SELECT views FROM post_totals WHERE path = '/post/one'").get()?.views
            expect(total()).toBe(2)
            expect(article()).toBe(2)
            db.exec(dailyMigration)
            expect(total()).toBe(2)
            expect(article()).toBe(2)
            expect(db.prepare("SELECT views FROM daily_totals WHERE day = '2026-09-08'").get()?.views).toBe(2)

            const visit = db.prepare("INSERT OR IGNORE INTO daily_site_visitors (day, visitor_id) VALUES (?, ?)")
            const open = db.prepare("INSERT OR IGNORE INTO page_view_events VALUES (?, ?, ?, ?)")
            visit.run("2026-09-09", "same-browser")
            visit.run("2026-09-09", "same-browser")
            open.run("opening-one", "2026-09-09", "/post/one", "2026-09-09")
            open.run("opening-two", "2026-09-09", "/post/one", "2026-09-09")
            open.run("opening-two", "2026-09-09", "/post/one", "2026-09-09")
            expect(total()).toBe(3)
            expect(article()).toBe(4)
            expect(db.prepare("SELECT views FROM daily_totals WHERE day = '2026-09-09'").get()?.views).toBe(1)

            // Reapplying the migration and removing expired dedupe rows must
            // never recalculate or subtract historical counters.
            db.exec(dailyMigration)
            db.exec("DELETE FROM page_view_events; DELETE FROM daily_site_visitors;")
            expect(total()).toBe(3)
            expect(article()).toBe(4)
        } finally {
            db.close()
        }
    })

    it("runs the Worker SQL for daily dedupe, retries, old clients, concurrent visits and read-only polling", async () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2026-09-10T14:59:59Z"))
        const db = new DatabaseSync(":memory:")
        const sql: string[] = []
        // Execute the Worker's real prepared SQL and migration triggers against
        // SQLite. Wrangler integration separately verifies Cloudflare D1 itself.
        function prepare(query: string) {
            sql.push(query)
            let values: (string | number | null)[] = []
            const prepared = {
                bind(...args: (string | number | null)[]) { values = args; return prepared },
                all() { return { success: true, results: db.prepare(query).all(...values) } },
            }
            return prepared
        }
        const env = { DB: {
            prepare,
            async batch(statements: ReturnType<typeof prepare>[]) {
                db.exec("BEGIN")
                try {
                    const results = statements.map((statement) => statement.all())
                    db.exec("COMMIT")
                    return results
                } catch (error) {
                    db.exec("ROLLBACK")
                    throw error
                }
            },
        } } as unknown as Env
        async function post(route: string, body: unknown) {
            const content = JSON.stringify(body)
            const response = await worker.fetch(new Request(`https://counter.example/${route}`, {
                method: "POST",
                headers: { Origin: "https://www.basilry.kim", "Content-Type": "application/json", "Content-Length": String(Buffer.byteLength(content)), "User-Agent": "Mozilla/5.0" },
                body: content,
            }), env, {} as ExecutionContext)
            expect(response.status).toBe(200)
            return await response.json() as { todayViews: number; totalViews: number; postViews: Record<string, number>; date: string }
        }
        try {
            db.exec(original)
            db.exec(migration)
            db.exec(dailyMigration)
            const path = "/post/one"
            const visitorId = randomUUID()
            const firstEvent = { eventId: randomUUID(), visitorId, path }
            const first = await post("visit", firstEvent)
            expect(first).toMatchObject({ todayViews: 1, totalViews: 1, postViews: { [path]: 1 }, date: "2026-09-10" })
            expect(await post("visit", firstEvent)).toMatchObject({ todayViews: 1, totalViews: 1, postViews: { [path]: 1 } })

            await Promise.all(Array.from({ length: 10 }, () => post("visit", { eventId: randomUUID(), visitorId, path })))
            expect(await post("stats", { path })).toMatchObject({ todayViews: 1, totalViews: 1, postViews: { [path]: 11 } })
            expect(await post("visit", { eventId: randomUUID(), visitorId: randomUUID(), path: null }))
                .toMatchObject({ todayViews: 2, totalViews: 2, postViews: {} })
            expect(await post("visit", { eventId: randomUUID(), path }))
                .toMatchObject({ todayViews: 2, totalViews: 2, postViews: { [path]: 12 } })

            const pollStart = sql.length
            await post("stats", { path, eventId: randomUUID(), visitorId: randomUUID() })
            await post("views", { paths: [path] })
            await post("count", { path, eventId: randomUUID(), visitorId: randomUUID() })
            expect(sql.slice(pollStart).every((query) => query.startsWith("SELECT "))).toBe(true)

            vi.setSystemTime(new Date("2026-09-10T15:00:00Z"))
            expect(await post("stats", { path })).toMatchObject({ date: "2026-09-11", todayViews: 0, totalViews: 2 })
            expect(await post("visit", { eventId: randomUUID(), visitorId, path }))
                .toMatchObject({ date: "2026-09-11", todayViews: 1, totalViews: 3, postViews: { [path]: 13 } })
            expect(db.prepare("SELECT views FROM daily_totals WHERE day = '2026-09-10'").get()?.views).toBe(2)
        } finally {
            db.close()
        }
    })
})
