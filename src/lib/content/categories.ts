export const POST_CATEGORIES = [
    { id: "ai-agents", label: "AI·에이전트", description: "AI와 에이전트로 만들어 가는 것들" },
    { id: "development", label: "개발·출시", description: "만들고, 출시하고, 운영하며 배운 것들" },
    { id: "work-life", label: "일과 생각", description: "개발자로 일하며 마주한 생각들" },
    { id: "other", label: "기타", description: "여러 주제의 기록과 이전 글 보관함" },
] as const

export type PostCategoryId = typeof POST_CATEGORIES[number]["id"]
export type PostCategoryFilter = PostCategoryId | "all"
export type PostCategoryCounts = Record<PostCategoryFilter, number>

export function isPostCategory(value: unknown): value is PostCategoryId {
    return POST_CATEGORIES.some((category) => category.id === value)
}

export function postCategoryLabel(id: PostCategoryId = "other", locale: "ko" | "en" = "ko"): string {
    if (locale === "en") return ({ "ai-agents": "AI & agents", development: "Development & shipping", "work-life": "Work & life", other: "Other" })[id]
    return POST_CATEGORIES.find((category) => category.id === id)?.label ?? "기타"
}

export function postCategoryDescription(id: PostCategoryId, locale: "ko" | "en" = "ko"): string {
    if (locale === "en") return ({ "ai-agents": "What I am building with AI and agents", development: "Lessons from building, shipping and running software", "work-life": "Thoughts on working as a developer", other: "Other topics and earlier posts" })[id]
    return POST_CATEGORIES.find(category => category.id === id)?.description ?? ""
}

export function postListHref(page = 1, category: PostCategoryFilter = "all"): string {
    const query = new URLSearchParams()
    if (category !== "all") query.set("category", category)
    if (page > 1) query.set("page", String(page))
    return `/post${query.size ? `?${query}` : ""}`
}
