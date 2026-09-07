import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import type { ReactElement } from "react"
import PostList from "./PostList"
import { getPublicPosts, SITE_URL } from "@lib/content"

export const metadata: Metadata = {
    title: "글",
    description: "개발과 제품을 만들며 배운 내용을 기록합니다.",
    alternates: { canonical: `${SITE_URL}/post` },
}

interface PostIndexPageProps {
    searchParams: Promise<{ page?: string | string[] }>
}

export default async function PostIndexPage({ searchParams }: PostIndexPageProps): Promise<ReactElement> {
    const requestedPage = (await searchParams).page
    if (Array.isArray(requestedPage)) redirect("/post?page=1")

    const page = requestedPage === undefined ? 1 : Number(requestedPage)
    if (!Number.isSafeInteger(page) || page < 1) redirect("/post?page=1")

    const posts = await getPublicPosts({ page, pageSize: 10 })
    if (!posts.legacyUnavailable && posts.totalItems > 0 && page > posts.totalPages) notFound()

    return <PostList posts={posts} />
}
