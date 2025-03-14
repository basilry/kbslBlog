"use client"

import { ReactElement, useEffect, useState } from "react"
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

import DOMPurify from "dompurify"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import parse, { Element, HTMLReactParserOptions } from "html-react-parser"
import { all, createLowlight } from "lowlight"
import Image from "next/image"
import classNames from "classnames"
import ThumbnailUploader from "@components/template/editor/ThumbnailUploader"
import TipTapToolbar from "@components/template/editor/TipTapToolbar"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/editor/editor.module.scss"

interface IEditorProps {
    title: string
    contents: string
    onChangeTitle: (title: string) => void
    onChangeContents: (contents: string) => void
    onChangeThumbnail: (thumbnail: string | File) => void
    thumbnail?: string | File
}

const lowlight = createLowlight(all)
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

const CustomDocument = Document.extend({
    content: "heading block*",
})

// 구글 드라이브 이미지 URL인지 확인하는 함수
const isGoogleDriveImage = (url: string): boolean => {
    return url.includes("drive.google.com") || url.includes("googleusercontent.com")
}

// HTML 파싱 및 img 태그 변환 함수
const parseHtmlWithNextImage = (htmlContent: string): React.ReactNode => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === "img") {
                const { src, alt = "" } = domNode.attribs

                if (src) {
                    // 구글 드라이브 이미지인 경우
                    if (isGoogleDriveImage(src)) {
                        return (
                            <div style={{ position: "relative", width: "100%", height: "400px", margin: "20px 0" }}>
                                <Image
                                    src={src}
                                    alt={alt || "이미지"}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="/image.svg"
                                />
                            </div>
                        )
                    }
                }
            }
        },
    }

    return parse(htmlContent, options)
}

const Editor = (props: IEditorProps): ReactElement => {
    const { title, contents, onChangeTitle, onChangeContents, onChangeThumbnail, thumbnail } = props
    const [parsedContent, setParsedContent] = useState<React.ReactNode | null>(null)

    const titleEditor = useEditor({
        extensions: [
            CustomDocument,
            StarterKit.configure({ document: false }),
            Placeholder.configure({ placeholder: "제목" }),
        ],
        content: title || "<h1></h1>",
        autofocus: "end",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const clean = DOMPurify.sanitize(editor.getHTML(), { FORBID_TAGS: ["h1"] })
            onChangeTitle(clean)
        },
    })

    const contentsEditor = useEditor({
        extensions: [
            StarterKit,
            // 명시 버튼
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Underline,
            Superscript,
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
        content: () => parsedContent || "<p></p>",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (!editor) return
            const contents = editor.getHTML()
            const clean = DOMPurify.sanitize(contents, {
                ADD_TAGS: ["iframe"],
                ADD_ATTR: [
                    "allowfullscreen",
                    "frameborder",
                    "src",
                    "width",
                    "height",
                    "allow",
                    "autoplay",
                    "disablekbcontrols",
                    "enableiframeapi",
                    "endtime",
                    "ivloadpolicy",
                    "loop",
                    "modestbranding",
                    "origin",
                    "playlist",
                    "start",
                ],
            })

            // 구글 드라이브 이미지가 있는지 확인
            if (clean.includes("drive.google.com") || clean.includes("googleusercontent.com")) {
                // 이미지 처리를 위해 parseHtmlWithNextImage 함수 사용
                setParsedContent(parseHtmlWithNextImage(clean))
            } else {
                setParsedContent(null)
            }

            onChangeContents(clean)
        },
    })

    // 초기 콘텐츠에 img 태그가 있을 경우 처리
    useEffect(() => {
        if (contentsEditor && contents) {
            // 구글 드라이브 이미지가 있는지 확인
            if (contents.includes("drive.google.com") || contents.includes("googleusercontent.com")) {
                setParsedContent(parseHtmlWithNextImage(contents))
            }

            // 에디터 내용 설정
            contentsEditor.commands.setContent(contents)
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
                {/* {parsedContent ? (
                    <div className="editor-content-wrapper">
                        {parsedContent}
                        <div
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0 }}
                        >
                            <EditorContent editor={contentsEditor} />
                        </div>
                    </div>
                ) : (
                    <EditorContent editor={contentsEditor} />
                )} */}
            </div>
        </div>
    )
}

export default Editor
