import { mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { sanitizePostHtml } from "./markdown"
import { getPublicPosts, getPublishedLocalPosts } from "./posts"

const temporaryDirectories: string[] = []

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
