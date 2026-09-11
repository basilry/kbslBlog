import { isPostCategory, type PostCategoryCounts, type PostCategoryFilter } from "./categories"
import { normalizeSearchQuery } from "./search-query"
import type { PublicPostPage, PublicPostSummary } from "./types"

export interface SearchablePost {
    summary: PublicPostSummary
    text: string
}

function excerpt(text: string, terms: string[]): string {
    const lower = text.toLowerCase()
    const positions = terms.map((term) => lower.indexOf(term)).filter((position) => position >= 0)
    const start = positions.length ? Math.max(0, Math.min(...positions) - 60) : 0
    const end = Math.min(text.length, start + 220)
    return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`
}

export function searchPostSummaries(posts: SearchablePost[], query: string): PublicPostSummary[] {
    const terms = [...new Set(normalizeSearchQuery(query).toLowerCase().split(" ").filter(Boolean))]
    if (!terms.length) return []
    return posts.flatMap(({ summary, text: body }) => {
        const fields = [summary.title, summary.tags.join(" "), summary.description, body]
            .map((field) => field.normalize("NFKC").toLowerCase())
        if (!terms.every((term) => fields.some((field) => field.includes(term)))) return []
        const score = terms.reduce((total, term) => total + fields.reduce((sum, field, index) =>
            sum + (field.includes(term) ? [8, 4, 2, 1][index] : 0), 0), 0)
        const description = terms.some((term) => fields[3].includes(term)) ? excerpt(body, terms) : summary.description
        return [{ post: { ...summary, description }, score }]
    }).sort((a, b) => b.score - a.score
        || Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt)
        || a.post.href.localeCompare(b.post.href))
        .map(({ post }) => post)
}

export function getSearchPostPage(
    index: SearchablePost[],
    query: string,
    options: { page?: number; pageSize?: number; category?: PostCategoryFilter } = {},
): PublicPostPage {
    const normalized = normalizeSearchQuery(query)
    const matches = normalized ? searchPostSummaries(index, normalized)
        : index.map(({ summary }) => summary).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    const category = isPostCategory(options.category) ? options.category : "all"
    const categoryCounts: PostCategoryCounts = { all: matches.length, "ai-agents": 0, development: 0, "work-life": 0, other: 0 }
    for (const post of matches) categoryCounts[post.category ?? "other"]++
    const filtered = category === "all" ? matches : matches.filter((post) => post.category === category)
    const pageSize = Number.isSafeInteger(options.pageSize) && Number(options.pageSize) > 0
        ? Math.min(Number(options.pageSize), 20) : 10
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const requestedPage = Number.isSafeInteger(options.page) && Number(options.page) > 0 ? Number(options.page) : 1
    const page = Math.min(requestedPage, totalPages)
    return {
        category, categoryCounts,
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        page, pageSize, totalItems: filtered.length, totalPages,
        legacyUnavailable: false, legacyTruncated: false,
    }
}
