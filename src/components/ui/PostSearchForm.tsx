"use client"

import Form from "next/form"
import Link from "next/link"
import { useSyncExternalStore, type FormEvent } from "react"
import { postCategoryLabel, type PostCategoryFilter } from "@lib/content/categories"
import { MAX_SEARCH_QUERY_LENGTH, postSearchHref } from "@lib/content/search-query"
import { addRecentSearch, clearRecentSearches, getRecentSearchesSnapshot, getServerRecentSearchesSnapshot, removeRecentSearch, subscribeRecentSearches } from "@lib/content/recent-searches"
import styles from "@styles/pages/postList.module.scss"

interface PostSearchFormProps {
    query?: string
    category: PostCategoryFilter
}

export default function PostSearchForm({ query = "", category }: PostSearchFormProps) {
    const recent = useSyncExternalStore(subscribeRecentSearches, getRecentSearchesSnapshot, getServerRecentSearchesSnapshot)
    const submit = (event: FormEvent<HTMLFormElement>) => {
        addRecentSearch(new FormData(event.currentTarget).get("q"))
    }
    return <>
        <Form action="/search" className={styles.searchForm} role="search" aria-label="포스팅 검색" onSubmit={submit}>
            <label htmlFor="post-search">{category === "all" ? "포스팅 검색" : `${postCategoryLabel(category)}에서 검색`}</label>
            <div className={styles.searchControls}>
                <input key={`${category}:${query}`} id="post-search" type="search" name="q" defaultValue={query}
                    placeholder="제목, 본문, 태그 검색" maxLength={MAX_SEARCH_QUERY_LENGTH} autoComplete="off"
                    enterKeyHint="search" aria-describedby="post-search-hint" />
                {category !== "all" && <input type="hidden" name="category" value={category} />}
                <button type="submit">검색</button>
            </div>
            <p id="post-search-hint">단어를 띄어 쓰면 모든 단어가 포함된 글을 찾습니다.</p>
        </Form>
        <section className={styles.recentSearches} aria-label="최근 검색어">
            <div className={styles.recentHeading}>
                <h2>최근 검색어</h2>
                <span>이 브라우저에만 저장됩니다.</span>
                {recent.length > 0 && <button type="button" onClick={clearRecentSearches}>전체 삭제</button>}
            </div>
            {recent.length ? <ul className={styles.recentList}>
                {recent.map((term) => <li key={term}>
                    <Link href={postSearchHref(term, 1, category)} prefetch={false} onClick={() => addRecentSearch(term)} title={term}>{term}</Link>
                    <button type="button" aria-label={`${term} 검색어 삭제`} onClick={() => removeRecentSearch(term)}><span aria-hidden="true">×</span></button>
                </li>)}
            </ul> : <p className={styles.recentEmpty}>최근 검색어가 없습니다.</p>}
        </section>
    </>
}
