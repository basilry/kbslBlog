import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { GET, POST } from "../../app/api/community/[postId]/route"
import { POST as authPost } from "../../app/api/community/auth/route"
import { GET as authCallback } from "../../app/api/auth/callback/route"
import { returnCookieName } from "./identity"

const mocks = vi.hoisted(() => ({
    getUser: vi.fn(), getSession: vi.fn(), rpc: vi.fn(), getPost: vi.fn(), signIn: vi.fn(), signOut: vi.fn(), exchange: vi.fn(),
    cookies: new Map<string, { value: string; options: any }>(),
}))
vi.mock("@lib/content/posts", () => ({ getPublicPost: mocks.getPost }))
vi.mock("./server", async original => ({
    ...await original<typeof import("./server")>(),
    communityClients: async () => ({
        auth: { auth: { getUser: mocks.getUser, getSession: mocks.getSession, signInWithOAuth: mocks.signIn, signOut: mocks.signOut, exchangeCodeForSession: mocks.exchange } },
        database: { rpc: mocks.rpc }, config: { cookieSecret: "a-test-secret-long-enough-for-cookie-signing" },
        store: { get: (key: string) => mocks.cookies.get(key), set: (key: string, value: string, options: any) => mocks.cookies.set(key, { value, options }) },
    }),
}))
const origin = "https://www.basilry.kim"
const context = { params: Promise.resolve({ postId: "shared-article" }) }
const request = (body?: unknown, source = origin) => new Request(`${origin}/api/community/shared-article`, body ? { method: "POST", headers: { origin: source, "content-type": "application/json" }, body: JSON.stringify(body) } : undefined)
const state = { likes: 2, liked: false, commentCount: 0, comments: [], hasMore: false, displayName: "Reader", moderator: false }
beforeEach(() => {
    vi.clearAllMocks(); mocks.cookies.clear()
    vi.stubEnv("COMMUNITY_SITE_URL", origin)
    vi.stubEnv("COMMUNITY_AUTH_PROVIDERS", "google,kakao")
    vi.stubEnv("VERCEL", "0")
    mocks.getPost.mockResolvedValue({ likeCount: 7 })
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: { name: "AuthSessionMissingError" } })
    mocks.rpc.mockResolvedValue({ data: state, error: null })
    mocks.signOut.mockResolvedValue({ error: null })
    mocks.signIn.mockResolvedValue({ data: { url: "https://project.supabase.co/auth/v1/authorize" }, error: null })
    mocks.exchange.mockResolvedValue({ error: null })
})
afterEach(() => vi.unstubAllEnvs())
describe("community Next.js request handlers", () => {
    it("retains historical likes and emits private uncached responses without auth metadata", async () => {
        const response = await GET(request(), context)
        expect(response.status).toBe(200)
        expect(response.headers.get("Cache-Control")).toContain("no-store")
        expect(await response.json()).toMatchObject({ likes: 9, user: null })
        const cookie = [...mocks.cookies.values()][0]
        expect(cookie.options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" })
        expect(mocks.getSession).not.toHaveBeenCalled()
    })
    it("rejects cross-origin writes and unknown posts before using privileged RPCs", async () => {
        expect((await POST(request({ action: "like", liked: true }, "https://evil.test"), context)).status).toBe(403)
        expect(mocks.rpc).not.toHaveBeenCalled()
        mocks.getPost.mockResolvedValue(null)
        expect((await POST(request({ action: "like", liked: true }), context)).status).toBe(404)
        expect(mocks.rpc).not.toHaveBeenCalled()
    })
    it("allows signed-browser likes without login but requires verified auth for comments", async () => {
        expect((await POST(request({ action: "like", liked: true, user_id: "forged", count: 999 }), context)).status).toBe(200)
        expect(mocks.rpc.mock.calls[0]).toEqual(["community_write", expect.objectContaining({ p_user_id: null, p_payload: { liked: true }, p_browser_hash: expect.stringMatching(/^[a-f0-9]{64}$/) })])
        mocks.rpc.mockClear()
        expect((await POST(request({ action: "create", id: crypto.randomUUID(), body: "Hello", name: "Reader" }), context)).status).toBe(401)
        expect(mocks.rpc).not.toHaveBeenCalled()
    })
    it("uses getUser identity and ignores client-supplied authors, moderator roles, and email", async () => {
        const userId = crypto.randomUUID(), commentId = crypto.randomUUID()
        mocks.getUser.mockResolvedValue({ data: { user: { id: userId, identities: [{ provider: "google" }], email: "private@example.test", user_metadata: { role: "admin" } } }, error: null })
        const response = await POST(request({ action: "create", id: commentId, body: "Hello", name: "Reader", author_id: "forged", role: "admin" }), context)
        expect(response.status).toBe(200)
        expect(mocks.rpc.mock.calls[0][1]).toMatchObject({ p_user_id: userId, p_post_key: "post/shared-article", p_payload: { id: commentId, body: "Hello", name: "Reader" } })
        expect(mocks.rpc.mock.calls[0][1].p_payload).not.toHaveProperty("author_id")
        const serialized = await response.text()
        expect(serialized).not.toContain("private@example.test")
        expect(serialized).not.toContain(userId)
        expect(serialized).toContain('"moderator":false')
        expect(mocks.getSession).not.toHaveBeenCalled()
    })
    it("preserves permission and rate errors while hiding internal database messages", async () => {
        mocks.rpc.mockResolvedValue({ data: null, error: { message: "rate_limited" } })
        const limited = await POST(request({ action: "like", liked: true }), context)
        expect(limited.status).toBe(429)
        expect(limited.headers.get("Retry-After")).toBe("60")
        mocks.rpc.mockResolvedValue({ data: null, error: { message: "internal server-test-secret database details" } })
        const failed = await GET(request(), context)
        expect(failed.status).toBe(503)
        expect(await failed.json()).toEqual({ error: "unavailable" })
    })
    it("does not treat anonymous or unrelated password accounts as social commenters", async () => {
        for (const account of [
            { id: crypto.randomUUID(), is_anonymous: true, identities: [] },
            { id: crypto.randomUUID(), identities: [{ provider: "email" }] },
        ]) {
            mocks.getUser.mockResolvedValue({ data: { user: account }, error: null })
            const response = await POST(request({ action: "create", id: crypto.randomUUID(), body: "Hello", name: "Reader" }), context)
            expect(response.status).toBe(401)
            expect(mocks.rpc).not.toHaveBeenCalled()
        }
    })
    it("starts only the selected providers and scopes callbacks to the app origin", async () => {
        const response = await authPost(request({ provider: "kakao", next: "/en/post/shared-article" }))
        expect(response.status).toBe(200)
        const options = mocks.signIn.mock.calls[0][0]
        expect(options.provider).toBe("kakao")
        expect(options.options.scopes).toBe("profile_nickname profile_image")
        const callback = new URL(options.options.redirectTo)
        expect(callback.origin).toBe(origin)
        expect(callback.pathname).toBe("/api/auth/callback")
        expect(callback.search).toBe("")
        expect(mocks.cookies.get(returnCookieName())?.value).toBe("/en/post/shared-article#comments")
        expect((await authPost(request({ provider: "github" }))).status).toBe(400)
        expect((await authPost(request({ action: "logout" }))).status).toBe(200)
        expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" })
    })
    it("exchanges the PKCE code, preserves the language, and handles denial without an open redirect", async () => {
        mocks.cookies.set(returnCookieName(), { value: "/en/post/shared-article#comments", options: {} })
        const callback = await authCallback(new Request(`${origin}/api/auth/callback?code=one-time`))
        expect(mocks.exchange).toHaveBeenCalledWith("one-time")
        expect(callback.headers.get("location")).toBe(`${origin}/en/post/shared-article#comments`)
        expect(mocks.cookies.get(returnCookieName())?.options.maxAge).toBe(0)
        mocks.exchange.mockClear()
        const denied = await authCallback(new Request(`${origin}/api/auth/callback?error=denied&error_description=private&next=${encodeURIComponent("//evil.test")}`))
        expect(mocks.exchange).not.toHaveBeenCalled()
        expect(denied.headers.get("location")).toBe(`${origin}/ko/post?community-auth=failed#comments`)
        expect(denied.headers.get("Referrer-Policy")).toBe("no-referrer")
    })
})
