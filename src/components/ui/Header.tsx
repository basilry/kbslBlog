"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import { useNavigationStore } from "@lib/stores/navigationStore"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/header.module.scss"

export default function Header() {
    const darkMode = useCoreStore((state) => state.darkMode)
    const sideBarFold = useNavigationStore((state) => state.isOpen)
    const changeSideBarFold = useNavigationStore((state) => state.setOpen)
    const path = usePathname()
    return <header className={classNames(styles.headerWrapper, darkMode && styles.darkMode)}>
        <div className={styles.leftWrapper}>
            <button className={classNames(styles.hamberger, "iconButton")} aria-label="메뉴 열기" aria-controls="site-navigation" aria-expanded={sideBarFold} onClick={() => changeSideBarFold(!sideBarFold)}>
                <Image src={darkMode ? "/bars-solid_white.svg" : "/bars-solid.svg"} alt="" width={20} height={20} />
            </button>
            <div className={styles.linkBlock}><Link className={styles.rootLink} href="/" onClick={() => changeSideBarFold(false)}>basilry.kim</Link></div>
            <nav aria-label="빠른 이동" className={styles.quickLinks}>
                <Link href="/post" aria-current={path.startsWith("/post") ? "page" : undefined}>글</Link>
                <Link href="/projects" aria-current={path.startsWith("/projects") ? "page" : undefined}>프로젝트</Link>
            </nav>
        </div>
        <div className={styles.rightWrapper}>
            <DarkModeBasic />
        </div>
    </header>
}
