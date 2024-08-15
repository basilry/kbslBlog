"use client"

import React, { forwardRef, ReactElement, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/pages/landing.module.scss"

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
            // animate={{ opacity: 1, scale: 1 }}
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

const Landing = (): ReactElement => {
    const sectionRefs = useRef<any[]>([])

    const handleScroll = (e: WheelEvent): void => {
        e.preventDefault()

        const scrollDirection = e.deltaY > 0 ? 1 : -1
        const currentIndex = Math.round(window.scrollY / window.innerHeight)
        const nextIndex = currentIndex + scrollDirection

        if (nextIndex >= 0 && nextIndex < sectionRefs.current.length) {
            const nextSection = sectionRefs.current[nextIndex]
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop - 100,
                    behavior: "smooth",
                })
            }
        }
    }

    useEffect(() => {
        window.addEventListener("wheel", handleScroll, { passive: false })

        return () => {
            window.removeEventListener("wheel", handleScroll)
        }
    }, [])

    return (
        <div>
            <ScrollBlockWrapper ref={(el): HTMLDivElement => (sectionRefs.current[0] = el!)}>
                <div className={styles.landingWrapper}>
                    <VisibleText className={styles.titleWrapper1}>
                        <TextBasic className={styles.title} size={"xxxx-large"} bold={"bold"}>
                            {`"Web의 경계에서 ML을 바라보다"`}
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
                            {`개발자 "김바실리"입니다.`}
                        </TextBasic>
                    </VisibleText>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper
                className={styles.secondBlock}
                ref={(el): HTMLDivElement => (sectionRefs.current[1] = el!)}
            >
                <div className={styles.landingWrapper}>
                    <VisibleText className={styles.titleWrapper2}>
                        <TextBasic className={styles.title} size={"xxxx-large"} bold={"bold"}>
                            {`"항상 새로운 기술에 목마른,"`}
                        </TextBasic>
                    </VisibleText>
                    <br />
                    <VisibleText className={styles.titleWrapper2} delay={1.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"2024 Google Machine Learning Bootcamp"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={2}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"2024 AWS Summit"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={2.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"2023 헬스테크 박람회"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={3}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"2021 / 2022 사내 세미나 발표 및 공유 다수 등,"}
                        </TextBasic>
                    </VisibleText>
                    <VisibleText className={styles.titleWrapper2} delay={3.5}>
                        <TextBasic size={"xxx-large"} bold={"bold"}>
                            {"멈추지 않는 기술에 대한 열정을 가지고 달려왔습니다."}
                        </TextBasic>
                    </VisibleText>
                </div>
            </ScrollBlockWrapper>
            <ScrollBlockWrapper
                className={styles.thirdBlock}
                ref={(el): HTMLDivElement => (sectionRefs.current[2] = el!)}
            >
                <div className={styles.blockWrapper}>121231231233</div>
            </ScrollBlockWrapper>
        </div>
    )
}

export default Landing
