import PageLoadingProgress from "@components/ui/PageLoadingProgress"
import styles from "@styles/ui/pageLoading.module.scss"

export default function RootLoading() {
    return <section className={styles.loadingScreen} role="status" aria-live="polite" aria-busy="true">
        <PageLoadingProgress />
        <span className={styles.spinner} aria-hidden="true" />
        <p>페이지를 불러오는 중입니다.</p>
    </section>
}
