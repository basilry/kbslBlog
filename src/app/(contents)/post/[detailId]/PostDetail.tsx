"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import dayjs from "dayjs"
import parse from "html-react-parser"
import Image from "next/image"
import { usePathname } from "next/navigation"
import ButtonBasic from "@components/atom/ButtonBasic"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
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

    const getPostDetail = (id: number): void => {
        axiosInstance
            .get(`/posts/${id}`)
            .then((res) => {
                setPostDetail(res.data.data)
            })
            .catch(() => {
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

    const diff = dayjs().diff(dayjs(postDetail.createdAt), "hour")

    useEffect(() => {
        getPostDetail(Number(id))
    }, [id])

    return (
        <Wrapper>
            <div className={styles.postDetailWrapper}>
                <div className={styles.titleWrapper}>
                    <div className={styles.titleLeftWrapper}>
                        <div className={styles.backBtn}>
                            <Image
                                src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                                alt={"arrowback"}
                                width={25}
                                height={25}
                                onClick={() => router.back()}
                            />
                        </div>
                        {diff < 1 && <Image src={"/hot.svg"} alt={"hot"} width={30} height={30} />}
                        <TextBasic size="xx-large" bold="bold">
                            {parse(postDetail.title || "")}
                        </TextBasic>
                    </div>
                    {loginState && loginUser.loginId && (
                        <ButtonBasic
                            buttonWrapperStyle={styles.btnWrapper}
                            type={""}
                            fontSize={"small"}
                            onClick={() => ""}
                            label={"수정하기"}
                        />
                    )}
                </div>
                <div className={styles.titleBottom}>
                    <div className={styles.thumbAndLike}>
                        <Image src={"/thumbsUp.svg"} alt={"thumbsUp"} width={15} height={15} />
                        <TextBasic className={styles.thumbNum} size="x-small" bold={"normal"}>
                            {postDetail.likeCount}
                        </TextBasic>
                    </div>
                    <TextBasic size="x-small" bold="normal">
                        {handleCalDiffTime(diff, postDetail.createdAt)}
                    </TextBasic>
                    <TextBasic size="x-small" bold="normal">
                        {"김바실리"}
                    </TextBasic>
                </div>
                <br />
                <LineBasic />
                <br />
                <div className={styles.thumbnailWrapper}>
                    {postDetail.thumbnail && (
                        <Image
                            className={styles.thumbnail}
                            src={postDetail.thumbnail}
                            alt={"thumbnail"}
                            width={400}
                            height={400}
                            placeholder={"blur"}
                            blurDataURL={darkMode ? "/image_white.svg" : "/image.svg"}
                            loading={"lazy"}
                        />
                    )}
                </div>
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
