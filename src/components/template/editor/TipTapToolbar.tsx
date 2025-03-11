"use client"

import { ReactElement, useCallback } from "react"
import { Editor } from "@tiptap/core"
import TipTapToolbarIcon from "@components/template/editor/TipTapToolbarIcon"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/editor/tipTapToolbar.module.scss"

interface ITipTapToolbarProps {
    editor: Editor
}

const TipTapToolbar = ({ editor }: ITipTapToolbarProps): ReactElement => {
    const { darkMode } = useCoreStore()

    const doSetLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()

            return
        }

        // update link
        try {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        } catch (e: any) {
            alert(e.message)
        }
    }, [editor])

    const doSetImage = useCallback(() => {
        const url = window.prompt("URL")

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const toolbarItems = [
        { icon: "bold", command: "bold", action: () => editor.chain().focus().toggleBold().run() },
        { icon: "italic", command: "italic", action: () => editor.chain().focus().toggleItalic().run() },
        { icon: "strike", command: "strike", action: () => editor.chain().focus().toggleStrike().run() },
        { icon: "highlight", command: "highlight", action: () => editor.chain().focus().toggleHighlight().run() },
        { icon: "code", command: "code", action: () => editor.chain().focus().toggleCode().run() },
        {
            icon: "alignLeft",
            command: "align",
            alignment: "left",
            action: () => editor.chain().focus().setTextAlign("left").run(),
        },
        {
            icon: "alignCenter",
            command: "align",
            alignment: "center",
            action: () => editor.chain().focus().setTextAlign("center").run(),
        },
        {
            icon: "alignRight",
            command: "align",
            alignment: "right",
            action: () => editor.chain().focus().setTextAlign("right").run(),
        },
        {
            icon: "h1",
            command: "heading",
            level: 1,
            action: () => editor.chain().focus().setHeading({ level: 1 }).run(),
        },
        {
            icon: "h2",
            command: "heading",
            level: 2,
            action: () => editor.chain().focus().setHeading({ level: 2 }).run(),
        },
        {
            icon: "h3",
            command: "heading",
            level: 3,
            action: () => editor.chain().focus().setHeading({ level: 3 }).run(),
        },
        {
            icon: "h4",
            command: "heading",
            level: 4,
            action: () => editor.chain().focus().setHeading({ level: 4 }).run(),
        },
        {
            icon: "horizontal_rule",
            command: "horizontal_rule",
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        { icon: "underline", command: "underline", action: () => editor.chain().focus().toggleUnderline().run() },
        { icon: "superscript", command: "superscript", action: () => editor.chain().focus().toggleSuperscript().run() },
        { icon: "link", command: "link", action: () => doSetLink() },
        { icon: "image", command: "image", action: () => doSetImage() },
    ]

    return (
        <div className={styles.toolbarWrapper}>
            {toolbarItems.map((item, index) => (
                <TipTapToolbarIcon
                    key={index}
                    iconSrc={`/toolbar/${darkMode ? `${item.icon}_white` : item.icon}.svg`}
                    onClick={() => item?.action?.()}
                />
            ))}
        </div>
    )
}

export default TipTapToolbar
