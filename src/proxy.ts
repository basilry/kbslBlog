import { NextRequest, NextResponse } from "next/server"
import { LANGUAGE_COOKIE, localeFromPath, localeHref, preferredLocale } from "./lib/i18n/config"

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    if (localeFromPath(pathname)) return NextResponse.next()
    const locale = preferredLocale(request.headers.get("x-vercel-ip-country"), request.cookies.get(LANGUAGE_COOKIE)?.value)
    const destination = request.nextUrl.clone()
    destination.pathname = localeHref(pathname, locale)
    const response = NextResponse.redirect(destination, 307)
    response.headers.set("Cache-Control", "private, no-store")
    response.headers.set("Vary", "Cookie, X-Vercel-IP-Country")
    return response
}

export const config = { matcher: ["/((?!api(?:/|$)|language(?:/|$)|_next(?:/|$)|content(?:/|$)|.*\\.[^/]+$).*)"] }
