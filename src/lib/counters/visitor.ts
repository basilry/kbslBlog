import { counterDay } from "./types"

const KEY = "kbsl-blog:daily-visitor:v2"
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let memory: { day: string; id: string } | null = null

/** Stored IDs rotate daily; no IP, fingerprint, or lasting user profile. */
export function readDailyVisitor(storage: Pick<Storage, "getItem" | "setItem">, day: string, createId: () => string): string {
    const raw = storage.getItem(KEY)
    if (raw) {
        try {
            const value = JSON.parse(raw) as { day?: unknown; id?: unknown }
            if (value.day === day && typeof value.id === "string" && UUID.test(value.id)) return value.id
        } catch { /* Replace a damaged entry. */ }
    }
    const id = createId()
    storage.setItem(KEY, JSON.stringify({ day, id }))
    return id
}

export async function dailyVisitorId(): Promise<string> {
    const read = () => {
        const day = counterDay(new Date(), "Asia/Seoul")
        try {
            const id = readDailyVisitor(window.localStorage, day, () => window.crypto.randomUUID())
            memory = { day, id }
            return id
        } catch {
            // Storage-disabled browsers can dedupe within this page's lifetime only.
            if (memory?.day !== day) memory = { day, id: window.crypto.randomUUID() }
            return memory.id
        }
    }
    // Serialize initial creation across tabs sharing this origin.
    if (navigator.locks) {
        try { return await navigator.locks.request(KEY, read) } catch { return read() }
    }
    return read()
}
