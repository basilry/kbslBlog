import { messages } from "@lib/i18n/messages"
import { formatPostDate } from "@lib/i18n/config"
import Link from "@components/ui/LocaleLink"
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

export default function PostDetail({ post, adjacent }: PostDetailProps): ReactElement {
    const locale = post.locale ?? "ko"
    const m = messages(locale)
    const formatDate = (value: string) => formatPostDate(value, locale)
    const outline = buildPostOutline(post.html)
    return (
        <PostReaderShell legacyPost={post.legacyEditorPost}>
            <Wrapper>
                <div className={styles.page} data-post-page="detail">
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPosting(post)) }} />
                    <article className={`${styles.article} ${outline.headings.length ? styles.withOutline : ""}`}>
                        <Link href="/post" className={styles.backLink}>
                            {m.postList}
                        </Link>
                        <header className={styles.header}>
                            <div className={styles.meta}>
                                <Link className={styles.category} href={postListHref(1, post.category ?? "other")}>{postCategoryLabel(post.category, locale)}</Link>
                                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                                <Link href="/introduce" rel="author">{m.author}</Link>
                                <VisitorCounter postPath={post.href} />
                            </div>
                            <h1>{post.title}</h1>
                            <p>{post.description}</p>
                            {post.tags.length > 0 && (
                                <ul className={styles.tags} aria-label={m.tags}>
                                    {post.tags.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            )}
                        </header>
                        <PostTableOfContents key={post.id} headings={outline.headings} />
                        <div id="post-content" className={styles.content} dangerouslySetInnerHTML={{ __html: outline.html }} />
                        {adjacent && <nav className={styles.adjacentNavigation} aria-label={m.postNavigation}>
                            <div className={styles.adjacentHeading}><h2>{m.morePosts}</h2><Link href="/post">{m.viewAll}</Link></div>
                            <div className={styles.adjacentCards}>
                                {adjacent.previous ? <Link href={adjacent.previous.href} rel="prev" className={styles.adjacentCard}>
                                    <span>← {m.previousPost}</span>
                                    <strong>{adjacent.previous.title}</strong>
                                    <time dateTime={adjacent.previous.publishedAt}>{formatDate(adjacent.previous.publishedAt)}</time>
                                </Link> : <div className={styles.adjacentEmpty}><span>← {m.previousPost}</span><p>{m.firstPost}</p></div>}
                                {adjacent.next ? <Link href={adjacent.next.href} rel="next" className={`${styles.adjacentCard} ${styles.nextCard}`}>
                                    <span>{m.nextPost} →</span>
                                    <strong>{adjacent.next.title}</strong>
                                    <time dateTime={adjacent.next.publishedAt}>{formatDate(adjacent.next.publishedAt)}</time>
                                </Link> : <div className={`${styles.adjacentEmpty} ${styles.nextCard}`}><span>{m.nextPost} →</span><p>{m.latestPost}</p></div>}
                            </div>
                        </nav>}
                    </article>
                    <section className={styles.comments} aria-label={m.comments}>
                        <Giscus emotion={false} />
                    </section>
                </div>
            </Wrapper>
        </PostReaderShell>
    )
}
