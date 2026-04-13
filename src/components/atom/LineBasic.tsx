import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/lineBasic.module.scss"

const LineBasic = (): JSX.Element => {
    const { darkMode } = useCoreStore()
    return <div className={classNames(styles.lineBasic, darkMode && styles.dark)}></div>
}

export default LineBasic
