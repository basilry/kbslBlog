"use client"

import React, { ReactElement, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { IMainProjects } from "@interface/IMain"
import mainProjects from "@lib/json/mainProjects.json"
import { useCoreStore } from "@lib/stores/store"
import { BACK_YEAR, FRONT_YEAR, FULL_YEAR, TOTAL_YEAR } from "@lib/utils/constants"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/main.module.scss"

interface IYearMonthBlock {
    title: string
    subTitle: string
    yearMonth: number
    period: string
}

const Main = (): ReactElement => {
    const { darkMode, changeNowMenuName } = useCoreStore()

    const [totalYear, setTotalYear] = useState(0)
    const [frontYear, setFrontYear] = useState(0)
    const [backYear, setBackYear] = useState(0)
    const [fullYear, setFullYear] = useState(0)

    const handleYearMonthBlock = (): IYearMonthBlock[] => {
        return [
            { title: "Total", subTitle: "Career", yearMonth: totalYear, period: "year" },
            { title: "F/E", subTitle: "Position", yearMonth: frontYear, period: "month" },
            { title: "B/E", subTitle: "Exp", yearMonth: backYear, period: "month" },
            { title: "Fullstack", subTitle: "Position", yearMonth: fullYear, period: "month" },
        ]
    }

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
            if (
                TOTAL_YEAR === totalYear &&
                FRONT_YEAR === frontYear &&
                BACK_YEAR === backYear &&
                FULL_YEAR !== fullYear
            ) {
                setFullYear(fullYear + 1)
            }
        }, 50)

        return () => {
            clearInterval(doCalYear)
        }
    }, [totalYear, frontYear, backYear, fullYear])

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
                    <p>{"DevSecOps와 ML Engineer를 지향하고,"}</p>
                    <p>{"진정한 개발자를 꿈꾸는 법학도."}</p>
                    <br />
                    <p>{"Web FullStack 개발자,"}</p>
                    <p>{"'김바실리'입니다."}</p>
                </div>
            </div>
            <LineBasic />
            <div className={classNames(styles.mainMid, darkMode && styles.dark)}>
                {handleYearMonthBlock().map((row) => (
                    <div key={row.title} className={styles.midBlock}>
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <p>{row.title}</p>
                            <p>{row.subTitle}</p>
                            <div className={styles.yearNumWrapper}>
                                <div className={styles.yearNum}>{row.yearMonth}+</div>
                            </div>
                            <p className={styles.yearChar}>{row.period}</p>
                        </motion.div>
                    </div>
                ))}
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
                    <motion.div
                        key={idx}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.8 }}
                    >
                        <motion.div className={styles.botBlock}>
                            <div className={styles.workContents}>
                                <Link
                                    href={row.url ?? ""}
                                    onClick={(): void => {
                                        changeNowMenuName("PROJECTS")
                                        toastCall("프로젝트 페이지로 이동합니다.", "success")
                                    }}
                                >
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
                                                <img
                                                    key={logo?.src + "_" + subIdx}
                                                    src={logo.src ?? ""}
                                                    alt={logo.alt ?? ""}
                                                    width={logo.width}
                                                    height={logo.height}
                                                />
                                            ))}
                                        </div>
                                        <TextBasic size="small" bold="bold">
                                            {row.description}
                                        </TextBasic>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <LineBasic />
        </Wrapper>
    )
}

export default Main
