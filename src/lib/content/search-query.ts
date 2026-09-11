import { isPostCategory, type PostCategoryFilter } from "./categories"

export const MAX_SEARCH_QUERY_LENGTH = 100

export function normalizeSearchQuery(value: unknown): string {
    return typeof value === "string"
        ? value.normalize("NFKC").replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_QUERY_LENGTH).trim()
        : ""
}

export function postSearchHref(query = "", page = 1, category: PostCategoryFilter = "all"): string {
    const params = new URLSearchParams()
    const normalized = normalizeSearchQuery(query)
    if (normalized) params.set("q", normalized)
    if (category !== "all") params.set("category", category)
    if (page > 1) params.set("page", String(page))
    return `/search${params.size ? `?${params}` : ""}`
}

export interface PostSearchParams {
    q?: string | string[]
    page?: string | string[]
    category?: string | string[]
}

export function parsePostSearchParams(params: PostSearchParams) {
    const query = normalizeSearchQuery(params.q)
    const category: PostCategoryFilter = isPostCategory(params.category) ? params.category : "all"
    const requestedPage = typeof params.page === "string" ? Number(params.page) : 1
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    const needsRedirect = (params.q !== undefined && params.q !== (query || undefined))
        || (params.category !== undefined && params.category !== (category === "all" ? undefined : category))
        || (params.page !== undefined && params.page !== (page === 1 ? undefined : String(page)))
    return { query, category, page, needsRedirect, href: postSearchHref(query, page, category) }
}
