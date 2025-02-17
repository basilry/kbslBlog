import { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import MenuItem from "@components/molecule/MenuItem"
import { useCoreStore } from "@lib/stores/store"
import { MENU_LIST, MENU_LIST_KR } from "@lib/utils/constants"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/ui/sidebar.module.scss"

function Sidebar(): ReactElement {
    const pathName = usePathname().split("/")
    const { darkMode, sideBarFold, changeSideBarFold, changeNowMenuName } = useCoreStore()
    const [focus, setFocus] = useState(0)
    const router = useRouter()

    return (
        <div className={classNames(styles.sidebarWrapper, sideBarFold && styles.open, darkMode && styles.dark)}>
            <ul>
                <li
                    className={!sideBarFold ? styles.hidden : styles.view}
                    onClick={(): void => changeSideBarFold(false)}
                >
                    <Image
                        src={darkMode ? "/xmark-solid_white.svg" : "/xmark-solid.svg"}
                        alt="sidebarCloseBtn"
                        width={30}
                        height={30}
                    />
                </li>
                {MENU_LIST.map((menuName, idx) => (
                    <Link key={menuName} href={`/${menuName.slice(0, 1).toLowerCase() + menuName.slice(1)}`}>
                        <li
                            onClick={(): void => {
                                changeNowMenuName(menuName.toUpperCase())
                                changeSideBarFold(false)
                                toastCall(`${MENU_LIST_KR[idx]} 페이지로 이동합니다.`, "success")
                                router.push(`/${menuName.slice(0, 1).toLowerCase() + menuName.slice(1)}`)
                            }}
                            className={classNames(
                                !sideBarFold ? styles.hidden : styles.view,
                                pathName[1] === menuName.toLowerCase() && styles.nowPath,
                                darkMode && styles.dark,
                            )}
                            onMouseEnter={(): void => setFocus(idx)}
                            onMouseLeave={(): void => setFocus(-1)}
                        >
                            <MenuItem menuName={menuName} krName={focus === idx ? MENU_LIST_KR[idx] : ""} />
                        </li>
                    </Link>
                ))}
            </ul>

            <div className={classNames(styles.sideBarFooter, !sideBarFold && styles.hidden)}>
                <TextBasic size="x-small" bold="bold">
                    Copyright ⓒ 2023 by Basilri Kim
                </TextBasic>
                <TextBasic size="x-small" bold="bold">
                    all rights reserved.
                </TextBasic>
                <div className={styles.socialLogoWrppaer}>
                    <div className={styles.socialLogo}>
                        <Link href="https://github.com/basilry">
                            <Image
                                src={darkMode ? "/github_white.svg" : "/github.svg"}
                                alt="github"
                                width={20}
                                height={20}
                            />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://www.linkedin.com/in/basilri-kim-4b6611218/">
                            <Image
                                src={darkMode ? "/linkedin_white.svg" : "/linkedin.svg"}
                                alt="linkedin"
                                width={20}
                                height={20}
                            />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://blog.naver.com/basilry">
                            <Image
                                src={darkMode ? "/n-solid_white.svg" : "/n-solid.svg"}
                                alt="n-solid"
                                width={20}
                                height={20}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
