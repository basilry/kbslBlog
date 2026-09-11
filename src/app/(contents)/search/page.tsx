import type { Metadata } from "next"
import { Suspense } from "react"
import Wrapper from "@components/layout/Wrapper"
import { buildPostSearchIndex } from "@lib/content/search-index"
import { pageMetadata } from "@lib/seo"
import PostSearch from "./PostSearch"
import styles from "@styles/pages/postList.module.scss"

// All content is read at build time; URL search parameters are read only in the client component.
export const metadata: Metadata = {
    ...pageMetadata("/search", "포스팅 검색", "제목, 본문, 태그로 포스팅을 검색하세요."),
    robots: { index: false, follow: true },
}

export default async function SearchPage() {
    const index = await buildPostSearchIndex()
    return <Suspense fallback={<Wrapper><div className={styles.empty} role="status">검색을 준비하고 있습니다.</div></Wrapper>}>
        <PostSearch index={index} />
    </Suspense>
}
