import { ReactElement } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import MenuItem from "@components/molecule/MenuItem"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/sidebar.module.scss"

const MENU_LIST = ["Search", "Main", "Introduce", "Notice", "Post", "Visitors"]

function Sidebar(): ReactElement {
    const pathName = usePathname()
    const { darkMode, sideBarFold, changeSideBarFold } = useCoreStore()
    console.log(pathName)

    return (
        <div className={classNames(styles.sidebarWrapper, sideBarFold && styles.open, darkMode && styles.dark)}>
            <ul>
                <li className={!sideBarFold ? styles.hidden : ""} onClick={(): void => changeSideBarFold(false)}>
                    <Image src={darkMode ? "xmark-solid_white.svg" : "xmark-solid.svg"} alt="sidebarCloseBtn" width={30} height={30} />
                </li>
                {MENU_LIST.map((menuName) => (
                    <li key={menuName} onClick={(): void => changeSideBarFold(false)} className={classNames(!sideBarFold ? styles.hidden : "", pathName.slice(1) === menuName && styles.nowPath)}>
                        <MenuItem menuName={menuName} />
                    </li>
                ))}
                {/* <li>
                    <TextBasic bold="bold" size="xx-large">
                        Donate
                    </TextBasic>
                </li> */}
            </ul>

            <div className={classNames(styles.sideBarFooter, !sideBarFold && styles.hidden)}>
                <TextBasic size="x-small" bold="bold">
                    Copyright ⓒ 2023 by Basilri Kim
                </TextBasic>
                <TextBasic size="x-small" bold="bold">
                    all rights reserved.
                </TextBasic>
            </div>
        </div>
    )
}

export default Sidebar
