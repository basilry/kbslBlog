"use client"

import React, { forwardRef, ReactElement, useEffect, useRef, useState } from "react"
import GitHubCalendar, { Activity } from "react-github-calendar"
import { motion } from "framer-motion"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import { BACK_YEAR, FRONT_YEAR, FULL_YEAR, TOTAL_YEAR } from "@lib/utils/constants"
import styles from "@styles/pages/landing.module.scss"

interface IYearMonthBlock {
    title: string
    subTitle: string
    yearMonth: number
    period: string
}

interface IScrollBlockProps {
    children: ReactElement
    className?: string
}

interface IVisibleTextProps {
    children: ReactElement
    className?: string
    delay?: number
    marginTop?: number
}

interface IScrollGithubCalendarWrapper {
    children: ReactElement
    delay: number
    className?: string
}

// eslint-disable-next-line react/display-name
const ScrollBlockWrapper = forwardRef<HTMLDivElement, IScrollBlockProps>(
    ({ children, className }, ref): ReactElement => {
        return (
            <motion.section
                className={className}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div ref={ref}>{children}</div>
            </motion.section>
        )
    },
)

const VisibleText = ({ children, className, delay = 0.5, marginTop = 0 }: IVisibleTextProps): ReactElement => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                root: null,
                threshold: 0.5, // 50%가 보일 때 트리거
            },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <motion.div
            ref={ref}
            style={{ marginTop: `${marginTop}rem` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            whileInView="onscreen"
            className={className}
        >
            {children}
        </motion.div>
    )
}

const ScrollGithubCalendarWrapper = ({ children, delay, className }: IScrollGithubCalendarWrapper): ReactElement => {
    return (
        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.8 }}>
            <motion.div
                className={className}
                style={{ marginTop: delay !== 0 ? "2rem" : 0 }}
                variants={{
                    offscreen: {
                        opacity: 0,
                        y: 200,
                    },
                    onscreen: {
                        opacity: 1,
                        y: 30,
                        transition: {
                            type: "spring",
                            bounce: 0.4,
                            duration: 0.8,
                            delay: delay,
                        },
                    },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}

const Landing = (): ReactElement => {
    const { darkMode, changeNowMenuName } = useCoreStore()
    const sectionRefs = useRef<any[]>([])

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

    const updateYearCounts = (): any => {
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
    }

    const handleScroll = (e: WheelEvent): void => {
        e.preventDefault()

        const scrollDirection = e.deltaY > 0 ? 1 : -1
        const currentIndex = Math.round(window.scrollY / window.innerHeight)
        const nextIndex = currentIndex + scrollDirection

        if (nextIndex >= 0 && nextIndex < sectionRefs.current.length) {
            const nextSection = sectionRefs.current[nextIndex]
            if (nextSection) {
                const yOffset = nextSection.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({
                    top: yOffset,
                    behavior: "smooth",
                })
            }
        }
    }

    const selectLastHalfYear = (contributions: Activity[], year: number): Activity[] => {
        const currentYear = year
        const currentMonth = 12
        const shownMonths = 12

        return contributions.filter((activity) => {
            const date = new Date(activity.date)
            const monthOfDay = date.getMonth()

            return (
                date.getFullYear() === currentYear &&
                monthOfDay > currentMonth - shownMonths &&
                monthOfDay <= currentMonth
            )
        })
    }

    useEffect(() => {
        changeNowMenuName("")

        window.addEventListener("wheel", handleScroll, { passive: false })

        return () => {
            window.removeEventListener("wheel", handleScroll)
        }
    }, [])

    useEffect(() => {
        if (sectionRefs.current[3]) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        updateYearCounts()
                        observer.disconnect()
                    }
                },
                { threshold: 0.5 },
            )

            observer.observe(sectionRefs.current[3])

            return () => observer.disconnect()
        }
    }, [totalYear, frontYear, backYear, fullYear])

    return (
        <div className={styles.landingWrapper}>
            <ScrollBlockWrapper className={styles.firstBlock} ref={(el): any => (sectionRefs.current[0] = el!)}>
                <div>
                    <VisibleText className={styles.titleWrapper1}>
                        <TextBasic
                            className={classNames(styles.title, !darkMode && styles.white)}
                            size={"xxxx-large"}
                            bold={"bold"}
                        >
                            {`Web을 딛고 ML을 바라보다`}
                        </TextBasic>
                    </VisibleText>
                    <br />
                    <VisibleText className={styles.titleWrapper1} delay={1.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"Frontend에서 시작해"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper1} delay={2}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"Backend의 경험을 쌓고"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper1} delay={2.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"Fullstack으로 성장하며"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper1} delay={3}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"미래를 보고 ML에 대한 열정을 가진"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper1} delay={3.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {`매일 성장하는 개발자, "김바실리"입니다`}
                        </TextBasic>
                    </VisibleText>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper className={styles.secondBlock} ref={(el): any => (sectionRefs.current[1] = el!)}>
                <div className={styles.landingWrapper}>
                    <VisibleText className={styles.titleWrapper2}>
                        <TextBasic
                            className={classNames(styles.title, !darkMode && styles.white)}
                            size={"xxxx-large"}
                            bold={"bold"}
                        >
                            {`항상 새로운 기술에 목마른 개발자`}
                        </TextBasic>
                    </VisibleText>
                    <br />
                    <VisibleText className={styles.titleWrapper2} delay={1.5}>
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {"2024 Google Machine Learning Bootcamp 수료"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={2}>
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {"2024 AWS Summit 참석"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={2.5}>
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {"2023 헬스테크 박람회 / 대한민국 소프트웨어대전 참석"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={3}>
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {"2022 한국방송통신대학교 컴퓨터과학과 학사편입"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={3.5}>
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {"2021 / 2022 사내 세미나 발표 및 공유 다수"}
                        </TextBasic>
                    </VisibleText>
                    <br />
                    <VisibleText className={styles.titleWrapper2} delay={4}>
                        <TextBasic className={styles.break} size={"xxx-large"} bold={"bold"}>
                            {"멈추지 않는 기술에 대한 열정을"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={4.5}>
                        <TextBasic className={styles.break} size={"xxx-large"} bold={"bold"}>
                            {"갖고 달려왔습니다"}
                        </TextBasic>
                    </VisibleText>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper className={styles.thirdBlock} ref={(el): any => (sectionRefs.current[2] = el!)}>
                <div className={styles.blockWrapper}>
                    <div>
                        {[2025, 2024, 2023, 2022, 2021].map((row, idx) => (
                            <ScrollGithubCalendarWrapper key={row} delay={idx * 0.5} className={styles.calendar1}>
                                <GitHubCalendar
                                    username="basilry"
                                    transformData={(e): Activity[] => selectLastHalfYear(e, row)}
                                    year={row}
                                    colorScheme={darkMode ? "dark" : "light"}
                                    blockSize={8}
                                />
                            </ScrollGithubCalendarWrapper>
                        ))}
                    </div>
                    <div className={styles.titles}>
                        <VisibleText className={styles.topTitle}>
                            <TextBasic
                                className={classNames(styles.title, !darkMode && styles.white)}
                                size={"xxxx-large"}
                                bold={"bold"}
                            >
                                {`꾸준함은 가장 큰 자산입니다`}
                            </TextBasic>
                        </VisibleText>
                        <br />
                        <VisibleText className={styles.titleWrapper3} delay={1.5}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"2021년 커리어 시작 이후로"}
                            </TextBasic>
                        </VisibleText>
                        <VisibleText className={styles.titleWrapper3} delay={2}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"멈추지 않은 Github Calendar"}
                            </TextBasic>
                        </VisibleText>
                        <VisibleText className={styles.titleWrapper3} delay={2.5}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"2025년에도 변함없이 달리고 있습니다"}
                            </TextBasic>
                        </VisibleText>
                    </div>
                    <div className={styles.calendarWrapper}>
                        <div className={styles.calendarBlock}>
                            {[2025, 2024, 2023].map((row, idx) => (
                                <ScrollGithubCalendarWrapper key={row} delay={idx * 0.5} className={styles.calendar2}>
                                    <GitHubCalendar
                                        username="basilry"
                                        transformData={(e): Activity[] => selectLastHalfYear(e, row)}
                                        year={row}
                                        colorScheme={darkMode ? "dark" : "light"}
                                        blockSize={4}
                                        style={{}}
                                    />
                                </ScrollGithubCalendarWrapper>
                            ))}
                        </div>
                        <div className={styles.calendarBlock}>
                            {[2022, 2021].map((row, idx) => (
                                <ScrollGithubCalendarWrapper key={row} delay={idx * 0.5} className={styles.calendar2}>
                                    <GitHubCalendar
                                        username="basilry"
                                        transformData={(e): Activity[] => selectLastHalfYear(e, row)}
                                        year={row}
                                        colorScheme={darkMode ? "dark" : "light"}
                                        blockSize={4}
                                    />
                                </ScrollGithubCalendarWrapper>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper className={styles.forthBlock} ref={(el): any => (sectionRefs.current[3] = el!)}>
                <div className={styles.blockWrapper}>
                    <div className={styles.textWrapper}>
                        <VisibleText className={styles.titleWrapper4}>
                            <TextBasic
                                className={classNames(styles.title, !darkMode && styles.white)}
                                size={"xxxx-large"}
                                bold={"bold"}
                            >
                                {`지금까지의 경험과 가능성`}
                            </TextBasic>
                        </VisibleText>
                        <br />
                        <VisibleText className={styles.titleWrapper4} delay={1.5}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"전체 경력은 이제 4년차에 접어들었지만,"}
                            </TextBasic>
                        </VisibleText>
                        <VisibleText className={styles.titleWrapper4} delay={2}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"같은 연차에 비해 많은 경험을 쌓아왔고,"}
                            </TextBasic>
                        </VisibleText>
                        <VisibleText className={styles.titleWrapper4} delay={2.5}>
                            <TextBasic size={"xxx-large"} bold={"bold"}>
                                {"앞으로도 그 발전 가능성을 믿고 있습니다"}
                            </TextBasic>
                        </VisibleText>
                    </div>
                    <div className={styles.blockController}>
                        <div className={classNames(styles.mainMid, darkMode && styles.dark)}>
                            {handleYearMonthBlock()
                                .slice(0, 2)
                                .map((row) => (
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
                        <div className={classNames(styles.mainMid, darkMode && styles.dark)}>
                            {handleYearMonthBlock()
                                .slice(2)
                                .map((row) => (
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
                    </div>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper className={styles.fifthBLock} ref={(el): any => (sectionRefs.current[4] = el!)}>
                <div className={styles.landingWrapper}>
                    <VisibleText className={styles.titleWrapper5}>
                        <TextBasic
                            className={classNames(styles.title, !darkMode && styles.white)}
                            size={"xxxx-large"}
                            bold={"bold"}
                        >
                            {`멈추지 않는 열정으로`}
                        </TextBasic>
                    </VisibleText>
                    <br />
                    <VisibleText className={styles.titleWrapper5} delay={1.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"쫓고있는 꿈이 비록 멀지라도"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper5} delay={2}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"절대 포기하지 않고"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper5} delay={2.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"끊임없이 노력하는,"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper5} delay={3}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {`저는 "개발자" 김바실리 입니다`}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper5} delay={3.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {`감사합니다`}
                        </TextBasic>
                    </VisibleText>
                </div>
            </ScrollBlockWrapper>
        </div>
    )
}

export default Landing
