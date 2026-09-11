import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { htmlToDOM, Element } from "html-react-parser"
import { describe, expect, it } from "vitest"
import type { PublicPostPage } from "@lib/content/types"
import PostList from "./PostList"

function elements(nodes: Element["children"]): Element[] {
    return nodes.flatMap((node) => [...(node instanceof Element ? [node] : []), ...("children" in node ? elements(node.children) : [])])
}
const page: PublicPostPage = {
    category: "ai-agents", categoryCounts: { all: 25, "ai-agents": 25, development: 0, "work-life": 0, other: 0 },
    items: [], page: 2, pageSize: 10, totalItems: 25, totalPages: 3, legacyUnavailable: false, legacyTruncated: false,
}

describe("search list navigation", () => {
    it("submits a new search from page one and preserves query/category in previous and next links", () => {
        const html = renderToStaticMarkup(createElement(PostList, { posts: page, query: "AI & 보안" }))
        const tags = elements(htmlToDOM(html)).filter((node) => node.type === "tag")
        const inputs = tags.filter((node) => node.name === "input")
        expect(inputs.find((node) => node.attribs.name === "q")?.attribs.value).toBe("AI & 보안")
        expect(inputs.find((node) => node.attribs.name === "category")?.attribs.value).toBe("ai-agents")
        expect(inputs.some((node) => node.attribs.name === "page")).toBe(false)
        const links = tags.filter((node) => node.name === "a").map((node) => node.attribs.href)
        expect(links).toContain("/ko/search?q=AI+%26+%EB%B3%B4%EC%95%88&category=ai-agents")
        expect(links).toContain("/ko/search?q=AI+%26+%EB%B3%B4%EC%95%88&category=ai-agents&page=3")
        expect(links).toContain("/ko/search?q=AI+%26+%EB%B3%B4%EC%95%88&category=development")
        expect(links).toContain("/ko/search?category=ai-agents")
    })

    it("retains ordinary list pagination outside search and has no legacy API warning in static search", () => {
        const list = renderToStaticMarkup(createElement(PostList, { posts: page }))
        expect(list).toContain('href="/ko/post?category=ai-agents&amp;page=3"')
        const search = renderToStaticMarkup(createElement(PostList, { posts: page, query: "AI" }))
        expect(search).not.toContain("이전 글 보관함을 모두 불러오지 못했습니다")
        expect(search).not.toContain("확인된 글")
    })
})
