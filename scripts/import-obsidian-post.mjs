#!/usr/bin/env node

import { createHash } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const MAX_NOTE_BYTES = 1_000_000
const MAX_ASSET_BYTES = 10_000_000
const MAX_TOTAL_ASSET_BYTES = 25_000_000
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"])

function usage() {
    return `Usage:
  node scripts/import-obsidian-post.mjs --source <one-note.md>
  node scripts/import-obsidian-post.mjs --source <one-note.md> --preview
  node scripts/import-obsidian-post.mjs --source <one-note.md> --write [--force]
  node scripts/import-obsidian-post.mjs --source <one-note.md> --publish [--force]

Options:
  --attachments-dir <dir>  Resolve local images inside this exact directory (default: note directory)
  --slug <slug>            Override the note's frontmatter slug
  --output-root <dir>      Use another project root for an isolated test or staging run
  --preview                 Write a local HTML preview only
  --write                   Import as draft: true
  --publish                 Import as draft: false (explicit public opt-in)
  --force                   Replace the same slug's Markdown/assets without deleting other files

With no mode flag, validation is a read-only dry run. This command never scans a vault,
deploys the site, commits files, or publishes without --publish.`
}

function parseArgs(argv) {
    const options = { mode: "dry-run", force: false }
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index]
        if (["--source", "--attachments-dir", "--slug", "--output-root"].includes(argument)) {
            const value = argv[index + 1]
            if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`)
            const key = argument
                .slice(2)
                .replace("attachments-dir", "attachmentsDir")
                .replace("output-root", "outputRoot")
            options[key] = value
            index += 1
        } else if (["--preview", "--write", "--publish"].includes(argument)) {
            if (options.mode !== "dry-run") throw new Error("Choose only one of --preview, --write, or --publish")
            options.mode = argument.slice(2)
        } else if (argument === "--force") {
            options.force = true
        } else if (argument === "--help" || argument === "-h") {
            console.log(usage())
            process.exit(0)
        } else {
            throw new Error(`Unknown option: ${argument}`)
        }
    }
    if (!options.source) throw new Error("--source must name one Markdown file")
    if (options.force && !["write", "publish"].includes(options.mode)) {
        throw new Error("--force is only valid with --write or --publish")
    }
    return options
}

function stringField(value, name, maxLength) {
    const normalized = value instanceof Date ? value.toISOString() : typeof value === "string" ? value.trim() : ""
    if (!normalized) throw new Error(`${name} is required`)
    if (normalized.length > maxLength) throw new Error(`${name} must be at most ${maxLength} characters`)
    return normalized
}

function isoDate(value, name) {
    const date = stringField(value, name, 40)
    if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(date)) {
        throw new Error(`${name} must be an ISO date or date-time`)
    }
    if (!Number.isFinite(Date.parse(date))) throw new Error(`${name} is not a valid date`)
    return date
}

function validateMetadata(data, slugOverride, publish) {
    const slug = stringField(slugOverride || data.slug, "slug", 100)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || /^\d+$/.test(slug) || ["register", "rss.xml"].includes(slug)) {
        throw new Error("slug must use lowercase letters, numbers and hyphens and must not be numeric or reserved")
    }
    const publishedAt = isoDate(data.publishedAt, "publishedAt")
    if (
        data.tags !== undefined &&
        (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim()))
    ) {
        throw new Error("tags must be an array of non-empty strings")
    }
    if ((data.tags || []).length > 20) throw new Error("tags must contain at most 20 entries")
    if (data.category !== undefined && !["ai-agents", "development", "work-life", "other"].includes(data.category)) {
        throw new Error("category must be ai-agents, development, work-life, or other")
    }

    const metadata = {
        title: stringField(data.title, "title", 160),
        slug,
        description: stringField(data.description, "description", 320),
        publishedAt,
        tags: [...new Set((data.tags || []).map((tag) => tag.trim()).filter(Boolean))],
        category: data.category ?? "other",
        draft: !publish,
    }
    if (data.updatedAt !== undefined) metadata.updatedAt = isoDate(data.updatedAt, "updatedAt")
    if (data.project) metadata.project = stringField(data.project, "project", 120)
    if (data.thumbnail !== undefined) {
        const thumbnail = stringField(data.thumbnail, "thumbnail", 2048)
        try {
            const url = new URL(thumbnail)
            if (url.protocol !== "https:") throw new Error()
            metadata.thumbnail = url.toString()
        } catch {
            throw new Error("thumbnail must be an HTTPS URL; use a body image for local attachments")
        }
    }
    return metadata
}

function isRemoteReference(reference) {
    return /^(?:https?:)?\/\//i.test(reference) || reference.startsWith("#")
}

function inside(root, target) {
    const relative = path.relative(root, target)
    return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative)
}

function hasImageSignature(bytes, extension) {
    if (extension === ".png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    if (extension === ".jpg" || extension === ".jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    if (extension === ".gif") return bytes.subarray(0, 4).toString("ascii") === "GIF8"
    if (extension === ".webp") {
        return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP"
    }
    if (extension === ".avif") {
        const brand = bytes.subarray(8, 12).toString("ascii")
        return bytes.subarray(4, 8).toString("ascii") === "ftyp" && (brand === "avif" || brand === "avis")
    }
    return false
}

function collectImageReferences(markdown) {
    const references = []
    const wikiPattern = /!\[\[([^\]\n]+)\]\]/g
    const markdownPattern = /!\[([^\]\n]*)\]\(([^)\n]+)\)/g
    let match
    while ((match = wikiPattern.exec(markdown))) {
        const [target, label] = match[1].split("|", 2)
        references.push({ token: match[0], target: target.trim(), alt: label?.trim() || path.basename(target.trim()) })
    }
    while ((match = markdownPattern.exec(markdown))) {
        let target = match[2].trim()
        if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1)
        const titleStart = target.search(/\s+["']/)
        if (titleStart >= 0) target = target.slice(0, titleStart)
        if (!isRemoteReference(target)) references.push({ token: match[0], target, alt: match[1] })
    }
    const withoutImageEmbeds = markdown.replace(wikiPattern, "")
    if (/\[\[[^\]\n]+\]\]/.test(withoutImageEmbeds)) {
        throw new Error("Obsidian note links must be converted to public Markdown links before import")
    }
    return references
}

async function resolveAssets(references, attachmentsRoot, slug) {
    const assets = []
    const bySource = new Map()
    let totalBytes = 0

    for (const reference of references) {
        let decoded
        try {
            decoded = decodeURIComponent(reference.target.replace(/\\/g, "/"))
        } catch {
            throw new Error(`Invalid encoded attachment path: ${reference.target}`)
        }
        if (path.isAbsolute(decoded) || /^[a-z][a-z0-9+.-]*:/i.test(decoded)) {
            throw new Error(`Local attachment paths must be relative: ${reference.target}`)
        }
        const source = await fs.realpath(path.resolve(attachmentsRoot, decoded))
        if (!inside(attachmentsRoot, source)) throw new Error(`Attachment escapes --attachments-dir: ${reference.target}`)
        const extension = path.extname(source).toLowerCase()
        if (!ALLOWED_EXTENSIONS.has(extension)) throw new Error(`Unsupported attachment type: ${reference.target}`)

        let asset = bySource.get(source)
        if (!asset) {
            const bytes = await fs.readFile(source)
            if (bytes.byteLength > MAX_ASSET_BYTES) throw new Error(`Attachment exceeds 10 MB: ${reference.target}`)
            if (!hasImageSignature(bytes, extension)) throw new Error(`Attachment content does not match its image type: ${reference.target}`)
            totalBytes += bytes.byteLength
            if (totalBytes > MAX_TOTAL_ASSET_BYTES) throw new Error("Attachments exceed the 25 MB total limit")
            const fileName = `${createHash("sha256").update(bytes).digest("hex").slice(0, 16)}${extension}`
            asset = { source, bytes, fileName, publicPath: `/content/${slug}/${fileName}` }
            bySource.set(source, asset)
            assets.push(asset)
        }
        reference.publicPath = asset.publicPath
        reference.assetFileName = asset.fileName
    }
    return assets
}

function rewriteImages(markdown, references, draft = false) {
    let result = markdown
    for (const reference of references) {
        const target = draft
            ? `../assets/${reference.publicPath.split("/")[2]}/${reference.assetFileName}`
            : reference.publicPath
        const replacement = `![${reference.alt.replace(/[\[\]]/g, "")}](${target})`
        result = result.split(reference.token).join(replacement)
    }
    return result
}

function renderPreview(metadata, markdown) {
    const rendered = marked.parse(markdown, { gfm: true })
    const html = sanitizeHtml(rendered, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
        allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title", "width", "height"] },
        allowedSchemes: ["http", "https", "mailto"],
    }).replace(/src="\/content\//g, 'src="./content/')
    return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${sanitizeHtml(metadata.title, { allowedTags: [], allowedAttributes: {} })}</title>
<style>body{max-width:760px;margin:64px auto;padding:0 24px;font:17px/1.75 system-ui;color:#202124}h1{font-size:42px;line-height:1.2}img{max-width:100%;height:auto}pre{overflow:auto;background:#171717;color:#fff;padding:16px;border-radius:8px}blockquote{border-left:4px solid #b024d6;padding-left:16px;color:#555}.draft{color:#b024d6;font-weight:700}</style>
<body><p class="draft">LOCAL PREVIEW · ${metadata.draft ? "DRAFT" : "PUBLISH CANDIDATE"}</p><h1>${sanitizeHtml(metadata.title, { allowedTags: [], allowedAttributes: {} })}</h1><p>${sanitizeHtml(metadata.description, { allowedTags: [], allowedAttributes: {} })}</p><hr>${html}</body></html>`
}

async function ensureWritableDestination(target, force, label) {
    try {
        await fs.access(target)
        if (!force) throw new Error(`${label} already exists; inspect it and rerun with --force to update it`)
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }
}

async function main() {
    const options = parseArgs(process.argv.slice(2))
    const sourcePath = path.resolve(options.source)
    const sourceStat = await fs.stat(sourcePath)
    if (!sourceStat.isFile() || path.extname(sourcePath).toLowerCase() !== ".md") {
        throw new Error("--source must be exactly one .md file, not a directory or vault")
    }
    if (sourceStat.size > MAX_NOTE_BYTES) throw new Error("Markdown source exceeds the 1 MB limit")

    const attachmentsRoot = await fs.realpath(path.resolve(options.attachmentsDir || path.dirname(sourcePath)))
    if (!(await fs.stat(attachmentsRoot)).isDirectory()) throw new Error("--attachments-dir must be a directory")
    const parsed = matter(await fs.readFile(sourcePath, "utf8"))
    const metadata = validateMetadata(parsed.data, options.slug, options.mode === "publish")
    const references = collectImageReferences(parsed.content)
    const assets = await resolveAssets(references, attachmentsRoot, metadata.slug)
    const markdown = rewriteImages(parsed.content, references, options.mode === "write")
    const outputRoot = path.resolve(options.outputRoot || REPO_ROOT)
    const publishedContentDir = path.join(outputRoot, "content", "posts")
    const draftRoot = path.join(outputRoot, ".content-drafts")
    const contentDir = options.mode === "publish" ? publishedContentDir : path.join(draftRoot, "posts")
    const publicDir = path.join(outputRoot, "public", "content")
    const draftAssetDir = path.join(draftRoot, "assets")
    const previewDir = path.join(outputRoot, ".content-preview")
    const outputPath = path.join(contentDir, `${metadata.slug}.md`)
    const assetDir = path.join(options.mode === "publish" ? publicDir : draftAssetDir, metadata.slug)

    console.log(JSON.stringify({ mode: options.mode, source: sourcePath, output: outputPath, metadata, attachments: assets.map((asset) => asset.fileName) }, null, 2))
    if (options.mode === "dry-run") {
        console.log("Validation passed. No files were written.")
        return
    }

    if (options.mode === "preview") {
        const previewRoot = path.join(previewDir, metadata.slug)
        const previewAssets = path.join(previewRoot, "content", metadata.slug)
        await fs.mkdir(previewAssets, { recursive: true })
        for (const asset of assets) await fs.writeFile(path.join(previewAssets, asset.fileName), asset.bytes)
        const previewPath = path.join(previewRoot, "index.html")
        await fs.writeFile(previewPath, renderPreview(metadata, markdown), "utf8")
        console.log(`Preview written: ${previewPath}`)
        return
    }

    await ensureWritableDestination(outputPath, options.force, "Post")
    try {
        const entries = await fs.readdir(assetDir)
        if (entries.length > 0 && !options.force) throw new Error("Asset directory already contains files; use --force after inspection")
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }
    await fs.mkdir(contentDir, { recursive: true })
    await fs.mkdir(assetDir, { recursive: true })
    for (const asset of assets) await fs.writeFile(path.join(assetDir, asset.fileName), asset.bytes)
    await fs.writeFile(outputPath, matter.stringify(markdown, metadata), "utf8")
    console.log(metadata.draft ? "Imported as a private draft." : "Imported with draft: false. Review and deploy separately.")
}

main().catch((error) => {
    console.error(`Import failed: ${error.message}`)
    console.error(usage())
    process.exitCode = 1
})
