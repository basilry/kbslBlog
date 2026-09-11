"use client"

import { useLocale } from "@lib/i18n/context"
import PageLoadingProgress from "@components/ui/PageLoadingProgress"
import styles from "@styles/ui/pageLoading.module.scss"

export default function RootLoading() {
    const en = useLocale() === "en"
    return <section className={styles.loadingScreen} role="status" aria-live="polite" aria-busy="true">
        <PageLoadingProgress />
        <span className={styles.spinner} aria-hidden="true" />
        <p>{en ? "Loading page…" : "페이지를 불러오는 중입니다."}</p>
    </section>
}
