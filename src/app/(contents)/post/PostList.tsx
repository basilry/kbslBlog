import Link from "next/link"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import { PostViewCount, PostViewCountsProvider } from "@components/ui/PostViewCounters"
import PostSearchForm from "@components/ui/PostSearchForm"
import type { PublicPostPage } from "@lib/content"
import { POST_CATEGORIES, postCategoryLabel, postListHref } from "@lib/content/categories"
import { postSearchHref } from "@lib/content/search-query"
import styles from "@styles/pages/postList.module.scss"

interface PostListProps {
    posts: PublicPostPage
    query?: string
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
})

function formatDate(value: string): string {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : value
}

export default function PostList({ posts, query }: PostListProps): ReactElement {
    const selected = POST_CATEGORIES.find((category) => category.id === posts.category)
    const categories = [{ id: "all" as const, label: "전체 글" }, ...POST_CATEGORIES]
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
                        <h2>카테고리</h2>
                    </div>
                    <p className={styles.sidebarNote}>관심 있는 주제부터 읽어보세요.</p>
                    <nav aria-label="포스팅 카테고리" className={styles.categoryList}>
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
                    <h1>{searchPage ? "포스팅 검색" : "포스팅"}</h1>
                    <p>{searchPage ? "제목, 본문, 태그에서 원하는 글을 찾아보세요." : selected?.description ?? "개발과 제품을 만들며 배운 내용을 기록합니다."}</p>
                    {!searching && posts.items.some((post) => post.source === "legacy") && (
                        <p className={styles.orderNote}>새 발행 글을 먼저 보여 드리고, 이전 글 보관함을 이어서 표시합니다.</p>
                    )}
                </header>
                <PostSearchForm query={query} category={posts.category} />
                {searching && (
                    <div className={styles.searchSummary}>
                        <p role="status">“{query}”{selected ? ` · ${selected.label}` : ""}</p>
                        <Link href={postSearchHref("", 1, posts.category)}>검색 지우기</Link>
                    </div>
                )}
                <div className={styles.listHeading}>
                    <h2>{searching ? "검색 결과" : selected?.label ?? "전체 글"}<span>{posts.totalItems}</span></h2>
                    <span>{searching ? "관련도순 · 같은 관련도는 최신순" : "기록을 하나씩, 꾸준히."}</span>
                </div>

                {posts.legacyTruncated && (
                    <aside className={styles.notice} role="status">
                        기존 글이 많아 최근 글 일부만 표시합니다.
                    </aside>
                )}

                {posts.items.length === 0 ? (
                    <section className={styles.empty}>
                        <h2>{searching ? "검색 결과가 없습니다" : posts.legacyUnavailable ? "글을 불러올 수 없습니다" : selected ? "아직 이 주제의 글이 없습니다" : "공개된 글이 없습니다"}</h2>
                        <p>
                            {searching ? "검색어를 줄이거나 다른 단어로 검색해 보세요." : posts.legacyUnavailable
                                ? "잠시 후 이 페이지를 다시 열어 주세요."
                                : selected ? "다른 카테고리에서 기록을 살펴보세요." : "초안은 준비가 끝난 뒤 이곳에 공개됩니다."}
                        </p>
                        {searching && selected && <Link href={postSearchHref(query)}>모든 카테고리에서 검색 →</Link>}
                        {(selected || searchPage) && <Link href="/post">전체 글 보기 →</Link>}
                    </section>
                ) : (
                    <PostViewCountsProvider paths={posts.items.map((post) => post.href)}>
                        <section aria-label="글 목록" className={styles.list}>
                            {posts.items.map((post) => (
                                <article key={`${post.source}-${post.id}`} className={styles.item}>
                                    <Link href={post.href} className={styles.itemLink}>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemCategory}>{postCategoryLabel(post.category)}</span>
                                            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                                            <PostViewCount postPath={post.href} />
                                        </div>
                                        <h2>{post.title}</h2>
                                        <p>{post.description}</p>
                                        {post.tags.length > 0 && (
                                            <ul className={styles.tags} aria-label="태그">
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
                    <nav className={styles.pagination} aria-label="글 목록 페이지">
                        {posts.page > 1 ? <Link href={listHref(posts.page - 1)} prefetch={searchPage ? false : undefined}>이전</Link> : <span>이전</span>}
                        <span aria-live="polite">
                            {posts.page} / {posts.totalPages}
                        </span>
                        {posts.page < posts.totalPages ? (
                            <Link href={listHref(posts.page + 1)} prefetch={searchPage ? false : undefined}>다음</Link>
                        ) : (
                            <span>다음</span>
                        )}
                    </nav>
                )}
                </div>
            </div>
        </Wrapper>
    )
}
