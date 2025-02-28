"use client"

import { ReactElement, useState } from "react"
import { Highlight } from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { Mention } from "@tiptap/extension-mention"
import { Paragraph } from "@tiptap/extension-paragraph"
import { Superscript } from "@tiptap/extension-superscript"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { Underline } from "@tiptap/extension-underline"
import { Youtube } from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"

import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { all, createLowlight } from "lowlight"
import classNames from "classnames"
import InputBasic from "@components/atom/InputBasic"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import TipTapToolbar from "@components/template/tiptap/TipTapToolbar"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/tiptap/tiptap.module.scss"

const lowlight = createLowlight(all)
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

const Tiptap = (): ReactElement => {
    const contentsEditor = useEditor({
        extensions: [
            StarterKit,
            Paragraph,
            // 명시 버튼
            Highlight,
            Underline,
            Superscript,
            Image.configure({
                allowBase64: true,
            }),
            Mention,
            Youtube,
            TaskItem,
            TaskList,
        ],
        content: "<p></p>", // 초기 콘텐츠 (비어 있음)
        autofocus: "end",
        immediatelyRender: false,
    })

    const { darkMode } = useCoreStore()

    const [title, setTitle] = useState("")

    // 이미지 렌더링 테스트
    // useEffect(() => {
    //     if (!titleEditor || !contentsEditor) return
    //     contentsEditor.commands.setImage({
    //         src: "/kyoto.jpg",
    //         alt: "Kyoto",
    //     })
    // }, [contentsEditor, titleEditor])

    if (!contentsEditor) return <div>Loading...</div>

    return (
        <Wrapper>
            <TextBasic className={styles.title} size="xxx-large" bold="bold">
                {"New Post | 새 글 쓰기"}
            </TextBasic>
            <br />
            <LineBasic />
            <br />
            <div className={classNames(styles.titleEditor, darkMode && styles.dark)}>
                <InputBasic value={title} onChange={(e) => setTitle(e.target.value)} type={""} />
            </div>
            <TipTapToolbar />
            <div
                className={classNames(styles.contentsEditor, darkMode && styles.dark)}
                onClick={() => {
                    contentsEditor?.commands.focus()
                }}
            >
                <EditorContent editor={contentsEditor} />
            </div>
        </Wrapper>
    )
}

export default Tiptap
