import { getAllPublicPostSummaries, SITE_URL } from "@lib/content"

export const dynamic = "force-dynamic"

function xml(value: string): string {
    return value.replace(/[<>&"']/g, (character) => {
        const entities: Record<string, string> = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
        }
        return entities[character]
    })
}

export async function GET(): Promise<Response> {
    const { items } = await getAllPublicPostSummaries()
    const updated = items[0]?.updatedAt || items[0]?.publishedAt || new Date(0).toISOString()
    const entries = items
        .slice(0, 50)
        .map((post) => {
            const url = `${SITE_URL}${post.href}`
            return `<item>
  <guid isPermaLink="true">${xml(url)}</guid>
  <title>${xml(post.title)}</title>
  <link>${xml(url)}</link>
  <pubDate>${xml(new Date(post.publishedAt).toUTCString())}</pubDate>
  <description>${xml(post.description)}</description>
</item>`
        })
        .join("\n")

    const body = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
<channel>
  <title>basilry.kim</title>
  <link>${SITE_URL}/</link>
  <description>개발과 제품을 만들며 배운 내용을 기록합니다.</description>
  <language>ko</language>
  <lastBuildDate>${xml(new Date(updated).toUTCString())}</lastBuildDate>
  ${entries}
</channel>
</rss>`

    return new Response(body, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
        },
    })
}
