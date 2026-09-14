import "server-only"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SITE_URL } from "@lib/content/types"
import { communityConfig } from "./config"
import { browserCookieName, createBrowserIdentity, readBrowserIdentity } from "./identity"

export class CommunityError extends Error {
    constructor(public code: string, public status = 400) { super(code) }
}

export function appOrigin(request: Request): string {
    if (process.env.COMMUNITY_SITE_URL) return new URL(process.env.COMMUNITY_SITE_URL).origin
    const url = new URL(request.url)
    if (process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return url.origin
    return SITE_URL
}

export function assertSameOrigin(request: Request) {
    if (request.headers.get("origin") !== appOrigin(request) || request.headers.get("sec-fetch-site") === "cross-site") throw new CommunityError("forbidden", 403)
}

export async function readCommunityJson(request: Request): Promise<Record<string, unknown>> {
    assertSameOrigin(request)
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new CommunityError("invalid_input")
    const reader = request.body?.getReader()
    if (!reader) throw new CommunityError("invalid_input")
    const chunks: Uint8Array[] = []
    let size = 0
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > 12_000) { await reader.cancel(); throw new CommunityError("too_large", 413) }
            chunks.push(value)
        }
        const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"))
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new CommunityError("invalid_input")
        return body as Record<string, unknown>
    } catch (error) {
        if (error instanceof CommunityError) throw error
        throw new CommunityError("invalid_input")
    } finally { reader.releaseLock() }
}

const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie, Origin" }
export function communityJson(value: unknown, status = 200) { return NextResponse.json(value, { status, headers: noStore }) }
export function communityFailure(error: unknown) {
    const known = error instanceof CommunityError ? error : new CommunityError("unavailable", 503)
    const response = communityJson({ error: known.code }, known.status)
    if (known.status === 429) response.headers.set("Retry-After", "60")
    return response
}
export function checkDatabaseError(error: { message: string } | null) {
    if (!error) return
    const statuses: Record<string, number> = { unauthorized: 401, forbidden: 403, not_found: 404, conflict: 409, invalid_input: 400, invalid_parent: 400, thread_full: 409, rate_limited: 429 }
    if (statuses[error.message]) throw new CommunityError(error.message, statuses[error.message])
    throw new CommunityError("unavailable", 503)
}

// Used only in route handlers: session refresh cookies must be written to the response.
// The post's server component never reads a session, keeping Markdown pages static and public.
export async function communityClients() {
    const config = communityConfig()
    if (!config) throw new CommunityError("not_configured", 503)
    const store = await cookies()
    const boundedFetch: typeof fetch = (input, init) => fetch(input, {
        ...init, cache: "no-store",
        signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(10_000)]) : AbortSignal.timeout(10_000),
    })
    const auth = createServerClient(config.url, config.publishableKey, {
        global: { fetch: boundedFetch },
        cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" },
        cookies: { getAll: () => store.getAll(), setAll: entries => { for (const { name, value, options } of entries) store.set(name, value, options) } },
    })
    const database = createClient(config.url, config.secretKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { fetch: boundedFetch },
    })
    return { auth, database, store, config }
}

export async function communityIdentity(clients: Awaited<ReturnType<typeof communityClients>>) {
    const { auth, store, config } = clients
    const { data, error } = await auth.auth.getUser()
    if (error && error.name !== "AuthSessionMissingError" && error.status !== 401 && error.status !== 403) throw new CommunityError("unavailable", 503)
    let browserHash = readBrowserIdentity(store.get(browserCookieName())?.value, config.cookieSecret)
    if (!browserHash) {
        const value = createBrowserIdentity(config.cookieSecret)
        browserHash = readBrowserIdentity(value, config.cookieSecret)!
        store.set(browserCookieName(), value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 })
    }
    const verified = error ? null : data.user
    const socialUser = verified && !verified.is_anonymous && verified.identities?.some(identity => identity.provider === "google" || identity.provider === "kakao") ? verified : null
    return { user: socialUser, browserHash }
}
