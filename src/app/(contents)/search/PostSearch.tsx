"use client"

import { useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSearchPostPage, type SearchablePost } from "@lib/content/search"
import { parsePostSearchParams, postSearchHref } from "@lib/content/search-query"
import PostList from "../post/PostList"

export default function PostSearch({ index }: { index: SearchablePost[] }) {
    const params = useSearchParams()
    const router = useRouter()
    const request = useMemo(() => {
        const value = (key: string) => {
            const values = params.getAll(key)
            return values.length > 1 ? values : values[0]
        }
        return parsePostSearchParams({ q: value("q"), category: value("category"), page: value("page") })
    }, [params])
    const { query, category, page, needsRedirect } = request
    const posts = useMemo(() => getSearchPostPage(index, query, { page, pageSize: 10, category }), [index, query, page, category])

    useEffect(() => {
        if (needsRedirect || page !== posts.page) router.replace(postSearchHref(query, posts.page, category), { scroll: false })
    }, [router, needsRedirect, query, category, page, posts.page])

    return <PostList posts={posts} query={query} />
}
