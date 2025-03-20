"use client"

import React, { ReactElement, useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import Footer from "@components/ui/Footer"
import Header from "@components/ui/Header"
import Sidebar from "@components/ui/Sidebar"
import TopMoveButton from "@components/ui/TopMoveButton"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/layout/container.module.scss"

function Container({ children }: { children: React.ReactNode }): ReactElement {
    const pathName = usePathname()
    const { darkMode, changeSideBarFold } = useCoreStore()
    const { scrollYProgress } = useScroll()

    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [darkMode])

    return mount ? (
        <div className={classNames(styles.container, darkMode && styles.darkMode)}>
            <motion.div className={styles.progressBar} style={{ scaleX: scrollYProgress ? scrollYProgress : 0 }} />
            <Header />
            <Sidebar />
            <div className={styles.body} onClick={(): void => changeSideBarFold(false)}>
                {children}
            </div>
            <TopMoveButton />
            {!pathName.includes("login") && <Footer />}
        </div>
    ) : (
        <></>
    )
}

export default Container
