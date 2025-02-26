"use client"

import { ReactElement } from "react"
import { useRouter } from "next-nprogress-bar"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import DarkModeBasic from "@components/atom/DarkModeBasic"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore, useLoginStore } from "@lib/stores/store"
import { MENU_LIST, MENU_LIST_KR } from "@lib/utils/constants"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/ui/header.module.scss"

function Header(): ReactElement {
    const { darkMode, changeSideBarFold, nowMenuName, changeNowMenuName } = useCoreStore()
    const { loginUser, loginState, initialize } = useLoginStore()
    const router = useRouter()

    const doSetImgSrc = (darkMode: boolean, loginState: boolean): string => {
        if (darkMode) {
            return loginState ? "/logout_white.svg" : "/login_white.svg"
        } else {
            return loginState ? "/logout.svg" : "/login.svg"
        }
    }

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
                        <Link
                            href="/"
                            onClick={(): void => {
                                changeNowMenuName("")
                                router.push("/")
                                toastCall("홈으로 이동합니다.", "success")
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
                            onClick={(): void => {
                                toastCall(
                                    `${
                                        MENU_LIST_KR[
                                            MENU_LIST.indexOf(nowMenuName[0] + nowMenuName.slice(1).toLowerCase())
                                        ]
                                    } 페이지로 이동합니다.`,
                                    "success",
                                )
                            }}
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
                {loginState && (
                    <Link href="/userProfile">
                        <div className={classNames(styles.profile, darkMode && styles.darkProfile)}>
                            <Image src={loginUser.profileImg || "/myFace.png"} alt={"user"} width={25} height={25} />
                        </div>
                    </Link>
                )}
                <div
                    className={styles.loginBlock}
                    onClick={(): void => {
                        if (loginState) {
                            initialize()
                            router.push(`/${nowMenuName.toLowerCase()}`)
                            toastCall("로그아웃 되었습니다.", "success")
                        } else {
                            changeNowMenuName("LOGIN")
                            router.push("/login")
                            toastCall("로그인 페이지로 이동합니다.", "success")
                        }
                    }}
                >
                    <div className={styles.login}>
                        <Image src={doSetImgSrc(darkMode, loginState)} alt={"login"} width={25} height={25} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
