import { communityOptions, communityReturnPath } from "@lib/community/config"
import { CommunityError, appOrigin, communityClients, communityFailure, communityJson, readCommunityJson } from "@lib/community/server"
import { returnCookieName } from "@lib/community/identity"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function POST(request: Request) {
    try {
        const body = await readCommunityJson(request)
        const { auth, store } = await communityClients()
        if (body.action === "logout") {
            const { error } = await auth.auth.signOut({ scope: "local" })
            if (error) throw new CommunityError("unavailable", 503)
            return communityJson({ ok: true })
        }
        if ((body.provider !== "google" && body.provider !== "kakao") || !communityOptions().providers.includes(body.provider)) throw new CommunityError("invalid_input")
        const callback = new URL("/api/auth/callback", appOrigin(request))
        // A short-lived cookie keeps the provider redirect URL exact (no per-post wildcard allowlist).
        store.set(returnCookieName(), communityReturnPath(body.next), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 })
        const { data, error } = await auth.auth.signInWithOAuth({
            provider: body.provider,
            options: {
                redirectTo: callback.toString(), skipBrowserRedirect: true,
                ...(body.provider === "kakao" ? { scopes: "profile_nickname profile_image" } : {}),
            },
        })
        if (error || !data.url) throw new CommunityError("auth_failed", 503)
        return communityJson({ url: data.url })
    } catch (error) { return communityFailure(error) }
}
