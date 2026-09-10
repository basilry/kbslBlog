import Link from "next/link"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import VisitorCounter from "@components/ui/VisitorCounter"
import Giscus from "@components/ui/Giscus"
import PostTableOfContents from "@components/ui/PostTableOfContents"
import { buildPostOutline } from "@lib/content/outline"
import { postCategoryLabel, postListHref } from "@lib/content/categories"
import type { PublicPost } from "@lib/content"
import { blogPosting, serializeJsonLd } from "@lib/seo"
import PostReaderShell from "./PostReaderShell"
import styles from "@styles/pages/postDetail.module.scss"

interface PostDetailProps {
    post: PublicPost
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

export default function PostDetail({ post }: PostDetailProps): ReactElement {
    const outline = buildPostOutline(post.html)
    return (
        <PostReaderShell legacyPost={post.legacyEditorPost}>
            <Wrapper>
                <div className={styles.page}>
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
                    </article>
                    <section className={styles.comments} aria-label="댓글">
                        <Giscus emotion={false} />
                    </section>
                </div>
            </Wrapper>
        </PostReaderShell>
    )
}
