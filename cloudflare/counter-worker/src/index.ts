import { counterDay, parsePayload, parseViewPaths } from "./lib"

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

async function visitorHash(secret: string, scope: string, visitorId: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${scope}:${visitorId}`))
    return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function resultCount(result: D1Result<Record<string, unknown>> | undefined, field: string): number {
    const value = result?.results?.[0]?.[field]
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid D1 aggregate")
    return value
}

async function count(request: Request, env: Env, origin: string): Promise<Response> {
    if (BOT.test(request.headers.get("User-Agent") || "")) return json({ available: false }, 200, origin)
    const length = Number(request.headers.get("Content-Length"))
    if (!Number.isInteger(length) || length < 2 || length > 512) return json({ available: false }, 400, origin)
    const payload = parsePayload(await request.json<unknown>())
    if (!payload) return json({ available: false }, 400, origin)

    const now = new Date()
    const day = counterDay(now)
    const [stableHash, dailyHash] = await Promise.all([
        visitorHash(env.HASH_SECRET, "all", payload.visitorId),
        visitorHash(env.HASH_SECRET, day, payload.visitorId),
    ])
    const statements = [
        env.DB.prepare("DELETE FROM daily_visitors WHERE day < ?").bind(day),
        env.DB.prepare("DELETE FROM post_view_dedupe WHERE day < ?").bind(day),
        env.DB.prepare("INSERT OR IGNORE INTO all_visitors (visitor_hash, created_at) VALUES (?, ?)").bind(stableHash, now.toISOString()),
        env.DB.prepare("INSERT OR IGNORE INTO daily_visitors (day, visitor_hash, created_at) VALUES (?, ?, ?)").bind(day, dailyHash, now.toISOString()),
    ]
    if (payload.path) {
        statements.push(env.DB.prepare("INSERT OR IGNORE INTO post_view_dedupe (day, path, visitor_hash, created_at) VALUES (?, ?, ?, ?)").bind(day, payload.path, dailyHash, now.toISOString()))
    }
    statements.push(env.DB.prepare("SELECT COUNT(*) AS count FROM daily_visitors WHERE day = ?").bind(day))
    statements.push(env.DB.prepare("SELECT COUNT(*) AS count FROM all_visitors"))
    if (payload.path) statements.push(env.DB.prepare("SELECT views FROM post_totals WHERE path = ?").bind(payload.path))

    const results = await env.DB.batch<Record<string, unknown>>(statements)
    const todayVisitors = resultCount(results[payload.path ? 5 : 4], "count")
    const totalVisitors = resultCount(results[payload.path ? 6 : 5], "count")
    const postViews: Record<string, number> = {}
    if (payload.path) postViews[payload.path] = resultCount(results[7], "views")
    return json({ available: true, date: day, timeZone: "Asia/Seoul", updatedAt: now.toISOString(), todayVisitors, totalVisitors, postViews }, 200, origin)
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
        if ((url.pathname !== "/count" && url.pathname !== "/views") || origin !== ALLOWED_ORIGIN) return json({ available: false }, 403)
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(origin) })
        if (request.method !== "POST") return json({ available: false }, 405, origin)
        try {
            return url.pathname === "/count" ? await count(request, env, origin) : await views(request, env, origin)
        } catch (error) {
            console.error(JSON.stringify({ message: "counter_request_failed", error: error instanceof Error ? error.message : "unknown" }))
            return json({ available: false }, 503, origin)
        }
    },
} satisfies ExportedHandler<Env>
