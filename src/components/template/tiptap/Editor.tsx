"use client"

import { ReactElement } from "react"
import { Document } from "@tiptap/extension-document"
import { Highlight } from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { Mention } from "@tiptap/extension-mention"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Superscript } from "@tiptap/extension-superscript"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { Underline } from "@tiptap/extension-underline"
import { Youtube } from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"

import DOMPurify from "dompurify"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { all, createLowlight } from "lowlight"
import classNames from "classnames"
import TipTapToolbar from "@components/template/tiptap/TipTapToolbar"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/tiptap/tiptap.module.scss"

interface IEditorProps {
    title: string
    contents: string
    onChangeTitle: (title: string) => void
    onChangeContents: (contents: string) => void
}

const lowlight = createLowlight(all)
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

const CustomDocument = Document.extend({
    content: "heading block*",
})

const Editor = (props: IEditorProps): ReactElement => {
    const { title, contents, onChangeTitle, onChangeContents } = props

    const titleEditor = useEditor({
        extensions: [
            CustomDocument,
            StarterKit.configure({
                document: false,
            }),
            Placeholder.configure({
                placeholder: () => {
                    return "제목"
                },
            }),
        ],
        content: title ? <h1>{title}</h1> : "<h1></h1>",
        autofocus: "end",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (!editor) return
            const title = editor.getHTML()
            const clean = DOMPurify.sanitize(title, { FORBID_TAGS: ["h1"] })

            onChangeTitle(clean)
        },
    })

    const contentsEditor = useEditor({
        extensions: [
            StarterKit,
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
            Placeholder.configure({
                placeholder: (PlaceholderProps: any) => {
                    if (PlaceholderProps.pos > 0) {
                        return ""
                    }
                    return "내용을 입력하세요."
                },
            }),
        ],
        content: contents || "<p></p>",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (!editor) return
            const contents = editor.getHTML()
            const clean = DOMPurify.sanitize(contents)

            onChangeContents(clean)
        },
    })

    const { darkMode } = useCoreStore()

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
        <div>
            <div className={classNames(styles.titleEditor, darkMode && styles.dark)}>
                <EditorContent editor={titleEditor} />
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
        </div>
    )
}

export default Editor
