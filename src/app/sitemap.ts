import type { MetadataRoute } from "next"
import { getAllPublicPostSummaries, SITE_URL } from "@lib/content"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { items } = await getAllPublicPostSummaries()
    return [
        { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/post`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.7 },
        ...items.map((post) => ({
            url: `${SITE_URL}${post.href}`,
            lastModified: post.updatedAt || post.publishedAt,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ]
}
