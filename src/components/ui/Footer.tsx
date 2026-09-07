"use client"

import { ReactElement } from "react"
import classNames from "classnames"
import AnalyticsCounter from "@components/ui/AnalyticsCounter"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/footer.module.scss"

function Footer(): ReactElement {
    const { darkMode } = useCoreStore()

    return (
        <>

                <div className={classNames(styles.footer, darkMode && styles.dark)}>
                    <div className={styles.leftWrapper}>
                        <TextBasic size="x-small" bold="bold">
                            Copyright ⓒ 2023 by Basilri Kim all rights reserved.
                        </TextBasic>
                        <TextBasic size="x-small"><AnalyticsCounter /></TextBasic>
                    </div>
                    <div className={styles.rightWrapper}>
                        <TextBasic size="x-small" bold="bold">
                            {"basilry@gmail.com"}
                        </TextBasic>
                        <TextBasic size="x-small" bold="bold">
                            {"+82 010-8936-4302"}
                        </TextBasic>
                    </div>
                </div>

        </>
    )
}

export default Footer
