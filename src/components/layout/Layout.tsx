"use client"

import React, { ReactElement } from "react"
import Header from "@components/ui/Header"
import Sidebar from "@components/ui/Sidebar"
import styles from "@styles/layout/layout.module.scss"

function Layout({ children }: { children: React.ReactNode }): ReactElement {
    return (
        <div className={styles.rootLayoutWrapper}>
            <div>
                <Header />
            </div>
            <div className={styles.body}>
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default Layout
