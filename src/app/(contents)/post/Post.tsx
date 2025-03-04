"use client"

import { ReactElement, useEffect, useState } from "react"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import Pagination from "@components/template/Pagination"
import { IPagination } from "@interface/IRoot"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/post.module.scss"

interface IPost {
    id: number
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    likeCount: number
}

const Post = (): ReactElement => {
    const { darkMode } = useCoreStore()

    const [postList, setPostList] = useState<IPost[]>([])
    const [pagination, setPagination] = useState<IPagination<IPost>>({} as IPagination<IPost>)

    const handleCalDiffTime = (diff: number, createdAt: Date): string => {
        if (diff < 1) {
            return `${dayjs().diff(dayjs(createdAt), "minute")}분 전`
        } else {
            if (diff < 24) {
                return `${diff}시간 전`
            } else {
                return `${dayjs().diff(dayjs(createdAt), "day")}일 전`
            }
        }
    }

    const getPosts = (page = 0): void => {
        axiosInstance
            .get(`/posts?page=${page}`)
            .then((res) => {
                setPostList(res.data.content)
                setPagination(res.data)

                toastCall("포스팅 목록을 불러왔습니다.", "success")
            })
            .catch(() => {
                toastCall("포스팅 목록을 불러오지 못했습니다.", "error")
            })
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <Wrapper>
            <TextBasic size="xxx-large" bold="bold">
                {"Post | 포스팅"}
            </TextBasic>
            <br />
            <LineBasic />
            <br />
            <div className={styles.postListWrapper}>
                {postList.map((post, index) => {
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
                                <div className={styles.itemLeft}>
                                    <div className={styles.itemTitle}>
                                        {diff < 1 && <Image src={"/hot.svg"} alt={"hot"} width={20} height={25} />}
                                        <TextBasic size="large" bold="bold">
                                            {post.title}
                                        </TextBasic>
                                    </div>
                                    <div className={styles.itemBottom}>
                                        <div className={styles.thumbAndLike}>
                                            <Image src={"/thumbsUp.svg"} alt={"thumbsUp"} width={20} height={20} />
                                            <TextBasic size="small" bold={"normal"}>
                                                {post.likeCount}
                                            </TextBasic>
                                        </div>
                                        <TextBasic size="small" bold="normal">
                                            {handleCalDiffTime(diff, post.createdAt)}
                                        </TextBasic>
                                        <TextBasic size="small" bold="normal">
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
                })}
            </div>
            <Pagination {...pagination} onChangePage={(pageNum) => getPosts(pageNum)} />
        </Wrapper>
    )
}

export default Post
