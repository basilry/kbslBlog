import { readFile } from "node:fs/promises"
import { randomUUID } from "node:crypto"
import { PGlite } from "@electric-sql/pglite"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

const alice = "11111111-1111-4111-8111-111111111111"
const bob = "22222222-2222-4222-8222-222222222222"
const moderator = "33333333-3333-4333-8333-333333333333"
const browser = "a".repeat(64)
const post = "post/shared-article"
let db: PGlite
const write = (action: string, payload: Record<string, unknown>, user: string | null = alice, key = post, hash = browser) =>
    db.query("select public.community_write($1, $2, $3, $4, $5::jsonb)", [key, hash, user, action, JSON.stringify(payload)])
const snapshot = async (user: string | null = alice, key = post, offset = 0, hash = browser) => {
    const { rows } = await db.query<{ state: any }>("select public.community_snapshot($1, $2, $3, $4) as state", [key, hash, user, offset])
    return rows[0].state
}
const create = async (user = alice, key = post, parentId: string | null = null) => {
    const id = randomUUID()
    await write("create", { id, name: user === alice ? "Alice" : "Bob", body: "A comment", parentId }, user, key)
    return id
}
beforeAll(async () => {
    db = new PGlite()
    await db.exec("create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key);")
    await db.exec(await readFile(new URL("../../../supabase/migrations/202609140001_community.sql", import.meta.url), "utf8"))
}, 30000)
beforeEach(async () => {
    await db.exec("truncate public.community_comments, public.community_profiles, public.community_moderators, public.community_reports, public.community_likes, public.community_rate_limits, auth.users cascade")
    await db.query("insert into auth.users(id) values ($1), ($2), ($3)", [alice, bob, moderator])
    await db.query("insert into public.community_moderators(user_id) values ($1)", [moderator])
})
afterAll(async () => { await db?.close() })

describe("community PostgreSQL permissions and persistence", () => {
    it("limits changing browser identities from the same network", async () => {
        for (let index = 0; index < 60; index++) {
            await db.query("select public.community_write($1, $2, null, 'like', '{\"liked\":true}'::jsonb, $3)", [post, index.toString(16).padStart(64, "0"), "d".repeat(64)])
        }
        await expect(db.query("select public.community_write($1, $2, null, 'like', '{\"liked\":true}'::jsonb, $3)", [post, "e".repeat(64), "d".repeat(64)])).rejects.toThrow("rate_limited")
        expect((await snapshot(null)).likes).toBe(60)
    })
    it("denies direct browser table/RPC access even to authenticated users", async () => {
        for (const role of ["anon", "authenticated"]) {
            await db.exec(`set role ${role}`)
            try {
                await expect(db.query("select * from public.community_comments")).rejects.toThrow(/permission denied/)
                await expect(snapshot()).rejects.toThrow(/permission denied/)
                await expect(write("like", { liked: true })).rejects.toThrow(/permission denied/)
                await expect(db.query("insert into public.community_moderators values ($1)", [bob])).rejects.toThrow(/permission denied/)
            } finally { await db.exec("reset role") }
        }
        const result = await db.query<{ enabled: boolean }>("select bool_and(relrowsecurity) as enabled from pg_class where relname in ('community_profiles','community_moderators','community_comments','community_reports','community_likes','community_rate_limits')")
        expect(result.rows[0].enabled).toBe(true)
        await db.exec("set role service_role")
        try { await write("like", { liked: true }, null); expect((await snapshot(null)).likes).toBe(1) }
        finally { await db.exec("reset role") }
    })
    it("makes retries and login transitions idempotent for the same browser", async () => {
        await Promise.all([write("like", { liked: true }, null), write("like", { liked: true }, null)])
        expect((await snapshot(null)).likes).toBe(1)
        await write("like", { liked: true }, alice)
        expect((await snapshot(alice)).likes).toBe(1)
        await write("like", { liked: true }, null, post, "b".repeat(64))
        expect((await snapshot(null)).likes).toBe(2)
        await write("like", { liked: false }, alice)
        await write("like", { liked: false }, null)
        expect(await snapshot(null)).toMatchObject({ likes: 1, liked: false })
        expect((await snapshot(null, "post/another-article")).likes).toBe(0)
    })
    it("requires login and ownership, and rejects cross-post IDs", async () => {
        await expect(write("create", { id: randomUUID(), name: "Anon", body: "No" }, null)).rejects.toThrow("unauthorized")
        const id = await create()
        const original = (await snapshot()).comments[0]
        await expect(write("edit", { id, body: "Hijacked", updatedAt: original.updatedAt }, bob)).rejects.toThrow("forbidden")
        await expect(write("delete", { id }, bob)).rejects.toThrow("forbidden")
        await expect(write("delete", { id }, alice, "post/another-article")).rejects.toThrow("not_found")
        await expect(write("edit", { id, body: "Moderator edit", updatedAt: original.updatedAt }, moderator)).rejects.toThrow("forbidden")
        await write("edit", { id, body: "Updated", updatedAt: original.updatedAt })
        expect((await snapshot()).comments[0].body).toBe("Updated")
        await expect(write("edit", { id, body: "Stale edit", updatedAt: original.updatedAt })).rejects.toThrow("conflict")
    })
    it("keeps a deleted parent's replies and rejects nesting or a different post", async () => {
        const id = await create()
        const reply = await create(bob, post, id)
        await expect(create(bob, post, reply)).rejects.toThrow("invalid_parent")
        await expect(create(bob, "post/another-article", id)).rejects.toThrow("invalid_parent")
        await write("delete", { id })
        await write("delete", { id })
        const state = await snapshot()
        expect(state.commentCount).toBe(1)
        expect(state.comments[0]).toMatchObject({ status: "deleted", body: "", name: "" })
        expect(state.comments[0].replies[0].body).toBe("A comment")
        await expect(create(bob, post, id)).rejects.toThrow("invalid_parent")
    })
    it("retries a comment UUID once and prevents someone else claiming that UUID", async () => {
        const id = await create()
        await write("create", { id, name: "Alice", body: "A comment" })
        expect((await snapshot()).commentCount).toBe(1)
        await expect(write("create", { id, name: "Bob", body: "Stolen" }, bob)).rejects.toThrow("forbidden")
    })
    it("hides content from readers while retaining moderator evidence and unique reports", async () => {
        const id = await create()
        await write("report", { id, reason: "spam" }, bob)
        await write("report", { id, reason: "spam" }, bob)
        await expect(write("hide", { id, role: "admin", user_id: moderator }, bob)).rejects.toThrow("forbidden")
        expect((await snapshot(bob)).comments[0]).toMatchObject({ reported: true, reportCount: 0 })
        expect((await snapshot(moderator)).comments[0].reportCount).toBe(1)
        await write("hide", { id }, moderator)
        const publicState = await snapshot(null)
        expect(publicState.comments[0]).toMatchObject({ status: "hidden", body: "" })
        expect(publicState.commentCount).toBe(0)
        expect(JSON.stringify(publicState)).not.toContain(alice)
        expect((await snapshot(moderator)).comments[0].body).toBe("A comment")
        await expect(write("edit", { id, body: "Unhide me" })).rejects.toThrow("forbidden")
        await write("restore", { id }, moderator)
        expect((await snapshot(null)).comments[0].body).toBe("A comment")
    })
    it("enforces body length and per-user limits across posts", async () => {
        await expect(write("create", { id: randomUUID(), name: "A", body: " " })).rejects.toThrow("invalid_input")
        await expect(write("create", { id: randomUUID(), name: "A", body: "x".repeat(2001) })).rejects.toThrow("invalid_input")
        for (let index = 0; index < 5; index++) await create(alice, `post/article-${index}`)
        await expect(create(alice, "post/other")).rejects.toThrow("rate_limited")
        await expect(create(bob)).resolves.toBeTypeOf("string")
    })
    it("bounds root pages, includes replies, and retains stored likes across reconnects", async () => {
        for (let index = 0; index < 12; index++) {
            await db.query("insert into public.community_comments(id, post_key, author_id, author_name, body, created_at) values ($1, $2, $3, 'A', 'body', now() + $4::integer * interval '1 second')", [randomUUID(), post, alice, index])
        }
        const page1 = await snapshot(null)
        const page2 = await snapshot(null, post, 10)
        expect(page1.comments).toHaveLength(10)
        expect(page1.hasMore).toBe(true)
        expect(page2.comments).toHaveLength(2)
        expect(page2.hasMore).toBe(false)
        expect(new Set([...page1.comments, ...page2.comments].map(item => item.id)).size).toBe(12)
        await write("like", { liked: true }, null)
        const saved = await db.dumpDataDir()
        const reopened = new PGlite({ loadDataDir: saved })
        try { expect((await reopened.query<{ count: number }>("select count(*)::integer as count from public.community_likes")).rows[0].count).toBe(1) }
        finally { await reopened.close() }
    }, 20000) // Starts a second PostgreSQL WASM engine and restores its data directory.
})
