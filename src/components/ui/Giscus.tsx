"use client"

import { usePathname } from "next/navigation"
import { useLocale } from "@lib/i18n/context"
import { discussionTerm } from "@lib/i18n/config"
import { ReactElement, useEffect, useRef, useSyncExternalStore } from "react"
import { useCoreStore } from "@lib/stores/store"

function subscribeHydration(notify: () => void) {
    const start = useCoreStore.persist.onHydrate(notify)
    const finish = useCoreStore.persist.onFinishHydration(notify)
    return () => { start(); finish() }
}

interface IGiscusProps {
    emotion?: boolean
}

export default function Giscus({ emotion = true }: IGiscusProps): ReactElement {
    const locale = useLocale()
    const term = discussionTerm(usePathname())
    const ref = useRef<HTMLDivElement>(null)
    const { darkMode } = useCoreStore()

    const hydrated = useSyncExternalStore(subscribeHydration, () => useCoreStore.persist.hasHydrated(), () => false)
    const theme = darkMode ? "dark" : "light"

    useEffect(() => {
        if (!hydrated || !ref.current || ref.current.hasChildNodes()) return

        const scriptElem = document.createElement("script")
        scriptElem.src = "https://giscus.app/client.js"
        scriptElem.async = true
        scriptElem.crossOrigin = "anonymous"

        scriptElem.setAttribute("data-repo", "basilry/giscus")
        scriptElem.setAttribute("data-repo-id", "R_kgDOLaOwhw")
        scriptElem.setAttribute("data-category", "General")
        scriptElem.setAttribute("data-category-id", "DIC_kwDOLaOwh84CdpMC")
        scriptElem.setAttribute("data-mapping", "specific")
        scriptElem.setAttribute("data-term", term)
        scriptElem.setAttribute("data-strict", "0")
        scriptElem.setAttribute("data-reactions-enabled", emotion ? "1" : "0")
        scriptElem.setAttribute("data-emit-metadata", "1")
        scriptElem.setAttribute("data-input-position", "top")
        scriptElem.setAttribute("data-theme", theme)
        scriptElem.setAttribute("data-lang", locale)
        scriptElem.setAttribute("data-loading", "lazy")

        ref.current.appendChild(scriptElem)
    }, [hydrated, emotion, theme, locale, term])

    useEffect(() => {
        const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
        iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme, lang: locale, term, mapping: "specific" } } }, "https://giscus.app")
    }, [theme, locale, term])

    return <section ref={ref} style={{ marginBottom: "120px" }} />
}
