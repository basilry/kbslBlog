import { readFileSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"
import { describe, expect, it } from "vitest"

const original = readFileSync(new URL("../migrations/0001_create_counters.sql", import.meta.url), "utf8")
const migration = readFileSync(new URL("../migrations/0002_count_page_views.sql", import.meta.url), "utf8")

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
