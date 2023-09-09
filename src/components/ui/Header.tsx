import { ReactElement } from "react"
import styles from "@styles/ui/header.module.scss"

function Header(): ReactElement {
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.leftWrapper}>
                <div className={styles.mainLink}>메인링크</div>
                <div>공지사항</div>
            </div>
            <div className={styles.rightWrapper}>
                <div>white/black 테마 변경</div>
                <div>로그인 버튼</div>
                <div>개별 유저 프로필(클릭시 유저정보)</div>
            </div>
        </div>
    )
}

export default Header
