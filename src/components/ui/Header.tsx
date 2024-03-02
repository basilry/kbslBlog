"use client"

import { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/header.module.scss"

function Header(): ReactElement {
    const { darkMode, changeSideBarFold, nowMenuName, changeNowMenuName } = useCoreStore()

    return (
        <div
            className={classNames(styles.headerWrapper, darkMode && styles.darkMode)}
            onClick={(): void => changeSideBarFold(false)}
        >
            <div className={styles.leftWrapper}>
                <div className={styles.hamberger}>
                    <Image
                        src={darkMode ? "/bars-solid_white.svg" : "/bars-solid.svg"}
                        alt="sidebarBtn"
                        width={20}
                        height={20}
                        onClick={(e): void => {
                            e.stopPropagation()
                            changeSideBarFold(true)
                        }}
                    />
                </div>
                <div className={styles.linkBlock}>
                    <div className={styles.rootLink}>
                        <Link href="/" onClick={(): void => changeNowMenuName("MAIN")}>
                            <TextBasic size="xx-large" bold="bold">
                                {"KBSL's Blog"}
                            </TextBasic>
                        </Link>
                    </div>
                    <TextBasic size="xx-large" bold="bold">
                        /
                    </TextBasic>
                    <div className={styles.menuLink}>
                        <Link href={`/${nowMenuName.toLowerCase()}`}>
                            <TextBasic size="xx-large" bold="bold">
                                {nowMenuName}
                            </TextBasic>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.rightWrapper}>
                <div className={styles.darkToggleWrapper} onClick={(e): void => e.stopPropagation()}>
                    <DarkModeBasic />
                </div>
                {/* <Link href="/login">
                    <TextBasic size="small" bold="bold">
                        {"Login"}
                    </TextBasic>
                </Link>
                <Link href="/userProfile">
                    <TextBasic size="small" bold="bold">
                        {"UserProfile"}
                    </TextBasic>
                </Link> */}
            </div>
        </div>
    )
}

export default Header
