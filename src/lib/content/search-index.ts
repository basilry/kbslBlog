import { htmlToDOM } from "html-react-parser"
import { plainTextFromHtml } from "./markdown"
import { getPublishedLocalPosts } from "./posts"
import type { SearchablePost } from "./search"

function searchableText(html: string): string {
    // Preserve paragraph boundaries and decode entities after removing HTML.
    const text = plainTextFromHtml(html.replace(/<\/(?:p|h[1-6]|li|blockquote|pre|div|tr)>|<br\s*\/?>/gi, "$& "))
    return htmlToDOM(text).map((node) => node.type === "text" ? node.data : "").join("")
        .normalize("NFKC").replace(/\s+/g, " ").trim()
}

// Called during the static page build. Only already-published local content is serialized to the browser.
export async function buildPostSearchIndex(directory?: string): Promise<SearchablePost[]> {
    const posts = await getPublishedLocalPosts(directory)
    return posts.map(({ html, ...summary }) => ({ summary, text: searchableText(html) }))
}
