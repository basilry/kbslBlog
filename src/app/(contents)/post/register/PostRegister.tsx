"use client"

import { ReactElement, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { clearPostDraft, readPostDraft, toRecoverablePostDraft, writePostDraft } from "./postDraft"
import { ImageUploadCache, PostImageUploadError, preparePostContent } from "./postPublishing"

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
    const [draftReady, setDraftReady] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const postDataRef = useRef(postData)
    const latestContentRef = useRef(postData.content)
    const isSubmittingRef = useRef(false)
    const imageUploadCacheRef = useRef<ImageUploadCache>(new Map())
    const thumbnailUploadCacheRef = useRef<WeakMap<File, string>>(new WeakMap())

    const updatePostData = useCallback((update: (current: IPost) => IPost): void => {
        const next = update(postDataRef.current)
        postDataRef.current = next
        setPostData(next)
    }, [])

    const persistDraft = useCallback((): void => {
        if (typeof window === "undefined") return

        try {
            const originThumbnail = typeof originPostData.thumbnail === "string" ? originPostData.thumbnail : ""
            writePostDraft(window.localStorage, toRecoverablePostDraft(postDataRef.current, originThumbnail))
        } catch (error) {
            console.error("임시 저장에 실패했습니다:", error)
        }
    }, [originPostData.thumbnail])

    useEffect(() => {
        const draft = readPostDraft(window.localStorage, originPostData.id)
        const originUpdatedAt = new Date(originPostData.updatedAt).getTime()
        const draftSavedAt = draft ? new Date(draft.savedAt).getTime() : 0
        const shouldRestore =
            draft &&
            (originPostData.id === 0 || !Number.isFinite(originUpdatedAt) || draftSavedAt > originUpdatedAt) &&
            (draft.title !== originPostData.title ||
                draft.content !== originPostData.content ||
                draft.thumbnail !== originPostData.thumbnail)

        if (shouldRestore) {
            const restoredPost = {
                ...originPostData,
                title: draft.title,
                content: draft.content,
                thumbnail: draft.thumbnail,
            }
            postDataRef.current = restoredPost
            latestContentRef.current = restoredPost.content
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the external localStorage draft after client hydration.
            setPostData(restoredPost)
            toastCall("임시 저장된 글을 복구했습니다.", "success")
        }

        setDraftReady(true)
    }, [originPostData])

    useEffect(() => {
        if (!draftReady) return
        const timeout = window.setTimeout(persistDraft, 500)
        return () => window.clearTimeout(timeout)
    }, [draftReady, persistDraft, postData])

    useEffect(() => {
        if (!draftReady) return
        window.addEventListener("beforeunload", persistDraft)
        return () => window.removeEventListener("beforeunload", persistDraft)
    }, [draftReady, persistDraft])

    const uploadSingleFile = async (file: File): Promise<string> => {
        const cachedUrl = thumbnailUploadCacheRef.current.get(file)
        if (cachedUrl) return cachedUrl

        const formData = new FormData()
        formData.append("file", file)
        const response = await axiosInstanceMultipart.post("/file/single", formData)
        const uploadedUrl = response.data?.data?.fileUrl

        if (typeof uploadedUrl !== "string" || uploadedUrl.length === 0) {
            throw new PostImageUploadError("썸네일 이미지 업로드 결과가 올바르지 않습니다.")
        }

        thumbnailUploadCacheRef.current.set(file, uploadedUrl)
        return uploadedUrl
    }

    const savePost = async (finalPost: IPost): Promise<void> => {
        const clearSavedDraft = (): void => {
            try {
                clearPostDraft(window.localStorage, finalPost.id)
            } catch (error) {
                console.error("저장 완료 후 임시 글을 정리하지 못했습니다:", error)
            }
        }

        if (finalPost.id === 0) {
            const response = await axiosInstance.post("/posts", finalPost)
            if (response.data?.code !== 200 || response.data?.data?.id == null) {
                throw new Error("Unexpected post response")
            }

            clearSavedDraft()
            toastCall("글이 성공적으로 저장되었습니다.", "success")
            router.replace(`/post/${response.data.data.id}`)
            return
        }

        const response = await axiosInstance.put(`/posts/${finalPost.id}`, finalPost)
        if (response.data?.code !== 200) throw new Error("Unexpected post response")

        clearSavedDraft()
        toastCall("글이 성공적으로 수정되었습니다.", "success")
        setEdit?.(false)
    }

    const handleSubmit = async (): Promise<void> => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true
        setIsSubmitting(true)

        try {
            const currentPost = postDataRef.current
            const currentContent = latestContentRef.current
            const preparedContent = await preparePostContent(
                currentContent,
                {
                    uploadBase64Images: async (images) => {
                        const response = await axiosInstance.post("/file/base64-multi", { images })
                        return response.data?.data
                    },
                    uploadExternalImages: async (urls) => {
                        const response = await axiosInstance.post("/file/external-urls", { urls })
                        return response.data?.data
                    },
                },
                imageUploadCacheRef.current,
                process.env.NEXT_PUBLIC_IP || "",
            )

            let thumbnailUrl = typeof currentPost.thumbnail === "string" ? currentPost.thumbnail : ""
            if (typeof File !== "undefined" && currentPost.thumbnail instanceof File) {
                thumbnailUrl = await uploadSingleFile(currentPost.thumbnail)
            }

            await savePost({ ...currentPost, thumbnail: thumbnailUrl, content: preparedContent })
        } catch (error) {
            persistDraft()
            if (error instanceof PostImageUploadError) {
                toastCall(error.message, "error")
            } else {
                toastCall(postDataRef.current.id === 0 ? "글 저장에 실패했습니다." : "글 수정에 실패했습니다.", "error")
            }
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }

    const handleCancel = (): void => {
        if (isSubmittingRef.current) return
        persistDraft()
        if (setEdit) {
            setEdit(false)
            return
        }
        router.back()
    }

    return (
        <Wrapper>
            <div className={styles.postNewWrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.backBtn}>
                        <Image
                            src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                            alt="뒤로 가기"
                            width={25}
                            height={25}
                            onClick={handleCancel}
                        />
                    </div>
                    <TextBasic className={styles.title} size="xx-large" bold="bold">
                        {postData.id === 0 ? "새 글 쓰기" : "글 수정하기"}
                    </TextBasic>
                    <div className={styles.btnGroupWrapper}>
                        <ButtonBasic
                            buttonWrapperStyle={styles.btnWrapper}
                            type="reset"
                            fontSize="small"
                            onClick={handleCancel}
                            aria-disabled={isSubmitting}
                            label="취소하기"
                        />
                        <ButtonBasic
                            buttonWrapperStyle={styles.btnWrapper}
                            type=""
                            fontSize="small"
                            onClick={handleSubmit}
                            aria-busy={isSubmitting}
                            aria-disabled={isSubmitting}
                            label={isSubmitting ? "저장 중..." : "저장하기"}
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
                        onChangeTitle={(title) => updatePostData((current) => ({ ...current, title }))}
                        onChangeContents={(content) => {
                            latestContentRef.current = content
                            updatePostData((current) => ({ ...current, content }))
                        }}
                        onChangeThumbnail={(thumbnail) => updatePostData((current) => ({ ...current, thumbnail }))}
                    />
                </div>
            </div>
        </Wrapper>
    )
}

export default PostRegister
