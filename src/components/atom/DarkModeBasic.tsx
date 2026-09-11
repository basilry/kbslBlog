"use client"

import { useLocale } from "@lib/i18n/context"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/darkModeBasic.module.scss"

export default function DarkModeBasic() {
    const en = useLocale() === "en"
    const darkMode = useCoreStore((state) => state.darkMode)
    const changeDarkMode = useCoreStore((state) => state.changeDarkMode)
    return <button type="button" aria-label={en ? "Dark mode" : "다크 모드"} title={en ? darkMode ? "Switch to light theme" : "Switch to dark theme" : darkMode ? "밝은 테마로 변경" : "어두운 테마로 변경"} aria-pressed={darkMode} className={classNames(styles.darkModeBasic, darkMode && styles.dark)} onClick={changeDarkMode}>
        <span className={styles.track} aria-hidden="true">
            <span className={classNames(styles.symbol, styles.sun)} />
            <span className={classNames(styles.symbol, styles.moon)} />
            <span className={styles.thumb} />
        </span>
    </button>
}
