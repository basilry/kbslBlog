const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const POST_PATH = /^\/post\/[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface CountPayload {
    visitorId: string
    path: string | null
}

export function counterDay(date: Date): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date)
}

export function parsePayload(value: unknown): CountPayload | null {
    if (!value || typeof value !== "object") return null
    const body = value as { visitorId?: unknown; path?: unknown }
    if (typeof body.visitorId !== "string" || !UUID.test(body.visitorId)) return null
    if (body.path !== null && (typeof body.path !== "string" || body.path.length > 160 || !POST_PATH.test(body.path))) return null
    return { visitorId: body.visitorId, path: body.path }
}
