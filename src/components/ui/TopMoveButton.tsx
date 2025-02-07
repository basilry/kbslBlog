import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/topMoveButton.module.scss"

const TopMoveButton = (): JSX.Element => {
    const { darkMode } = useCoreStore()

    window.addEventListener("scroll", function () {
        const scrollToTopButton = document.getElementById("scrollToTopButton")
        if (!scrollToTopButton) return

        if (window.scrollY > 150) {
            scrollToTopButton.style.display = "block"
            scrollToTopButton.classList.add("show")
        } else {
            scrollToTopButton.style.display = "none"
            scrollToTopButton.classList.remove("show")
        }
    })
    return (
        <div
            id="scrollToTopButton"
            className={classNames(styles.wrapper, darkMode && styles.darkMode)}
            onClick={(): void => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        >
            <TextBasic className={"topButton"} size="medium" bold="bold">
                {"Top"}
            </TextBasic>
        </div>
    )
}

export default TopMoveButton
