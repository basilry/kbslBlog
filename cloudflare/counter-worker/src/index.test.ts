import { describe, expect, it } from "vitest"
import { counterDay, parsePayload, parseStatsPayload, parseViewPaths } from "./lib"

describe("counter request validation", () => {
    it("uses the Korean calendar day around midnight", () => {
        expect(counterDay(new Date("2026-09-06T14:59:59Z"))).toBe("2026-09-06")
        expect(counterDay(new Date("2026-09-06T15:00:00Z"))).toBe("2026-09-07")
    })

    it("requires a per-opening request ID and accepts a separately validated browser ID", () => {
        const eventId = "ef31a8c0-334a-4f33-8b46-3778282a2f06"
        const visitorId = "ab31a8c0-334a-4f33-8b46-3778282a2f06"
        expect(parsePayload({ eventId, visitorId, path: null })).toEqual({ eventId, visitorId, path: null })
        expect(parsePayload({ eventId, visitorId: visitorId.toUpperCase(), path: null })?.visitorId).toBe(visitorId)
        expect(parsePayload({ eventId, visitorId: "bad", path: null })).toBeNull()
        expect(parsePayload({ eventId, visitorId: null, path: null })).toBeNull()
        // Tabs running the previous client still record post openings without
        // claiming a new daily browser visit for every event.
        expect(parsePayload({ eventId, path: "/post/ai-progress-and-my-next-income" })).toEqual({ eventId, path: "/post/ai-progress-and-my-next-income" })
        expect(parsePayload({ eventId, path: null })).toEqual({ eventId, path: null })
        expect(parsePayload({ visitorId: eventId, path: null })).toBeNull()
        expect(parsePayload({ eventId: "visitor", path: null })).toBeNull()
        expect(parsePayload({ eventId, path: "/login" })).toBeNull()
        expect(parsePayload({ eventId, path: "/post/register" })).toBeNull()
        expect(parsePayload({ eventId, path: "/post/example?admin=true" })).toBeNull()
        expect(parsePayload({ eventId: eventId.toUpperCase(), path: null })?.eventId).toBe(eventId)
    })

    it("allows read-only statistics without any ID", () => {
        expect(parseStatsPayload({ path: null })).toEqual({ path: null })
        expect(parseStatsPayload({ path: "/post/one" })).toEqual({ path: "/post/one" })
        expect(parseStatsPayload({})).toBeNull()
        expect(parseStatsPayload({ path: "/post/register" })).toBeNull()
    })

    it("accepts a bounded, unique list of canonical post paths", () => {
        expect(parseViewPaths({ paths: ["/post/one", "/post/two", "/post/one"] })).toEqual(["/post/one", "/post/two"])
        expect(parseViewPaths({ paths: [] })).toBeNull()
        expect(parseViewPaths({ paths: ["/projects"] })).toBeNull()
        expect(parseViewPaths({ paths: Array.from({ length: 21 }, (_, index) => `/post/${index}`) })).toBeNull()
    })
})
