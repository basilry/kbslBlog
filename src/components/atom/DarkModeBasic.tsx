"use client"

import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/darkModeBasic.module.scss"

export default function DarkModeBasic() {
    const { changeDarkMode, darkMode } = useCoreStore()
    return <button type="button" aria-label={darkMode ? "밝은 테마로 변경" : "어두운 테마로 변경"} aria-pressed={darkMode} className={classNames(styles.darkModeBasic, "iconButton", darkMode && styles.darkBack)} onClick={changeDarkMode}>
        <span className={classNames(styles.modeToggleBtn, darkMode && styles.left)}>
            <span className={styles.toggleRound}><span className={classNames(styles.toggleInnerColor, darkMode && styles.dark)}>{darkMode && <span className={styles.moon} />}</span></span>
        </span>
    </button>
}
