"use client"

import { useEffect, useState } from "react"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/topMoveButton.module.scss"

export default function TopMoveButton() {
    const darkMode = useCoreStore((state) => state.darkMode)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const update = () => setVisible(window.scrollY > 150)
        window.addEventListener("scroll", update, { passive: true })
        update()
        return () => window.removeEventListener("scroll", update)
    }, [])
    return <button type="button" aria-label="페이지 맨 위로" className={classNames(styles.wrapper, darkMode && styles.darkMode)} style={{ display: visible ? "block" : "none" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Top</button>
}
