"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { analyticsDay, type AnalyticsResponse, type AnalyticsSnapshot } from "@lib/analytics/types"

const AnalyticsContext = createContext<AnalyticsSnapshot | null>(null)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null)
    useEffect(() => {
        let disposed = false
        let inFlight = false
        let controller: AbortController | null = null
        const refresh = async () => {
            if (inFlight || document.visibilityState === "hidden") return
            inFlight = true
            controller = new AbortController()
            const timeout = window.setTimeout(() => controller?.abort(), 12_000)
            try {
                const response = await fetch("/api/analytics", { signal: controller.signal, cache: "no-store" })
                const result: AnalyticsResponse = response.ok ? await response.json() : { available: false }
                if (!disposed) setSnapshot(result.available ? result : null)
            } catch {
                if (!disposed) setSnapshot(null)
            } finally {
                window.clearTimeout(timeout)
                inFlight = false
            }
        }
        void refresh()
        const timer = window.setInterval(() => void refresh(), 15 * 60_000)
        let midnightTimer: number
        const scheduleMidnight = () => {
            const today = analyticsDay(new Date(), "Asia/Seoul")
            const nextMidnight = Date.parse(`${today}T00:00:00+09:00`) + 24 * 60 * 60_000
            midnightTimer = window.setTimeout(() => {
                setSnapshot(null)
                void refresh()
                scheduleMidnight()
            }, Math.max(1_000, nextMidnight - Date.now() + 100))
        }
        scheduleMidnight()
        const onVisible = () => { if (document.visibilityState === "visible") void refresh() }
        document.addEventListener("visibilitychange", onVisible)
        return () => {
            disposed = true
            controller?.abort()
            window.clearInterval(timer)
            window.clearTimeout(midnightTimer)
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [])
    return <AnalyticsContext.Provider value={snapshot}>{children}</AnalyticsContext.Provider>
}

export default function AnalyticsCounter({ postPath }: { postPath?: string }) {
    const snapshot = useContext(AnalyticsContext)
    if (!snapshot) return null
    if (!postPath && snapshot.date !== analyticsDay(new Date(), snapshot.timeZone)) return null
    const count = postPath ? snapshot.postViews[postPath] : snapshot.todayVisitors
    if (!Number.isSafeInteger(count) || count < 0) return null
    const title = postPath ? "Google Analytics 기준 누적 조회 수 · 반복 열람 포함 · 집계 반영에 지연이 있습니다." : "Google Analytics 기준 오늘 방문자 수 · 한국 시간 기준 · 집계 반영에 지연이 있습니다."
    return <span title={title}>{postPath ? `조회 ${count.toLocaleString("ko-KR")}` : `오늘 방문자 ${count.toLocaleString("ko-KR")}명`}</span>
}
