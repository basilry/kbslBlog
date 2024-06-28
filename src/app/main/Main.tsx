"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { IMainProjects } from "@interface/IMain"
import mainProjects from "@lib/json/mainProjects.json"
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

    useEffect(() => {
        changeNowMenuName("MAIN")
    }, [])

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
                {mainProjects.map((row: IMainProjects, idx: number) => (
                    <div key={idx} className={styles.botBlock}>
                        <div className={styles.workContents}>
                            <Link href={"/projects/solutionInit"} onClick={(): void => changeNowMenuName("PROJECTS")}>
                                <TextBasic size="x-large" bold="bold">
                                    {row.title}
                                </TextBasic>
                                <TextBasic size="large" bold="bold">
                                    {row.period}
                                </TextBasic>
                                <LineBasic />
                                <div className={styles.contents}>
                                    <div className={styles.ciLogo}>
                                        {row?.logos?.map((logo, subIdx) => (
                                            <Image
                                                key={subIdx}
                                                src={logo.src ?? ""}
                                                alt={logo.alt ?? ""}
                                                width={logo.width}
                                                height={logo.height}
                                                placeholder={"blur"}
                                            />
                                        ))}
                                    </div>
                                    <TextBasic size="small" bold="bold">
                                        {row.description}
                                    </TextBasic>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <LineBasic />
        </Wrapper>
    )
}

export default Main
