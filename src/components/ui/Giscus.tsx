"use client"

import { ReactElement, useEffect, useRef } from "react"
import { useCoreStore } from "@lib/stores/store"

interface IGiscusProps {
    emotion?: boolean
}

export default function Giscus({ emotion = true }: IGiscusProps): ReactElement {
    const ref = useRef<HTMLDivElement>(null)
    const { darkMode } = useCoreStore()

    const theme = darkMode ? "dark" : "light"

    const handleMessage = (event: MessageEvent): void => {
        if (event.origin !== "https://giscus.app") return
        if (!(typeof event.data === "object" && event.data.giscus)) return

        const giscusData = event.data.giscus
        // Do whatever you want with it, e.g. `console.log(giscusData)`.
        // You'll need to make sure that `giscusData` contains the message you're
        // expecting, e.g. by using `if ('discussion' in giscusData)`.

        console.log(giscusData)
    }

    useEffect(() => {
        window.addEventListener("message", handleMessage)

        return () => {
            window.removeEventListener("message", handleMessage)
        }
    }, [])

    useEffect(() => {
        if (!ref.current || ref.current.hasChildNodes()) return

        const scriptElem = document.createElement("script")
        scriptElem.src = "https://giscus.app/client.js"
        scriptElem.async = true
        scriptElem.crossOrigin = "anonymous"

        scriptElem.setAttribute("data-repo", "basilry/giscus")
        scriptElem.setAttribute("data-repo-id", "R_kgDOLaOwhw")
        scriptElem.setAttribute("data-category", "General")
        scriptElem.setAttribute("data-category-id", "DIC_kwDOLaOwh84CdpMC")
        scriptElem.setAttribute("data-mapping", "pathname")
        scriptElem.setAttribute("data-strict", "0")
        scriptElem.setAttribute("data-reactions-enabled", emotion ? "1" : "0")
        scriptElem.setAttribute("data-emit-metadata", "1")
        scriptElem.setAttribute("data-input-position", "top")
        scriptElem.setAttribute("data-theme", theme)
        scriptElem.setAttribute("data-lang", "ko")
        scriptElem.setAttribute("data-loading", "lazy")

        ref.current.appendChild(scriptElem)
    }, [])

    useEffect(() => {
        const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
        iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app")
    }, [theme])

    return <section ref={ref} style={{ marginBottom: "120px" }} />
}
