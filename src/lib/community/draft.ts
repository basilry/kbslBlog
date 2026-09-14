"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

export interface CommentDraft { body: string; name: string | null; parent: { id: string; name: string } | null; id: string | null }
const empty: CommentDraft = { body: "", name: null, parent: null, id: null }
const memory = new Map<string, string>()
const eventName = "basilry-community-draft"
const draftKey = (postId: string) => `basilry:comment-draft:v1:${postId}`
export function parseCommentDraft(raw: string): CommentDraft {
    try {
        const value = JSON.parse(raw)
        if (!value || typeof value.body !== "string") return empty
        return {
            body: value.body.slice(0, 2000), name: typeof value.name === "string" ? value.name.slice(0, 30) : null,
            parent: value.parent && typeof value.parent.id === "string" && typeof value.parent.name === "string" ? { id: value.parent.id, name: value.parent.name.slice(0, 30) } : null,
            id: typeof value.id === "string" ? value.id : null,
        }
    } catch { return empty }
}
export function saveCommentDraft(postId: string, draft: CommentDraft): boolean {
    const key = draftKey(postId), value = JSON.stringify(draft)
    memory.set(key, value)
    let saved = true
    try { sessionStorage.setItem(key, value) } catch { saved = false }
    window.dispatchEvent(new Event(eventName))
    return saved
}
export function useCommentDraft(postId: string) {
    const key = draftKey(postId)
    const subscribe = useCallback((notify: () => void) => {
        const onStorage = (event: StorageEvent) => { if (event.key === key) { memory.delete(key); notify() } }
        window.addEventListener(eventName, notify)
        window.addEventListener("storage", onStorage)
        return () => { window.removeEventListener(eventName, notify); window.removeEventListener("storage", onStorage) }
    }, [key])
    const snapshot = useCallback(() => {
        if (memory.has(key)) return memory.get(key)!
        try { return sessionStorage.getItem(key) ?? "" } catch { return "" }
    }, [key])
    const raw = useSyncExternalStore(subscribe, snapshot, () => "")
    return [useMemo(() => parseCommentDraft(raw), [raw]), (draft: CommentDraft) => saveCommentDraft(postId, draft)] as const
}
