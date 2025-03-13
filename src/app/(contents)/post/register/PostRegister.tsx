"use client"

import { ReactElement, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import Image from "next/image"
import ButtonBasic from "@components/atom/ButtonBasic"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import Editor from "@components/template/editor/Editor"
import { IPost } from "@interface/IPost"
import { axiosInstance, axiosInstanceMultipart } from "@lib/api/axiosInstance"
import { useCoreStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/postNew.module.scss"

const initialPostData: IPost = {
    id: 0,
    title: "",
    thumbnail: "",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
}

interface IPostRegisterProps {
    setEdit?: (edit: boolean) => void
    originPostData?: IPost
}

interface ExtractedImages {
    files: File[]
    tempUrls: string[]
}

const PostRegister = ({ setEdit, originPostData = initialPostData }: IPostRegisterProps): ReactElement => {
    const { darkMode } = useCoreStore()

    const router = useRouter()

    const [postData, setPostData] = useState<IPost>(originPostData)
    console.log(postData)

    // Editor에서 생성된 임시 URL과 File 객체를 저장하는 Map
    const imageFileMap = new Map<string, File>()

    const extractImagesFromContent = (content: string): ExtractedImages => {
        const tempUrls: string[] = []
        const files: File[] = []

        // blob: 로 시작하는 임시 URL을 찾기 위한 정규식
        const blobUrlRegex = /blob:http[s]?:\/\/[^\s"']+/g
        const matches = content.match(blobUrlRegex) || []

        matches.forEach((tempUrl) => {
            const file = imageFileMap.get(tempUrl)
            if (file) {
                tempUrls.push(tempUrl)
                files.push(file)
            }
        })

        return { files, tempUrls }
    }

    // base64 이미지를 추출하는 함수 추가
    const extractBase64ImagesFromContent = (
        content: string,
    ): { base64Images: string[]; contentWithPlaceholders: string } => {
        const base64Images: string[] = []
        let contentWithPlaceholders = content

        // base64 이미지를 찾기 위한 정규식
        const base64Regex = /src="data:image\/(jpeg|jpg|png|gif|webp);base64,([^"]+)"/g
        let match
        let index = 0

        while ((match = base64Regex.exec(content)) !== null) {
            const fullMatch = match[0]
            const base64Data = match[2]
            const mimeType = match[1]
            const base64Image = `data:image/${mimeType};base64,${base64Data}`

            // 고유 플레이스홀더 생성
            const placeholder = `__IMAGE_PLACEHOLDER_${index}__`

            // 이미지 데이터 저장
            base64Images.push(base64Image)

            // 원본 콘텐츠에서 base64 이미지를 플레이스홀더로 대체
            contentWithPlaceholders = contentWithPlaceholders.replace(fullMatch, `src="${placeholder}"`)

            index++
        }

        return { base64Images, contentWithPlaceholders }
    }

    // 외부 이미지 URL을 추출하는 함수 추가
    const extractExternalImagesFromContent = (
        content: string,
    ): { externalUrls: string[]; contentWithPlaceholders: string } => {
        const externalUrls: string[] = []
        let contentWithPlaceholders = content

        // 외부 이미지 URL을 찾기 위한 정규식 (data:image와 blob: 제외)
        const externalUrlRegex = /<img[^>]+src="((?!data:image)(?!blob:)[^"]+)"[^>]*>/g
        let match
        let index = 0

        while ((match = externalUrlRegex.exec(content)) !== null) {
            const fullMatch = match[0]
            const imageUrl = match[1]

            // 이미 구글 드라이브 URL인 경우 건너뛰기
            if (imageUrl.includes("drive.google.com")) {
                continue
            }

            // 고유 플레이스홀더 생성
            const placeholder = `__EXTERNAL_IMAGE_PLACEHOLDER_${index}__`

            // 이미지 URL 저장
            externalUrls.push(imageUrl)

            // 원본 콘텐츠에서 외부 이미지 URL을 플레이스홀더로 대체
            contentWithPlaceholders = contentWithPlaceholders.replace(
                fullMatch,
                fullMatch.replace(imageUrl, placeholder),
            )

            index++
        }

        return { externalUrls, contentWithPlaceholders }
    }

    const uploadSingleFile = async (file: File | string): Promise<string | null> => {
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await axiosInstanceMultipart.post("/file/single", formData)
            return response.data.data.fileUrl
        } catch (error) {
            toastCall("이미지 업로드 중 오류가 발생했습니다.", "error")
            return null
        }
    }

    const uploadMultiFile = async (contentHtml: string, files: File[]): Promise<string> => {
        try {
            // 파일들을 base64로 변환
            const base64Images: string[] = []
            const tempUrls: string[] = []

            // 각 파일의 임시 URL 생성 및 base64 변환
            for (const file of files) {
                const tempUrl = URL.createObjectURL(file)
                tempUrls.push(tempUrl)

                // 파일을 base64로 변환
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = (): void => resolve(reader.result as string)
                    reader.onerror = (): void => reject(new Error("파일 읽기 실패"))
                    reader.readAsDataURL(file)
                })

                base64Images.push(base64)
            }

            // 서버로 base64 이미지 배열 전송
            const response = await axiosInstance.post("/file/base64-multi", {
                images: base64Images,
            })

            const urls: string[] = response.data.data

            // 임시 URL을 실제 업로드된 URL로 교체
            tempUrls.forEach((tempUrl, idx) => {
                if (urls[idx]) {
                    contentHtml = contentHtml.replace(tempUrl, urls[idx])
                }
            })

            return contentHtml
        } catch (error) {
            toastCall("이미지 업로드 중 오류가 발생했습니다.", "error")
            return contentHtml
        }
    }

    const handleSubmit = async (): Promise<void> => {
        // 기존 blob URL 이미지 처리
        const { files } = extractImagesFromContent(postData.content)
        let contentHtml = postData.content

        if (files.length > 0) {
            contentHtml = await uploadMultiFile(contentHtml, files)
        }

        // base64 이미지 처리
        const { base64Images, contentWithPlaceholders } = extractBase64ImagesFromContent(contentHtml)
        let updatedContent = contentWithPlaceholders

        if (base64Images.length > 0) {
            try {
                // base64 문자열을 직접 서버로 전송
                const response = await axiosInstance.post("/file/base64-multi", {
                    images: base64Images,
                })
                const urls: string[] = response.data.data

                // 플레이스홀더를 실제 URL로 대체
                urls.forEach((url, index) => {
                    updatedContent = updatedContent.replace(`__IMAGE_PLACEHOLDER_${index}__`, url)
                })
            } catch (error) {
                toastCall("이미지 업로드 중 오류가 발생했습니다.", "error")
            }
        }

        // 외부 이미지 URL 처리
        const { externalUrls, contentWithPlaceholders: externalContentWithPlaceholders } =
            extractExternalImagesFromContent(updatedContent)
        updatedContent = externalContentWithPlaceholders

        if (externalUrls.length > 0) {
            try {
                // 외부 URL을 직접 서버로 전송
                const response = await axiosInstance.post("/file/external-urls", {
                    urls: externalUrls,
                })
                const urls: string[] = response.data.data

                // 플레이스홀더를 실제 URL로 대체
                urls.forEach((url, index) => {
                    updatedContent = updatedContent.replace(`__EXTERNAL_IMAGE_PLACEHOLDER_${index}__`, url)
                })
            } catch (error) {
                toastCall("외부 이미지 업로드 중 오류가 발생했습니다.", "error")
            }
        }

        // 썸네일 처리 (uploadSingleFile 사용)
        const thumbnailFile = postData.thumbnail
        let thumbnailUrl = typeof thumbnailFile === "string" ? thumbnailFile : ""

        if (thumbnailFile && typeof thumbnailFile !== "string") {
            const uploadedUrl = await uploadSingleFile(thumbnailFile)
            if (uploadedUrl) {
                thumbnailUrl = uploadedUrl
            } else {
                toastCall("썸네일 이미지 업로드에 실패했습니다.", "error")
                return
            }
        }

        const finalPostData = { ...postData, thumbnail: thumbnailUrl, content: updatedContent }

        if (postData.id === 0) {
            registerPost(finalPostData)
        } else {
            updatePost(finalPostData)
        }
    }

    const registerPost = (finalPost: IPost): void => {
        axiosInstance
            .post("/posts", finalPost)
            .then((res) => {
                if (res.data.code === 200) {
                    router.replace(`/post/${res.data.data.id}`)
                    toastCall("글이 성공적으로 저장되었습니다.", "success")
                }
            })
            .catch(() => {
                toastCall("글 저장에 실패했습니다.", "error")
            })
    }

    const updatePost = (finalPost: IPost): void => {
        axiosInstance
            .put(`/posts/${postData.id}`, finalPost)
            .then((res) => {
                if (res.data.code === 200) {
                    setEdit?.(false)
                    toastCall("글이 성공적으로 수정되었습니다.", "success")
                }
            })
            .catch(() => {
                toastCall("글 수정에 실패했습니다.", "error")
            })
    }

    return (
        <Wrapper>
            <div className={styles.postNewWrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.backBtn}>
                        <Image
                            src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                            alt={"arrowback"}
                            width={25}
                            height={25}
                            onClick={() => router.back()}
                        />
                    </div>
                    <TextBasic className={styles.title} size="xx-large" bold="bold">
                        {"새 글 쓰기"}
                    </TextBasic>
                    <div className={styles.btnGroupWrapper}>
                        <ButtonBasic
                            buttonWrapperStyle={styles.btnWrapper}
                            type={"reset"}
                            fontSize={"small"}
                            onClick={() => router.back()}
                            label={"취소하기"}
                        />
                        <ButtonBasic
                            buttonWrapperStyle={styles.btnWrapper}
                            type={""}
                            fontSize={"small"}
                            onClick={() => handleSubmit()}
                            label={"저장하기"}
                        />
                    </div>
                </div>
                <br />
                <LineBasic />
                <br />
                <div className={styles.tiptapWrapper}>
                    <Editor
                        title={postData.title}
                        contents={postData.content}
                        onChangeTitle={(title) => setPostData({ ...postData, title })}
                        onChangeContents={(content) => setPostData({ ...postData, content })}
                        onChangeThumbnail={(thumbnail) => setPostData({ ...postData, thumbnail })}
                    />
                </div>
            </div>
        </Wrapper>
    )
}

export default PostRegister
