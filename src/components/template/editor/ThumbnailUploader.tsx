import { ChangeEvent, ReactElement, useEffect, useRef, useState, ClipboardEvent } from "react"
import Image from "next/image"
import classNames from "classnames"
import styles from "@styles/components/template/editor/thumbnail.module.scss"

interface ThumbnailUploaderProps {
    thumbnail?: string | File
    onChangeThumbnail: (thumbnail: File | string) => void
}

// 구글 드라이브 이미지 URL인지 확인하는 함수
const isGoogleDriveImage = (url: string): boolean => {
    console.log(url, url.includes("drive.google.com"))
    return url.includes("drive.google.com") || url.includes("googleusercontent.com")
}

const ThumbnailUploader = ({ thumbnail = "", onChangeThumbnail }: ThumbnailUploaderProps): ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const urlInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
    const [urlValue, setUrlValue] = useState<string>("")
    const [previewUrl, setPreviewUrl] = useState<string>(() => {
        if (thumbnail && typeof thumbnail === "string") {
            return thumbnail
        }
        if (thumbnail && thumbnail instanceof File) {
            return URL.createObjectURL(thumbnail)
        }
        return ""
    })

    // 썸네일이 변경될 때 previewUrl 업데이트
    useEffect(() => {
        if (thumbnail && typeof thumbnail === "string" && thumbnail !== previewUrl) {
            setPreviewUrl(thumbnail)
        } else if (thumbnail && thumbnail instanceof File && previewUrl === "") {
            setPreviewUrl(URL.createObjectURL(thumbnail))
        }
    }, [thumbnail, previewUrl])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.match("image.*")) {
            alert("이미지 파일만 업로드 가능합니다.")
            return
        }

        const tempUrl = URL.createObjectURL(file)
        setPreviewUrl(tempUrl)
        onChangeThumbnail(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (): void => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (!file) return

        if (!file.type.match("image.*")) {
            alert("이미지 파일만 업로드 가능합니다.")
            return
        }

        const tempUrl = URL.createObjectURL(file)
        setPreviewUrl(tempUrl)
        onChangeThumbnail(file)
    }

    const handleRemove = (): void => {
        if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl("")
        onChangeThumbnail("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        setUrlValue("")
    }

    // 클립보드에서 이미지 붙여넣기 처리
    const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
        const items = e.clipboardData.items

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile()
                if (file) {
                    const tempUrl = URL.createObjectURL(file)
                    setPreviewUrl(tempUrl)
                    onChangeThumbnail(file)
                    return
                }
            }
        }
    }

    // URL 입력 처리
    const handleUrlSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        if (!urlValue) return

        // URL 유효성 검사
        try {
            new URL(urlValue)
            setPreviewUrl(urlValue)
            onChangeThumbnail(urlValue)
            setShowUrlInput(false)
        } catch (error) {
            alert("유효한 URL을 입력해주세요.")
        }
    }

    // cleanup effect
    useEffect(() => {
        return () => {
            if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    // 구글 드라이브 이미지인지 확인
    const isGoogleDrive = typeof previewUrl === "string" && isGoogleDriveImage(previewUrl)

    console.log(isGoogleDrive)

    return (
        <div className={styles.thumbnailUploaderContainer}>
            <div
                className={classNames(styles.thumbnailUploader, { [styles.dragging]: isDragging })}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !showUrlInput && fileInputRef.current?.click()}
                onPaste={handlePaste}
                tabIndex={0} // 키보드 이벤트를 받기 위해 필요
            >
                {previewUrl ? (
                    <div className={styles.thumbnailPreviewContainer}>
                        {isGoogleDrive ? (
                            // 구글 드라이브 이미지인 경우 Next.js Image 컴포넌트 사용
                            <Image
                                src={previewUrl}
                                alt="썸네일 미리보기"
                                className={styles.thumbnailPreview}
                                fill
                                style={{ objectFit: "cover" }}
                                placeholder="blur"
                                blurDataURL="/image.svg"
                            />
                        ) : (
                            // 일반 이미지인 경우
                            <Image
                                src={previewUrl}
                                alt="썸네일 미리보기"
                                className={styles.thumbnailPreview}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        )}
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove()
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : showUrlInput ? (
                    <div className={styles.urlInputContainer} onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleUrlSubmit}>
                            <input
                                ref={urlInputRef}
                                type="text"
                                placeholder="이미지 URL을 입력하세요 (구글 드라이브 URL 가능)"
                                value={urlValue}
                                onChange={(e) => setUrlValue(e.target.value)}
                                className={styles.urlInput}
                                autoFocus
                            />
                            <div className={styles.urlButtonGroup}>
                                <button type="submit" className={styles.urlSubmitButton}>
                                    확인
                                </button>
                                <button
                                    type="button"
                                    className={styles.urlCancelButton}
                                    onClick={() => setShowUrlInput(false)}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className={styles.uploadPlaceholder}>
                        <Image src={"/plus.svg"} alt={"plus"} width={47} height={47} />
                        <p>썸네일 이미지를 업로드해주세요</p>
                        <p className={styles.subText}>클릭하거나 파일을 끌어다 놓으세요</p>
                        <p className={styles.subText}>
                            또는{" "}
                            <button
                                type="button"
                                className={styles.urlButton}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowUrlInput(true)
                                }}
                            >
                                URL 입력
                            </button>
                        </p>
                        <p className={styles.subText}>구글 드라이브 이미지 URL도 사용 가능합니다</p>
                        <p className={styles.subText}>이미지를 복사한 후 Ctrl+V로 붙여넣을 수도 있습니다</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>
        </div>
    )
}

export default ThumbnailUploader
