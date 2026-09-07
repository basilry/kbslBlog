import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { isGoogleDriveImage, isManagedImageUrl, optimizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"
import GoogleDriveImageView from "./GoogleDriveImageView"

export interface GoogleDriveImageOptions {
    HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        googleDriveImage: {
            /**
             * 구글 드라이브 이미지 추가
             */
            setGoogleDriveImage: (options: { src: string; alt?: string }) => ReturnType
        }
    }
}

export const GoogleDriveImageExtension = Node.create<GoogleDriveImageOptions>({
    name: "googleDriveImage",

    // 일반 이미지와 동일한 spec으로 변경
    inline: true,
    group: "inline",
    draggable: true,
    selectable: true,
    content: "",

    // 이미지보다 더 높은 우선순위 설정
    priority: 100,

    // 기본 옵션
    addOptions() {
        return {
            HTMLAttributes: {
                class: "google-drive-image",
            },
        }
    },

    // 기본 속성
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        }
    },

    // HTML 파싱 규칙
    parseHTML() {
        return [
            {
                // 구글 드라이브 URL을 가진 이미지 태그 선택
                tag: "img",
                getAttrs: (node): false | { src: string; alt: string | null; title: string | null } => {
                    // 노드가 문자열인 경우 처리
                    if (typeof node === "string") return false

                    // 실제 DOM 노드로 변환
                    const dom = node as HTMLElement
                    const src = dom.getAttribute("src")

                    // src 속성이 없으면 무시
                    if (!src) return false

                    // 구글 드라이브 이미지인지 확인
                    if (isGoogleDriveImage(src) || isManagedImageUrl(src)) {
                        return {
                            src,
                            alt: dom.getAttribute("alt"),
                            title: dom.getAttribute("title"),
                        }
                    }

                    return false
                },
            },
        ]
    },

    // HTML 렌더링 방식 - 백엔드 프록시 사용
    renderHTML({ HTMLAttributes }) {
        const optimizedAttributes = { ...HTMLAttributes }
        if (optimizedAttributes.src) {
            optimizedAttributes.src = optimizeGoogleDriveImageUrl(optimizedAttributes.src)
        }

        // 일반 img 태그로 렌더링
        return ["img", mergeAttributes(this.options.HTMLAttributes, optimizedAttributes)]
    },

    // 간소화된 노드 뷰
    addNodeView() {
        return ReactNodeViewRenderer(GoogleDriveImageView)
    },

    // 명령어 정의 - 프록시 URL 사용
    addCommands() {
        return {
            setGoogleDriveImage:
                (options) =>
                ({ chain }): boolean => {
                    const proxyUrl = optimizeGoogleDriveImageUrl(options.src)
                    return chain()
                        .focus()
                        .insertContent({ type: this.name, attrs: { ...options, src: proxyUrl } })
                        .run()
                },
        }
    },
})
