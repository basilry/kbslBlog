import { afterEach, describe, expect, it, vi } from "vitest"
import { communityOptions, communityPostKey, communityReturnPath } from "./config"
import { createBrowserIdentity, networkIdentity, readBrowserIdentity } from "./identity"
import { appOrigin, assertSameOrigin, readCommunityJson } from "./server"

afterEach(() => vi.unstubAllEnvs())
describe("community identity and request boundary", () => {
    it("uses daily hashes for trusted Vercel network limits without storing raw IP addresses", () => {
        const request = new Request("https://www.basilry.kim", { headers: { "x-vercel-forwarded-for": "192.0.2.1", "x-forwarded-for": "forged" } })
        vi.stubEnv("VERCEL", "0")
        expect(networkIdentity(request, "secret")).toBeNull()
        vi.stubEnv("VERCEL", "1")
        const today = networkIdentity(request, "secret", new Date("2026-09-14"))
        expect(today).toMatch(/^[a-f0-9]{64}$/)
        expect(networkIdentity(request, "secret", new Date("2026-09-15"))).not.toBe(today)
        expect(() => networkIdentity(new Request("https://www.basilry.kim", { headers: { "x-forwarded-for": "192.0.2.1" } }), "secret")).toThrow("Missing trusted network identity")
    })
    it("rejects tampered, invented, and old-secret browser identities", () => {
        const secret = "test-secret".repeat(5)
        const signed = createBrowserIdentity(secret)
        const hash = readBrowserIdentity(signed, secret)
        expect(hash).toMatch(/^[a-f0-9]{64}$/)
        expect(readBrowserIdentity(signed, secret)).toBe(hash)
        expect(readBrowserIdentity(signed.slice(0, -1) + (signed.endsWith("a") ? "b" : "a"), secret)).toBeNull()
        expect(readBrowserIdentity(signed, "different-secret")).toBeNull()
        expect(readBrowserIdentity("invented", secret)).toBeNull()
        expect(readBrowserIdentity(createBrowserIdentity(secret), secret)).not.toBe(hash)
    })
    it("preserves Korean/English return paths without accepting redirects outside post pages", () => {
        expect(communityReturnPath("/en/post/shared-article?from=search")).toBe("/en/post/shared-article?from=search#comments")
        expect(communityReturnPath("/ko/post/shared-article#old")).toBe("/ko/post/shared-article#comments")
        for (const value of ["//evil.test/a", "https://evil.test/a", "/\\evil.test", "/api/auth/callback", "/en/post/%2e%2e", "\n/en/post/hello", "/en/post/hello\t"]) expect(communityReturnPath(value)).toBe("/ko/post#comments")
        expect(communityPostKey("shared-article")).toBe("post/shared-article")
        for (const value of ["../secret", "register", "ko/post/a", "a".repeat(101)]) expect(communityPostKey(value)).toBeNull()
    })
    it("requires a complete explicit configuration before replacing existing comments", () => {
        vi.stubEnv("COMMUNITY_ENABLED", "false")
        expect(communityOptions().enabled).toBe(false)
        vi.stubEnv("COMMUNITY_ENABLED", "true")
        vi.stubEnv("SUPABASE_URL", "https://test.supabase.co")
        vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "public-test")
        vi.stubEnv("SUPABASE_SECRET_KEY", "server-test")
        vi.stubEnv("COMMUNITY_COOKIE_SECRET", "short")
        expect(communityOptions().enabled).toBe(false)
        vi.stubEnv("COMMUNITY_COOKIE_SECRET", "x".repeat(40))
        vi.stubEnv("COMMUNITY_AUTH_PROVIDERS", "google,unknown,google")
        expect(communityOptions()).toEqual({ enabled: true, providers: ["google"] })
    })
    it("checks the configured origin instead of trusting a forwarded host", async () => {
        vi.stubEnv("COMMUNITY_SITE_URL", "https://www.basilry.kim")
        const request = (origin: string) => new Request("https://www.basilry.kim/api/community/post", { method: "POST", headers: { origin, "content-type": "application/json", "x-forwarded-host": "evil.test" }, body: '{"action":"like","liked":true}' })
        expect(appOrigin(request("https://evil.test"))).toBe("https://www.basilry.kim")
        expect(() => assertSameOrigin(request("https://evil.test"))).toThrow("forbidden")
        expect(() => assertSameOrigin(request("null"))).toThrow("forbidden")
        expect(await readCommunityJson(request("https://www.basilry.kim"))).toEqual({ action: "like", liked: true })
        await expect(readCommunityJson(new Request("https://www.basilry.kim/api/community/post", { method: "POST", headers: { origin: "https://www.basilry.kim", "content-type": "application/json" }, body: JSON.stringify({ body: "a".repeat(12001) }) }))).rejects.toThrow("too_large")
    })
})
