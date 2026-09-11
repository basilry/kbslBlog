"use client"

import Image from "next/image"
import Link from "@components/ui/LocaleLink"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import { useNavigationStore } from "@lib/stores/navigationStore"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import HeaderVisitorCounter from "@components/ui/HeaderVisitorCounter"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/header.module.scss"
import LanguageSwitcher from "./LanguageSwitcher"
import { useLocale } from "@lib/i18n/context"
import { stripLocale } from "@lib/i18n/config"
import { messages } from "@lib/i18n/messages"

export default function Header() {
    const m = messages(useLocale())
    const darkMode = useCoreStore((state) => state.darkMode)
    const sideBarFold = useNavigationStore((state) => state.isOpen)
    const changeSideBarFold = useNavigationStore((state) => state.setOpen)
    const path = stripLocale(usePathname())
    return <header className={classNames(styles.headerWrapper, darkMode && styles.darkMode)}>
        <div className={styles.leftWrapper}>
            <button className={classNames(styles.hamberger, "iconButton")} aria-label={m.openMenu} aria-controls="site-navigation" aria-expanded={sideBarFold} onClick={() => changeSideBarFold(!sideBarFold)}>
                <Image src={darkMode ? "/bars-solid_white.svg" : "/bars-solid.svg"} alt="" width={20} height={20} />
            </button>
            <div className={styles.linkBlock}><Link aria-label="basilry.kim" className={styles.rootLink} href="/" onClick={() => changeSideBarFold(false)}>basilry<span className={styles.domainSuffix}>.kim</span></Link></div>
            <nav aria-label={m.quickLinks} className={styles.quickLinks}>
                <Link href="/post" aria-current={path.startsWith("/post") || path === "/search" ? "page" : undefined}>{m.posts}</Link>
                <Link href="/projects" aria-current={path.startsWith("/projects") ? "page" : undefined}>{m.projects}</Link>
            </nav>
        </div>
        <div className={styles.rightWrapper}>
            <HeaderVisitorCounter />
            <LanguageSwitcher />
            <DarkModeBasic />
        </div>
    </header>
}
