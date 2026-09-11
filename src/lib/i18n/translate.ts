import english from "./site-en.json"
import type { Locale } from "./config"

export function translateText(text: string, locale: Locale): string {
    return locale === "en" ? (english as Record<string, string>)[text] ?? text : text
}
export function translateData<T>(value: T, locale: Locale): T {
    if (locale === "ko") return value
    if (typeof value === "string") return translateText(value, locale) as T
    if (Array.isArray(value)) return value.map(item => translateData(item, locale)) as T
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateData(item, locale)])) as T
    return value
}
