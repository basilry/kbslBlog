import type { MetadataRoute } from "next"
import { publicPages, languageAlternates } from "@lib/seo"
import projectDetails from "@lib/json/projectDetails.json"
import { SITE_URL } from "@lib/content"
import { getLocalizedPostSummaries } from "@lib/content/localized-posts"
import { LOCALES, localeHref, stripLocale } from "@lib/i18n/config"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages = [...Object.keys(publicPages), ...projectDetails.map(project => `/projects/${project.slug}`)]
    const posts = await Promise.all(LOCALES.map(locale => getLocalizedPostSummaries(locale)))
    const translated = new Set(posts[1].map(post => post.slug))
    return [
        ...LOCALES.flatMap(locale => pages.map(path => ({ url: new URL(localeHref(path, locale), SITE_URL).href, alternates: { languages: languageAlternates(path) } }))),
        ...posts.flat().map((post) => ({
            url: `${SITE_URL}${post.href}`,
            lastModified: post.updatedAt || post.publishedAt,
            changeFrequency: "monthly" as const,
            priority: 0.6,
            ...(translated.has(post.slug) ? { alternates: { languages: languageAlternates(stripLocale(post.href)) } } : {}),
        })),
    ]
}
