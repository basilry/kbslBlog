"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import { MENU_LIST, MENU_LIST_KR } from "@lib/utils/constants"
import styles from "@styles/ui/sidebar.module.scss"

export default function Sidebar() {
    const pathName = usePathname().split("/")[1]
    const { darkMode, sideBarFold, changeSideBarFold } = useCoreStore()
    const closeButton = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        if (!sideBarFold) return
        const trigger = document.activeElement as HTMLElement | null
        closeButton.current?.focus()
        return () => { trigger?.focus() }
    }, [sideBarFold])
    return <nav id="site-navigation" aria-label="주 메뉴" onKeyDown={(event) => {
        if (event.key === "Escape") changeSideBarFold(false)
    }} className={classNames(styles.sidebarWrapper, sideBarFold && styles.open, darkMode && styles.dark)}>
        <ul>
            <li><button ref={closeButton} className="iconButton" aria-label="메뉴 닫기" onClick={() => changeSideBarFold(false)}>
                <Image src={darkMode ? "/xmark-solid_white.svg" : "/xmark-solid.svg"} alt="" width={28} height={28} />
            </button></li>
            {MENU_LIST.map((name, index) => <li key={name} className={classNames(pathName === name.toLowerCase() && styles.nowPath)}>
                <Link href={`/${name[0].toLowerCase()}${name.slice(1)}`} aria-current={pathName === name.toLowerCase() ? "page" : undefined} onClick={() => changeSideBarFold(false)}>{MENU_LIST_KR[index]}</Link>
            </li>)}
        </ul>
        <div className={styles.sideBarFooter}>
            <Link href="/feed.xml">RSS 구독</Link>
            <div className={styles.socialLogoWrppaer}><Link className={styles.socialLogo} href="https://github.com/basilry">GitHub</Link><Link className={styles.socialLogo} href="https://blog.naver.com/basilry">네이버 블로그</Link></div>
        </div>
    </nav>
}
