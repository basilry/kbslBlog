"use client"

import { ReactElement } from "react"
import TipTapToolbarIcon from "@components/template/tiptap/TipTapToolbarIcon"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/tiptap/tipTapToolbar.module.scss"

const TipTapToolbar = (): ReactElement => {
    const { darkMode } = useCoreStore()
    // Tiptap 툴바 기능
    // 10. superscript
    // 11. link

    // 키보드로 해결 가능한 것들
    // blockquote |12313
    // bullet list -
    // codeblock lowlight ```
    // list item - -hello
    // order list - 1. 2. 3.
    // mention - @david
    // task list - []

    return (
        <div className={styles.toolbarWrapper}>
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "bold_white" : "bold"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "italic_white" : "italic"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "strike_white" : "strike"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon
                iconSrc={`/toolbar/${darkMode ? "highlight_white" : "highlight"}.svg`}
                onClick={() => ""}
            />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "code_white" : "code"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "h1_white" : "h1"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "h2_white" : "h2"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "h3_white" : "h3"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "h4_white" : "h4"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon
                iconSrc={`/toolbar/${darkMode ? "horizontal_rule_white" : "horizontal_rule"}.svg`}
                onClick={() => ""}
            />
            <TipTapToolbarIcon
                iconSrc={`/toolbar/${darkMode ? "underline_white" : "underline"}.svg`}
                onClick={() => ""}
            />
            <TipTapToolbarIcon
                iconSrc={`/toolbar/${darkMode ? "superscript_white" : "superscript"}.svg`}
                onClick={() => ""}
            />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "link_white" : "link"}.svg`} onClick={() => ""} />
            <TipTapToolbarIcon iconSrc={`/toolbar/${darkMode ? "image_white" : "image"}.svg`} onClick={() => ""} />
        </div>
    )
}

export default TipTapToolbar
