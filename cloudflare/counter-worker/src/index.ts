import { counterDay, parsePayload, parseStatsPayload, parseViewPaths } from "./lib"

const ALLOWED_ORIGIN = "https://www.basilry.kim"
const SEO_HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" }
const BOT = /bot|crawler|spider|slurp|headless|lighthouse|pagespeed/i

function responseHeaders(origin?: string): HeadersInit {
    return {
        ...SEO_HEADERS,
        ...(origin === ALLOWED_ORIGIN ? {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
            "Vary": "Origin",
        } : {}),
    }
}

function json(body: unknown, status: number, origin?: string): Response {
    return Response.json(body, { status, headers: responseHeaders(origin) })
}

function resultCount(result: D1Result<Record<string, unknown>> | undefined, field: string): number {
    const value = result?.results?.[0]?.[field]
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid D1 aggregate")
    return value
}

async function count(request: Request, env: Env, origin: string, recordView: boolean, legacy: boolean): Promise<Response> {
    if (BOT.test(request.headers.get("User-Agent") || "")) return json({ available: false }, 200, origin)
    const length = Number(request.headers.get("Content-Length"))
    if (!Number.isInteger(length) || length < 2 || length > 512) return json({ available: false }, 400, origin)
    const body = await request.json<unknown>()
    const visitPayload = recordView ? parsePayload(body) : null
    const payload = recordView ? visitPayload : parseStatsPayload(body)
    if (!payload) return json({ available: false }, 400, origin)

    const now = new Date()
    const day = counterDay(now)
    const statements: D1PreparedStatement[] = []
    if (visitPayload) {
        if (visitPayload.visitorId) {
            statements.push(env.DB.prepare("INSERT OR IGNORE INTO daily_site_visitors (day, visitor_id) VALUES (?, ?)").bind(day, visitPayload.visitorId))
        }
        statements.push(env.DB.prepare("INSERT OR IGNORE INTO page_view_events (event_id, day, path, created_at) VALUES (?, ?, ?, ?)").bind(visitPayload.eventId, day, visitPayload.path, now.toISOString()))
    }
    statements.push(env.DB.prepare("SELECT COALESCE((SELECT views FROM daily_totals WHERE day = ?), 0) AS views").bind(day))
    statements.push(env.DB.prepare("SELECT views FROM site_totals WHERE id = 1"))
    statements.push(env.DB.prepare("SELECT COALESCE((SELECT views FROM post_totals WHERE path = ?), 0) AS views").bind(payload.path))

    const results = await env.DB.batch<Record<string, unknown>>(statements)
    if (results.some((result) => !result.success)) throw new Error("D1 counter transaction failed")
    const todayViews = resultCount(results.at(-3), "views")
    const totalViews = resultCount(results.at(-2), "views")
    const postViews: Record<string, number> = {}
    if (payload.path) postViews[payload.path] = resultCount(results.at(-1), "views")
    return json({
        available: true, date: day, timeZone: "Asia/Seoul", updatedAt: now.toISOString(),
        todayViews, totalViews, postViews,
        // Older open tabs still poll /count. Serve their expected fields without
        // recording another opening or treating polling as a page view.
        ...(legacy ? { todayVisitors: todayViews, totalVisitors: totalViews } : {}),
    }, 200, origin)
}

async function views(request: Request, env: Env, origin: string): Promise<Response> {
    const length = Number(request.headers.get("Content-Length"))
    if (!Number.isInteger(length) || length < 2 || length > 4_096) return json({ available: false }, 400, origin)
    const paths = parseViewPaths(await request.json<unknown>())
    if (!paths) return json({ available: false }, 400, origin)

    const placeholders = paths.map(() => "?").join(", ")
    const result = await env.DB.prepare(`SELECT path, views FROM post_totals WHERE path IN (${placeholders})`).bind(...paths).all<Record<string, unknown>>()
    if (!result.success) throw new Error("D1 view lookup failed")

    const postViews = Object.fromEntries(paths.map((path) => [path, 0]))
    for (const row of result.results) {
        const path = row.path
        const count = row.views
        if (typeof path !== "string" || !(path in postViews)) continue
        if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) throw new Error("Invalid D1 view aggregate")
        postViews[path] = count
    }
    return json({ available: true, updatedAt: new Date().toISOString(), postViews }, 200, origin)
}

export default {
    async fetch(request, env): Promise<Response> {
        const url = new URL(request.url)
        if (request.method === "GET" && url.pathname === "/health") return json({ ok: true }, 200)
        const origin = request.headers.get("Origin") || ""
        if (!["/visit", "/stats", "/count", "/views"].includes(url.pathname) || origin !== ALLOWED_ORIGIN) return json({ available: false }, 403)
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(origin) })
        if (request.method !== "POST") return json({ available: false }, 405, origin)
        try {
            return url.pathname === "/views"
                ? await views(request, env, origin)
                : await count(request, env, origin, url.pathname === "/visit", url.pathname === "/count")
        } catch (error) {
            console.error(JSON.stringify({ message: "counter_request_failed", error: error instanceof Error ? error.message : "unknown" }))
            return json({ available: false }, 503, origin)
        }
    },
} satisfies ExportedHandler<Env>
