"use client"

import React, { ReactElement, useEffect, useState } from "react"
import classNames from "classnames"
import Footer from "@components/ui/Footer"
import Header from "@components/ui/Header"
import Sidebar from "@components/ui/Sidebar"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/layout/container.module.scss"

function Container({ children }: { children: React.ReactNode }): ReactElement {
    const { darkMode, changeSideBarFold } = useCoreStore()

    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [darkMode])

    return mount ? (
        <div className={classNames(styles.container, darkMode && styles.darkMode)}>
            <Header />
            <Sidebar />
            <div className={styles.body} onClick={(): void => changeSideBarFold(false)}>
                {children}
            </div>
            <Footer />
        </div>
    ) : (
        <></>
    )
}

export default Container
