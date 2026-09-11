import { getPublishedLocalPosts } from "./posts"
import type { PublicPostSummary } from "./types"

export type AdjacentPost = Pick<PublicPostSummary, "title" | "href" | "publishedAt">
export interface AdjacentPosts {
    previous: AdjacentPost | null
    next: AdjacentPost | null
}

export async function getAdjacentPublishedPosts(slug: string, directory?: string): Promise<AdjacentPosts> {
    const posts = await getPublishedLocalPosts(directory)
    posts.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.slug.localeCompare(b.slug))
    const index = posts.findIndex((post) => post.slug === slug)
    if (index < 0) return { previous: null, next: null }
    const summary = (post: PublicPostSummary | undefined): AdjacentPost | null => post
        ? { title: post.title, href: post.href, publishedAt: post.publishedAt } : null
    // Previous is the older publication; next is the newer publication. Do not wrap at either end.
    return { previous: summary(posts[index + 1]), next: summary(posts[index - 1]) }
}
