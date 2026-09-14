"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import type { Locale } from "@lib/i18n/config"
import type { CommunityAction, CommunityOptions, CommunityState, SocialProvider } from "@lib/community/types"

async function communityRequest(url: string, body?: Record<string, unknown>): Promise<CommunityState> {
    try {
        const response = await fetch(url, {
            method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store",
            ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
            signal: AbortSignal.timeout(15_000),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "unavailable")
        return data
    } catch (error) {
        if (error instanceof Error && error.name === "Error") throw error
        throw new Error("unavailable")
    }
}
interface CommunityContextValue {
    postId: string; locale: Locale; options: CommunityOptions; state: CommunityState | null
    loading: boolean; busy: boolean; error: string; reload: (more?: boolean) => Promise<void>
    mutate: (action: CommunityAction, payload: Record<string, unknown>) => Promise<void>
    signIn: (provider: SocialProvider) => Promise<void>; signOut: () => Promise<void>
}
const CommunityContext = createContext<CommunityContextValue | null>(null)
export function useCommunity() {
    const value = useContext(CommunityContext)
    if (!value) throw new Error("PostCommunityProvider is missing")
    return value
}
export default function PostCommunityProvider({ children, postId, locale, options }: { children: ReactNode; postId: string; locale: Locale; options: CommunityOptions }) {
    const [state, setState] = useState<CommunityState | null>(null)
    const [loading, setLoading] = useState(options.enabled)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")
    const current = useRef(state), writing = useRef(false), generation = useRef(0)
    const endpoint = `/api/community/${encodeURIComponent(postId)}`
    const apply = useCallback((next: CommunityState) => { current.current = next; setState(next) }, [])
    const reload = useCallback(async (more = false) => {
        if (!options.enabled || writing.current) return
        const requestGeneration = ++generation.current
        setLoading(true)
        const previous = current.current
        try {
            const next = await communityRequest(endpoint + (more ? `?offset=${previous?.comments.length ?? 0}` : ""))
            if (generation.current !== requestGeneration) return
            if (more && previous) next.comments = [...previous.comments, ...next.comments.filter(comment => !previous.comments.some(existing => existing.id === comment.id))]
            apply(next)
            setError("")
        } catch (failure) {
            if (generation.current === requestGeneration) setError(failure instanceof Error ? failure.message : "unavailable")
        } finally { if (generation.current === requestGeneration) setLoading(false) }
    }, [options.enabled, endpoint, apply])
    useEffect(() => {
        void reload()
        const onVisible = () => { if (document.visibilityState === "visible") void reload() }
        document.addEventListener("visibilitychange", onVisible)
        const requests = generation
        return () => { requests.current++; document.removeEventListener("visibilitychange", onVisible) }
    }, [reload])
    const mutate = async (action: CommunityAction, payload: Record<string, unknown>) => {
        if (writing.current) throw new Error("rate_limited")
        writing.current = true; setBusy(true); generation.current++; setLoading(false)
        const previous = current.current
        if (action === "like" && previous) apply({ ...previous, liked: Boolean(payload.liked), likes: Math.max(0, previous.likes + Number(Boolean(payload.liked)) - Number(previous.liked)) })
        try {
            const next = await communityRequest(endpoint, { action, ...payload })
            apply(action === "like" && previous ? { ...previous, likes: next.likes, liked: next.liked, user: next.user } : next)
            setError("")
        } catch (failure) {
            if (previous) apply(previous)
            if (failure instanceof Error && failure.message === "unauthorized" && previous) apply({ ...previous, user: null })
            throw failure
        } finally { writing.current = false; setBusy(false) }
    }
    const signIn = async (provider: SocialProvider) => {
        const response = await fetch("/api/community/auth", {
            method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider, next: location.pathname + location.search }), signal: AbortSignal.timeout(15_000),
        })
        const data = await response.json()
        if (!response.ok || !data.url) throw new Error(data.error ?? "auth_failed")
        location.assign(data.url)
    }
    const signOut = async () => {
        const response = await fetch("/api/community/auth", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }), signal: AbortSignal.timeout(15_000) })
        if (!response.ok) throw new Error("unavailable")
        await reload()
    }
    return <CommunityContext.Provider value={{ postId, locale, options, state, loading, busy, error, reload, mutate, signIn, signOut }}>{children}</CommunityContext.Provider>
}
