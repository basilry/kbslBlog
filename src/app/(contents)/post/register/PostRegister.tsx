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

    const registerPost = (): void => {
        axiosInstance
            .post("/posts", postData)
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

    const updatePost = (): void => {
        axiosInstance
            .put(`/posts/${postData.id}`, postData)
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
                            onClick={() => (setEdit ? updatePost() : registerPost())}
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
