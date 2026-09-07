"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { counterDay, type CounterResponse, type CounterSnapshot } from "@lib/counters/types"

const CounterContext = createContext<CounterSnapshot | null>(null)
const VISITOR_KEY = "kbsl-blog:visitor-id:v1"
const DEFAULT_COUNTER_URL = "https://kbsl-blog-counter.basbot.workers.dev/count"
const VISITOR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const POST_PATH = /^\/post\/[a-z0-9]+(?:-[a-z0-9]+)*$/

function visitorId(): string {
    try {
        const saved = window.localStorage.getItem(VISITOR_KEY)
        if (saved && VISITOR_ID.test(saved)) return saved
        const created = window.crypto.randomUUID()
        window.localStorage.setItem(VISITOR_KEY, created)
        return created
    } catch {
        return window.crypto.randomUUID()
    }
}

export function VisitorCounterProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const identity = useRef<string | null>(null)
    const [snapshot, setSnapshot] = useState<CounterSnapshot | null>(null)

    useEffect(() => {
        let disposed = false
        let inFlight = false
        let controller: AbortController | null = null
        const endpoint = process.env.NEXT_PUBLIC_COUNTER_API_URL || DEFAULT_COUNTER_URL
        const postPath = POST_PATH.test(pathname) ? pathname : null
        identity.current ||= visitorId()

        const refresh = async () => {
            if (inFlight || document.visibilityState === "hidden") return
            inFlight = true
            controller = new AbortController()
            const timeout = window.setTimeout(() => controller?.abort(), 12_000)
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ visitorId: identity.current, path: postPath }),
                    signal: controller.signal,
                    cache: "no-store",
                })
                const result: CounterResponse = response.ok ? await response.json() : { available: false }
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
            const today = counterDay(new Date(), "Asia/Seoul")
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
    }, [pathname])

    return <CounterContext.Provider value={snapshot}>{children}</CounterContext.Provider>
}

export default function VisitorCounter({ postPath }: { postPath?: string }) {
    const snapshot = useContext(CounterContext)
    if (!snapshot) return null
    if (!postPath && snapshot.date !== counterDay(new Date(), snapshot.timeZone)) return null
    if (postPath) {
        const count = snapshot.postViews[postPath]
        if (!Number.isSafeInteger(count) || count < 0) return null
        return <span title="Cloudflare 기준 누적 조회 수 · 브라우저별 하루 한 번 집계">조회 {count.toLocaleString("ko-KR")}</span>
    }
    if (!Number.isSafeInteger(snapshot.todayVisitors) || !Number.isSafeInteger(snapshot.totalVisitors) || snapshot.todayVisitors < 0 || snapshot.totalVisitors < 0) return null
    return <span title="Cloudflare 기준 오늘 및 전체 누적 방문자 수 · 브라우저 식별 기준">오늘 방문자 {snapshot.todayVisitors.toLocaleString("ko-KR")}명 · 누적 {snapshot.totalVisitors.toLocaleString("ko-KR")}명</span>
}
