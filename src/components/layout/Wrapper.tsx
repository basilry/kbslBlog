import { ReactElement, ReactNode } from "react"
import styles from "@styles/layout/wrapper.module.scss"

const Wrapper = ({ children }: { children: ReactNode }): ReactElement => {
    return <div className={styles.wrapper}>{children}</div>
}

export default Wrapper
