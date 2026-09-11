"use client"
import { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useLocale } from "@lib/i18n/context"
import { safeReturnPath } from "@lib/i18n/config"
import { messages } from "@lib/i18n/messages"
import styles from "@styles/ui/header.module.scss"

function LanguageForm({ query = "" }: { query?: string }) {
    const locale = useLocale()
    const pathname = usePathname()
    return <form action="/language" method="get" className={styles.languageForm}>
        <input type="hidden" name="next" value={safeReturnPath(pathname + query)} />
        <select name="locale" aria-label={messages(locale).language} value={locale} onChange={event => {
            const form = event.currentTarget.form
            if (form) {
                const next = form.elements.namedItem("next") as HTMLInputElement
                next.value = safeReturnPath(window.location.pathname + window.location.search + window.location.hash)
                form.requestSubmit()
            }
        }}>
            <option value="ko" lang="ko">한국어</option>
            <option value="en" lang="en">English</option>
        </select>
        <noscript><button type="submit">OK</button></noscript>
    </form>
}
function QueryLanguageForm() {
    const params = useSearchParams()
    return <LanguageForm query={params.size ? `?${params}` : ""} />
}
export default function LanguageSwitcher() {
    return <Suspense fallback={<LanguageForm />}><QueryLanguageForm /></Suspense>
}
