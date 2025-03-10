"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import classNames from "classnames"
import ButtonBasic from "@components/atom/ButtonBasic"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import Pagination from "@components/template/Pagination"
import { IPost } from "@interface/IPost"
import { IPagination } from "@interface/IRoot"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore, useLoginStore } from "@lib/stores/store"
import { handleCalDiffTime } from "@lib/utils/common"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/postList.module.scss"

const PostList = (): ReactElement => {
    const { darkMode } = useCoreStore()
    const { loginUser, loginState } = useLoginStore()

    const router = useRouter()
    const param = useSearchParams()
    const page = param.get("page") || 1

    const [postList, setPostList] = useState<IPost[]>([])
    const [pagination, setPagination] = useState<IPagination<IPost>>({} as IPagination<IPost>)

    const getPosts = (page = 1): void => {
        if (page < 1) {
            router.push("/post")
            return
        }

        axiosInstance
            .get(`/posts?page=${page - 1}`)
            .then((res) => {
                setPostList(res.data.data.content)
                setPagination(res.data.data)

                toastCall("포스팅 목록을 불러왔습니다.", "success")
            })
            .catch(() => {
                toastCall("포스팅 목록을 불러오지 못했습니다.", "error")
            })
    }

    const handlePostThumbnail = (thumbnail: string): string => {
        if (thumbnail) {
            return thumbnail
        }

        if (darkMode) {
            return "/image_white.svg"
        } else {
            return "/image.svg"
        }
    }

    useEffect(() => {
        getPosts(Number(page))
    }, [page])

    return (
        <Wrapper>
            <div className={styles.topWrapper}>
                <TextBasic className={styles.topTitle} size="xxx-large" bold="bold">
                    {"Post | 포스팅"}
                </TextBasic>
                {loginState && loginUser.loginId && (
                    <ButtonBasic
                        buttonWrapperStyle={styles.topButton}
                        buttonStyle={styles.topButtonEach}
                        type={"icon"}
                        fontSize={"x-small"}
                        onClick={() => router.push("/post/postNew")}
                    >
                        <Image src={darkMode ? "/pen_white.svg" : "/pen.svg"} alt={"plus"} width={25} height={25} />
                    </ButtonBasic>
                )}
            </div>
            <br />
            <LineBasic />
            <br />
            <div></div>
            <div className={styles.postListWrapper}>
                {postList.length > 0 ? (
                    postList.map((post, index) => {
                        const diff = dayjs().diff(dayjs(post.createdAt), "hour")

                        return (
                            <Link
                                key={post.id + "_" + post.createdAt + "_" + post.title}
                                href={`/post/${post.id}`}
                                passHref
                                onClick={() => {
                                    toastCall("해당 포스팅으로 이동합니다.", "success")
                                }}
                            >
                                <div
                                    className={classNames(
                                        styles.postListItem,
                                        darkMode && styles.dark,
                                        index === 0 && styles.first,
                                    )}
                                >
                                    <div className={styles.thumbnailWrapper}>
                                        <Image
                                            className={styles.thumbnail}
                                            src={handlePostThumbnail(post.thumbnail)}
                                            alt={"thumbnail"}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.itemLeft}>
                                        <div className={styles.itemTitle}>
                                            {diff < 1 && <Image src={"/hot.svg"} alt={"hot"} width={20} height={20} />}
                                            <TextBasic className={styles.title} size="medium" bold="bold">
                                                {post.title}
                                            </TextBasic>
                                        </div>
                                        <div className={styles.itemBottom}>
                                            <div className={styles.thumbAndLike}>
                                                <Image src={"/thumbsUp.svg"} alt={"thumbsUp"} width={15} height={15} />
                                                <TextBasic className={styles.thumbNum} size="x-small" bold={"normal"}>
                                                    {post.likeCount}
                                                </TextBasic>
                                            </div>
                                            <TextBasic size="x-small" bold="normal">
                                                {handleCalDiffTime(diff, post.createdAt)}
                                            </TextBasic>
                                            <TextBasic size="x-small" bold="normal">
                                                {"김바실리"}
                                            </TextBasic>
                                        </div>
                                    </div>
                                    <Image
                                        className={styles.arrow}
                                        src={darkMode ? "/doubleArrow_white.svg" : "/doubleArrow.svg"}
                                        alt={"doubleArrow"}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className={styles.noData}>
                        <Image
                            src={darkMode ? "/image_white.svg" : "/image.svg"}
                            alt={"basicImage"}
                            width={100}
                            height={100}
                        />
                        <TextBasic size="medium" bold="bold">
                            {"포스팅이 없습니다."}
                        </TextBasic>
                    </div>
                )}
            </div>
            <Pagination {...pagination} path={"post"} />
        </Wrapper>
    )
}

export default PostList
