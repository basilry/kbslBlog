import type { MetadataRoute } from "next"
import { publicPages } from "@lib/seo"
import projectDetails from "@lib/json/projectDetails.json"
import { getAllPublicPostSummaries, SITE_URL } from "@lib/content"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { items } = await getAllPublicPostSummaries()
    return [
        ...Object.keys(publicPages).map((path) => ({ url: new URL(path, SITE_URL).href })),
        ...projectDetails.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
        ...items.map((post) => ({
            url: `${SITE_URL}${post.href}`,
            lastModified: post.updatedAt || post.publishedAt,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ]
}
