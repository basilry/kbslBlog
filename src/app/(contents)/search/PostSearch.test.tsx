import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { SearchablePost } from "@lib/content/search"
import PostSearch from "./PostSearch"

const navigation = vi.hoisted(() => ({ query: "", replace: vi.fn() }))
vi.mock("next/navigation", async (importOriginal) => ({
    ...await importOriginal<typeof import("next/navigation")>(),
    useSearchParams: () => new URLSearchParams(navigation.query),
    useRouter: () => ({ replace: navigation.replace }),
}))

const index: SearchablePost[] = [
    { summary: { id: "iphone", slug: "iphone", href: "/post/iphone", source: "local", title: "아이폰 이야기", description: "접히는 기기", publishedAt: "2026-09-11", category: "ai-agents", tags: [], likeCount: 0 }, text: "아이폰과 통신의 변화" },
    { summary: { id: "android", slug: "android", href: "/post/android", source: "local", title: "안드로이드 이야기", description: "개발 기록", publishedAt: "2026-09-10", category: "development", tags: [], likeCount: 0 }, text: "통신 앱 만들기" },
]
const render = () => renderToStaticMarkup(createElement(PostSearch, { index }))
afterEach(() => { navigation.query = ""; vi.unstubAllGlobals() })

describe("static search client", () => {
    it("reads the URL query and selects results without calling an API", () => {
        const fetchMock = vi.fn(() => { throw new Error("No API is available") })
        vi.stubGlobal("fetch", fetchMock)
        navigation.query = "q=" + encodeURIComponent("아이폰")
        const html = render()
        expect(html).toContain('href="/post/iphone"')
        expect(html).not.toContain('href="/post/android"')
        expect(html).toContain('value="아이폰"')
        expect(html).not.toContain("이전 글 보관함을 모두 불러오지 못했습니다")
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("applies the URL category to the same static data", () => {
        navigation.query = "q=" + encodeURIComponent("통신") + "&category=development"
        const html = render()
        expect(html).toContain('href="/post/android"')
        expect(html).not.toContain('href="/post/iphone"')
        expect(html).toContain('name="category" value="development"')
    })

    it("uses the current URL for empty queries and result-free searches", () => {
        expect(render()).toContain('href="/post/iphone"')
        expect(render()).toContain('href="/post/android"')
        navigation.query = "q=unmatched-query"
        expect(render()).toContain("검색 결과가 없습니다")
        expect(render()).not.toContain('href="/post/iphone"')
    })
})
