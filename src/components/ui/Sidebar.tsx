"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import { useNavigationStore } from "@lib/stores/navigationStore"
import { MENU_LIST, MENU_LIST_KR } from "@lib/utils/constants"
import styles from "@styles/ui/sidebar.module.scss"

export default function Sidebar() {
    const pathName = usePathname().split("/")[1]
    const router = useRouter()
    const darkMode = useCoreStore((state) => state.darkMode)
    const isOpen = useNavigationStore((state) => state.isOpen)
    const setOpen = useNavigationStore((state) => state.setOpen)
    const closeButton = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        if (!isOpen) return
        const trigger = document.activeElement as HTMLElement | null
        closeButton.current?.focus({ preventScroll: true })
        return () => { trigger?.focus({ preventScroll: true }) }
    }, [isOpen])

    return <nav id="site-navigation" aria-label="주 메뉴" aria-hidden={!isOpen} inert={!isOpen} onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false)
    }} className={classNames(styles.sidebarWrapper, isOpen && styles.open, darkMode && styles.dark)}>
        <ul>
            <li className={styles.closeRow}><button ref={closeButton} className="iconButton" aria-label="메뉴 닫기" onClick={() => setOpen(false)}>
                <Image src={darkMode ? "/xmark-solid_white.svg" : "/xmark-solid.svg"} alt="" width={28} height={28} />
            </button></li>
            {MENU_LIST.map((name, index) => {
                const href = `/${name[0].toLowerCase()}${name.slice(1)}`
                const prefetch = () => router.prefetch(href)
                return <li key={name} className={styles.menuItem}>
                    <Link className={styles.menuLink} href={href} prefetch={false} onPointerEnter={prefetch} onFocus={prefetch} onTouchStart={prefetch}
                        aria-current={pathName === name.toLowerCase() ? "page" : undefined}
                        onNavigate={() => setOpen(false)}>{MENU_LIST_KR[index]}</Link>
                </li>
            })}
        </ul>
        <div className={styles.sideBarFooter}>
            <a href="/feed.xml">RSS 구독</a>
            <div className={styles.socialLogoWrppaer}><a className={styles.socialLogo} href="https://github.com/basilry">GitHub</a><a className={styles.socialLogo} href="https://blog.naver.com/basilry">네이버 블로그</a></div>
        </div>
    </nav>
}
