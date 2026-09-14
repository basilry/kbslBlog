import { NextResponse } from "next/server"
import { communityReturnPath } from "@lib/community/config"
import { appOrigin, communityClients } from "@lib/community/server"
import { returnCookieName } from "@lib/community/identity"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function GET(request: Request) {
    const input = new URL(request.url)
    let destination = new URL(communityReturnPath(input.searchParams.get("next")), appOrigin(request))
    const code = input.searchParams.get("code")
    let ok = false
    try {
        const { auth, store } = await communityClients()
        const savedReturn = store.get(returnCookieName())?.value
        if (savedReturn) destination = new URL(communityReturnPath(savedReturn), appOrigin(request))
        store.set(returnCookieName(), "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 })
        if (code && !input.searchParams.has("error")) {
            const { error } = await auth.auth.exchangeCodeForSession(code)
            ok = !error
        }
    } catch { /* Show a localized retry message in the original post; do not leak provider errors. */ }
    if (!ok) destination.searchParams.set("community-auth", "failed")
    else destination.searchParams.delete("community-auth")
    const response = NextResponse.redirect(destination, 303)
    response.headers.set("Cache-Control", "private, no-store")
    response.headers.set("Referrer-Policy", "no-referrer")
    return response
}
