import { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import MenuItem from "@components/molecule/MenuItem"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/sidebar.module.scss"

// const MENU_LIST = ["Main", "Search", "Introduce", "Notice", "Post", "Projects", "Visitor", "Donate"]
// const MENU_LIST_KR = ["메인", "블로그 글 검색", "자기소개", "공지사항", "포스팅", "프로젝트 목록", "방명록", "후원"]
const MENU_LIST = ["Main", "Introduce", "Projects", "Visitor"]
const MENU_LIST_KR = ["메인", "자기소개", "프로젝트", "방명록"]

function Sidebar(): ReactElement {
    const pathName = usePathname()
    const { darkMode, sideBarFold, changeSideBarFold, changeNowMenuName } = useCoreStore()
    const [focus, setFocus] = useState(0)

    return (
        <div className={classNames(styles.sidebarWrapper, sideBarFold && styles.open, darkMode && styles.dark)}>
            <ul>
                <li
                    className={!sideBarFold ? styles.hidden : styles.view}
                    onClick={(): void => changeSideBarFold(false)}
                >
                    <Image
                        placeholder="blur"
                        src={darkMode ? "/kbslBlog/xmark-solid_white.svg" : "/kbslBlog/xmark-solid.svg"}
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
                            }}
                            className={classNames(
                                !sideBarFold ? styles.hidden : styles.view,
                                pathName.slice(1) === menuName.toLowerCase() && styles.nowPath,
                                darkMode && styles.dark,
                            )}
                            onMouseEnter={(): void => setFocus(idx)}
                            onMouseLeave={(): void => setFocus(-1)}
                        >
                            <MenuItem
                                menuName={
                                    pathName.slice(1) === menuName.toLowerCase() ? "{" + menuName + "}" : menuName
                                }
                                krName={focus === idx ? MENU_LIST_KR[idx] : ""}
                            />
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
                                placeholder="blur"
                                src={darkMode ? "/kbslBlog/github_white.svg" : "/kbslBlog/github.svg"}
                                alt="github"
                                width={20}
                                height={20}
                            />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://www.linkedin.com/in/basilri-kim-4b6611218/">
                            <Image
                                placeholder="blur"
                                src={darkMode ? "/kbslBlog/linkedin_white.svg" : "/kbslBlog/linkedin.svg"}
                                alt="linkedin"
                                width={20}
                                height={20}
                            />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://blog.naver.com/basilry">
                            <Image
                                placeholder="blur"
                                src={darkMode ? "/kbslBlog/n-solid_white.svg" : "/kbslBlog/n-solid.svg"}
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
