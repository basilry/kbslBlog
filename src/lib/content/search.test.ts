import { mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { buildPostSearchIndex } from "./search-index"
import { getSearchPostPage, type SearchablePost } from "./search"
import type { PostCategoryFilter } from "./categories"
import { normalizeSearchQuery, parsePostSearchParams, postSearchHref } from "./search-query"

const directories: string[] = []

async function searchPublicPosts(query: string, options: { contentDirectory: string; category?: PostCategoryFilter; page?: number; pageSize?: number }) {
    return getSearchPostPage(await buildPostSearchIndex(options.contentDirectory), query, options)
}

async function fixtures() {
    const directory = await mkdtemp(path.join(os.tmpdir(), "kbsl-search-"))
    directories.push(directory)
    const posts = [
        { slug: "title-match", title: "AI 보안", description: "제목에서 찾기", category: "ai-agents", body: "통신에 관한 글입니다." },
        { slug: "body-match", title: "본문 검색", description: "요약에는 키워드가 없습니다", category: "ai-agents", body: `${"도입 문장입니다. ".repeat(50)}ＡＩ <strong>보안</strong> &amp; 통신을 설명합니다.` },
        { slug: "tag-match", title: "태그 검색", description: "태그로도 찾을 수 있습니다", category: "development", body: "개발 기록", tags: ["AI", "보안"] },
        { slug: "description-match", title: "요약 검색", description: "AI 보안에 관한 요약", category: "other", body: "기록" },
        { slug: "cross-field", title: "AI 시작하기", description: "연결하기", category: "development", body: "통신의 보안", tags: [] },
        { slug: "single-term", title: "AI만 포함", description: "검색 범위를 좁히기", category: "other", body: "단일 키워드" },
        { slug: "hidden-draft", title: "AI 보안 비공개 초안", description: "보이면 안 됩니다", category: "ai-agents", body: "draft-only-secret", draft: true },
    ]
    await Promise.all(posts.map((post, index) => writeFile(path.join(directory, `${post.slug}.md`),
        `---\ntitle: ${JSON.stringify(post.title)}\nslug: ${post.slug}\ndescription: ${JSON.stringify(post.description)}\npublishedAt: "2026-09-0${index + 1}"\ncategory: ${post.category}\ntags: ${JSON.stringify(post.tags ?? [])}\ndraft: ${post.draft ?? false}\n---\n\n${post.body}`)))
    return directory
}

afterEach(async () => {
    vi.unstubAllGlobals()
    delete process.env.CONTENT_API_URL
    delete process.env.NEXT_PUBLIC_IP
    await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe("public post search", () => {
    it("searches every public field, requires all words, ranks title matches first, and excludes drafts", async () => {
        const contentDirectory = await fixtures()
        const results = await searchPublicPosts("  ai   보안  ".normalize("NFD"), { contentDirectory })
        expect(results.items[0].id).toBe("title-match")
        expect(results.items.map((post) => post.id).sort()).toEqual(["body-match", "cross-field", "description-match", "tag-match", "title-match"])
        expect(results.items.every((post) => !("html" in post))).toBe(true)
        const bodyResult = results.items.find((post) => post.id === "body-match")!
        expect(bodyResult.description).toContain("AI 보안 & 통신")
        expect(bodyResult.description).toMatch(/^…/)
        expect(bodyResult.description).not.toContain("<strong>")
        expect((await searchPublicPosts("draft-only-secret", { contentDirectory })).totalItems).toBe(0)
    })

    it("filters before pagination and counts matching posts across categories", async () => {
        const contentDirectory = await fixtures()
        const options = { contentDirectory, category: "ai-agents" as const, pageSize: 1 }
        const first = await searchPublicPosts("ai 보안", options)
        const second = await searchPublicPosts("ai 보안", { ...options, page: 2 })
        expect(first.items.map((post) => post.id)).toEqual(["title-match"])
        expect(second.items.map((post) => post.id)).toEqual(["body-match"])
        expect(first.totalItems).toBe(2)
        expect(first.totalPages).toBe(2)
        expect(first.categoryCounts).toEqual({ all: 5, "ai-agents": 2, development: 2, "work-life": 0, other: 1 })
        expect(second.categoryCounts).toEqual(first.categoryCounts)
        const empty = await searchPublicPosts("ai 보안", { contentDirectory, category: "work-life" })
        expect(empty.items).toEqual([])
        expect(empty.categoryCounts.all).toBe(5)
    })

    it("treats empty input as the ordinary list and finds literal punctuation without regular expressions", async () => {
        const contentDirectory = await fixtures()
        expect((await searchPublicPosts("   ", { contentDirectory })).totalItems).toBe(6)
        expect((await searchPublicPosts("[.*]", { contentDirectory })).items).toEqual([])
    })

    it("builds a public-only index without any API requests, even if an old API URL remains configured", async () => {
        const contentDirectory = await fixtures()
        process.env.CONTENT_API_URL = "https://api.example.test/"
        const fetchMock = vi.fn(() => { throw new Error("No API is available") })
        vi.stubGlobal("fetch", fetchMock)
        const index = await buildPostSearchIndex(contentDirectory)
        const serialized = JSON.stringify(index)
        expect(index).toHaveLength(6)
        expect(serialized).not.toContain("draft-only-secret")
        expect(serialized).not.toContain("hidden-draft")
        expect(index.every((post) => !("html" in post.summary) && !("html" in post))).toBe(true)
        const result = getSearchPostPage(JSON.parse(serialized), "ai 보안")
        expect(result.totalItems).toBe(5)
        expect(result.legacyUnavailable).toBe(false)
        expect(result.legacyTruncated).toBe(false)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("searches normally without environment variables or a running backend", async () => {
        const contentDirectory = await fixtures()
        delete process.env.CONTENT_API_URL
        delete process.env.NEXT_PUBLIC_IP
        const fetchMock = vi.fn(() => { throw new Error("No API is available") })
        vi.stubGlobal("fetch", fetchMock)
        const result = await searchPublicPosts("ai 보안", { contentDirectory })
        expect(result.legacyUnavailable).toBe(false)
        expect(result.totalItems).toBe(5)
        expect(result.items.every((post) => post.source === "local")).toBe(true)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("searches every indexed post beyond 1,000 and paginates in memory without requests", () => {
        const index: SearchablePost[] = Array.from({ length: 1250 }, (_, i) => ({
            summary: { id: String(i), slug: `post-${i}`, href: `/post/post-${i}`, source: "local", title: `기록 ${i}`, description: "요약", publishedAt: "2026-09-01", category: "other", tags: [], likeCount: 0 },
            text: i === 1249 ? "마지막 글의 고유검색어" : "일반 본문",
        }))
        const fetchMock = vi.fn()
        vi.stubGlobal("fetch", fetchMock)
        expect(getSearchPostPage(index, "고유검색어").items.map((post) => post.id)).toEqual(["1249"])
        const first = getSearchPostPage(index, "기록")
        const second = getSearchPostPage(index, "기록", { page: 2 })
        expect(first.totalItems).toBe(1250)
        expect(first.totalPages).toBe(125)
        expect(first.legacyTruncated).toBe(false)
        expect(second.items).toHaveLength(10)
        expect(second.items.every((post) => !first.items.some((other) => post.id === other.id))).toBe(true)
        expect(getSearchPostPage(index, "기록", { page: 9999 }).page).toBe(125)
        expect(getSearchPostPage(index, "없는검색어", { page: 9999 }).page).toBe(1)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})

describe("search URLs", () => {
    it("keeps the query and category when changing pages and encodes special characters", () => {
        const href = postSearchHref("  AI & 보안  ", 2, "ai-agents")
        const url = new URL(href, "https://example.test")
        expect(url.pathname).toBe("/search")
        expect(Object.fromEntries(url.searchParams)).toEqual({ q: "AI & 보안", category: "ai-agents", page: "2" })
        expect(postSearchHref("", 1)).toBe("/search")
    })

    it.each([
        [{ q: "  AI  ", page: "01", category: "all" }, "/search?q=AI"],
        [{ q: ["AI", "보안"], page: ["2", "3"], category: "unknown" }, "/search"],
        [{ q: "AI", page: "-2" }, "/search?q=AI"],
        [{ q: "", page: "1" }, "/search"],
        [{ page: "Infinity" }, "/search"],
    ])("normalizes malformed or redundant parameters: %o", (params, href) => {
        expect(parsePostSearchParams(params)).toEqual(expect.objectContaining({ href, needsRedirect: true }))
    })

    it("bounds input and leaves an already canonical URL alone", () => {
        expect(normalizeSearchQuery("가".repeat(200))).toHaveLength(100)
        expect(parsePostSearchParams({ q: "AI 보안", page: "2", category: "ai-agents" }).needsRedirect).toBe(false)
    })
})
