import { readFile, readdir, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { describe, expect, it } from "vitest"
import { parseMarkdownSource } from "./markdown"
import { getLocalizedPublishedPosts, getLocalizedAdjacentPosts } from "./localized-posts"
import { buildPostSearchIndex } from "./search-index"
import { searchPostSummaries } from "./search"
import { localizedFeed } from "./feed"
import { blogPosting, staticPageMetadata } from "../seo"
import { translateData } from "../i18n/translate"

const directory = path.join(process.cwd(), "content", "posts")
describe("published translations", () => {
    it("has a complete English version of every public Korean post with the same dates, sources and images", async () => {
        const originals = (await readdir(directory)).filter(file => file.endsWith(".md"))
        const english = await getLocalizedPublishedPosts("en")
        let count = 0
        for (const file of originals) {
            const ko = parseMarkdownSource(await readFile(path.join(directory, file), "utf8"))
            if (ko.metadata.draft) { expect(english.some(p => p.slug === ko.metadata.slug)).toBe(false); continue }
            const en = parseMarkdownSource(await readFile(path.join(directory, "en", file), "utf8"))
            count++
            for (const key of ["slug", "publishedAt", "updatedAt", "category", "thumbnail", "draft"] as const) expect(en.metadata[key]).toEqual(ko.metadata[key])
            const images = (html: string) => [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1])
            const sources = (html: string) => [...html.matchAll(/href="(https?:[^\"]+)"/g)].map(match => match[1]).sort()
            expect(images(en.html)).toEqual(images(ko.html))
            expect(sources(en.html)).toEqual(sources(ko.html))
            for (const tag of ["h2", "figure", "blockquote", "table", "tr"]) expect(en.html.match(new RegExp(`<${tag}[ >]`, "g"))?.length ?? 0).toBe(ko.html.match(new RegExp(`<${tag}[ >]`, "g"))?.length ?? 0)
            expect(en.markdown).not.toMatch(/[가-힣]/)
        }
        expect(english).toHaveLength(count)
        expect(english.every(post => post.href.startsWith("/en/post/"))).toBe(true)
        expect(english.filter(post => post.html.includes('href="/en/post/')).length).toBeGreaterThan(0)
    })
    it("never exposes a translation when its source is draft or missing", async () => {
        const base = path.join(os.tmpdir(), "kbsl-i18n-")
        const temp = await mkdtemp(base)
        try {
            await mkdir(path.join(temp, "en"))
            const source = (slug: string, draft: boolean) => `---\ntitle: Test\nslug: ${slug}\ndescription: Test\npublishedAt: "2026-09-01"\ndraft: ${draft}\n---\nBody`
            await writeFile(path.join(temp, "hidden.md"), source("hidden", true))
            await writeFile(path.join(temp, "en", "hidden.md"), source("hidden", false))
            await writeFile(path.join(temp, "en", "orphan.md"), source("orphan", false))
            expect(await getLocalizedPublishedPosts("en", temp)).toEqual([])
        } finally {
            expect(path.resolve(temp).startsWith(path.resolve(base))).toBe(true)
            await rm(temp, { recursive: true })
        }
    })
    it("searches English article bodies and links to English neighbors", async () => {
        const index = await buildPostSearchIndex(undefined, "en")
        const results = searchPostSummaries(index, "mental privacy")
        expect(results.map(post => post.slug)).toContain("iphone-duo-cyborg-communication-security")
        expect(results.every(post => post.href.startsWith("/en/post/"))).toBe(true)
        const posts = await getLocalizedPublishedPosts("en")
        for (const post of posts) {
            const adjacent = await getLocalizedAdjacentPosts(post.slug, "en")
            for (const neighbor of [adjacent.previous, adjacent.next]) if (neighbor) expect(neighbor.href).toMatch(/^\/en\/post\//)
        }
    })
    it("publishes English feed entries and language-aware metadata", async () => {
        const posts = await getLocalizedPublishedPosts("en")
        const feed = await (await localizedFeed("en")).text()
        expect(feed).toContain("<language>en</language>")
        expect(feed).not.toMatch(/[가-힣]/)
        expect(feed.match(/<item>/g)).toHaveLength(posts.length)
        const metadata = staticPageMetadata("/projects", "en")
        expect(metadata.alternates?.canonical).toBe("https://www.basilry.kim/en/projects")
        expect(metadata.alternates?.languages).toMatchObject({ ko: "https://www.basilry.kim/ko/projects", en: "https://www.basilry.kim/en/projects" })
        expect(blogPosting(posts[0]).inLanguage).toBe("en")
        expect(blogPosting(posts[0]).author.name).toBe("Basilri Kim")
    })
    it("translates all Korean strings in public portfolio data", async () => {
        for (const file of ["mainProjects", "projectDetails", "introduce", "career", "certificate", "seminar"]) {
            const data = JSON.parse(await readFile(path.join(process.cwd(), "src/lib/json", `${file}.json`), "utf8"))
            expect(JSON.stringify(translateData(data, "en"))).not.toMatch(/[가-힣]/)
        }
    })
})
