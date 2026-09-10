import matter from "gray-matter"
import { marked } from "marked"
import sanitizeHtml from "sanitize-html"
import { isGoogleDriveImage, normalizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"
import { LocalPostDocument, LocalPostFrontmatter } from "./types"
import { isPostCategory } from "./categories"

const LOCAL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const RESERVED_SLUGS = new Set(["register", "rss.xml"])
const MAX_TITLE_LENGTH = 160
const MAX_DESCRIPTION_LENGTH = 320

function normalizePublicImageSource(source: string): string {
    const backendBase = process.env.NEXT_PUBLIC_IP || ""
    if (source.startsWith("/proxy/") && backendBase) {
        return `${backendBase.replace(/\/$/, "")}${source}`
    }
    if (isGoogleDriveImage(source)) {
        const normalized = normalizeGoogleDriveImageUrl(source)
        return `/api/image-proxy?url=${encodeURIComponent(normalized)}`
    }
    return source
}

export class InvalidPostError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "InvalidPostError"
    }
}

function requiredString(value: unknown, field: string, maxLength: number): string {
    if (typeof value !== "string" || !value.trim()) {
        throw new InvalidPostError(`${field} must be a non-empty string`)
    }

    const normalized = value.trim()
    if (normalized.length > maxLength) {
        throw new InvalidPostError(`${field} must be at most ${maxLength} characters`)
    }
    return normalized
}

function optionalString(value: unknown, field: string, maxLength: number): string | undefined {
    if (value === undefined || value === null || value === "") return undefined
    return requiredString(value, field, maxLength)
}

function isoDate(value: unknown, field: string): string {
    if (value instanceof Date && Number.isFinite(value.getTime())) {
        return value.toISOString()
    }
    const date = requiredString(value, field, 40)
    if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(date)) {
        throw new InvalidPostError(`${field} must be an ISO date or date-time`)
    }
    if (!Number.isFinite(Date.parse(date))) {
        throw new InvalidPostError(`${field} is not a valid date`)
    }
    return date
}

function tags(value: unknown): string[] {
    if (value === undefined) return []
    if (!Array.isArray(value) || value.some((tag) => typeof tag !== "string" || !tag.trim())) {
        throw new InvalidPostError("tags must be an array of non-empty strings")
    }
    if (value.length > 20) throw new InvalidPostError("tags must contain at most 20 entries")
    return [...new Set(value.map((tag) => tag.trim()).filter(Boolean))]
}

function safeThumbnail(value: unknown, slug: string): string | undefined {
    const thumbnail = optionalString(value, "thumbnail", 2048)
    if (!thumbnail) return undefined

    if (thumbnail.startsWith(`/content/${slug}/`)) return thumbnail
    try {
        const url = new URL(thumbnail)
        if (url.protocol === "https:") return url.toString()
    } catch {
        // The error below gives authors one consistent validation message.
    }
    throw new InvalidPostError("thumbnail must be an HTTPS URL or an imported /content/<slug>/ asset")
}

export function validateLocalPostFrontmatter(data: Record<string, unknown>): LocalPostFrontmatter {
    const slug = requiredString(data.slug, "slug", 100)
    if (!LOCAL_SLUG_PATTERN.test(slug) || /^\d+$/.test(slug) || RESERVED_SLUGS.has(slug)) {
        throw new InvalidPostError(
            "slug must use lowercase letters, numbers and hyphens, must not be numeric, and must not be reserved",
        )
    }
    if (typeof data.draft !== "boolean") {
        throw new InvalidPostError("draft must be explicitly true or false")
    }

    const updatedAt = data.updatedAt === undefined ? undefined : isoDate(data.updatedAt, "updatedAt")
    if (data.category !== undefined && !isPostCategory(data.category)) {
        throw new InvalidPostError("category must be ai-agents, development, work-life, or other")
    }
    return {
        category: data.category ?? "other",
        title: requiredString(data.title, "title", MAX_TITLE_LENGTH),
        slug,
        description: requiredString(data.description, "description", MAX_DESCRIPTION_LENGTH),
        publishedAt: isoDate(data.publishedAt, "publishedAt"),
        updatedAt,
        tags: tags(data.tags),
        draft: data.draft,
        thumbnail: safeThumbnail(data.thumbnail, slug),
        project: optionalString(data.project, "project", 120),
    }
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [
        "p",
        "br",
        "hr",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "strong",
        "em",
        "del",
        "u",
        "s",
        "sup",
        "sub",
        "mark",
        "blockquote",
        "pre",
        "code",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "figure",
        "figcaption",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "details",
        "summary",
        "iframe",
    ],
    allowedAttributes: {
        a: ["href", "title", "target", "rel"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        code: ["class"],
        th: ["align"],
        td: ["align"],
        iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading", "referrerpolicy"],
    },
    allowedClasses: {
        code: ["language-*"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
        img: ["http", "https"],
        iframe: ["https"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    allowProtocolRelative: false,
    transformTags: {
        a: (tagName, attribs) => {
            if (attribs.target === "_blank") {
                return {
                    tagName,
                    attribs: { ...attribs, rel: "noopener noreferrer" },
                }
            }
            return { tagName, attribs }
        },
        img: (tagName, attribs) => ({
            tagName,
            attribs: { ...attribs, src: normalizePublicImageSource(attribs.src || ""), loading: "lazy" },
        }),
    },
}

export function sanitizePostHtml(html: string): string {
    return sanitizeHtml(html, SANITIZE_OPTIONS)
}

export function plainTextFromHtml(html: string): string {
    return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
        .replace(/\s+/g, " ")
        .trim()
}

export function parseMarkdownSource(source: string): LocalPostDocument {
    if (Buffer.byteLength(source, "utf8") > 1_000_000) {
        throw new InvalidPostError("post source must be at most 1 MB")
    }

    const parsed = matter(source)
    const metadata = validateLocalPostFrontmatter(parsed.data)
    const rendered = marked.parse(parsed.content, {
        async: false,
        gfm: true,
        breaks: false,
    }) as string

    return {
        metadata,
        markdown: parsed.content,
        html: sanitizePostHtml(rendered),
    }
}
