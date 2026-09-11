"use client"

import { useLocale } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"
import { counterPostPath, languageTag } from "@lib/i18n/config"
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { counterDay, type CounterResponse, type CounterSnapshot } from "@lib/counters/types"
import { counterEndpoint } from "@lib/counters/endpoint"
import { dailyVisitorId } from "@lib/counters/visitor"

type CounterState =
    | { status: "loading"; snapshot: null }
    | { status: "ready"; snapshot: CounterSnapshot }
    | { status: "unavailable"; snapshot: null }

const LOADING: CounterState = { status: "loading", snapshot: null }
const CounterContext = createContext<CounterState>(LOADING)

export function useVisitorCounterState() {
    return useContext(CounterContext)
}

export function VisitorCounterProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const activeView = useRef<{ pathname: string; eventId: string } | null>(null)
    const postPath = counterPostPath(pathname)
    const [result, setResult] = useState<{ path: string | null; state: CounterState } | null>(null)

    useEffect(() => {
        let disposed = false
        let inFlight = false
        let controller: AbortController | null = null
        // This ID belongs only to this opening. Retain it through Strict Mode's
        // effect replay, but generate a new one for every navigation/reload.
        if (activeView.current?.pathname !== pathname) {
            activeView.current = { pathname, eventId: window.crypto.randomUUID() }
        }
        const view = activeView.current
        let recordPending = true

        const refresh = async () => {
            if (inFlight || document.visibilityState === "hidden") return
            inFlight = true
            const recordView = recordPending
            const requestController = new AbortController()
            controller = requestController
            const timeout = window.setTimeout(() => requestController.abort(), 12_000)
            try {
                const visitorId = recordView ? await dailyVisitorId() : undefined
                if (disposed) return
                const response = await fetch(counterEndpoint(recordView ? "visit" : "stats"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: postPath, ...(recordView ? { eventId: view.eventId, visitorId } : {}) }),
                    signal: requestController.signal,
                    cache: "no-store",
                })
                const result: CounterResponse = response.ok ? await response.json() : { available: false }
                if (recordView && result.available) recordPending = false
                if (!disposed) setResult({
                    path: pathname,
                    state: result.available ? { status: "ready", snapshot: result } : { status: "unavailable", snapshot: null },
                })
            } catch {
                if (!disposed) setResult({ path: pathname, state: { status: "unavailable", snapshot: null } })
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
                setResult({ path: pathname, state: LOADING })
                void refresh()
                scheduleMidnight()
            }, Math.max(1_000, nextMidnight - Date.now() + 100))
        }
        scheduleMidnight()
        const onVisible = () => { if (document.visibilityState === "visible") void refresh() }
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                view.eventId = window.crypto.randomUUID()
                recordPending = true
                void refresh()
            }
        }
        document.addEventListener("visibilitychange", onVisible)
        window.addEventListener("pageshow", onPageShow)
        return () => {
            disposed = true
            controller?.abort()
            window.clearInterval(timer)
            window.clearTimeout(midnightTimer)
            document.removeEventListener("visibilitychange", onVisible)
            window.removeEventListener("pageshow", onPageShow)
        }
    }, [pathname, postPath])

    const state = result?.path === pathname ? result.state : LOADING
    return <CounterContext.Provider value={state}>{children}</CounterContext.Provider>
}

export default function VisitorCounter({ postPath }: { postPath?: string }) {
    const locale = useLocale()
    const m = messages(locale)
    const state = useContext(CounterContext)
    if (postPath && state.status !== "ready") {
        const loading = state.status === "loading"
        return (
            <span aria-live="polite" aria-busy={loading} title={loading ? m.loadingViews : m.unavailableViews}>
                {m.views} {loading ? m.checking : "—"}
            </span>
        )
    }
    if (state.status !== "ready") return null
    const snapshot = state.snapshot
    if (!postPath && snapshot.date !== counterDay(new Date(), snapshot.timeZone)) return null
    if (postPath) {
        const count = snapshot.postViews[counterPostPath(postPath) ?? ""]
        if (!Number.isSafeInteger(count) || count < 0) return <span title={m.unavailableViews}>{m.views} —</span>
        return <span aria-live="polite" title={m.cumulativeViews}>{m.views} {count.toLocaleString(languageTag(locale))}</span>
    }
    if (!Number.isSafeInteger(snapshot.todayViews) || !Number.isSafeInteger(snapshot.totalViews) || snapshot.todayViews < 0 || snapshot.totalViews < 0) return null
    return <span title={locale === "en" ? "Each browser is counted once per day in Korea time. Totals include records from the earlier counting method." : "같은 브라우저는 한국 시간 기준 하루 1회 · 누적값에는 집계 기준 변경 전 기록 포함"}>{m.today} {snapshot.todayViews.toLocaleString(languageTag(locale))} · {m.total} {snapshot.totalViews.toLocaleString(languageTag(locale))}</span>
}
