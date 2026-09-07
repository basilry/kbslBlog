"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import classNames from "classnames"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import { useCoreStore, useLoginStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/ui/header.module.scss"

export default function Header() {
    const { darkMode, sideBarFold, changeSideBarFold } = useCoreStore()
    const { loginState, initialize } = useLoginStore()
    const router = useRouter()
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
            {loginState ? <button className="iconButton" aria-label="로그아웃" onClick={() => { initialize(); router.refresh(); toastCall("로그아웃 되었습니다.", "success") }}>
                <Image src={darkMode ? "/logout_white.svg" : "/logout.svg"} alt="" width={24} height={24} />
            </button> : <Link href="/login" aria-label="관리자 로그인"><Image src={darkMode ? "/login_white.svg" : "/login.svg"} alt="" width={24} height={24} /></Link>}
        </div>
    </header>
}
