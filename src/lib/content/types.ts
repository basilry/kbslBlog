import type { PostCategoryCounts, PostCategoryFilter, PostCategoryId } from "./categories"
import type { Locale } from "../i18n/config"

export const SITE_URL = "https://www.basilry.kim"

export type PublicPostSource = "local" | "legacy"

export interface PublicPostSummary {
    locale?: Locale
    id: string
    slug: string
    source: PublicPostSource
    title: string
    description: string
    publishedAt: string
    updatedAt?: string
    thumbnail?: string
    tags: string[]
    category?: PostCategoryId
    likeCount: number
    href: string
}

export interface LegacyEditorPost {
    id: number
    title: string
    thumbnail: string
    content: string
    createdAt: string
    updatedAt: string
    likeCount: number
}

export interface PublicPost extends PublicPostSummary {
    html: string
    legacyEditorPost?: LegacyEditorPost
}

export interface PublicPostPage {
    category: PostCategoryFilter
    categoryCounts: PostCategoryCounts
    items: PublicPostSummary[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    legacyUnavailable: boolean
    legacyTruncated: boolean
}

export interface LocalPostFrontmatter {
    category: PostCategoryId
    title: string
    slug: string
    description: string
    publishedAt: string
    updatedAt?: string
    tags: string[]
    draft: boolean
    thumbnail?: string
    project?: string
}

export interface LocalPostDocument {
    metadata: LocalPostFrontmatter
    markdown: string
    html: string
}
