import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { localeHref, type Locale } from "@lib/i18n/config"
import type { Metadata } from "next"
import { cache, type ReactElement } from "react"
import { notFound, redirect } from "next/navigation"
import PostList from "./PostList"
import { getLocalizedPostPage } from "@lib/content/localized-posts"
import { postListMetadata } from "@lib/seo"
import { isPostCategory, postListHref, type PostCategoryFilter } from "@lib/content/categories"

interface PostIndexPageProps extends LocalePageProps {
    searchParams: Promise<{ page?: string | string[]; category?: string | string[] }>
}

function pageNumber(requested: string | string[] | undefined, category: PostCategoryFilter, locale: Locale): number {
    if (requested === undefined) return 1
    if (Array.isArray(requested)) redirect(localeHref(postListHref(1, category), locale))
    const page = Number(requested)
    if (!Number.isSafeInteger(page) || page < 1) redirect(localeHref(postListHref(1, category), locale))
    if (page === 1 || requested !== String(page)) redirect(localeHref(postListHref(page, category), locale))
    return page
}

function categoryFilter(value: string | string[] | undefined, locale: Locale): PostCategoryFilter {
    if (value === undefined) return "all"
    if (!isPostCategory(value)) redirect(localeHref("/post", locale))
    return value
}

const loadPosts = cache(async (page: number, category: PostCategoryFilter, locale: Locale) => {
    const posts = await getLocalizedPostPage(locale, { page, pageSize: 10, category })
    if (!posts.legacyUnavailable && page > posts.totalPages) notFound()
    return posts
})

export async function generateMetadata({ searchParams, params }: PostIndexPageProps): Promise<Metadata> {
    const locale = await pageLocale(params)
    const requested = await searchParams
    const category = categoryFilter(requested.category, locale)
    const page = pageNumber(requested.page, category, locale)
    const posts = await loadPosts(page, category, locale)
    return {
        ...postListMetadata(page, category, locale),
        ...(posts.items.length === 0 ? { robots: { index: false, follow: true } } : {}),
    }
}

export default async function PostIndexPage({ searchParams, params }: PostIndexPageProps): Promise<ReactElement> {
    const locale = await pageLocale(params)
    const requested = await searchParams
    const category = categoryFilter(requested.category, locale)
    const page = pageNumber(requested.page, category, locale)
    return <PostList posts={await loadPosts(page, category, locale)} />
}
