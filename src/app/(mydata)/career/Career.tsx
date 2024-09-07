"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import careerJson from "@lib/json/career.json"
import certificateJson from "@lib/json/certificate.json"
import seminarJson from "@lib/json/seminar.json"
import { useCoreStore } from "@lib/stores/store"
import { DateFormat, formatDate } from "@lib/utils/common"
import styles from "@styles/pages/career.module.scss"

const Career = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
                <div className={styles.careerBlock}>
                    <div className={styles.careerParagraphs}>
                        <TextBasic size="xxx-large" bold="bold">
                            {"Career Now | 경력"}
                        </TextBasic>
                        <br />
                        <br />
                        {careerJson.map((row) => (
                            <div key={row.id} className={classNames(styles.seminarBlock, darkMode && styles.dark)}>
                                <TextBasic className={styles.wrapper} size="x-large" bold="bold">
                                    {row.title}
                                </TextBasic>
                                <br />
                                <TextBasic size="x-small">
                                    {formatDate(row.startDate, DateFormat.MONTH_DATE) +
                                        " ~ " +
                                        formatDate(row.endDate, DateFormat.MONTH_DATE)}
                                </TextBasic>
                            </div>
                        ))}
                    </div>
                </div>
                <LineBasic />
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xxx-large" bold="bold">
                        {"Activity | 연구개발 & 교육 & 보고"}
                    </TextBasic>
                    <div className={styles.dotWrapper}>
                        <span className={styles.red}>*</span>
                        <TextBasic size={"small"} bold={"normal"}>
                            {": 외부 링크로 연결됩니다."}
                        </TextBasic>
                    </div>
                    <br />
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
                <LineBasic />
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xxx-large" bold="bold">
                        {"Certificate | 자격증 & 수료증"}
                    </TextBasic>
                    <div className={styles.dotWrapper}>
                        <span className={styles.red}>*</span>
                        <TextBasic size={"small"} bold={"normal"}>
                            {": 외부 링크로 연결됩니다."}
                        </TextBasic>
                    </div>
                    <br />
                    <br />
                    {certificateJson.map((seminar) => (
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

export default Career
