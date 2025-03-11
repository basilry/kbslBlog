import { ChangeEvent, ReactElement, useRef, useState } from "react"
import Image from "next/image"
import classNames from "classnames"
import styles from "@styles/components/template/editor/thumbnail.module.scss"

interface ThumbnailUploaderProps {
    thumbnail: string
    onChangeThumbnail: (thumbnail: string) => void
}

const ThumbnailUploader = ({ thumbnail, onChangeThumbnail }: ThumbnailUploaderProps): ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0]
        if (!file) return

        // 이미지 파일 타입 검증
        if (!file.type.match("image.*")) {
            alert("이미지 파일만 업로드 가능합니다.")
            return
        }

        const reader = new FileReader()
        reader.onload = (e): void => {
            const result = e.target?.result as string
            onChangeThumbnail(result)
        }
        reader.readAsDataURL(file)
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

        const reader = new FileReader()
        reader.onload = (e): void => {
            const result = e.target?.result as string
            onChangeThumbnail(result)
        }
        reader.readAsDataURL(file)
    }

    const handleRemove = (): void => {
        onChangeThumbnail("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className={styles.thumbnailUploaderContainer}>
            <div
                className={classNames(styles.thumbnailUploader, { [styles.dragging]: isDragging })}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {thumbnail ? (
                    <div className={styles.thumbnailPreviewContainer}>
                        <Image
                            src={thumbnail}
                            alt="썸네일 미리보기"
                            className={styles.thumbnailPreview}
                            fill
                            style={{ objectFit: "cover" }}
                        />
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
                ) : (
                    <div className={styles.uploadPlaceholder}>
                        <Image src={"/plus.svg"} alt={"plus"} width={47} height={47} />
                        <p>썸네일 이미지를 업로드해주세요</p>
                        <p className={styles.subText}>클릭하거나 파일을 끌어다 놓으세요</p>
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
