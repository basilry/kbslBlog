"use client"

import { useLocale } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"
import { localeHref } from "@lib/i18n/config"
import Form from "next/form"
import Link from "@components/ui/LocaleLink"
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
    const locale = useLocale()
    const m = messages(locale)
    const recent = useSyncExternalStore(subscribeRecentSearches, getRecentSearchesSnapshot, getServerRecentSearchesSnapshot)
    const submit = (event: FormEvent<HTMLFormElement>) => {
        addRecentSearch(new FormData(event.currentTarget).get("q"))
    }
    return <>
        <Form action={localeHref("/search", locale)} className={styles.searchForm} role="search" aria-label={m.searchTitle} onSubmit={submit}>
            <label htmlFor="post-search">{category === "all" ? m.searchTitle : (locale === "en" ? `Search ${postCategoryLabel(category, locale)}` : `${postCategoryLabel(category)}에서 검색`)}</label>
            <div className={styles.searchControls}>
                <input key={`${category}:${query}`} id="post-search" type="search" name="q" defaultValue={query}
                    placeholder={m.searchPlaceholder} maxLength={MAX_SEARCH_QUERY_LENGTH} autoComplete="off"
                    enterKeyHint="search" aria-describedby="post-search-hint" />
                {category !== "all" && <input type="hidden" name="category" value={category} />}
                <button type="submit">{m.search}</button>
            </div>
            <p id="post-search-hint">{m.searchHint}</p>
        </Form>
        <section className={styles.recentSearches} aria-label={m.recentSearches}>
            <div className={styles.recentHeading}>
                <h2>{m.recentSearches}</h2>
                <span>{m.browserOnly}</span>
                {recent.length > 0 && <button type="button" onClick={clearRecentSearches}>{m.clearAll}</button>}
            </div>
            {recent.length ? <ul className={styles.recentList}>
                {recent.map((term) => <li key={term}>
                    <Link href={postSearchHref(term, 1, category)} prefetch={false} onClick={() => addRecentSearch(term)} title={term}>{term}</Link>
                    <button type="button" aria-label={(locale === "en" ? `Remove search: ${term}` : `${term} 검색어 삭제`)} onClick={() => removeRecentSearch(term)}><span aria-hidden="true">×</span></button>
                </li>)}
            </ul> : <p className={styles.recentEmpty}>{m.noRecent}</p>}
        </section>
    </>
}
