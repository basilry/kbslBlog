import { NextRequest, NextResponse } from "next/server"
import { isLocale, LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, localeHref, safeReturnPath } from "@lib/i18n/config"

export function GET(request: NextRequest) {
    const locale = request.nextUrl.searchParams.get("locale")
    if (!isLocale(locale)) return new Response("Unsupported language", { status: 400 })
    const destination = new URL(localeHref(safeReturnPath(request.nextUrl.searchParams.get("next")), locale), request.url)
    const response = NextResponse.redirect(destination, 303)
    response.cookies.set(LANGUAGE_COOKIE, locale, { path: "/", maxAge: LANGUAGE_COOKIE_MAX_AGE, httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:" })
    response.headers.set("Cache-Control", "private, no-store")
    return response
}
