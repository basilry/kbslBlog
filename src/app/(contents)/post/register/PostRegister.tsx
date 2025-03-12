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
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore } from "@lib/stores/store"
import { extractBase64Images } from "@lib/utils/common"
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

const PostRegister = ({ setEdit, originPostData = initialPostData }: IPostRegisterProps): ReactElement => {
    const { darkMode } = useCoreStore()

    const router = useRouter()

    const [postData, setPostData] = useState<IPost>(originPostData)

    const handleSubmit = async (): Promise<void> => {
        const base64Images = extractBase64Images(postData.content)
        let contentHtml = postData.content

        if (base64Images.length > 0) {
            contentHtml = await uploadMultiFile(contentHtml, base64Images)
        }

        let thumbnailUrl = postData.thumbnail

        if (thumbnailUrl.startsWith("data:image/")) {
            const uploadedThumbnailUrl = await uploadSingleImage(thumbnailUrl)
            if (uploadedThumbnailUrl) {
                thumbnailUrl = uploadedThumbnailUrl
            } else {
                toastCall("썸네일 이미지 업로드에 실패했습니다.", "error")
                return // 썸네일 업로드 실패 시 중단
            }
        }

        const finalPostData = { ...postData, thumbnail: thumbnailUrl, content: contentHtml }

        if (postData.id === 0) {
            registerPost(finalPostData)
        } else {
            updatePost(finalPostData)
        }
    }

    const uploadSingleImage = async (base64Image: string): Promise<string | null> => {
        try {
            const response = await axiosInstance.post("/google-drive/upload", { base64Image })
            return response.data.data
        } catch (error) {
            toastCall("이미지 업로드 중 오류가 발생했습니다.", "error")
            return null
        }
    }

    const uploadMultiFile = async (contentHtml: string, base64Images: string[]): Promise<string> => {
        try {
            const response = await axiosInstance.post("/google-drive/upload-multi", { base64Images })
            const urls: string[] = response.data.data

            urls.forEach((url, idx) => {
                contentHtml = contentHtml.replace(base64Images[idx], url)
            })

            return contentHtml
        } catch (error) {
            toastCall("이미지 업로드 중 오류가 발생했습니다.", "error")
            return contentHtml
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
                        thumbnail={postData.thumbnail}
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
