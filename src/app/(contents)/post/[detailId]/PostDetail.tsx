"use client"

import { ReactElement, useEffect, useState } from "react"
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
import { useCoreStore } from "@lib/stores/store"
import { handleCalDiffTime } from "@lib/utils/common"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/postDetail.module.scss"

const PostDetail = (): ReactElement => {
    const { darkMode } = useCoreStore()

    const pathName = usePathname()

    const id = pathName.split("/")[2]

    const [postDetail, setPostDetail] = useState<IPost>({} as IPost)

    const getPostDetail = (id: number): void => {
        axiosInstance
            .get(`/posts/${id}`)
            .then((res) => {
                setPostDetail(res.data.data)
            })
            .catch((reason) => {
                console.log(reason)
                toastCall("포스팅을 불러오지 못했습니다.", "error")
            })
    }

    const updateLike = (id: number): void => {
        axiosInstance
            .post(`/posts/${id}/like`)
            .then((res) => {
                console.log(res)
                getPostDetail(id)
                toastCall("좋아요를 눌렀습니다.", "success")
            })
            .catch((reason) => {
                console.log(reason)
                toastCall("좋아요를 누르지 못했습니다.", "error")
            })
    }

    const diff = dayjs().diff(dayjs(postDetail.createdAt), "hour")

    useEffect(() => {
        getPostDetail(Number(id))
    }, [id])

    return (
        <Wrapper>
            {/*<div>*/}
            {/*    <Image*/}
            {/*        src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}*/}
            {/*        alt={"arrowback"}*/}
            {/*        width={30}*/}
            {/*        height={30}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className={styles.postDetailWrapper}>
                <div className={styles.titleWrapper}>
                    {diff < 1 && <Image src={"/hot.svg"} alt={"hot"} width={30} height={30} />}
                    <TextBasic size="xx-large" bold="bold">
                        {parse(postDetail.title || "")}
                    </TextBasic>
                </div>
                <div className={styles.titleBottom}>
                    <div className={styles.thumbAndLike}>
                        <Image src={"/thumbsUp.svg"} alt={"thumbsUp"} width={15} height={15} />
                        <TextBasic size="x-small" bold={"normal"}>
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
                <div className={styles.content}>{parse(postDetail.content || "")}</div>
                <ButtonBasic type={"thumb"} onClick={() => updateLike(postDetail.id)}>
                    <div>
                        <Image src={"/thumbsUp.svg"} alt={"thumbsUP"} width={25} height={25} />
                        <TextBasic size="small" bold="bold">
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
