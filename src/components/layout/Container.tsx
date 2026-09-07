"use client"

import React, { ReactElement } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import { useNavigationStore } from "@lib/stores/navigationStore"
import Footer from "@components/ui/Footer"
import Header from "@components/ui/Header"
import Sidebar from "@components/ui/Sidebar"
import TopMoveButton from "@components/ui/TopMoveButton"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/layout/container.module.scss"

function Container({ children }: { children: React.ReactNode }): ReactElement {
    const pathName = usePathname()
    const darkMode = useCoreStore((state) => state.darkMode)
    const changeSideBarFold = useNavigationStore((state) => state.setOpen)
    const { scrollY, scrollYProgress } = useScroll()
    const readingProgress = useTransform(() => scrollY.get() > 0 ? scrollYProgress.get() : 0)

    return (
        <div className={classNames(styles.container, darkMode && styles.darkMode)}>
            <motion.div className={styles.progressBar} style={{ scaleX: readingProgress }} />
            <Header />
            <Sidebar />
            <main id="main-content" className={styles.body} onClick={(): void => changeSideBarFold(false)}>
                {children}
            </main>
            <TopMoveButton />
            {!pathName.includes("login") && <Footer />}
        </div>
    )
}

export default Container
