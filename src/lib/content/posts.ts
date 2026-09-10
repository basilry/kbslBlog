import { promises as fs } from "node:fs"
import path from "node:path"
import { parseMarkdownSource, plainTextFromHtml, sanitizePostHtml } from "./markdown"
import { PublicPost, PublicPostPage, PublicPostSummary } from "./types"
import { isPostCategory, type PostCategoryCounts, type PostCategoryFilter } from "./categories"

const CONTENT_DIRECTORY = path.join(process.cwd(), "content", "posts")
const LEGACY_PAGE_SIZE = 20
const MAX_LEGACY_PAGES = 5
const MAX_LEGACY_POSTS = LEGACY_PAGE_SIZE * MAX_LEGACY_PAGES
const MAX_RESPONSE_BYTES = 2_000_000
const FETCH_TIMEOUT_MS = 5_000

interface LegacyPostPayload {
    id: number
    title: string
    thumbnail?: string | null
    content: string
    createdAt: string
    updatedAt: string
    likeCount: number
}

interface LegacyPagePayload {
    content: LegacyPostPayload[]
    totalElements: number
    totalPages: number
}

interface LegacyCollection {
    items: LegacyPostPayload[]
    unavailable: boolean
    truncated: boolean
}

interface LegacySlice {
    items: LegacyPostPayload[]
    totalElements: number
    unavailable: boolean
}

class LegacyPostUnavailableError extends Error {
    constructor(message = "The legacy post service is unavailable") {
        super(message)
        this.name = "LegacyPostUnavailableError"
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function apiBaseUrl(): URL | null {
    const configured = process.env.CONTENT_API_URL || process.env.NEXT_PUBLIC_IP
    if (!configured) return null
    try {
        const url = new URL(configured)
        if (url.protocol !== "http:" && url.protocol !== "https:") return null
        if (!url.pathname.endsWith("/")) url.pathname += "/"
        return url
    } catch {
        return null
    }
}

async function readBoundedJson(url: URL, revalidate?: number): Promise<{ status: number; data?: unknown }> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
        const response = await fetch(url, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
            // Cache only explicitly opted-in public summaries. Lists and details stay fresh.
            ...(Number.isSafeInteger(revalidate) && Number(revalidate) > 0
                ? { next: { revalidate } }
                : { cache: "no-store" as const }),
        })
        if (!response.ok) return { status: response.status }

        const declaredLength = Number(response.headers.get("content-length"))
        if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
            throw new LegacyPostUnavailableError("Legacy post response exceeded the size limit")
        }
        if (!response.body) throw new LegacyPostUnavailableError()

        const reader = response.body.getReader()
        const chunks: Uint8Array[] = []
        let length = 0
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            length += value.byteLength
            if (length > MAX_RESPONSE_BYTES) {
                await reader.cancel()
                throw new LegacyPostUnavailableError("Legacy post response exceeded the size limit")
            }
            chunks.push(value)
        }

        const bytes = new Uint8Array(length)
        let offset = 0
        for (const chunk of chunks) {
            bytes.set(chunk, offset)
            offset += chunk.byteLength
        }
        return { status: response.status, data: JSON.parse(new TextDecoder().decode(bytes)) }
    } catch (error) {
        if (error instanceof LegacyPostUnavailableError) throw error
        throw new LegacyPostUnavailableError()
    } finally {
        clearTimeout(timeout)
    }
}

function parseLegacyPost(value: unknown): LegacyPostPayload | null {
    if (!isRecord(value)) return null
    const id = Number(value.id)
    if (!Number.isSafeInteger(id) || id < 1) return null
    if (typeof value.title !== "string" || typeof value.content !== "string") return null

    const createdAt = typeof value.createdAt === "string" ? value.createdAt : ""
    const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : createdAt
    if (!Number.isFinite(Date.parse(createdAt))) return null

    return {
        id,
        title: value.title,
        thumbnail: typeof value.thumbnail === "string" ? value.thumbnail : undefined,
        content: value.content,
        createdAt,
        updatedAt: Number.isFinite(Date.parse(updatedAt)) ? updatedAt : createdAt,
        likeCount: Number.isFinite(Number(value.likeCount)) ? Math.max(0, Number(value.likeCount)) : 0,
    }
}

function parseLegacyPage(value: unknown): LegacyPagePayload | null {
    if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.data.data)) return null
    const page = value.data.data
    if (!Array.isArray(page.content)) return null

    const content = page.content.map(parseLegacyPost).filter((post): post is LegacyPostPayload => post !== null)
    const totalElements = Math.max(content.length, Number(page.totalElements) || content.length)
    const totalPages = Math.max(1, Number(page.totalPages) || 1)
    return { content, totalElements, totalPages }
}

function parseLegacyDetail(value: unknown): LegacyPostPayload | null {
    if (!isRecord(value) || !isRecord(value.data)) return null
    return parseLegacyPost(value.data.data)
}

function legacySummary(post: LegacyPostPayload): PublicPostSummary {
    const title = plainTextFromHtml(post.title).slice(0, 160) || "제목 없는 글"
    const excerpt = plainTextFromHtml(post.content).slice(0, 240)
    return {
        id: String(post.id),
        slug: String(post.id),
        source: "legacy",
        title,
        description: excerpt || `${title} 글을 읽어보세요.`,
        publishedAt: post.createdAt,
        updatedAt: post.updatedAt,
        thumbnail: post.thumbnail || undefined,
        tags: [],
        category: "other",
        likeCount: post.likeCount,
        href: `/post/${post.id}`,
    }
}

export async function getPublishedLocalPosts(directory = CONTENT_DIRECTORY): Promise<PublicPost[]> {
    let fileNames: string[]
    try {
        fileNames = await fs.readdir(directory)
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
        throw error
    }

    const posts = await Promise.all(
        fileNames
            .filter((fileName) => fileName.endsWith(".md"))
            .sort()
            .map(async (fileName): Promise<PublicPost | null> => {
                const absolutePath = path.join(directory, fileName)
                const document = parseMarkdownSource(await fs.readFile(absolutePath, "utf8"))
                if (document.metadata.draft) return null

                const { metadata } = document
                return {
                    id: metadata.slug,
                    slug: metadata.slug,
                    source: "local" as const,
                    title: metadata.title,
                    description: metadata.description,
                    publishedAt: metadata.publishedAt,
                    updatedAt: metadata.updatedAt,
                    thumbnail: metadata.thumbnail,
                    tags: metadata.tags,
                    category: metadata.category,
                    likeCount: 0,
                    href: `/post/${metadata.slug}`,
                    html: document.html,
                }
            }),
    )

    return posts
        .filter((post): post is PublicPost => post !== null)
        .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
}

async function fetchLegacyPage(page: number, revalidate?: number): Promise<LegacyPagePayload> {
    const base = apiBaseUrl()
    if (!base) throw new LegacyPostUnavailableError("Legacy post API URL is not configured")
    const url = new URL("posts", base)
    url.searchParams.set("page", String(page))
    url.searchParams.set("size", String(LEGACY_PAGE_SIZE))
    const response = await readBoundedJson(url, revalidate)
    const parsed = parseLegacyPage(response.data)
    if (!parsed) throw new LegacyPostUnavailableError()
    return parsed
}

async function getLegacyCollection(): Promise<LegacyCollection> {
    let firstPage: LegacyPagePayload
    try {
        firstPage = await fetchLegacyPage(0)
    } catch {
        return { items: [], unavailable: true, truncated: false }
    }

    const pageCount = Math.min(firstPage.totalPages, MAX_LEGACY_PAGES)
    const remaining = await Promise.allSettled(
        Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => fetchLegacyPage(index + 1)),
    )
    const items = [...firstPage.content]
    let unavailable = false
    for (const result of remaining) {
        if (result.status === "fulfilled") items.push(...result.value.content)
        else unavailable = true
    }

    return {
        items: items.slice(0, MAX_LEGACY_POSTS),
        unavailable,
        truncated: firstPage.totalPages > MAX_LEGACY_PAGES || firstPage.totalElements > MAX_LEGACY_POSTS,
    }
}

async function getLegacySlice(offset: number, limit: number, revalidate?: number): Promise<LegacySlice> {
    const pageNumber = limit > 0 ? Math.floor(offset / LEGACY_PAGE_SIZE) : 0
    const withinPage = offset % LEGACY_PAGE_SIZE
    let firstPage: LegacyPagePayload
    try {
        firstPage = await fetchLegacyPage(pageNumber, revalidate)
    } catch {
        return { items: [], totalElements: 0, unavailable: true }
    }

    const items = limit > 0 ? firstPage.content.slice(withinPage, withinPage + limit) : []
    let unavailable = false
    const remainingCount = limit - items.length
    if (remainingCount > 0 && pageNumber + 1 < firstPage.totalPages) {
        try {
            const nextPage = await fetchLegacyPage(pageNumber + 1, revalidate)
            items.push(...nextPage.content.slice(0, remainingCount))
        } catch {
            unavailable = true
        }
    }

    return { items, totalElements: firstPage.totalElements, unavailable }
}

export async function getAllPublicPostSummaries(): Promise<{
    items: PublicPostSummary[]
    legacyUnavailable: boolean
    legacyTruncated: boolean
}> {
    const [localPosts, legacy] = await Promise.all([getPublishedLocalPosts(), getLegacyCollection()])
    const items: PublicPostSummary[] = [...localPosts, ...legacy.items.map(legacySummary)]
    items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    return { items, legacyUnavailable: legacy.unavailable, legacyTruncated: legacy.truncated }
}

export async function getRecentPublicPosts(
    limit = 3,
    options: { legacyRevalidate?: number; contentDirectory?: string } = {},
): Promise<{
    items: PublicPostSummary[]
    legacyUnavailable: boolean
}> {
    const safeLimit = Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, 20) : 3
    const [localPosts, legacy] = await Promise.all([
        getPublishedLocalPosts(options.contentDirectory),
        getLegacySlice(0, safeLimit, options.legacyRevalidate),
    ])
    const items: PublicPostSummary[] = [...localPosts, ...legacy.items.map(legacySummary)]
    items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    return { items: items.slice(0, safeLimit), legacyUnavailable: legacy.unavailable }
}

export async function getPublicPosts(
    options: { page?: number; pageSize?: number; contentDirectory?: string; category?: PostCategoryFilter } = {},
): Promise<PublicPostPage> {
    const page = Number.isSafeInteger(options.page) && Number(options.page) > 0 ? Number(options.page) : 1
    const pageSize =
        Number.isSafeInteger(options.pageSize) && Number(options.pageSize) > 0
            ? Math.min(Number(options.pageSize), LEGACY_PAGE_SIZE)
            : 10
    const allLocalPosts = await getPublishedLocalPosts(options.contentDirectory)
    const category = isPostCategory(options.category) ? options.category : "all"
    const localPosts = category === "all" ? allLocalPosts : allLocalPosts.filter((post) => post.category === category)
    const start = (page - 1) * pageSize
    const localItems = localPosts.slice(start, start + pageSize)
    const legacyOffset = Math.max(0, start - localPosts.length)
    // The old API has no categories. Keep its complete pagination under Other.
    const includeLegacy = category === "all" || category === "other"
    const legacyLimit = includeLegacy ? pageSize - localItems.length : 0
    const legacy = await getLegacySlice(includeLegacy ? legacyOffset : 0, legacyLimit)
    const totalItems = localPosts.length + (includeLegacy ? legacy.totalElements : 0)
    const categoryCounts: PostCategoryCounts = { all: allLocalPosts.length + legacy.totalElements, "ai-agents": 0, development: 0, "work-life": 0, other: legacy.totalElements }
    for (const post of allLocalPosts) categoryCounts[post.category ?? "other"]++
    const legacyUnavailable = includeLegacy && legacy.unavailable
    const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const totalPages = legacyUnavailable ? Math.max(page, calculatedTotalPages) : calculatedTotalPages

    return {
        category,
        categoryCounts,
        items: [...localItems, ...legacy.items.map(legacySummary)],
        page,
        pageSize,
        totalItems,
        totalPages,
        legacyUnavailable,
        legacyTruncated: false,
    }
}

async function getLegacyPost(id: number): Promise<PublicPost | null> {
    const base = apiBaseUrl()
    if (!base) throw new LegacyPostUnavailableError("Legacy post API URL is not configured")
    const response = await readBoundedJson(new URL(`posts/${id}`, base))
    if (response.status === 404) return null
    const post = parseLegacyDetail(response.data)
    if (!post) throw new LegacyPostUnavailableError()

    return {
        ...legacySummary(post),
        html: sanitizePostHtml(post.content),
        legacyEditorPost: {
            id: post.id,
            title: post.title,
            thumbnail: post.thumbnail || "",
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likeCount: post.likeCount,
        },
    }
}

export async function getPublicPost(slug: string): Promise<PublicPost | null> {
    if (/^[1-9]\d*$/.test(slug)) {
        const id = Number(slug)
        if (!Number.isSafeInteger(id)) return null
        return getLegacyPost(id)
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return null

    const posts = await getPublishedLocalPosts()
    return posts.find((post) => post.slug === slug) || null
}

export { LegacyPostUnavailableError }
