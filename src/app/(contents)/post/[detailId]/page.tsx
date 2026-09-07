import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactElement } from "react"
import PostDetail from "./PostDetail"
import { getPublicPost, LegacyPostUnavailableError, SITE_URL } from "@lib/content"

interface PostPageProps {
    params: Promise<{ detailId: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { detailId } = await params
    try {
        const post = await getPublicPost(detailId)
        if (!post) return { title: "글을 찾을 수 없습니다" }

        const canonical = `${SITE_URL}${post.href}`
        return {
            title: post.title,
            description: post.description,
            alternates: { canonical },
            openGraph: {
                type: "article",
                url: canonical,
                title: post.title,
                description: post.description,
                publishedTime: post.publishedAt,
                modifiedTime: post.updatedAt,
                tags: post.tags,
                images: post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : undefined,
            },
            twitter: {
                card: post.thumbnail ? "summary_large_image" : "summary",
                title: post.title,
                description: post.description,
                images: post.thumbnail ? [post.thumbnail] : undefined,
            },
        }
    } catch (error) {
        if (error instanceof LegacyPostUnavailableError) return { title: "글을 불러오는 중입니다" }
        throw error
    }
}

export default async function PostPage({ params }: PostPageProps): Promise<ReactElement> {
    const { detailId } = await params
    const post = await getPublicPost(detailId)
    if (!post) notFound()
    return <PostDetail post={post} />
}
