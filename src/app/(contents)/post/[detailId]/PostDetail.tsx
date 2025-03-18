"use client"

import { ReactElement, useEffect, useRef, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import dayjs from "dayjs"
import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser"
import Image from "next/image"
import { usePathname } from "next/navigation"
import classNames from "classnames"
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
    const [isScrolled, setIsScrolled] = useState(false)

    const titleRef = useRef<HTMLDivElement>(null)

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

    // 스크롤 이벤트 핸들러
    const handleScroll = (): void => {
        const scrollPosition = window.scrollY
        // 스크롤 위치가 특정 값(예: 100px) 이상이면 스크롤된 상태로 설정
        setIsScrolled(scrollPosition > 100)
    }

    useEffect(() => {
        getPostDetail(Number(id))
    }, [id, doEdit])

    // 스크롤 이벤트 리스너 등록 및 해제
    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // 구글 드라이브 이미지 URL 최적화 함수
    const optimizeGoogleDriveImageUrl = (url: string): string => {
        if (!url) return url

        // 이미 최적화된 URL인 경우 그대로 반환
        if (url.includes("/api/image-proxy")) return url

        // 프록시 URL인 경우 환경 변수 추가
        if (url.includes("/proxy/")) {
            return `${process.env.NEXT_PUBLIC_IP}${url}`
        }

        // 구글 드라이브나 googleusercontent 이미지인 경우에만 처리
        if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
            // 최적화된 URL로 변환
            let optimizedUrl = url

            // 일반 구글 드라이브 공유 URL을 직접 다운로드 URL로 변환
            if (url.includes("drive.google.com/file/d/")) {
                const fileId = url.split("/file/d/")[1].split("/")[0]
                optimizedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
            }

            // 구글 문서 뷰어 URL을 직접 다운로드 URL로 변환
            if (url.includes("/view?usp=sharing")) {
                optimizedUrl = url.replace("/view?usp=sharing", "/uc?export=view")
            }

            // 프록시 API를 통해 이미지 로드
            return `/api/image-proxy?url=${encodeURIComponent(optimizedUrl)}`
        }

        return url
    }

    // HTML 파싱 및 img 태그 변환 함수
    const parseHtmlWithNextImage = (htmlContent: string): React.ReactNode => {
        const options: HTMLReactParserOptions = {
            replace: (domNode: DOMNode) => {
                if (domNode instanceof Element && domNode.name === "img") {
                    const { src, alt = "" } = domNode.attribs

                    if (!src) return null

                    // 이미 프록시 처리된 이미지일 경우
                    if (src.includes("/proxy/")) {
                        // 중복 URL 방지
                        if (src.startsWith("http")) {
                            return null
                        }
                        return (
                            <div style={{ position: "relative", width: "100%", height: "400px", margin: "20px 0" }}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IP}${src}`}
                                    alt={alt || "이미지"}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    loading="eager"
                                    priority={true}
                                    placeholder="blur"
                                    blurDataURL={
                                        darkMode ? "/loading-placeholder-dark.svg" : "/loading-placeholder.svg"
                                    }
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                    onError={(e) => {
                                        // 이미지 로드 실패 시 처리
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                        console.error("이미지 로드 실패:", target.src)
                                        // 원본 URL 출력
                                        if (target.src.includes("/proxy/")) {
                                            console.log("프록시 URL 로드 실패, 환경 변수 확인 필요:", target.src)
                                            console.log("환경 변수:", {
                                                NEXT_PUBLIC_IP: process.env.NEXT_PUBLIC_IP,
                                            })
                                        }
                                        target.parentElement!.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:#f5f5f5;color:#666;">이미지를 불러올 수 없습니다</div>`
                                    }}
                                />
                            </div>
                        )
                    }

                    // 구글 드라이브 이미지인 경우
                    if (src && (src.includes("drive.google.com") || src.includes("googleusercontent.com"))) {
                        // 최적화된 URL 생성
                        const optimizedSrc = optimizeGoogleDriveImageUrl(src)

                        return (
                            <div style={{ position: "relative", width: "100%", height: "400px", margin: "20px 0" }}>
                                <Image
                                    src={optimizedSrc}
                                    alt={alt || "이미지"}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    loading="eager"
                                    priority={true}
                                    placeholder="blur"
                                    blurDataURL={
                                        darkMode ? "/loading-placeholder-dark.svg" : "/loading-placeholder.svg"
                                    }
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                    onError={(e) => {
                                        // 이미지 로드 실패 시 처리
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                        console.error("이미지 로드 실패:", target.src)
                                        // 원본 URL 출력
                                        if (target.src.includes("/proxy/")) {
                                            console.log("프록시 URL 로드 실패, 환경 변수 확인 필요:", target.src)
                                            console.log("환경 변수:", {
                                                NEXT_PUBLIC_IP: process.env.NEXT_PUBLIC_IP,
                                            })
                                        }
                                        target.parentElement!.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:#f5f5f5;color:#666;">이미지를 불러올 수 없습니다</div>`
                                    }}
                                />
                            </div>
                        )
                    }
                }
            },
        }

        return parse(htmlContent, options)
    }

    return doEdit ? (
        <PostRegister originPostData={postDetail} setEdit={() => setDoEdit(false)} />
    ) : (
        <Wrapper>
            <div className={styles.postDetailWrapper}>
                <div
                    ref={titleRef}
                    className={classNames(styles.titleWrapper, {
                        [styles.titleScrolled]: isScrolled,
                        [styles.dark]: darkMode && isScrolled,
                    })}
                    style={{
                        minHeight: postDetail.thumbnail && !isScrolled ? "300px" : "150px",
                    }}
                >
                    {postDetail.thumbnail && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_IP}${postDetail.thumbnail}`}
                            alt="background"
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: 0.5,
                                zIndex: 1,
                                borderRadius: "10px",
                                transition: "all 0.3s ease",
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
                            <TextBasic
                                size={isScrolled ? "xx-large" : "xxx-large"}
                                bold="bold"
                                className={styles.titleText}
                            >
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

                {/* 스크롤 시 타이틀 영역만큼 여백 추가 (타이틀이 fixed 포지션일 때) */}
                {isScrolled && <div style={{ height: "70px" }} />}

                <LineBasic />
                <br />
                {postDetail.content && (
                    <div className={styles.content}>{parseHtmlWithNextImage(postDetail.content)}</div>
                )}
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
