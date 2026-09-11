"use client"

import { useLocale } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import type { PostHeading } from "@lib/content/outline"
import styles from "@styles/components/postTableOfContents.module.scss"

export default function PostTableOfContents({ headings }: { headings: PostHeading[] }) {
    const m = messages(useLocale())
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "")
    const desktopList = useRef<HTMLElement>(null)
    const minimumLevel = Math.min(...headings.map((heading) => heading.level))

    useEffect(() => {
        if (!headings.length) return
        const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element): element is HTMLElement => Boolean(element))
        let frame = 0
        const update = () => {
            frame = 0
            let current = elements[0]?.id ?? ""
            for (const element of elements) {
                if (element.getBoundingClientRect().top <= 128) current = element.id
                else break
            }
            setActiveId(current)
        }
        const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
        // Re-evaluate when lazy images or embeds move the article headings.
        const observer = new ResizeObserver(schedule)
        const content = document.getElementById("post-content")
        if (content) observer.observe(content)
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        window.addEventListener("hashchange", schedule)
        // Streamed article HTML can arrive after the browser's initial fragment lookup.
        frame = window.requestAnimationFrame(() => {
            try {
                const id = decodeURIComponent(window.location.hash.slice(1))
                elements.find((element) => element.id === id)?.scrollIntoView({ behavior: "instant", block: "start" })
            } catch { /* Ignore malformed fragment escapes. */ }
            update()
        })
        return () => {
            window.cancelAnimationFrame(frame)
            observer.disconnect()
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            window.removeEventListener("hashchange", schedule)
        }
    }, [headings])

    useEffect(() => {
        const list = desktopList.current
        const active = list?.querySelector<HTMLElement>('[aria-current="location"]')
        if (!list || !active) return
        const bounds = list.getBoundingClientRect()
        const item = active.getBoundingClientRect()
        if (item.top < bounds.top) list.scrollTop += item.top - bounds.top - 12
        else if (item.bottom > bounds.bottom) list.scrollTop += item.bottom - bounds.bottom + 12
    }, [activeId])

    if (!headings.length) return null

    const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const target = document.getElementById(id)
        if (!target) return
        event.preventDefault()
        const disclosure = event.currentTarget.closest("details")
        if (disclosure) disclosure.open = false
        const hash = `#${encodeURIComponent(id)}`
        if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash)
        target.focus({ preventScroll: true })
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })
        setActiveId(id)
    }

    const links = () => <ol>{headings.map((heading) => (
        <li key={heading.id} style={{ paddingLeft: `${Math.min(heading.level - minimumLevel, 3) * 12}px` }}>
            <a href={`#${encodeURIComponent(heading.id)}`} aria-current={activeId === heading.id ? "location" : undefined}
                onClick={(event) => navigate(event, heading.id)}>{heading.text}</a>
        </li>
    ))}</ol>

    return <aside className={styles.toc} aria-label={m.contents}>
        <div className={styles.desktop}>
            <p className={styles.label}>{m.contents}</p>
            <nav ref={desktopList} aria-label={m.contentsNav} className={styles.list}>{links()}</nav>
        </div>
        <details className={styles.mobile}>
            <summary>{m.contents}<span>{headings.length} <span aria-hidden="true">⌄</span></span></summary>
            <nav aria-label={m.contentsNav} className={styles.list}>{links()}</nav>
        </details>
    </aside>
}
