"use client"

import { ReactElement, useEffect, useRef } from "react"
import { JSONContent } from "@tiptap/core"
import { CharacterCount } from "@tiptap/extension-character-count"
import { Document } from "@tiptap/extension-document"
import { Highlight } from "@tiptap/extension-highlight"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import { Mention } from "@tiptap/extension-mention"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Superscript } from "@tiptap/extension-superscript"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Youtube } from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { common, createLowlight } from "lowlight"
import classNames from "classnames"
import ThumbnailUploader from "@components/template/editor/ThumbnailUploader"
import TipTapToolbar from "@components/template/editor/TipTapToolbar"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/editor/editor.module.scss"
import { GoogleDriveImageExtension } from "./GoogleDriveImageExtension"

interface IEditorProps {
    title: string
    contents: string
    onChangeTitle: (title: string) => void
    onChangeContents: (contents: string) => void
    onChangeThumbnail: (thumbnail: string | File) => void
    thumbnail?: string | File
}

const CustomDocument = Document.extend({
    content: "heading block*",
})

// lowlight 초기화
const lowlight = createLowlight(common)
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

const createTitleDocument = (title: string): JSONContent => ({
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: { level: 1 },
            content: title ? [{ type: "text", text: title }] : [],
        },
    ],
})

const Editor = (props: IEditorProps): ReactElement => {
    const { title, contents, onChangeTitle, onChangeContents, onChangeThumbnail, thumbnail } = props
    const onChangeTitleRef = useRef(onChangeTitle)
    const onChangeContentsRef = useRef(onChangeContents)

    useEffect(() => {
        onChangeTitleRef.current = onChangeTitle
    }, [onChangeTitle])

    useEffect(() => {
        onChangeContentsRef.current = onChangeContents
    }, [onChangeContents])

    const titleEditor = useEditor({
        extensions: [
            CustomDocument,
            StarterKit.configure({ document: false }),
            Placeholder.configure({ placeholder: "제목" }),
            CharacterCount.configure({
                limit: 50,
            }),
        ],
        content: createTitleDocument(title),
        autofocus: "end",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChangeTitleRef.current(editor.getText())
        },
    })

    const contentsEditor = useEditor({
        extensions: [
            // 구글 드라이브 이미지 확장을 먼저 등록
            GoogleDriveImageExtension,
            // 기본 StarterKit 사용
            StarterKit,
            // 명시 버튼
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Underline,
            Superscript,
            // 일반 이미지용 별도 확장 (재정의)
            ImageExtension.configure({
                allowBase64: true,
                inline: true,
            }),
            Mention,
            Youtube.configure({
                inline: true,
            }),
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
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":") ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ["ftp", "file", "mailto"]
                        const protocol = parsedUrl.protocol.replace(":", "")

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ["example-phishing.com", "malicious-site.net"]
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: (url) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":") ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ["example-no-autolink.com", "another-no-autolink.com"]
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },
            }),
        ],
        content: contents || "<p></p>",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChangeContentsRef.current(editor.getHTML())
        },
    })

    useEffect(() => {
        if (!titleEditor || titleEditor.getText() === title) return
        titleEditor.commands.setContent(createTitleDocument(title), false)
    }, [title, titleEditor])

    useEffect(() => {
        if (!contentsEditor) return
        const nextContents = contents || "<p></p>"
        if (contentsEditor.getHTML() !== nextContents) {
            contentsEditor.commands.setContent(nextContents, false)
        }
    }, [contentsEditor, contents])

    const { darkMode } = useCoreStore()

    if (!contentsEditor) return <div>Loading...</div>

    return (
        <div>
            <div className={classNames(styles.titleEditor, darkMode && styles.dark)}>
                <EditorContent editor={titleEditor} />
            </div>
            <ThumbnailUploader thumbnail={thumbnail} onChangeThumbnail={onChangeThumbnail} />
            <TipTapToolbar editor={contentsEditor} />
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
