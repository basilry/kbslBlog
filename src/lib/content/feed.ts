import { getLocalizedPostSummaries } from "./localized-posts"
import { SITE_URL } from "./types"
import { localeHref, type Locale } from "../i18n/config"
import { messages } from "../i18n/messages"

function xml(value: string): string {
    const entities: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }
    return value.replace(/[<>&"']/g, character => entities[character])
}
export async function localizedFeed(locale: Locale): Promise<Response> {
    const items = await getLocalizedPostSummaries(locale)
    const updated = items.reduce((latest, post) => Math.max(latest, Date.parse(post.updatedAt || post.publishedAt)), 0)
    const entries = items.slice(0, 50).map(post => {
        const url = `${SITE_URL}${post.href}`
        return `<item><guid isPermaLink="true">${xml(url)}</guid><title>${xml(post.title)}</title><link>${xml(url)}</link><pubDate>${xml(new Date(post.publishedAt).toUTCString())}</pubDate><description>${xml(post.description)}</description></item>`
    }).join("\n")
    return new Response(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel><title>basilry.kim</title><link>${SITE_URL}${localeHref("/", locale)}</link><description>${xml(messages(locale).writingDescription)}</description><language>${locale}</language><lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>${entries}</channel></rss>`, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600" },
    })
}
