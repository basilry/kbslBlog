import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { optimizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"
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
                    if (
                        src.includes("drive.google.com") ||
                        src.includes("googleusercontent.com") ||
                        src.includes("/proxy/")
                    ) {
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
        // URL 최적화
        const optimizedAttributes = { ...HTMLAttributes }
        if (optimizedAttributes.src) {
            try {
                // 프록시 URL 처리
                if (optimizedAttributes.src.includes("/proxy/")) {
                    // 이미 전체 URL을 포함하고 있는지 확인
                    if (!optimizedAttributes.src.startsWith("http")) {
                        optimizedAttributes.src = `${process.env.NEXT_PUBLIC_IP}${optimizedAttributes.src}`
                    }
                } else {
                    optimizedAttributes.src = optimizeGoogleDriveImageUrl(optimizedAttributes.src)
                }
            } catch (error) {
                console.error("URL 최적화 오류:", error)
            }
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
                    try {
                        // 백엔드 프록시 URL로 변환
                        const proxyUrl = optimizeGoogleDriveImageUrl(options.src)
                        console.log("구글 드라이브 이미지 삽입, 프록시 URL:", proxyUrl)

                        // HTML 삽입 (백엔드 프록시 URL 포함)
                        const imgHTML = `<img src="${proxyUrl}" alt="${options.alt || ""}" class="google-drive-image" />`
                        return chain().focus().insertContent(imgHTML).run()
                    } catch (error) {
                        console.error("구글 드라이브 이미지 삽입 오류:", error)
                        return false
                    }
                },
        }
    },
})
