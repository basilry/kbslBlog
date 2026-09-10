import { afterEach, describe, expect, it, vi } from "vitest"
import { dailyVisitorId, readDailyVisitor } from "./visitor"

function storage() {
    const entries = new Map<string, string>()
    return { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => { entries.set(key, value) } }
}
const first = "ef31a8c0-334a-4f33-8b46-3778282a2f06"
const second = "ef31a8c0-334a-4f33-8b46-3778282a2f07"
afterEach(() => vi.unstubAllGlobals())

describe("daily browser visitor identity", () => {
    it("reuses the ID across openings and rotates on the next Korean day", () => {
        const saved = storage()
        const create = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second)
        expect(readDailyVisitor(saved, "2026-09-10", create)).toBe(first)
        expect(readDailyVisitor(saved, "2026-09-10", create)).toBe(first)
        expect(readDailyVisitor(saved, "2026-09-11", create)).toBe(second)
        expect(create).toHaveBeenCalledTimes(2)
    })

    it("uses an origin lock so concurrent tabs share the first stored ID", async () => {
        const saved = storage()
        const randomUUID = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second)
        let queue = Promise.resolve()
        const request = vi.fn((_key: string, callback: () => string) => {
            const pending = queue.then(callback)
            queue = pending.then(() => undefined)
            return pending
        })
        vi.stubGlobal("window", { localStorage: saved, crypto: { randomUUID } })
        vi.stubGlobal("navigator", { locks: { request } })
        expect(await Promise.all([dailyVisitorId(), dailyVisitorId()])).toEqual([first, first])
        expect(request).toHaveBeenCalledTimes(2)
        expect(randomUUID).toHaveBeenCalledTimes(1)
    })

    it("keeps a page-lifetime fallback when browser storage is disabled", async () => {
        vi.stubGlobal("window", { localStorage: { getItem() { throw new Error("blocked") } }, crypto: { randomUUID: () => first } })
        vi.stubGlobal("navigator", {})
        expect(await dailyVisitorId()).toBe(await dailyVisitorId())
    })
})
