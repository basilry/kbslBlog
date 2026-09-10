import { describe, expect, it } from "vitest"
import { buildPostOutline } from "./outline"

describe("post outline", () => {
    it("decodes inline text and creates unique Korean anchors across heading levels", () => {
        const source = '<h2>일과 <strong>생각</strong> &amp; AI</h2><h3>일과 생각 &amp; AI</h3><h4>일과 생각 &amp; AI 2</h4><h2>일과 생각 &amp; AI</h2>'
        const result = buildPostOutline(source)
        expect(result.headings).toEqual([
            { id: "heading-일과-생각-ai", text: "일과 생각 & AI", level: 2 },
            { id: "heading-일과-생각-ai-2", text: "일과 생각 & AI", level: 3 },
            { id: "heading-일과-생각-ai-2-2", text: "일과 생각 & AI 2", level: 4 },
            { id: "heading-일과-생각-ai-3", text: "일과 생각 & AI", level: 2 },
        ])
        for (const heading of result.headings) expect(result.html).toContain(`id="${heading.id}" tabindex="-1"`)
        expect(result.html).toContain("<strong>생각</strong>")
        expect(buildPostOutline(source)).toEqual(result)
    })

    it("removes unsafe attributes and scripts before generating anchors", () => {
        const result = buildPostOutline('<h2 id="post-content" onclick="alert(1)">Safe<script>alert(2)</script></h2><h3> &nbsp; </h3><h4>!!!</h4>')
        expect(result.headings.map((heading) => heading.id)).toEqual(["heading-safe", "heading-section"])
        expect(result.html).not.toMatch(/onclick|alert|id="post-content"/)
    })

    it("does not interpret code snippets as headings and permits articles without headings", () => {
        const result = buildPostOutline('<p>Text</p><pre><code>&lt;h2&gt;Example&lt;/h2&gt;</code></pre>')
        expect(result.headings).toEqual([])
        expect(result.html).toContain("&lt;h2&gt;")
    })
})
