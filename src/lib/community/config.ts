import "server-only"
import type { CommunityOptions, SocialProvider } from "./types"

export function communityOptions(): CommunityOptions {
    const providers = (process.env.COMMUNITY_AUTH_PROVIDERS ?? "google,kakao").split(",")
        .map(value => value.trim()).filter((value): value is SocialProvider => value === "google" || value === "kakao")
    return {
        enabled: process.env.COMMUNITY_ENABLED === "true" && Boolean(
            process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SECRET_KEY &&
            (process.env.COMMUNITY_COOKIE_SECRET?.length ?? 0) >= 32 && providers.length,
        ),
        providers: [...new Set(providers)],
    }
}

export function communityConfig() {
    if (!communityOptions().enabled) return null
    return {
        url: process.env.SUPABASE_URL!, publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY!,
        secretKey: process.env.SUPABASE_SECRET_KEY!, cookieSecret: process.env.COMMUNITY_COOKIE_SECRET!,
    }
}

export function communityPostKey(slug: string): string | null {
    return slug.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug !== "register" ? `post/${slug}` : null
}

// Keep the selected language, disallow external redirects and callback loops.
export function communityReturnPath(input: unknown): string {
    if (typeof input !== "string" || /[\\\u0000-\u0020]/.test(input)) return "/ko/post#comments"
    try {
        const url = new URL(input, "https://local.invalid")
        if (!input.startsWith("/") || url.origin !== "https://local.invalid" || !/^\/(ko|en)\/post\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url.pathname)) return "/ko/post#comments"
        return url.pathname + url.search + "#comments"
    } catch { return "/ko/post#comments" }
}
