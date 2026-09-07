import Link from "next/link"
import type { Metadata } from "next"
import projects from "@lib/json/mainProjects.json"
import { getRecentPublicPosts } from "@lib/content/posts"
import TrackedLink from "@components/ui/TrackedLink"
import styles from "@styles/pages/home.module.scss"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { alternates: { canonical: "/" } }
export default async function Home() {
    const posts = await getRecentPublicPosts(3)
    const featured = ["/projects/desk", "/projects/deskDefense", "/projects/haruWeather"]
        .map((href) => projects.find((project) => project.url === href))
        .filter((project) => project !== undefined)
    return <div className={styles.home}>
        <section className={styles.intro}>
            <p className={styles.eyebrow}>김바실리의 개발 기록</p>
            <h1>만들고, 운영하고,<br />배운 것을 기록합니다.</h1>
            <p className={styles.description}>웹 개발부터 AI까지. 직접 부딪힌 문제와 해결 과정, 그리고 만들고 있는 프로젝트를 소개합니다.</p>
            <div className={styles.links}><Link href="/post">개발 글 읽기 ↗</Link><Link href="/introduce">개발자 소개</Link></div>
        </section>
        <section aria-labelledby="recent-posts" className={styles.section}>
            <div className={styles.sectionHeading}><h2 id="recent-posts">최근 글</h2><Link href="/post">모든 글 보기 →</Link></div>
            {posts.items.length > 0 ? <div className={styles.posts}>{posts.items.map((post) => <article key={post.href} className={styles.post}>
                <time dateTime={post.publishedAt}>{post.publishedAt.slice(0, 10)}</time>
                <h3><Link href={post.href}>{post.title}</Link></h3><p>{post.description}</p>
            </article>)}</div> : <p className={styles.empty}>{posts.legacyUnavailable ? "지금은 글 목록을 불러오지 못했습니다. 잠시 후 글 목록에서 다시 확인해 주세요." : "아직 공개된 글이 없습니다. 진행 중인 프로젝트를 먼저 둘러보세요."}</p>}
        </section>
        <section aria-labelledby="featured-projects" className={styles.section}>
            <div className={styles.sectionHeading}><h2 id="featured-projects">만들고 있는 것들</h2><Link href="/projects">모든 프로젝트 →</Link></div>
            <div className={styles.projects}>{featured.map((project) => <article key={project.id} className={styles.project}>
                <p className={styles.eyebrow}>PROJECT</p>
                <h3><TrackedLink href={project.url} eventName="project_open" label={project.url}>{project.title}</TrackedLink></h3>
                <p>{project.description}</p>
                <TrackedLink className={styles.projectLink} href={project.url} eventName="project_open" label={project.url}>프로젝트 살펴보기 →</TrackedLink>
            </article>)}</div>
        </section>
        <div className={styles.archive}><p>지난 발표와 학습 자료도 모아두었습니다.</p><Link href="/research">연구·학습 기록 →</Link><Link href="/feed.xml">RSS 구독 →</Link></div>
    </div>
}
