const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const POST_PATH = /^\/post\/[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface CountPayload {
    eventId: string
    visitorId?: string
    path: string | null
}

const MAX_VIEW_PATHS = 20

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
    const body = value as { eventId?: unknown; visitorId?: unknown; path?: unknown }
    if (typeof body.eventId !== "string" || !UUID.test(body.eventId)) return null
    if (body.visitorId !== undefined && (typeof body.visitorId !== "string" || !UUID.test(body.visitorId))) return null
    const stats = parseStatsPayload(body)
    return stats ? { eventId: body.eventId.toLowerCase(), path: stats.path,
        ...(typeof body.visitorId === "string" ? { visitorId: body.visitorId.toLowerCase() } : {}),
    } : null
}

export function parseStatsPayload(value: unknown): { path: string | null } | null {
    if (!value || typeof value !== "object") return null
    const body = value as { path?: unknown }
    if (body.path !== null && (typeof body.path !== "string" || body.path.length > 160 || !POST_PATH.test(body.path))) return null
    if (body.path === "/post/register") return null
    return { path: body.path }
}

export function parseViewPaths(value: unknown): string[] | null {
    if (!value || typeof value !== "object") return null
    const paths = (value as { paths?: unknown }).paths
    if (!Array.isArray(paths) || paths.length === 0 || paths.length > MAX_VIEW_PATHS) return null
    if (paths.some((path) => typeof path !== "string" || path.length > 160 || !POST_PATH.test(path))) return null
    return [...new Set(paths)]
}
