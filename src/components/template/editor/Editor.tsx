"use client"

import { ReactElement, useEffect, useState } from "react"
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
import DOMPurify from "dompurify"

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

// window 전역 객체 확장
declare global {
    interface Window {
        _testGoogleDriveImage: () => void
    }
}

const Editor = (props: IEditorProps): ReactElement => {
    const { title, contents, onChangeTitle, onChangeContents, onChangeThumbnail, thumbnail } = props
    // 에디터 포커스 상태 추가
    const [isEditorFocused, setIsEditorFocused] = useState(false)

    const titleEditor = useEditor({
        extensions: [
            CustomDocument,
            StarterKit.configure({ document: false }),
            Placeholder.configure({ placeholder: "제목" }),
            CharacterCount.configure({
                limit: 50,
            }),
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
        onFocus: () => setIsEditorFocused(true),
        onBlur: () => {
            // blur 이벤트에서만 콘텐츠 업데이트
            setIsEditorFocused(false)
            if (contentsEditor) {
                const html = contentsEditor.getHTML()
                onChangeContents(html)
            }
        },
        onUpdate: ({ editor }) => {
            if (isEditorFocused) {
                // 타이핑 중일 때는 업데이트하지 않음 (성능 향상 및 커서 위치 유지)
                return
            }

            // 포커스가 없을 때만 전체 콘텐츠 업데이트
            const html = editor.getHTML()
            onChangeContents(html)
        },
        onCreate: ({ editor }) => {
            // 확장 등록 확인을 위한 로그
            console.log(
                "에디터 확장 목록:",
                editor.extensionManager.extensions.map((ext) => ext.name),
            )
            console.log(
                "GoogleDriveImageExtension 등록 확인:",
                editor.extensionManager.extensions.some((ext) => ext.name === "googleDriveImage"),
            )
        },
    })

    // 초기 콘텐츠에 img 태그가 있을 경우 처리
    useEffect(() => {
        if (contentsEditor && contents) {
            // 에디터 렌더링 후에 setTimeout으로 지연시켜 flushSync 에러 방지
            setTimeout(() => {
                console.log("에디터 초기화 - 콘텐츠 설정")
                contentsEditor.commands.setContent(contents)
            }, 0)
        }
    }, [contentsEditor, contents])

    // 툴바의 업로드 이미지 명령에 구글 드라이브 이미지 테스트 추가
    useEffect(() => {
        if (contentsEditor) {
            // 테스트용 버튼을 콘솔로 추가
            console.log("구글 드라이브 이미지 테스트 버튼 추가")

            // 구글 드라이브 버튼 클릭 함수 정의
            window._testGoogleDriveImage = (): void => {
                console.log("구글 드라이브 이미지 테스트 실행")
                // 구글 드라이브 이미지 추가 시도
                if (contentsEditor) {
                    // 구글 드라이브 이미지 확장 존재 여부 확인
                    const hasExtension = contentsEditor.extensionManager.extensions.some(
                        (ext) => ext.name === "googleDriveImage",
                    )
                    console.log("구글 드라이브 이미지 확장 존재:", hasExtension)

                    // 현재 에디터 상태 확인
                    console.log("현재 에디터 상태:", contentsEditor.getJSON())

                    // 이미지 삽입 실행 (백엔드 프록시 사용)
                    console.log("백엔드 프록시를 사용하여 이미지 삽입 시도")
                    const result = contentsEditor.commands.setGoogleDriveImage({
                        src: "https://drive.google.com/file/d/1lA4in2HV_-lNAnG4bVhhBE0Z1Fhc9eNL/view",
                        alt: "수동 테스트 이미지",
                    })
                    console.log("이미지 삽입 결과:", result)

                    // 삽입 후 상태 확인
                    setTimeout(() => {
                        console.log("삽입 후 에디터 상태:", contentsEditor.getJSON())
                    }, 100)
                }
            }

            // 콘솔 사용 안내
            console.log("콘솔에서 다음 명령어로 테스트: window._testGoogleDriveImage()")
        }
    }, [contentsEditor])

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
