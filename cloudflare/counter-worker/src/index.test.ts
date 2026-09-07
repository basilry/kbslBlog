import { describe, expect, it } from "vitest"
import { counterDay, parsePayload, parseViewPaths } from "./lib"

describe("counter request validation", () => {
    it("uses the Korean calendar day around midnight", () => {
        expect(counterDay(new Date("2026-09-06T14:59:59Z"))).toBe("2026-09-06")
        expect(counterDay(new Date("2026-09-06T15:00:00Z"))).toBe("2026-09-07")
    })

    it("accepts only random UUIDs and canonical post paths", () => {
        const visitorId = "ef31a8c0-334a-4f33-8b46-3778282a2f06"
        expect(parsePayload({ visitorId, path: "/post/ai-progress-and-my-next-income" })).toEqual({ visitorId, path: "/post/ai-progress-and-my-next-income" })
        expect(parsePayload({ visitorId, path: null })).toEqual({ visitorId, path: null })
        expect(parsePayload({ visitorId: "visitor", path: null })).toBeNull()
        expect(parsePayload({ visitorId, path: "/login" })).toBeNull()
        expect(parsePayload({ visitorId, path: "/post/example?admin=true" })).toBeNull()
    })

    it("accepts a bounded, unique list of canonical post paths", () => {
        expect(parseViewPaths({ paths: ["/post/one", "/post/two", "/post/one"] })).toEqual(["/post/one", "/post/two"])
        expect(parseViewPaths({ paths: [] })).toBeNull()
        expect(parseViewPaths({ paths: ["/projects"] })).toBeNull()
        expect(parseViewPaths({ paths: Array.from({ length: 21 }, (_, index) => `/post/${index}`) })).toBeNull()
    })
})
