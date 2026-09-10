import type { Metadata } from "next"
import { cache, type ReactElement } from "react"
import { notFound, redirect } from "next/navigation"
import PostList from "./PostList"
import { getPublicPosts } from "@lib/content"
import { postListMetadata } from "@lib/seo"
import { isPostCategory, postListHref, type PostCategoryFilter } from "@lib/content/categories"

interface PostIndexPageProps {
    searchParams: Promise<{ page?: string | string[]; category?: string | string[] }>
}

function pageNumber(requested: string | string[] | undefined, category: PostCategoryFilter): number {
    if (requested === undefined) return 1
    if (Array.isArray(requested)) redirect(postListHref(1, category))
    const page = Number(requested)
    if (!Number.isSafeInteger(page) || page < 1) redirect(postListHref(1, category))
    if (page === 1 || requested !== String(page)) redirect(postListHref(page, category))
    return page
}

function categoryFilter(value: string | string[] | undefined): PostCategoryFilter {
    if (value === undefined) return "all"
    if (!isPostCategory(value)) redirect("/post")
    return value
}

const loadPosts = cache(async (page: number, category: PostCategoryFilter) => {
    const posts = await getPublicPosts({ page, pageSize: 10, category })
    if (!posts.legacyUnavailable && page > posts.totalPages) notFound()
    return posts
})

export async function generateMetadata({ searchParams }: PostIndexPageProps): Promise<Metadata> {
    const requested = await searchParams
    const category = categoryFilter(requested.category)
    const page = pageNumber(requested.page, category)
    const posts = await loadPosts(page, category)
    return {
        ...postListMetadata(page, category),
        ...(posts.items.length === 0 ? { robots: { index: false, follow: true } } : {}),
    }
}

export default async function PostIndexPage({ searchParams }: PostIndexPageProps): Promise<ReactElement> {
    const requested = await searchParams
    const category = categoryFilter(requested.category)
    const page = pageNumber(requested.page, category)
    return <PostList posts={await loadPosts(page, category)} />
}
