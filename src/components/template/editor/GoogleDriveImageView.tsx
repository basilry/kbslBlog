import { useState, ReactElement, useEffect } from "react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { optimizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"

// 구글 드라이브 이미지 뷰 컴포넌트
const GoogleDriveImageView = (props: NodeViewProps): ReactElement => {
    const { node } = props
    const [src, setSrc] = useState<string>(node.attrs.src || "")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // 초기 렌더링 시에만 이미지 URL 최적화
    useEffect(() => {
        console.log("노드 속성:", node.attrs)
        console.log("원본 이미지 URL:", node.attrs.src)

        try {
            // 프록시 URL 확인
            if (node.attrs.src.includes("/proxy/")) {
                // URL 중복 방지: 이미 전체 URL을 포함하고 있는지 확인
                if (node.attrs.src.startsWith("http")) {
                    console.log("이미 전체 URL 포함:", node.attrs.src)
                    setSrc(node.attrs.src)
                } else {
                    const fullUrl = `${process.env.NEXT_PUBLIC_IP}${node.attrs.src}`
                    console.log("프록시 URL 사용:", fullUrl)
                    setSrc(fullUrl)
                }
                return
            }

            // 이미지 URL을 백엔드 프록시 URL로 변환
            const optimizedSrc = optimizeGoogleDriveImageUrl(node.attrs.src)
            console.log("프록시 URL:", optimizedSrc)
            setSrc(optimizedSrc)
        } catch (err) {
            console.error("이미지 URL 최적화 오류:", err)
            setError(true)
        }
    }, [node.attrs.src])

    console.log("현재 이미지 상태:", { src, loading, error })

    return (
        <NodeViewWrapper className="google-drive-image-view">
            {loading && <div className="loading-indicator">로딩 중...</div>}

            {error ? (
                <div className="error-message">
                    <p>이미지를 불러올 수 없습니다.</p>
                    <a
                        href={node.attrs.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "14px",
                        }}
                    >
                        원본 이미지 보기
                    </a>
                </div>
            ) : (
                <img
                    key={src} // URL이 변경될 때 이미지 요소를 강제로 리렌더링
                    src={src}
                    alt={node.attrs.alt || "구글 드라이브 이미지"}
                    onLoad={() => {
                        console.log("이미지 로드 성공:", src)
                        setLoading(false)
                    }}
                    onError={(e) => {
                        console.error("이미지 로드 실패:", src, e)
                        setLoading(false)
                        setError(true)
                    }}
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: loading ? "none" : "block",
                    }}
                />
            )}
        </NodeViewWrapper>
    )
}

export default GoogleDriveImageView
