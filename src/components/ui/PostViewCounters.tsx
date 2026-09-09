"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { PostViewsResponse } from "@lib/counters/types"
import { counterEndpoint } from "@lib/counters/endpoint"

type ViewState =
    | { status: "loading"; postViews: null }
    | { status: "ready"; postViews: Record<string, number> }
    | { status: "unavailable"; postViews: null }

const LOADING: ViewState = { status: "loading", postViews: null }
const ViewContext = createContext<ViewState>(LOADING)

export function PostViewCountsProvider({ paths, children }: { paths: string[]; children: ReactNode }) {
    const pathKey = paths.join("\n")
    const [result, setResult] = useState<{ pathKey: string; state: ViewState } | null>(null)

    useEffect(() => {
        let disposed = false
        let controller: AbortController | null = null
        const requestPaths = pathKey.split("\n")

        const refresh = async () => {
            controller?.abort()
            controller = new AbortController()
            const timeout = window.setTimeout(() => controller?.abort(), 12_000)
            try {
                const response = await fetch(counterEndpoint("views"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paths: requestPaths }),
                    signal: controller.signal,
                    cache: "no-store",
                })
                const payload: PostViewsResponse = response.ok ? await response.json() : { available: false }
                if (!disposed) setResult({
                    pathKey,
                    state: payload.available
                        ? { status: "ready", postViews: payload.postViews }
                        : { status: "unavailable", postViews: null },
                })
            } catch {
                if (!disposed) setResult({ pathKey, state: { status: "unavailable", postViews: null } })
            } finally {
                window.clearTimeout(timeout)
            }
        }

        void refresh()
        const timer = window.setInterval(() => void refresh(), 15 * 60_000)
        const onVisible = () => { if (document.visibilityState === "visible") void refresh() }
        document.addEventListener("visibilitychange", onVisible)
        return () => {
            disposed = true
            controller?.abort()
            window.clearInterval(timer)
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [pathKey])

    const state = result?.pathKey === pathKey ? result.state : LOADING
    return <ViewContext.Provider value={state}>{children}</ViewContext.Provider>
}

export function PostViewCount({ postPath }: { postPath: string }) {
    const state = useContext(ViewContext)
    if (state.status !== "ready") {
        const loading = state.status === "loading"
        return (
            <span aria-busy={loading} title={loading ? "조회수를 불러오는 중입니다" : "조회수를 잠시 불러올 수 없습니다"}>
                조회수 {loading ? "확인 중…" : "—"}
            </span>
        )
    }
    const count = state.postViews[postPath]
    if (!Number.isSafeInteger(count) || count < 0) return <span title="조회수를 잠시 불러올 수 없습니다">조회수 —</span>
    return <span title="누적 열람 횟수 · 재방문과 새로고침 포함">조회수 {count.toLocaleString("ko-KR")}</span>
}
