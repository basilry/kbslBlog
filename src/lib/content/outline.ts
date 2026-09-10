import { htmlToDOM, type DOMNode } from "html-react-parser"
import { sanitizePostHtml } from "./markdown"

export interface PostHeading {
    id: string
    text: string
    level: number
}

function textContent(nodes: readonly DOMNode[]): string {
    return nodes.map((node) => {
        if (node.type === "text") return node.data
        if ("children" in node) return textContent(node.children as DOMNode[])
        return ""
    }).join("")
}

/** Work on sanitized HTML: heading attributes have already been stripped. */
export function buildPostOutline(source: string): { html: string; headings: PostHeading[] } {
    const headings: PostHeading[] = []
    const used = new Set<string>()
    const html = sanitizePostHtml(source).replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (heading, level: string, inner: string) => {
        const text = textContent(htmlToDOM(inner)).replace(/\s+/g, " ").trim()
        if (!text) return heading
        const slug = text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 80)
        const base = `heading-${slug || "section"}`
        let id = base
        let suffix = 2
        while (used.has(id)) id = `${base}-${suffix++}`
        used.add(id)
        headings.push({ id, text, level: Number(level) })
        return `<h${level} id="${id}" tabindex="-1">${inner}</h${level}>`
    })
    return { html, headings }
}
