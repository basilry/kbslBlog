import { describe, expect, it } from "vitest"
import { blogPosting, postListMetadata, serializeJsonLd } from "./seo"
import type { PublicPostSummary } from "./content/types"

describe("search metadata boundaries", () => {
    it("keeps later list pages canonical to themselves", () => {
        expect(postListMetadata(1).alternates?.canonical).toBe("https://www.basilry.kim/post")
        expect(postListMetadata(2).alternates?.canonical).toBe("https://www.basilry.kim/post?page=2")
    })

    it("serializes article content without allowing script termination", () => {
        const post: PublicPostSummary = {
            id: "example", slug: "example", source: "local", href: "/post/example",
            title: '</script><script>alert("x")</script>', description: "A < B",
            publishedAt: "2026-09-07", tags: [], likeCount: 0,
        }
        const serialized = serializeJsonLd(blogPosting(post))
        expect(serialized).not.toContain("<")
        const decoded = JSON.parse(serialized)
        expect(decoded.headline).toBe(post.title)
        expect(decoded.mainEntityOfPage["@id"]).toBe("https://www.basilry.kim/post/example")
        expect(decoded).not.toHaveProperty("image")
        expect(decoded).not.toHaveProperty("dateModified")
    })

    it("preserves category and page in canonical links", () => {
        expect(postListMetadata(1, "ai-agents").alternates?.canonical).toBe("https://www.basilry.kim/post?category=ai-agents")
        expect(postListMetadata(2, "development").alternates?.canonical).toBe("https://www.basilry.kim/post?category=development&page=2")
    })
})
