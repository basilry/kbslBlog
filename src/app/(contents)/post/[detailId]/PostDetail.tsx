"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import dayjs from "dayjs"
import parse from "html-react-parser"
import Image from "next/image"
import { usePathname } from "next/navigation"
import PostRegister from "@app/(contents)/post/register/PostRegister"
import ButtonBasic from "@components/atom/ButtonBasic"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import ModalAlert from "@components/modal/ModalAlert"
import Giscus from "@components/ui/Giscus"
import { IPost } from "@interface/IPost"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore, useLoginStore } from "@lib/stores/store"
import { handleCalDiffTime } from "@lib/utils/common"
import { ERROR_MESSAGE } from "@lib/utils/constants"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/postDetail.module.scss"

const PostDetail = (): ReactElement => {
    const { darkMode } = useCoreStore()
    const { loginUser, loginState } = useLoginStore()

    const router = useRouter()
    const pathName = usePathname()

    const id = pathName.split("/")[2]

    const [postDetail, setPostDetail] = useState<IPost>({} as IPost)
    const [doEdit, setDoEdit] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const getPostDetail = (id: number): void => {
        axiosInstance
            .get(`/posts/${id}`)
            .then((res) => {
                setPostDetail(res.data.data)
            })
            .catch(() => {
                router.back()
                toastCall("포스팅을 불러오지 못했습니다.", "error")
            })
    }

    const updateLike = (id: number): void => {
        axiosInstance
            .post(`/posts/${id}/like`)
            .then(() => {
                getPostDetail(id)
                toastCall("좋아요를 눌렀습니다.", "success")
            })
            .catch((reason) => {
                const errCode = reason.response.data.errorCode as keyof typeof ERROR_MESSAGE
                const errMsg = ERROR_MESSAGE[errCode] || "좋아요를 누르지 못했습니다."

                toastCall(errMsg, "error")
            })
    }

    const deletePost = (id: number): void => {
        axiosInstance
            .delete(`/posts/${id}`)
            .then(() => {
                router.push("/post")
                toastCall("포스팅을 삭제했습니다.", "success")
            })
            .catch(() => {
                toastCall("포스팅을 삭제하지 못했습니다.", "error")
            })
    }

    const diff = dayjs().diff(dayjs(postDetail.createdAt), "hour")

    useEffect(() => {
        getPostDetail(Number(id))
    }, [id, doEdit])

    return doEdit ? (
        <PostRegister originPostData={postDetail} setEdit={() => setDoEdit(false)} />
    ) : (
        <Wrapper>
            <div className={styles.postDetailWrapper}>
                <div className={styles.titleWrapper} style={{ minHeight: postDetail.thumbnail ? "300px" : "150px" }}>
                    {postDetail.thumbnail && (
                        <Image
                            src={postDetail.thumbnail}
                            alt="background"
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: 0.5,
                                zIndex: 1,
                                borderRadius: "10px",
                            }}
                        />
                    )}
                    <div className={styles.titleTopWrapper}>
                        <div className={styles.titleLeftWrapper}>
                            <div className={styles.backBtn} onClick={() => router.back()}>
                                <Image
                                    src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                                    alt={"arrowback"}
                                    width={25}
                                    height={25}
                                />
                            </div>
                            {diff < 1 && <Image src={"/hot.svg"} alt={"hot"} width={30} height={30} />}
                            <TextBasic size="xxx-large" bold="bold">
                                {parse(postDetail.title || "")}
                            </TextBasic>
                        </div>

                        {loginState && loginUser.loginId && (
                            <div className={styles.btnWrapper}>
                                <ButtonBasic
                                    type={"reset"}
                                    fontSize={"small"}
                                    onClick={() => setOpenModal(true)}
                                    label={"삭제하기"}
                                />
                                <ButtonBasic
                                    type={""}
                                    fontSize={"small"}
                                    onClick={() => setDoEdit(true)}
                                    label={"수정하기"}
                                />
                            </div>
                        )}

                        <ModalAlert
                            title={"포스팅 삭제"}
                            isOpen={openModal}
                            onClose={() => setOpenModal(false)}
                            message={"정말 삭제하시겠습니까?"}
                            confirmBtnLabel={"삭제"}
                            onConfirm={() => deletePost(postDetail.id)}
                            cancelBtnLabel={"취소"}
                            onCancel={() => setOpenModal(false)}
                        />
                    </div>
                    <div className={styles.titleBottom}>
                        <div className={styles.thumbAndLike}>
                            <Image src={"/thumbsUp.svg"} alt={"thumbsUp"} width={15} height={15} />
                            <TextBasic className={styles.thumbNum} size="small" bold={"normal"}>
                                {postDetail.likeCount}
                            </TextBasic>
                        </div>
                        <TextBasic size="small" bold="normal">
                            {handleCalDiffTime(diff, postDetail.createdAt)}
                        </TextBasic>
                    </div>
                </div>
                <LineBasic />
                <br />
                {postDetail.content && <div className={styles.content}>{parse(postDetail.content)}</div>}
                <ButtonBasic type={"thumb"} onClick={() => updateLike(postDetail.id)}>
                    <div>
                        <Image src={"/thumbsUp.svg"} alt={"thumbsUP"} width={25} height={25} />
                        <TextBasic className={styles.thumbNum} size="small" bold="bold">
                            {postDetail.likeCount}
                        </TextBasic>
                    </div>
                </ButtonBasic>
            </div>
            <br />
            <LineBasic />
            <br />
            <div className={styles.commentWrapper}>
                <Giscus emotion={false} />
            </div>
        </Wrapper>
    )
}

export default PostDetail
