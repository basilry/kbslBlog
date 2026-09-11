"use client"

import { useLocale } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"
import { formatPostDate } from "@lib/i18n/config"
import Link from "@components/ui/LocaleLink"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import { PostViewCount, PostViewCountsProvider } from "@components/ui/PostViewCounters"
import PostSearchForm from "@components/ui/PostSearchForm"
import type { PublicPostPage } from "@lib/content"
import { POST_CATEGORIES, postCategoryLabel, postCategoryDescription, postListHref } from "@lib/content/categories"
import { postSearchHref } from "@lib/content/search-query"
import styles from "@styles/pages/postList.module.scss"

interface PostListProps {
    posts: PublicPostPage
    query?: string
}

export default function PostList({ posts, query }: PostListProps): ReactElement {
    const locale = useLocale()
    const m = messages(locale)
    const formatDate = (value: string) => formatPostDate(value, locale)
    const selected = POST_CATEGORIES.find((category) => category.id === posts.category)
    const categories = [{ id: "all" as const, label: m.allPosts }, ...POST_CATEGORIES.map(c => ({ ...c, label: postCategoryLabel(c.id, locale) }))]
    const searchPage = query !== undefined
    const searching = Boolean(query)
    const listHref = (page: number, category = posts.category) => searchPage
        ? postSearchHref(query, page, category) : postListHref(page, category)
    return (
        <Wrapper>
            <div className={styles.page} data-post-page={searchPage ? "search" : "list"}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeading}>
                        <span className={styles.categorySymbol} aria-hidden="true">≡</span>
                        <h2>{m.categories}</h2>
                    </div>
                    <p className={styles.sidebarNote}>{m.categoryHint}</p>
                    <nav aria-label={m.categoryNav} className={styles.categoryList}>
                        {categories.map((category) => (
                            <Link key={category.id} href={listHref(1, category.id)} prefetch={searchPage ? false : undefined}
                                aria-current={posts.category === category.id ? "page" : undefined}
                                className={styles.categoryLink}>
                                <span className={styles.categoryDot} aria-hidden="true" />
                                <span>{category.label}</span>
                                <span className={styles.categoryCount}>{posts.categoryCounts[category.id]}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <div className={styles.main}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>{searchPage ? "Search" : "Writing"}</p>
                    <h1>{searchPage ? m.searchTitle : m.writing}</h1>
                    <p>{searchPage ? m.searchDescription : (selected ? postCategoryDescription(selected.id, locale) : undefined) ?? m.writingDescription}</p>
                    {!searching && posts.items.some((post) => post.source === "legacy") && (
                        <p className={styles.orderNote}>{m.legacyOrder}</p>
                    )}
                </header>
                <PostSearchForm query={query} category={posts.category} />
                {searching && (
                    <div className={styles.searchSummary}>
                        <p role="status">“{query}”{selected ? ` · ${postCategoryLabel(selected.id, locale)}` : ""}</p>
                        <Link href={postSearchHref("", 1, posts.category)}>{m.clearSearch}</Link>
                    </div>
                )}
                <div className={styles.listHeading}>
                    <h2>{searching ? m.results : (selected ? postCategoryLabel(selected.id, locale) : undefined) ?? m.allPosts}<span>{posts.totalItems}</span></h2>
                    <span>{searching ? m.relevance : m.writingNote}</span>
                </div>

                {posts.legacyTruncated && (
                    <aside className={styles.notice} role="status">
                        {m.truncated}
                    </aside>
                )}

                {posts.items.length === 0 ? (
                    <section className={styles.empty}>
                        <h2>{searching ? m.noResults : posts.legacyUnavailable ? m.unavailable : selected ? m.noCategoryPosts : m.noPosts}</h2>
                        <p>
                            {searching ? m.searchSuggestion : posts.legacyUnavailable
                                ? m.retry
                                : selected ? m.otherCategories : m.draftNotice}
                        </p>
                        {searching && selected && <Link href={postSearchHref(query)}>{m.searchAll} →</Link>}
                        {(selected || searchPage) && <Link href="/post">{m.viewAll} →</Link>}
                    </section>
                ) : (
                    <PostViewCountsProvider paths={posts.items.map((post) => post.href)}>
                        <section aria-label={m.postList} className={styles.list}>
                            {posts.items.map((post) => (
                                <article key={`${post.source}-${post.id}`} className={styles.item}>
                                    <Link href={post.href} className={styles.itemLink}>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemCategory}>{postCategoryLabel(post.category, locale)}</span>
                                            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                                            <PostViewCount postPath={post.href} />
                                        </div>
                                        <h2>{post.title}</h2>
                                        <p>{post.description}</p>
                                        {post.tags.length > 0 && (
                                            <ul className={styles.tags} aria-label={m.tags}>
                                                {post.tags.map((tag) => (
                                                    <li key={tag}>{tag}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </Link>
                                </article>
                            ))}
                        </section>
                    </PostViewCountsProvider>
                )}

                {posts.totalPages > 1 && (
                    <nav className={styles.pagination} aria-label={m.pagination}>
                        {posts.page > 1 ? <Link href={listHref(posts.page - 1)} prefetch={searchPage ? false : undefined}>{m.previous}</Link> : <span>{m.previous}</span>}
                        <span aria-live="polite">
                            {posts.page} / {posts.totalPages}
                        </span>
                        {posts.page < posts.totalPages ? (
                            <Link href={listHref(posts.page + 1)} prefetch={searchPage ? false : undefined}>{m.next}</Link>
                        ) : (
                            <span>{m.next}</span>
                        )}
                    </nav>
                )}
                </div>
            </div>
        </Wrapper>
    )
}
