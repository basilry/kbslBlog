import Link from "next/link"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import VisitorCounter from "@components/ui/VisitorCounter"
import Giscus from "@components/ui/Giscus"
import PostTableOfContents from "@components/ui/PostTableOfContents"
import { buildPostOutline } from "@lib/content/outline"
import { postCategoryLabel, postListHref } from "@lib/content/categories"
import type { PublicPost } from "@lib/content"
import type { AdjacentPosts } from "@lib/content/adjacent-posts"
import { blogPosting, serializeJsonLd } from "@lib/seo"
import PostReaderShell from "./PostReaderShell"
import styles from "@styles/pages/postDetail.module.scss"

interface PostDetailProps {
    post: PublicPost
    adjacent?: AdjacentPosts
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

export default function PostDetail({ post, adjacent }: PostDetailProps): ReactElement {
    const outline = buildPostOutline(post.html)
    return (
        <PostReaderShell legacyPost={post.legacyEditorPost}>
            <Wrapper>
                <div className={styles.page} data-post-page="detail">
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPosting(post)) }} />
                    <article className={`${styles.article} ${outline.headings.length ? styles.withOutline : ""}`}>
                        <Link href="/post" className={styles.backLink}>
                            글 목록
                        </Link>
                        <header className={styles.header}>
                            <div className={styles.meta}>
                                <Link className={styles.category} href={postListHref(1, post.category ?? "other")}>{postCategoryLabel(post.category)}</Link>
                                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                                <Link href="/introduce" rel="author">김바실리</Link>
                                <VisitorCounter postPath={post.href} />
                            </div>
                            <h1>{post.title}</h1>
                            <p>{post.description}</p>
                            {post.tags.length > 0 && (
                                <ul className={styles.tags} aria-label="태그">
                                    {post.tags.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            )}
                        </header>
                        <PostTableOfContents key={post.id} headings={outline.headings} />
                        <div id="post-content" className={styles.content} dangerouslySetInnerHTML={{ __html: outline.html }} />
                        {adjacent && <nav className={styles.adjacentNavigation} aria-label="이전 글과 다음 글">
                            <div className={styles.adjacentHeading}><h2>다른 글 읽기</h2><Link href="/post">전체 글 보기</Link></div>
                            <div className={styles.adjacentCards}>
                                {adjacent.previous ? <Link href={adjacent.previous.href} rel="prev" className={styles.adjacentCard}>
                                    <span>← 이전 글</span>
                                    <strong>{adjacent.previous.title}</strong>
                                    <time dateTime={adjacent.previous.publishedAt}>{formatDate(adjacent.previous.publishedAt)}</time>
                                </Link> : <div className={styles.adjacentEmpty}><span>← 이전 글</span><p>첫 번째 글입니다.</p></div>}
                                {adjacent.next ? <Link href={adjacent.next.href} rel="next" className={`${styles.adjacentCard} ${styles.nextCard}`}>
                                    <span>다음 글 →</span>
                                    <strong>{adjacent.next.title}</strong>
                                    <time dateTime={adjacent.next.publishedAt}>{formatDate(adjacent.next.publishedAt)}</time>
                                </Link> : <div className={`${styles.adjacentEmpty} ${styles.nextCard}`}><span>다음 글 →</span><p>가장 최근 글입니다.</p></div>}
                            </div>
                        </nav>}
                    </article>
                    <section className={styles.comments} aria-label="댓글">
                        <Giscus emotion={false} />
                    </section>
                </div>
            </Wrapper>
        </PostReaderShell>
    )
}
