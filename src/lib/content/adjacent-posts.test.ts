import { mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { getAdjacentPublishedPosts } from "./adjacent-posts"

const directories: string[] = []
async function fixtures(entries = [
    { slug: "oldest", date: "2026-09-01", draft: false },
    { slug: "middle", date: "2026-09-02", draft: false },
    { slug: "draft-post", date: "2026-09-02T12:00:00Z", draft: true },
    { slug: "newest", date: "2026-09-03", draft: false },
]) {
    const directory = await mkdtemp(path.join(os.tmpdir(), "kbsl-adjacent-"))
    directories.push(directory)
    await Promise.all(entries.map(({ slug, date, draft }) => writeFile(path.join(directory, `${slug}.md`),
        `---\ntitle: ${slug}\nslug: ${slug}\ndescription: Public post\npublishedAt: "${date}"\ntags: []\ndraft: ${draft}\n---\nBody`)))
    return directory
}
afterEach(async () => {
    vi.unstubAllGlobals()
    await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe("adjacent published posts", () => {
    it("links to the older and newer public posts, skipping drafts without API requests", async () => {
        const directory = await fixtures()
        const fetchMock = vi.fn(() => { throw new Error("No API") })
        vi.stubGlobal("fetch", fetchMock)
        const result = await getAdjacentPublishedPosts("middle", directory)
        expect(result.previous).toEqual({ title: "oldest", href: "/post/oldest", publishedAt: "2026-09-01" })
        expect(result.next).toEqual({ title: "newest", href: "/post/newest", publishedAt: "2026-09-03" })
        expect(fetchMock).not.toHaveBeenCalled()
    })
    it("does not wrap at either end or expose neighbors for a draft or missing post", async () => {
        const directory = await fixtures()
        expect((await getAdjacentPublishedPosts("oldest", directory)).previous).toBeNull()
        expect((await getAdjacentPublishedPosts("newest", directory)).next).toBeNull()
        for (const slug of ["draft-post", "missing"]) expect(await getAdjacentPublishedPosts(slug, directory)).toEqual({ previous: null, next: null })
    })
    it("handles empty and single-post collections and orders same-date posts consistently", async () => {
        expect(await getAdjacentPublishedPosts("any", await fixtures([]))).toEqual({ previous: null, next: null })
        const single = [{ slug: "alpha", date: "2026-09-01", draft: false }]
        expect(await getAdjacentPublishedPosts("alpha", await fixtures(single))).toEqual({ previous: null, next: null })
        const directory = await fixtures([...single, { slug: "zulu", date: "2026-09-01", draft: false }])
        expect((await getAdjacentPublishedPosts("alpha", directory)).previous?.href).toBe("/post/zulu")
        expect((await getAdjacentPublishedPosts("zulu", directory)).next?.href).toBe("/post/alpha")
    })
})
