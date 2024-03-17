"use client"

import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projects.module.scss"

const Projects = (): JSX.Element => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <TextBasic size="xx-large" bold="bold">
                {"참여한 프로젝트 목록"}
            </TextBasic>
            <TextBasic size="large" bold="bold">
                {"Projects List"}
            </TextBasic>
            <br />
            <LineBasic />
            <br />
            <div className={classNames(styles.mainBot, darkMode && styles.dark)}>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects/solutionInit"}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, Solution"}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2021.12 ~ 2023.06 | 1년 6개월"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                    <Image
                                        placeholder="blur"
                                        src="/kbslBlog/ddogaLogo.svg"
                                        alt="logo"
                                        width={120}
                                        height={30}
                                    />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {
                                        "장기요양기관 내 어르신 대상 장기요양 행위를 기록하고 시설을 관리하는 백오피스 솔루션 웹 프로젝트입니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents}>
                        <Link href={"/projects/solutionRenewal"}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, Solution | Renewal"}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2023.07 ~ 2023.09 | 3개월"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                    <Image
                                        placeholder="blur"
                                        src="/kbslBlog/ddogaLogo.svg"
                                        alt="logo"
                                        width={120}
                                        height={30}
                                    />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {
                                        "공단의 고시변경으로 비즈니스 로직 등 다수 기능 변경 필요로 인해 리뉴얼 작업이 진행되었습니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects/carenote"}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, 돌봄노트"}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2023.09 ~ 2024.01 | 4개월"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                    <Image
                                        placeholder="blur"
                                        src="/kbslBlog/ddoga_logo.svg"
                                        alt="logo"
                                        width={115}
                                        height={20}
                                    />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {
                                        "타사 솔루션과 연동되는 요양기관 가정통신문 및 어르신 요양기록을 확인하는 모바일 웹 앱 프로젝트입니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents}>
                        <Link href={"/projects/ims"}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, 통합관리시스템 Part 1."}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2024.02 ~ 2024.03 | 2개월"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                    <Image
                                        placeholder="blur"
                                        src="/kbslBlog/ddoga_logo.svg"
                                        alt="logo"
                                        width={115}
                                        height={20}
                                    />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {
                                        "자사에서 인수한 복지용구 사업소 내부 물류 관리 및 외부 영업사원 관리 백오피스 모바일 웹 프로젝트입니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects"}>
                            <TextBasic size="x-large" bold="bold">
                                {"헥톤프로젝트, 테크 블로그"}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2024.02 ~ 진행 중 | 미정(올해 말)"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {"헥톤프로젝트 테크 블로그 사이드 프로젝트입니다."}
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents}>
                        <Link href={"/projects"}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, 통합관리시스템 Part 2."}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"24년 상반기 예정"}
                            </TextBasic>
                            <LineBasic />
                            <div className={styles.contents}>
                                <div className={styles.ciLogo}>
                                    <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={18} />
                                    <Image
                                        placeholder="blur"
                                        src="/kbslBlog/ddoga_logo.svg"
                                        alt="logo"
                                        width={115}
                                        height={20}
                                    />
                                </div>
                                <TextBasic size="small" bold="bold">
                                    {"미정"}
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Projects
