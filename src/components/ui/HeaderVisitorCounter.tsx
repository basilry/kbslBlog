"use client"

import { useLocale } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"
import { languageTag } from "@lib/i18n/config"
import classNames from "classnames"
import { useVisitorCounterState } from "@components/ui/VisitorCounter"
import { counterDay } from "@lib/counters/types"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/headerVisitorCounter.module.scss"

export default function HeaderVisitorCounter() {
    const locale = useLocale()
    const m = messages(locale)
    const compactNumber = new Intl.NumberFormat(languageTag(locale), { notation: "compact", maximumFractionDigits: 1 })
    const displayNumber = (value: number) => value < 10_000 ? value.toLocaleString(languageTag(locale)) : compactNumber.format(value)
    const state = useVisitorCounterState()
    const darkMode = useCoreStore((store) => store.darkMode)
    const snapshot = state.status === "ready" ? state.snapshot : null
    const valid = snapshot !== null
        && snapshot.date === counterDay(new Date(), snapshot.timeZone)
        && Number.isSafeInteger(snapshot.todayViews) && snapshot.todayViews >= 0
        && Number.isSafeInteger(snapshot.totalViews) && snapshot.totalViews >= 0
    const today = valid ? snapshot.todayViews : null
    const total = valid ? snapshot.totalViews : null
    const loading = state.status === "loading"
    const koreanDescription = today !== null && total !== null
        ? `오늘 방문 ${today.toLocaleString("ko-KR")}명, 누적 방문 ${total.toLocaleString("ko-KR")}명. 같은 브라우저는 한국 시간 기준 하루 1회 집계하며 누적값에는 집계 기준 변경 전 기록이 포함됩니다.`
        : loading ? "방문자 수를 불러오는 중입니다" : "방문자 수를 잠시 불러올 수 없습니다"

    const description = locale === "ko" ? koreanDescription : today !== null && total !== null
        ? `Today: ${today.toLocaleString("en-US")}; total: ${total.toLocaleString("en-US")}. Each browser is counted once per day in Korea time. Totals include records from the earlier counting method.`
        : loading ? "Loading visitor counts" : "Visitor counts are temporarily unavailable"

    return (
        <div className={classNames(styles.counter, darkMode && styles.dark)}
            role="status" aria-label={description} aria-busy={loading} title={description}>
            <div className={styles.metric} aria-hidden="true">
                <span className={styles.label}>{m.today}</span>
                <span className={classNames(styles.value, styles.today)}>{today === null ? "—" : displayNumber(today)}</span>
            </div>
            <div className={styles.metric} aria-hidden="true">
                <span className={styles.label}>{m.total}</span>
                <span className={styles.value}>{total === null ? "—" : displayNumber(total)}</span>
            </div>
        </div>
    )
}
