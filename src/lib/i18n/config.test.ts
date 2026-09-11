import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { unstable_doesMiddlewareMatch as unstable_doesProxyMatch } from "next/experimental/testing/server"
import { config, proxy } from "../../proxy"
import { GET } from "../../app/language/route"
import { LANGUAGE_COOKIE, counterPostPath, discussionTerm, localeHref, preferredLocale, safeReturnPath } from "./config"

describe("country defaults and explicit language choices", () => {
    it("defaults Korea to Korean and all other or unknown countries to English", () => {
        expect(preferredLocale("KR", undefined)).toBe("ko")
        for (const country of ["US", "JP", "GB", null, ""]) expect(preferredLocale(country, undefined)).toBe("en")
        expect(preferredLocale("US", "ko")).toBe("ko")
        expect(preferredLocale("KR", "en")).toBe("en")
    })
    it("preserves the original post and query in a private country redirect", () => {
        const path = "/post/example?from=rss"
        for (const [country, locale] of [["KR", "ko"], ["US", "en"]]) {
            const result = proxy(new NextRequest(`https://www.basilry.kim${path}`, { headers: { "x-vercel-ip-country": country, "accept-language": "fr" } }))
            expect(result.status).toBe(307)
            expect(result.headers.get("location")).toBe(`https://www.basilry.kim/${locale}${path}`)
            expect(result.headers.get("cache-control")).toContain("private")
        }
    })
    it("prioritizes the explicit URL, then a saved choice, over country", () => {
        const options = { headers: { "x-vercel-ip-country": "KR", cookie: `${LANGUAGE_COOKIE}=en` } }
        expect(proxy(new NextRequest("https://www.basilry.kim/post", options)).headers.get("location")).toBe("https://www.basilry.kim/en/post")
        expect(proxy(new NextRequest("https://www.basilry.kim/ko/post", options)).headers.get("location")).toBeNull()
    })
    it("leaves APIs, assets, feeds and metadata routes outside country routing", () => {
        for (const url of ["/api/test", "/_next/static/main.js", "/content/a/pic.webp", "/sitemap.xml", "/robots.txt", "/feed.xml", "/en/feed.xml", "/language"]) {
            expect(unstable_doesProxyMatch({ config, nextConfig: {}, url })).toBe(false)
        }
        for (const url of ["/", "/post/example", "/search?q=AI"]) expect(unstable_doesProxyMatch({ config, nextConfig: {}, url })).toBe(true)
    })
})

describe("language selector redirect", () => {
    it("saves a manual choice and keeps the article, query and fragment", async () => {
        const next = "/ko/post/example?q=AI&category=ai-agents#section"
        const result = await GET(new NextRequest(`https://www.basilry.kim/language?locale=en&next=${encodeURIComponent(next)}`))
        expect(result.status).toBe(303)
        expect(result.headers.get("location")).toBe("https://www.basilry.kim/en/post/example?q=AI&category=ai-agents#section")
        expect(result.headers.get("set-cookie")).toContain(`${LANGUAGE_COOKIE}=en`)
        expect(result.headers.get("set-cookie")).toContain("HttpOnly")
        expect(result.headers.get("set-cookie")).toContain("Secure")
    })
    it("rejects unsupported languages and never accepts an external return URL", async () => {
        expect((await GET(new NextRequest("https://www.basilry.kim/language?locale=fr"))).status).toBe(400)
        for (const input of ["https://other.test/post", "//other.test", "/\\other.test", "/\nother.test"]) {
            expect(safeReturnPath(input)).toBe("/")
            const result = await GET(new NextRequest(`https://www.basilry.kim/language?locale=ko&next=${encodeURIComponent(input)}`))
            expect(result.headers.get("location")).toBe("https://www.basilry.kim/ko")
        }
    })
    it("keeps one counter and discussion identity across the old and new URLs", () => {
        for (const path of ["/post/example", "/ko/post/example", "/en/post/example"]) {
            expect(counterPostPath(path)).toBe("/post/example")
            expect(discussionTerm(path)).toBe("post/example")
        }
        expect(discussionTerm("/en/visitor")).toBe("visitor")
        expect(discussionTerm("/ko")).toBe("index")
        expect(counterPostPath("/en/post/register")).toBeNull()
        expect(counterPostPath("/en/search")).toBeNull()
        expect(localeHref("/ko/search?q=hello&page=2", "en")).toBe("/en/search?q=hello&page=2")
    })
})
