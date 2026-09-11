import { pageLocale } from "@lib/i18n/server"
import { localeHref } from "@lib/i18n/config"
import { languageAlternates } from "@lib/seo"
import { getLocalizedPost, getLocalizedAdjacentPosts, getLocalizedPublishedPosts } from "@lib/content/localized-posts"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, type ReactElement } from "react"
import PostDetail from "./PostDetail"
import { LegacyPostUnavailableError, SITE_URL } from "@lib/content"


const loadPost = cache(getLocalizedPost)
export const dynamicParams = true

interface PostPageProps {
    params: Promise<{ detailId: string; locale: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { detailId } = await params
    const locale = await pageLocale(params)
    try {
        const post = await loadPost(detailId, locale)
        if (!post) notFound()

        const canonical = `${SITE_URL}${post.href}`
        return {
            title: post.title,
            description: post.description,
            alternates: { canonical, ...(post.source === "local" ? { languages: languageAlternates(`/post/${post.slug}`) } : {}), types: { "application/rss+xml": `${SITE_URL}${localeHref("/feed.xml", locale)}` } },
            openGraph: {
                type: "article",
                siteName: "basilry.kim",
                locale: locale === "en" ? "en_US" : "ko_KR",
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
        if (error instanceof LegacyPostUnavailableError) return { title: locale === "en" ? "Loading post" : "글을 불러오는 중입니다", robots: { index: false, follow: true } }
        throw error
    }
}

export default async function PostPage({ params }: PostPageProps): Promise<ReactElement> {
    const { detailId } = await params
    const locale = await pageLocale(params)
    const post = await loadPost(detailId, locale)
    if (!post) notFound()
    const adjacent = post.source === "local" ? await getLocalizedAdjacentPosts(post.slug, locale) : undefined
    return <PostDetail post={post} adjacent={adjacent} />
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
    const locale = await pageLocale(Promise.resolve(params))
    return (await getLocalizedPublishedPosts(locale)).map(post => ({ detailId: post.slug }))
}
