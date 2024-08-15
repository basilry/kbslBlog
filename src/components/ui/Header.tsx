"use client"

import { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import { MENU_LIST, MENU_LIST_KR } from "@lib/utils/constants"
import { toastCall } from "@lib/utils/toastCall"
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
                        src={darkMode ? "/kbslBlog/bars-solid_white.svg" : "/kbslBlog/bars-solid.svg"}
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
                        <Link
                            href="/"
                            onClick={(): void => {
                                changeNowMenuName("")
                                toastCall("메인 페이지로 이동합니다.", "success")
                            }}
                        >
                            <TextBasic size="xx-large" bold="bold">
                                {"KBSL's Blog"}
                            </TextBasic>
                        </Link>
                    </div>
                    <TextBasic size="xx-large" bold="bold">
                        /
                    </TextBasic>
                    <div className={styles.menuLink}>
                        <Link
                            href={`/${nowMenuName.toLowerCase()}`}
                            onClick={(): void =>
                                toastCall(
                                    `${
                                        MENU_LIST_KR[
                                            MENU_LIST.indexOf(nowMenuName[0] + nowMenuName.slice(1).toLowerCase())
                                        ]
                                    } 페이지로 이동합니다.`,
                                    "success",
                                )
                            }
                        >
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
