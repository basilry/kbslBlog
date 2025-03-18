import { ChangeEvent, ReactElement, useEffect, useRef, useState, ClipboardEvent } from "react"
import Cropper from "react-easy-crop"
import Image from "next/image"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/components/template/editor/thumbnail.module.scss"

interface ThumbnailUploaderProps {
    thumbnail?: string | File
    onChangeThumbnail: (thumbnail: File | string) => void
}

// 구글 드라이브 이미지 URL인지 확인하는 함수
const isGoogleDriveImage = (url: string): boolean => {
    return url.includes("drive.google.com") || url.includes("googleusercontent.com")
}

// 이미지 크롭 결과를 File 객체로 변환하는 함수
const getCroppedImg = async (
    imageSrc: string,
    crop: { x: number; y: number; width: number; height: number },
): Promise<File> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
        throw new Error("Could not get canvas context")
    }

    // 캔버스 크기 설정
    canvas.width = crop.width
    canvas.height = crop.height

    // 이미지 그리기
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

    // 캔버스를 Blob으로 변환
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"))
                return
            }

            // File 객체 생성
            const file = new File([blob], "cropped-image.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
            })
            resolve(file)
        }, "image/jpeg")
    })
}

// 이미지 로드 헬퍼 함수
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image()
        image.addEventListener("load", () => resolve(image))
        image.addEventListener("error", (error: Event) => reject(error))
        image.crossOrigin = "anonymous" // CORS 문제 해결을 위해 추가
        image.src = url
    })

const ThumbnailUploader = ({ thumbnail = "", onChangeThumbnail }: ThumbnailUploaderProps): ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const urlInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
    const [urlValue, setUrlValue] = useState<string>("")

    // 크롭 관련 상태
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropMode, setCropMode] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [imageToEdit, setImageToEdit] = useState<string>("")

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
        setImageToEdit(tempUrl)
        setCropMode(true)
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
        setImageToEdit(tempUrl)
        setCropMode(true)
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
                    setImageToEdit(tempUrl)
                    setCropMode(true)
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

    // 크롭 완료 시 호출되는 함수
    const onCropComplete = (_: any, croppedAreaPixelsObj: any): void => {
        setCroppedAreaPixels(croppedAreaPixelsObj)
    }

    // 크롭 적용
    const handleCropApply = async (): Promise<void> => {
        try {
            if (!imageToEdit || !croppedAreaPixels) return

            const croppedImage = await getCroppedImg(imageToEdit, croppedAreaPixels)

            // 이전 이미지 URL 해제
            if (imageToEdit.startsWith("blob:")) {
                URL.revokeObjectURL(imageToEdit)
            }

            // 이전 프리뷰 URL도 해제
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
            }

            const croppedImageUrl = URL.createObjectURL(croppedImage)
            setPreviewUrl(croppedImageUrl)
            onChangeThumbnail(croppedImage)
            setCropMode(false)
        } catch (e) {
            console.error("Error cropping image:", e)
            alert("이미지 크롭 중 오류가 발생했습니다.")
            setCropMode(false) // 오류 발생시에도 크롭 모드 종료
        }
    }

    // 크롭 취소
    const handleCropCancel = (): void => {
        if (imageToEdit.startsWith("blob:")) {
            URL.revokeObjectURL(imageToEdit)
        }
        setCropMode(false)
    }

    // cleanup effect
    useEffect(() => {
        return () => {
            if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
            }
            if (imageToEdit && imageToEdit.startsWith("blob:")) {
                URL.revokeObjectURL(imageToEdit)
            }
        }
    }, [previewUrl, imageToEdit])

    // 구글 드라이브 이미지인지 확인
    const isGoogleDrive = typeof previewUrl === "string" && isGoogleDriveImage(previewUrl)

    // URL이 blob인지 확인
    const isBlobUrl = typeof previewUrl === "string" && previewUrl.startsWith("blob:")

    return (
        <div className={styles.thumbnailUploaderContainer}>
            {cropMode ? (
                <div className={styles.cropContainer}>
                    <div className={styles.cropperWrapper}>
                        <Cropper
                            image={imageToEdit}
                            crop={crop}
                            zoom={zoom}
                            aspect={16 / 9}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className={styles.cropControls}>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className={styles.zoomSlider}
                        />
                        <div className={styles.cropButtons}>
                            <button type="button" className={styles.cropButton} onClick={handleCropApply}>
                                적용
                            </button>
                            <button type="button" className={styles.cropCancelButton} onClick={handleCropCancel}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
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
                            {isBlobUrl ? (
                                // blob URL인 경우 직접 URL 사용
                                <Image
                                    src={previewUrl}
                                    alt="썸네일 미리보기"
                                    className={styles.thumbnailPreview}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            ) : isGoogleDrive ? (
                                // 구글 드라이브 이미지인 경우 프록시 URL 사용
                                <Image
                                    src={
                                        previewUrl.startsWith("http")
                                            ? previewUrl
                                            : `${process.env.NEXT_PUBLIC_IP}${previewUrl}`
                                    }
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
                                    src={
                                        previewUrl.startsWith("http")
                                            ? previewUrl
                                            : `${process.env.NEXT_PUBLIC_IP}${previewUrl}`
                                    }
                                    alt="썸네일 미리보기"
                                    className={styles.thumbnailPreview}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            )}
                            <div className={styles.previewControls}>
                                <button
                                    type="button"
                                    className={styles.editButton}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // 로컬 이미지가 아니어도 편집 가능하도록 수정
                                        try {
                                            // Blob URL인 경우 직접 사용
                                            if (isBlobUrl) {
                                                setImageToEdit(previewUrl)
                                                setCropMode(true)
                                                return
                                            }

                                            // 이미지를 새로 로드하여 편집
                                            const imageUrl = previewUrl.startsWith("http")
                                                ? previewUrl
                                                : `${process.env.NEXT_PUBLIC_IP}${previewUrl}`

                                            fetch(imageUrl)
                                                .then((response) => {
                                                    if (!response.ok) {
                                                        throw new Error(`HTTP 오류: ${response.status}`)
                                                    }
                                                    return response.blob()
                                                })
                                                .then((blob) => {
                                                    const newTempUrl = URL.createObjectURL(blob)
                                                    setImageToEdit(newTempUrl)
                                                    setCropMode(true)
                                                })
                                                .catch((error) => {
                                                    console.error("이미지 가져오기 실패:", error)
                                                    alert("이미지를 불러올 수 없습니다.")
                                                })
                                        } catch (error) {
                                            console.error("이미지 로드 중 오류:", error)
                                            alert("이미지를 불러올 수 없습니다.")
                                        }
                                    }}
                                >
                                    편집
                                </button>
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
                            <TextBasic size="medium" bold="bold">
                                썸네일 이미지를 업로드해주세요
                            </TextBasic>
                            <TextBasic size="x-small">클릭하거나 파일을 끌어다 놓으세요</TextBasic>
                            <TextBasic size="x-small">
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
                            </TextBasic>
                            <TextBasic size="x-small">구글 드라이브 이미지 URL도 사용 가능합니다</TextBasic>
                            <TextBasic size="x-small">이미지를 복사한 후 Ctrl+V로 붙여넣을 수도 있습니다</TextBasic>
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
            )}
        </div>
    )
}

export default ThumbnailUploader
