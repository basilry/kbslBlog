import Link from "next/link"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import Giscus from "@components/ui/Giscus"
import type { PublicPost } from "@lib/content"
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
    return (
        <PostReaderShell legacyPost={post.legacyEditorPost}>
            <Wrapper>
                <div className={styles.page}>
                    <article className={styles.article}>
                        <Link href="/post" className={styles.backLink}>
                            글 목록
                        </Link>
                        <header className={styles.header}>
                            <div className={styles.meta}>
                                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                                {post.source === "local" && <span>Markdown</span>}
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
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.html }} />
                    </article>
                    <section className={styles.comments} aria-label="댓글">
                        <Giscus emotion={false} />
                    </section>
                </div>
            </Wrapper>
        </PostReaderShell>
    )
}
