import path from "node:path"
import { getPublishedLocalPosts, getPublicPost, getPublicPosts, getRecentPublicPosts, getAllPublicPostSummaries } from "./posts"
import { getSearchPostPage } from "./search"
import { localeHref, type Locale } from "../i18n/config"
import type { PublicPost, PublicPostSummary, PublicPostPage } from "./types"
import type { PostCategoryFilter } from "./categories"
import type { AdjacentPosts } from "./adjacent-posts"

const CONTENT = path.join(process.cwd(), "content", "posts")
export function localizePost<T extends PublicPostSummary>(post: T, locale: Locale): T {
    const result = { ...post, locale, href: localeHref(post.href, locale) }
    if ("html" in result && typeof result.html === "string") {
        result.html = result.html.replace(/href="(\/(?:post|search|projects|introduce|research|career|certification)(?:[/?#][^"]*)?)"/g, (_match, href: string) => `href="${localeHref(href, locale)}"`)
    }
    return result
}
export async function getLocalizedPublishedPosts(locale: Locale, directory = CONTENT): Promise<PublicPost[]> {
    const original = await getPublishedLocalPosts(directory)
    if (locale === "ko") return original.map(post => localizePost(post, locale))
    const publishedSlugs = new Set(original.map(post => post.slug))
    const translated = await getPublishedLocalPosts(path.join(directory, "en"))
    return translated.filter(post => publishedSlugs.has(post.slug)).map(post => localizePost(post, locale))
}
export async function getLocalizedPost(slug: string, locale: Locale): Promise<PublicPost | null> {
    if (locale === "ko") {
        const post = await getPublicPost(slug)
        return post ? localizePost(post, locale) : null
    }
    return (await getLocalizedPublishedPosts(locale)).find(post => post.slug === slug) ?? null
}
export async function getLocalizedPostPage(locale: Locale, options: { page?: number; pageSize?: number; category?: PostCategoryFilter } = {}): Promise<PublicPostPage> {
    if (locale === "ko") {
        const posts = await getPublicPosts(options)
        return { ...posts, items: posts.items.map(post => localizePost(post, locale)) }
    }
    const posts = await getLocalizedPublishedPosts(locale)
    return getSearchPostPage(posts.map(({ html: _html, ...summary }) => ({ summary, text: "" })), "", options)
}
export async function getLocalizedRecentPosts(locale: Locale, limit = 3) {
    if (locale === "ko") {
        const result = await getRecentPublicPosts(limit, { legacyRevalidate: 300 })
        return { ...result, items: result.items.map(post => localizePost(post, locale)) }
    }
    return { items: (await getLocalizedPublishedPosts(locale)).slice(0, limit), legacyUnavailable: false }
}
export async function getLocalizedPostSummaries(locale: Locale): Promise<PublicPostSummary[]> {
    return locale === "ko" ? (await getAllPublicPostSummaries()).items.map(post => localizePost(post, locale)) : getLocalizedPublishedPosts(locale)
}
export async function getLocalizedAdjacentPosts(slug: string, locale: Locale): Promise<AdjacentPosts> {
    const posts = (await getLocalizedPublishedPosts(locale)).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.slug.localeCompare(b.slug))
    const index = posts.findIndex(post => post.slug === slug)
    if (index < 0) return { previous: null, next: null }
    const summary = (post?: PublicPostSummary) => post ? { title: post.title, href: post.href, publishedAt: post.publishedAt } : null
    return { previous: summary(posts[index + 1]), next: summary(posts[index - 1]) }
}
