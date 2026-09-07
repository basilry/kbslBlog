import { ReactElement, useState } from "react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { optimizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"

interface ImagePreviewProps {
    src: string
    originalSrc: string
    alt: string
}

const ImagePreview = ({ src, originalSrc, alt }: ImagePreviewProps): ReactElement => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    return (
        <NodeViewWrapper className="google-drive-image-view">
            {loading && <div className="loading-indicator">로딩 중...</div>}
            {error ? (
                <div className="error-message">
                    <p>이미지를 불러올 수 없습니다.</p>
                    <a
                        href={originalSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", textDecoration: "underline", fontSize: "14px" }}
                    >
                        원본 이미지 보기
                    </a>
                </div>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element -- TipTap image node views must render the editor node as an img.
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false)
                        setError(true)
                    }}
                    style={{ maxWidth: "100%", height: "auto", display: loading ? "none" : "block" }}
                />
            )}
        </NodeViewWrapper>
    )
}

const GoogleDriveImageView = ({ node }: NodeViewProps): ReactElement => {
    const originalSrc = typeof node.attrs.src === "string" ? node.attrs.src : ""
    const src = optimizeGoogleDriveImageUrl(originalSrc)

    return <ImagePreview key={src} src={src} originalSrc={originalSrc} alt={node.attrs.alt || "구글 드라이브 이미지"} />
}

export default GoogleDriveImageView
