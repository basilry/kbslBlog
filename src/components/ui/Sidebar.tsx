import { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import MenuItem from "@components/molecule/MenuItem"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/sidebar.module.scss"

const MENU_LIST = ["Search", "Introduce", "Notice", "Post", "Projects", "Visitor", "Donate"]
const MENU_LIST_KR = ["블로그 글 검색", "자기소개", "공지사항", "포스팅", "프로젝트 목록", "방명록", "후원"]

function Sidebar(): ReactElement {
    const pathName = usePathname()
    const { darkMode, sideBarFold, changeSideBarFold } = useCoreStore()
    const [focus, setFocus] = useState(0)

    return (
        <div className={classNames(styles.sidebarWrapper, sideBarFold && styles.open, darkMode && styles.dark)}>
            <ul>
                <li className={!sideBarFold ? styles.hidden : styles.view} onClick={(): void => changeSideBarFold(false)}>
                    <Image src={darkMode ? "xmark-solid_white.svg" : "xmark-solid.svg"} alt="sidebarCloseBtn" width={30} height={30} />
                </li>
                {MENU_LIST.map((menuName, idx) => (
                    <li
                        key={menuName}
                        onClick={(): void => changeSideBarFold(false)}
                        className={classNames(!sideBarFold ? styles.hidden : styles.view, pathName.slice(1) === menuName && styles.nowPath, darkMode && styles.dark)}
                        onMouseEnter={(): void => setFocus(idx)}
                        onMouseLeave={(): void => setFocus(-1)}
                    >
                        <MenuItem menuName={menuName} krName={focus === idx ? MENU_LIST_KR[idx] : ""} />
                    </li>
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
                            <Image src={darkMode ? "/github_white.svg" : "/github.svg"} alt="github" width={20} height={20} />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://www.linkedin.com/in/basilri-kim-4b6611218/">
                            <Image src={darkMode ? "/linkedin_white.svg" : "/linkedin.svg"} alt="linkedin" width={20} height={20} />
                        </Link>
                    </div>
                    <div className={styles.socialLogo}>
                        <Link href="https://blog.naver.com/basilry">
                            <Image src={darkMode ? "/n-solid_white.svg" : "/n-solid.svg"} alt="n-solid" width={20} height={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
