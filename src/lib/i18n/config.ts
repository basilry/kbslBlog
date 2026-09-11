export const LOCALES = ["ko", "en"] as const
export type Locale = typeof LOCALES[number]
export const LANGUAGE_COOKIE = "basilry-language"
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const isLocale = (value: unknown): value is Locale => value === "ko" || value === "en"
export const languageTag = (locale: Locale) => locale === "ko" ? "ko-KR" : "en"
export const localeFromPath = (pathname: string): Locale | null => {
    const first = pathname.split("/")[1]
    return isLocale(first) ? first : null
}
export function stripLocale(path: string): string {
    return path.replace(/^\/(ko|en)(?=\/|[?#]|$)/, "") || "/"
}
export function localeHref(path: string, locale: Locale): string {
    if (!path.startsWith("/") || path.startsWith("//")) return path
    const bare = stripLocale(path)
    return `/${locale}${bare === "/" ? "" : bare}`
}
export function preferredLocale(country: string | null, saved: unknown): Locale {
    if (isLocale(saved)) return saved
    return country?.toUpperCase() === "KR" ? "ko" : "en"
}
export function safeReturnPath(value: string | null): string {
    if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value)) return "/"
    try {
        const parsed = new URL(value, "https://local.invalid")
        if (parsed.origin !== "https://local.invalid") return "/"
        return stripLocale(parsed.pathname) + parsed.search + parsed.hash
    } catch { return "/" }
}
export function counterPostPath(path: string): string | null {
    const bare = stripLocale(path)
    return /^\/post\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bare) && bare !== "/post/register" ? bare : null
}
// Match Giscus's original pathname mapping, so both languages use the existing discussion.
export function discussionTerm(path: string): string {
    const bare = stripLocale(path)
    return bare.length < 2 ? "index" : bare.substring(1).replace(/\.\w+$/, "")
}
export function formatPostDate(value: string, locale: Locale): string {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(languageTag(locale), {
        year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul",
    }).format(date) : value
}
export function formatArchiveDate(value: string, monthOnly = false): string {
    if (!value) return "Present"
    const compact = /^(\d{4})(\d{2})(\d{2})?$/.exec(value)
    const iso = compact ? `${compact[1]}-${compact[2]}-${compact[3] ?? "01"}` : value
    const date = new Date(iso)
    return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("en", {
        year: "numeric", month: "short", ...(monthOnly ? {} : { day: "numeric" }), timeZone: "Asia/Seoul",
    }).format(date) : value
}
