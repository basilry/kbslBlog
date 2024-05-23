"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/main.module.scss"

const FIRST_TOTAL_YEAR_DATE = "20210913"
const FIRST_FRONT_YEAR_DATE = "20211201"
const FIRST_BACK_YEAR_DATE = "20220101"
const TODAY = dayjs().format("YYYYMMDD")
const TOTAL_YEAR = dayjs(TODAY).diff(FIRST_TOTAL_YEAR_DATE, "year")
const FRONT_YEAR = dayjs(TODAY).diff(FIRST_FRONT_YEAR_DATE, "month")
const BACK_YEAR = dayjs(TODAY).diff(FIRST_BACK_YEAR_DATE, "month")

const Main = (): JSX.Element => {
    const { darkMode, changeNowMenuName } = useCoreStore()

    const [totalYear, setTotalYear] = useState(0)
    const [frontYear, setFrontYear] = useState(0)
    const [backYear, setBackYear] = useState(0)

    useEffect(() => {
        const doCalYear = setTimeout(() => {
            if (TOTAL_YEAR !== totalYear) {
                setTotalYear(totalYear + 1)
            }
            if (TOTAL_YEAR === totalYear && FRONT_YEAR !== frontYear) {
                setFrontYear(frontYear + 1)
            }
            if (TOTAL_YEAR === totalYear && FRONT_YEAR === frontYear && BACK_YEAR !== backYear) {
                setBackYear(backYear + 1)
            }
        }, 50)

        return () => {
            clearInterval(doCalYear)
        }
    }, [totalYear, frontYear, backYear])

    return (
        <Wrapper>
            <div className={styles.mainTop}>
                <div className={styles.imageWrapper}>
                    <img src="/kbslBlog/my_face_hand.png" alt="myFace" width={250} height={250} />
                </div>
                <div className={styles.paragraphWrapper}>
                    <p>{"안녕하세요! :)"}</p>
                    <p>{"Fullstack + DevSecOps를 지향하고,"}</p>
                    <p>{"진정한 개발자를 꿈꾸는 법학도."}</p>
                    <br />
                    <p>{"Web FrontEnd 개발자,"}</p>
                    <p>{"'김바실리'입니다."}</p>
                </div>
            </div>
            <LineBasic />
            <div className={classNames(styles.mainMid, darkMode && styles.dark)}>
                <div className={styles.midBlock}>
                    <p>Total</p>
                    <p>Career</p>
                    <div className={styles.yearNumWrapper}>
                        <div className={styles.yearNum}>{totalYear}+</div>
                    </div>
                    <p className={styles.yearChar}>Years</p>
                </div>
                <div className={classNames(styles.midBlock)}>
                    <p>F/E</p>
                    <p>Position</p>
                    <div className={styles.yearNumWrapper}>
                        <div className={styles.yearNum}>{frontYear}+</div>
                    </div>
                    <p className={styles.yearChar}>Months</p>
                </div>
                <div className={classNames(styles.midBlock)}>
                    <p>B/E</p>
                    <p>Exp</p>
                    <div className={styles.yearNumWrapper}>
                        <div className={styles.yearNum}>{backYear}+</div>
                    </div>
                    <p className={styles.yearChar}>Months</p>
                </div>
            </div>
            {/* TODO: 커리어 호버시 그래프 보이는 부분 */}
            {/* <div>{yearHover.id === "total" && yearHover.hover && <p>total</p>}</div> */}
            <LineBasic />
            <div className={classNames(styles.mainBot, darkMode && styles.dark)}>
                <div className={styles.botImage}>
                    <div>
                        <TextBasic size="xx-large" bold="bold">
                            {"아래의 프로젝트들도 진행했어요!"}
                        </TextBasic>
                        <TextBasic size="large">{"I also worked on the projects below!"}</TextBasic>
                        <LineBasic />
                        <TextBasic size="small">{"자세한 내용은 Projects 페이지에서 확인해주세요! :)"}</TextBasic>
                        <TextBasic size="x-small">{"Find out more on the Projects page! :)"}</TextBasic>
                    </div>
                    <img src="/kbslBlog/macbook_Face.png" alt="macbook" width={200} height={200} />
                </div>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects/solutionInit"} onClick={(): void => changeNowMenuName("PROJECTS")}>
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
                                        "장기요양기관 내 어르신 대상 장기요양 행위를 기록하고 시설을 관리하는 백오피스 솔루션 웹 프로젝트입니다. 어르신에 대한 모든 요양정보, 직원에 대한 근무기록 등 정보, 시설의 운영정보 등을 관리합니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents}>
                        <Link href={"/projects/solutionRenewal"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, Solution 리뉴얼"}
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
                        <Link href={"/projects/carenote"} onClick={(): void => changeNowMenuName("PROJECTS")}>
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
                        <Link href={"/projects/imsPart1"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, IMS(통합관리시스템) Part 1."}
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
                                        "자사에서 인수한 복지용구 사업소 내부 물류 관리 및 외부 영업사원 관리 백오피스 모바일 웹 프로젝트입니다. Part를 나누어 진행하며, Part 1은 로그인/마이페이지/수급자조회/직원관리/고객관리 등 기본기능을 구현했습니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects/hectonTechblog"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                            <TextBasic size="x-large" bold="bold">
                                {"헥톤프로젝트, 헥톤블로그"}
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
                                    {
                                        "헥톤프로젝트 회사 공식블로그 사이드 프로젝트입니다. 24년 5월 23일 현재 프론트/백 모두 프로젝트 기반 작업 진행 중입니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents}>
                        <Link href={"/projects"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, IMS(통합관리시스템) Part 2."}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2024.04 ~ 2024.05 | 2개월"}
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
                                        "24년 2월에 진행했던 IMS 프로젝트의 고도화 및 관리자 페이지 추가 프로젝트입니다. 수급자 조회내역/복지용구 구매가능&기 대여품목 조회 기능을 추가하였으며, 관리자 페이지는 기본적인 로그인/회원가입/공지사항(목록-필터/상세/등록/수정/삭제) 기능을 신규로 구현했습니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={styles.botBlock}>
                    <div className={styles.workContents}>
                        <Link href={"/projects/hectonTechblog"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                            <TextBasic size="x-large" bold="bold">
                                {"또하나의가족, 플랫폼 고도화 - 장기요양등급신청"}
                            </TextBasic>
                            <TextBasic size="large" bold="bold">
                                {"2024.06 ~ 2024.07 | 2개월(예정)"}
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
                                        "헥톤프로젝트의 대표 서비스 플랫폼인 또하나의가족에 수급자의 장기요양등급 신청을 편리하게 진행해주는 기능을 추가 개발합니다."
                                    }
                                </TextBasic>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.workContents} style={{ cursor: "auto", opacity: 0.3 }}></div>
                </div>
            </div>
            <LineBasic />
        </Wrapper>
    )
}

export default Main
