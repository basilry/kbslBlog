"use client"

import { useEffect, useState } from "react"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/darkModeBasic.module.scss"

const DarkModeBasic = (): JSX.Element => {
    const { changeDarkMode, darkMode } = useCoreStore()

    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [])

    return (
        <div className={classNames(styles.darkModeBasic, darkMode && styles.darkBack)} onClick={changeDarkMode}>
            {mount && (
                <div className={classNames(styles.modeToggleBtn, darkMode && styles.left)}>
                    <div className={classNames(styles.toggleRound)}>
                        <div className={classNames(styles.toggleInnerColor, darkMode && styles.dark)}>{darkMode && <div className={styles.moon}></div>}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DarkModeBasic
