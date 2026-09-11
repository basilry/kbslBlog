import { normalizeSearchQuery } from "./search-query"

export const RECENT_SEARCHES_KEY = "basilry:recent-post-searches:v1"
export const MAX_RECENT_SEARCHES = 5
const EMPTY: readonly string[] = []
let snapshot: readonly string[] = EMPTY
let lastStoredValue: string | null | undefined
const listeners = new Set<() => void>()

function cleanQueries(value: unknown): string[] {
    if (!Array.isArray(value)) return []
    const result: string[] = []
    const seen = new Set<string>()
    for (const item of value) {
        const query = normalizeSearchQuery(item)
        const key = query.toLowerCase()
        if (!query || seen.has(key)) continue
        seen.add(key)
        result.push(query)
        if (result.length === MAX_RECENT_SEARCHES) break
    }
    return result
}

export function getRecentSearchesSnapshot(): readonly string[] {
    if (typeof window === "undefined") return EMPTY
    try {
        const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY)
        if (stored !== lastStoredValue) {
            lastStoredValue = stored
            try { snapshot = stored && stored.length <= 20_000 ? cleanQueries(JSON.parse(stored)) : EMPTY }
            catch { snapshot = EMPTY }
        }
    } catch {
        // When storage is blocked, recent searches still work for this page session.
    }
    return snapshot
}

export function getServerRecentSearchesSnapshot(): readonly string[] { return EMPTY }

function storageChanged(event: StorageEvent) {
    if (event.key !== RECENT_SEARCHES_KEY && event.key !== null) return
    lastStoredValue = undefined
    listeners.forEach((listener) => listener())
}

export function subscribeRecentSearches(listener: () => void) {
    listeners.add(listener)
    if (listeners.size === 1 && typeof window !== "undefined") window.addEventListener("storage", storageChanged)
    return () => {
        listeners.delete(listener)
        if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", storageChanged)
    }
}

function save(queries: readonly string[]) {
    if (typeof window === "undefined") return
    snapshot = cleanQueries(queries)
    try {
        const stored = snapshot.length ? JSON.stringify(snapshot) : null
        if (stored) window.localStorage.setItem(RECENT_SEARCHES_KEY, stored)
        else window.localStorage.removeItem(RECENT_SEARCHES_KEY)
        lastStoredValue = stored
    } catch {
        // Keep the in-memory snapshot even when persistence is unavailable.
    }
    listeners.forEach((listener) => listener())
}

export function addRecentSearch(value: unknown) {
    const query = normalizeSearchQuery(value)
    if (!query) return
    const current = getRecentSearchesSnapshot()
    save([query, ...current.filter((item) => item.toLowerCase() !== query.toLowerCase())])
}

export function removeRecentSearch(query: string) {
    save(getRecentSearchesSnapshot().filter((item) => item.toLowerCase() !== query.toLowerCase()))
}

export function clearRecentSearches() { save([]) }
