import type { Metadata } from "next"
import { cache, type ReactElement } from "react"
import { notFound, redirect } from "next/navigation"
import PostList from "./PostList"
import { getPublicPosts } from "@lib/content"
import { postListMetadata } from "@lib/seo"

interface PostIndexPageProps {
    searchParams: Promise<{ page?: string | string[] }>
}

function pageNumber(requested: string | string[] | undefined): number {
    if (requested === undefined) return 1
    if (Array.isArray(requested)) redirect("/post")
    const page = Number(requested)
    if (!Number.isSafeInteger(page) || page < 1) redirect("/post")
    if (page === 1) redirect("/post")
    if (requested !== String(page)) redirect(`/post?page=${page}`)
    return page
}

const loadPosts = cache(async (page: number) => {
    const posts = await getPublicPosts({ page, pageSize: 10 })
    if (!posts.legacyUnavailable && page > posts.totalPages) notFound()
    return posts
})

export async function generateMetadata({ searchParams }: PostIndexPageProps): Promise<Metadata> {
    const page = pageNumber((await searchParams).page)
    const posts = await loadPosts(page)
    return {
        ...postListMetadata(page),
        ...(posts.items.length === 0 && posts.legacyUnavailable ? { robots: { index: false, follow: true } } : {}),
    }
}

export default async function PostIndexPage({ searchParams }: PostIndexPageProps): Promise<ReactElement> {
    const page = pageNumber((await searchParams).page)
    return <PostList posts={await loadPosts(page)} />
}
