import { mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { parseMarkdownSource, sanitizePostHtml } from "./markdown"
import {
    getAllPublicPostSummaries,
    getPublicPost,
    getPublicPosts,
    getPublishedLocalPosts,
    getRecentPublicPosts,
    LegacyPostUnavailableError,
} from "./posts"

const temporaryDirectories: string[] = []

describe("post categories", () => {
    async function categorizedFixtures() {
        const directory = await fixtureDirectory()
        await Promise.all(["ai-agents", "development", "ai-agents", "work-life", undefined, "ai-agents"].map((category, index) =>
            writeFile(path.join(directory, `post-${index}.md`), `---\ntitle: Post ${index}\nslug: post-${index}\ndescription: Public post\npublishedAt: "2026-09-0${index + 1}"\n${category ? `category: ${category}\n` : ""}tags: []\ndraft: ${index === 5}\n---\n\nBody`),
        ))
        return directory
    }

    it("filters before pagination, counts all published categories, and excludes drafts", async () => {
        const directory = await categorizedFixtures()
        const first = await getPublicPosts({ contentDirectory: directory, category: "ai-agents", pageSize: 1 })
        const second = await getPublicPosts({ contentDirectory: directory, category: "ai-agents", pageSize: 1, page: 2 })
        expect(first.items.map((post) => post.id)).toEqual(["post-2"])
        expect(second.items.map((post) => post.id)).toEqual(["post-0"])
        expect(first.totalItems).toBe(2)
        expect(first.totalPages).toBe(2)
        expect(first.categoryCounts).toEqual({ all: 5, "ai-agents": 2, development: 1, "work-life": 1, other: 1 })
        expect(second.categoryCounts).toEqual(first.categoryCounts)
        expect(first.legacyUnavailable).toBe(false)
        expect((await getPublicPosts({ contentDirectory: directory, category: "other" })).items.map((post) => post.id)).toEqual(["post-4"])
    })

    it("keeps the full legacy archive in Other without leaking it into named categories", async () => {
        const directory = await categorizedFixtures()
        process.env.CONTENT_API_URL = "https://api.example.test/"
        const fetchMock = vi.fn<typeof fetch>(async (input) => {
            const page = Number(new URL(String(input)).searchParams.get("page"))
            return Response.json({ data: { data: { totalElements: 125, totalPages: 7, content: Array.from({ length: page === 6 ? 5 : 20 }, (_, index) => ({
                id: page * 20 + index + 1, title: "Legacy", content: "<p>Body</p>", createdAt: "2026-01-01", likeCount: 0,
            })) } } })
        })
        vi.stubGlobal("fetch", fetchMock)
        const category = await getPublicPosts({ contentDirectory: directory, category: "development" })
        expect(category.items.map((post) => post.id)).toEqual(["post-1"])
        expect(category.categoryCounts.all).toBe(130)
        expect(category.categoryCounts.other).toBe(126)
        expect(fetchMock).toHaveBeenCalledTimes(1)
        const last = await getPublicPosts({ contentDirectory: directory, category: "other", page: 13 })
        expect(last.totalPages).toBe(13)
        expect(last.items.map((post) => post.id)).toEqual(["120", "121", "122", "123", "124", "125"])
        expect(last.items.every((post) => post.category === "other")).toBe(true)
        expect(last.legacyTruncated).toBe(false)
    })

    it("rejects unknown category values instead of silently misclassifying posts", () => {
        expect(() => parseMarkdownSource('---\ntitle: Test\nslug: test\ndescription: Test\npublishedAt: "2026-09-01"\ncategory: typo\ndraft: false\n---\nBody')).toThrow(/category/)
    })
})

async function fixtureDirectory(): Promise<string> {
    const directory = await mkdtemp(path.join(os.tmpdir(), "kbsl-content-"))
    temporaryDirectories.push(directory)
    return directory
}

afterEach(async () => {
    vi.unstubAllGlobals()
    delete process.env.CONTENT_API_URL
    delete process.env.NEXT_PUBLIC_IP
    await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe("recent public post cache policy", () => {
    const legacyPost = {
        id: 123,
        title: "Recent legacy post",
        content: "<p>Public summary</p>",
        createdAt: "2026-09-10T09:00:00Z",
        updatedAt: "2026-09-10T09:00:00Z",
        likeCount: 0,
    }

    function legacyPageResponse() {
        return Response.json({ data: { data: { content: [legacyPost], totalElements: 1, totalPages: 1 } } })
    }

    it("opts the homepage summary into timed caching without changing other content reads", async () => {
        const directory = await fixtureDirectory()
        process.env.CONTENT_API_URL = "https://api.example.test/"
        const fetchMock = vi.fn<typeof fetch>(async () => legacyPageResponse())
        vi.stubGlobal("fetch", fetchMock)

        const recent = await getRecentPublicPosts(3, { legacyRevalidate: 300, contentDirectory: directory })
        expect(recent.items.map((post) => post.href)).toEqual(["/post/123"])
        expect(recent.legacyUnavailable).toBe(false)
        expect(fetchMock.mock.calls[0]?.[1]).toEqual(expect.objectContaining({ next: { revalidate: 300 } }))
        expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("cache")

        await getRecentPublicPosts(3, { contentDirectory: directory })
        await getPublicPosts({ contentDirectory: directory })
        await getAllPublicPostSummaries()
        for (const [, init] of fetchMock.mock.calls.slice(1)) {
            expect(init).toEqual(expect.objectContaining({ cache: "no-store" }))
            expect(init).not.toHaveProperty("next")
        }
        expect(fetchMock).toHaveBeenCalledTimes(4)
    })

    it("keeps local posts available during a legacy outage and retries on the next render", async () => {
        const directory = await fixtureDirectory()
        await writeFile(
            path.join(directory, "local.md"),
            `---\ntitle: Local\nslug: local-post\ndescription: Public post\npublishedAt: "2026-09-09"\ntags: []\ndraft: false\n---\n\nBody`,
        )
        process.env.CONTENT_API_URL = "https://api.example.test/"
        const fetchMock = vi.fn<typeof fetch>()
            .mockRejectedValueOnce(new TypeError("Connection unavailable"))
            .mockResolvedValueOnce(legacyPageResponse())
        vi.stubGlobal("fetch", fetchMock)
        const options = { legacyRevalidate: 300, contentDirectory: directory }

        const unavailable = await getRecentPublicPosts(3, options)
        expect(unavailable.items.map((post) => post.href)).toEqual(["/post/local-post"])
        expect(unavailable.legacyUnavailable).toBe(true)

        const recovered = await getRecentPublicPosts(3, options)
        expect(recovered.items.map((post) => post.href)).toEqual(["/post/123", "/post/local-post"])
        expect(recovered.legacyUnavailable).toBe(false)
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("does not require a legacy API configuration for a static homepage", async () => {
        const directory = await fixtureDirectory()
        delete process.env.CONTENT_API_URL
        delete process.env.NEXT_PUBLIC_IP
        const fetchMock = vi.fn()
        vi.stubGlobal("fetch", fetchMock)

        expect(await getRecentPublicPosts(3, { legacyRevalidate: 300, contentDirectory: directory }))
            .toEqual({ items: [], legacyUnavailable: true })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("retains fresh detail requests and distinguishes missing posts from service errors", async () => {
        process.env.CONTENT_API_URL = "https://api.example.test/"
        const fetchMock = vi.fn<typeof fetch>()
            .mockResolvedValueOnce(new Response(null, { status: 404 }))
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
        vi.stubGlobal("fetch", fetchMock)

        expect(await getPublicPost("123")).toBeNull()
        await expect(getPublicPost("123")).rejects.toBeInstanceOf(LegacyPostUnavailableError)
        for (const [, init] of fetchMock.mock.calls) {
            expect(init).toEqual(expect.objectContaining({ cache: "no-store" }))
            expect(init).not.toHaveProperty("next")
        }
    })
})

describe("getPublishedLocalPosts", () => {
    it("keeps drafts out of all public local post results", async () => {
        const directory = await fixtureDirectory()
        await writeFile(
            path.join(directory, "draft.md"),
            `---\ntitle: Draft\nslug: hidden-draft\ndescription: Private draft\npublishedAt: "2026-09-07"\ntags: []\ndraft: true\n---\n\nsecret`,
        )

        expect(await getPublishedLocalPosts(directory)).toEqual([])
    })

    it("renders published Markdown and removes executable HTML", async () => {
        const directory = await fixtureDirectory()
        await writeFile(
            path.join(directory, "public.md"),
            `---\ntitle: Public\nslug: public-post\ndescription: Public post\npublishedAt: "2026-09-07"\ntags: [test]\ndraft: false\n---\n\n## Hello\n\n<script>alert(1)</script><img src="/content/public-post/a.png" onerror="alert(2)">`,
        )

        const posts = await getPublishedLocalPosts(directory)
        expect(posts).toHaveLength(1)
        expect(posts[0].html).toContain("<h2>Hello</h2>")
        expect(posts[0].html).not.toContain("script")
        expect(posts[0].html).not.toContain("onerror")
    })

    it("keeps trusted YouTube embeds and removes arbitrary iframes", async () => {
        const directory = await fixtureDirectory()
        await writeFile(
            path.join(directory, "embeds.md"),
            `---\ntitle: Embeds\nslug: embeds\ndescription: Safe embeds\npublishedAt: "2026-09-07"\ntags: []\ndraft: false\n---\n\n<iframe src="https://www.youtube-nocookie.com/embed/abc" onload="alert(1)"></iframe><iframe src="https://evil.example/embed/abc"></iframe>`,
        )

        const [post] = await getPublishedLocalPosts(directory)
        expect(post.html).toContain("youtube-nocookie.com/embed/abc")
        expect(post.html).not.toContain("evil.example")
        expect(post.html).not.toContain("onload")
    })

    it("includes the legacy total when a page is completely filled by local posts", async () => {
        const directory = await fixtureDirectory()
        await Promise.all(
            Array.from({ length: 10 }, (_, index) =>
                writeFile(
                    path.join(directory, `post-${index}.md`),
                    `---\ntitle: Post ${index}\nslug: post-${index}\ndescription: Local post\npublishedAt: "2026-09-07"\ntags: []\ndraft: false\n---\n\nBody`,
                ),
            ),
        )
        process.env.CONTENT_API_URL = "https://api.example.test/"
        vi.stubGlobal(
            "fetch",
            vi.fn(async () =>
                new Response(
                    JSON.stringify({
                        data: {
                            data: {
                                content: [],
                                totalElements: 7,
                                totalPages: 1,
                            },
                        },
                    }),
                    { status: 200, headers: { "Content-Type": "application/json" } },
                ),
            ),
        )

        const page = await getPublicPosts({ page: 1, pageSize: 10, contentDirectory: directory })
        expect(page.items).toHaveLength(10)
        expect(page.totalItems).toBe(17)
        expect(page.totalPages).toBe(2)
        expect(fetch).toHaveBeenCalledOnce()
    })

    it("normalizes managed and Google image sources after sanitizing HTML", () => {
        process.env.NEXT_PUBLIC_IP = "https://api.basilry.kim/"
        const html = sanitizePostHtml(
            '<img src="/proxy/image/123"><img src="https://drive.google.com/file/d/abc_123/view?usp=sharing">',
        )
        expect(html).toContain('src="https://api.basilry.kim/proxy/image/123"')
        expect(html).toContain(
            'src="/api/image-proxy?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3Dabc_123"',
        )
    })
})
