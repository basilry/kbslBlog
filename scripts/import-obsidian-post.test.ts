import { execFile } from "node:child_process"
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { afterEach, describe, expect, it } from "vitest"
import { parseMarkdownSource } from "../src/lib/content/markdown"

const execFileAsync = promisify(execFile)
const temporaryDirectories: string[] = []

async function missing(target: string): Promise<boolean> {
    try {
        await access(target)
        return false
    } catch {
        return true
    }
}

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe("Obsidian importer", () => {
    it("preserves categories on import and rejects unknown values", async () => {
        const fixture = await mkdtemp(path.join(os.tmpdir(), "kbsl-import-"))
        temporaryDirectories.push(fixture)
        const note = path.join(fixture, "note.md")
        const source = '---\ntitle: Categorized\nslug: categorized\ndescription: Category test\npublishedAt: "2026-09-07"\ncategory: ai-agents\ntags: []\ndraft: true\n---\nBody'
        await writeFile(note, source)
        const args = [path.resolve("scripts/import-obsidian-post.mjs"), "--source", note, "--output-root", fixture]
        await execFileAsync(process.execPath, [...args, "--publish"])
        const imported = await readFile(path.join(fixture, "content", "posts", "categorized.md"), "utf8")
        expect(parseMarkdownSource(imported).metadata.category).toBe("ai-agents")
        await writeFile(note, source.replace("category: ai-agents", "category: unknown"))
        await expect(execFileAsync(process.execPath, args)).rejects.toThrow(/category must be/)
    })

    it("keeps draft attachments outside the public directory", async () => {
        const fixture = await mkdtemp(path.join(os.tmpdir(), "kbsl-import-"))
        temporaryDirectories.push(fixture)
        const note = path.join(fixture, "note.md")
        await writeFile(path.join(fixture, "photo.png"), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        await writeFile(
            note,
            `---\ntitle: Draft asset\nslug: draft-asset\ndescription: Private attachment test\npublishedAt: "2026-09-07"\ntags: []\ndraft: false\n---\n\n![photo](photo.png)`,
        )

        await execFileAsync(process.execPath, [
            path.resolve("scripts/import-obsidian-post.mjs"),
            "--source",
            note,
            "--output-root",
            fixture,
            "--write",
        ])

        const imported = await readFile(path.join(fixture, ".content-drafts", "posts", "draft-asset.md"), "utf8")
        expect(parseMarkdownSource(imported).metadata.draft).toBe(true)
        expect(imported).toContain("draft: true")
        expect(imported).toContain("../assets/draft-asset/")
        expect(await missing(path.join(fixture, "public", "content", "draft-asset"))).toBe(true)
        expect(await missing(path.join(fixture, "content", "posts", "draft-asset.md"))).toBe(true)
        expect(await missing(path.join(fixture, ".content-drafts", "assets", "draft-asset"))).toBe(false)
    })
})
