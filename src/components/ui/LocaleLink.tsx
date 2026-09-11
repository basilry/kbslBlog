"use client"
import Link from "next/link"
import { forwardRef, type ComponentProps } from "react"
import { useLocale } from "@lib/i18n/context"
import { localeHref } from "@lib/i18n/config"

// Public navigation retains the active language; external URLs, assets and fragments are untouched.
export default forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function LocaleLink({ href, ...props }, ref) {
    const locale = useLocale()
    const localized = typeof href === "string" && /^\/(?:$|post(?:[/?#]|$)|search(?:[/?#]|$)|projects(?:[/?#]|$)|introduce(?:[/?#]|$)|research(?:[/?#]|$)|career(?:[/?#]|$)|certification(?:[/?#]|$)|visitor(?:[/?#]|$)|donate(?:[/?#]|$)|notice(?:[/?#]|$)|feed\.xml)/.test(href)
        ? localeHref(href, locale) : href
    return <Link ref={ref} href={localized} {...props} />
})
