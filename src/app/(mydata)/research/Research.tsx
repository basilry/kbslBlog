"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import seminarJson from "@lib/json/seminar.json"
import { useCoreStore } from "@lib/stores/store"
import { formatDate } from "@lib/utils/common"
import styles from "@styles/pages/career.module.scss"

const Research = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xxx-large" bold="bold">
                        {"Research | 연구개발 & 교육 & 보고"}
                    </TextBasic>
                    <div className={styles.dotWrapper}>
                        <span className={styles.red}>*</span>
                        <TextBasic size={"small"} bold={"normal"}>
                            {": 외부 링크로 연결됩니다."}
                        </TextBasic>
                    </div>
                    <br />
                    <LineBasic />
                    <br />
                    {seminarJson.map((seminar) => (
                        <Link
                            key={seminar.id + seminar.date}
                            href={seminar.url ?? "#"}
                            target={seminar.url ? "_blank" : ""}
                            scroll={false}
                        >
                            <div
                                className={classNames(
                                    styles.seminarBlock,
                                    seminar.url && styles.active,
                                    darkMode && styles.dark,
                                )}
                                style={{
                                    cursor: seminar.url ? "pointer" : "default",
                                }}
                            >
                                <TextBasic className={styles.wrapper} size="x-large" bold="bold">
                                    {seminar.url && <span className={styles.red}>*</span>}
                                    {seminar.title}
                                </TextBasic>
                                {seminar.subTitle && (
                                    <div className={styles.subTitle}>
                                        <TextBasic className={styles.subTitle} size="small" bold="bold">
                                            {"/ " + seminar.subTitle}
                                        </TextBasic>
                                    </div>
                                )}
                                <TextBasic size="x-small">{formatDate(seminar.date)}</TextBasic>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Research
