import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { messages } from "@lib/i18n/messages"
import type { Metadata } from "next"
import { Suspense } from "react"
import Wrapper from "@components/layout/Wrapper"
import { buildPostSearchIndex } from "@lib/content/search-index"
import { pageMetadata } from "@lib/seo"
import PostSearch from "./PostSearch"
import styles from "@styles/pages/postList.module.scss"

// All content is read at build time; URL search parameters are read only in the client component.
export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
    const locale = await pageLocale(params)
    const m = messages(locale)
    return { ...pageMetadata("/search", m.searchTitle, m.searchDescription, locale), robots: { index: false, follow: true } }
}

export default async function SearchPage({ params }: LocalePageProps) {
    const locale = await pageLocale(params)
    const m = messages(locale)
    const index = await buildPostSearchIndex(undefined, locale)
    return <Suspense fallback={<Wrapper><div className={styles.empty} role="status">{m.loadingSearch}</div></Wrapper>}>
        <PostSearch index={index} />
    </Suspense>
}
