import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let stored: Map<string, string>
let browser: EventTarget & { localStorage: { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void; removeItem: (key: string) => void } }
beforeEach(() => {
    vi.resetModules()
    stored = new Map()
    browser = Object.assign(new EventTarget(), { localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => { stored.set(key, value) },
        removeItem: (key: string) => { stored.delete(key) },
    } })
    vi.stubGlobal("window", browser)
})
afterEach(() => { vi.unstubAllGlobals() })

describe("recent post searches", () => {
    it("keeps five newest queries, ignores blanks and moves normalized duplicates to the front", async () => {
        const history = await import("./recent-searches")
        for (const query of ["AI", "보안", "통신", "개발", "아이폰", "배포", "  ａｉ  ", "   "]) history.addRecentSearch(query)
        expect(history.getRecentSearchesSnapshot()).toEqual(["ai", "배포", "아이폰", "개발", "통신"])
        expect(JSON.parse(stored.get(history.RECENT_SEARCHES_KEY)!)).toEqual(history.getRecentSearchesSnapshot())
    })

    it("persists across module reloads and removes only the selected history or history key", async () => {
        let history = await import("./recent-searches")
        stored.set("unrelated-setting", "keep")
        history.addRecentSearch("AI")
        history.addRecentSearch("보안")
        vi.resetModules()
        history = await import("./recent-searches")
        expect(history.getRecentSearchesSnapshot()).toEqual(["보안", "AI"])
        history.removeRecentSearch("ai")
        expect(history.getRecentSearchesSnapshot()).toEqual(["보안"])
        history.clearRecentSearches()
        expect(history.getRecentSearchesSnapshot()).toEqual([])
        expect(stored.has(history.RECENT_SEARCHES_KEY)).toBe(false)
        expect(stored.get("unrelated-setting")).toBe("keep")
    })

    it("handles corrupt data and returns stable snapshots until data changes", async () => {
        const history = await import("./recent-searches")
        stored.set(history.RECENT_SEARCHES_KEY, "{invalid")
        expect(history.getRecentSearchesSnapshot()).toEqual([])
        expect(history.getRecentSearchesSnapshot()).toBe(history.getRecentSearchesSnapshot())
        stored.set(history.RECENT_SEARCHES_KEY, JSON.stringify([null, " AI ", "ai", 12, "보안"]))
        expect(history.getRecentSearchesSnapshot()).toEqual(["AI", "보안"])
        expect(history.getRecentSearchesSnapshot()).toBe(history.getRecentSearchesSnapshot())
    })

    it("keeps search history usable in memory if browser storage is blocked", async () => {
        browser.localStorage.getItem = () => { throw new Error("Storage blocked") }
        browser.localStorage.setItem = () => { throw new Error("Quota exceeded") }
        browser.localStorage.removeItem = () => { throw new Error("Storage blocked") }
        const history = await import("./recent-searches")
        expect(() => history.addRecentSearch("아이폰")).not.toThrow()
        expect(history.getRecentSearchesSnapshot()).toEqual(["아이폰"])
        history.clearRecentSearches()
        expect(history.getRecentSearchesSnapshot()).toEqual([])
    })

    it("notifies this tab and synchronizes storage changes from another tab", async () => {
        const history = await import("./recent-searches")
        const notify = vi.fn()
        const unsubscribe = history.subscribeRecentSearches(notify)
        history.addRecentSearch("AI")
        expect(notify).toHaveBeenCalledTimes(1)
        browser.dispatchEvent(Object.assign(new Event("storage"), { key: "unrelated-setting" }))
        expect(notify).toHaveBeenCalledTimes(1)
        stored.set(history.RECENT_SEARCHES_KEY, JSON.stringify(["다른 탭 검색"]))
        browser.dispatchEvent(Object.assign(new Event("storage"), { key: history.RECENT_SEARCHES_KEY }))
        expect(notify).toHaveBeenCalledTimes(2)
        expect(history.getRecentSearchesSnapshot()).toEqual(["다른 탭 검색"])
        unsubscribe()
        history.clearRecentSearches()
        expect(notify).toHaveBeenCalledTimes(2)
    })

    it("never reads browser history into the server-rendered snapshot", async () => {
        const history = await import("./recent-searches")
        history.addRecentSearch("이 브라우저의 검색")
        expect(history.getServerRecentSearchesSnapshot()).toEqual([])
        expect(history.getServerRecentSearchesSnapshot()).toBe(history.getServerRecentSearchesSnapshot())
        vi.unstubAllGlobals()
        expect(history.getRecentSearchesSnapshot()).toEqual([])
    })
})
