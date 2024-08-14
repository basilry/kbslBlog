"use client"

import { Fragment, ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import careerJson from "@lib/json/career.json"
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
                        <TextBasic size="xx-large" bold="bold">
                            {"Career Now | 경력"}
                        </TextBasic>
                        <br />
                        <br />
                        {careerJson.map((row) => (
                            <Fragment key={row.title}>
                                <div className={styles.cbParagraph}>
                                    <TextBasic size="small" bold="bold">
                                        {row.title}
                                    </TextBasic>
                                    <div>
                                        <div className={styles.divider} />
                                        <TextBasic size="small" className={"careerYear"}>
                                            {formatDate(row.startDate, DateFormat.MONTH_DATE) +
                                                " ~ " +
                                                formatDate(row.endDate, DateFormat.MONTH_DATE)}
                                        </TextBasic>
                                    </div>
                                </div>
                                <br />
                            </Fragment>
                        ))}
                    </div>
                </div>
                <LineBasic />
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xx-large" bold="bold">
                        {"Activity | 연구개발 & 교육 & 보고 & 수료"}
                    </TextBasic>
                    <div className={styles.dotWrapper}>
                        <span className={styles.red}>*</span>
                        <TextBasic size={"x-small"} bold={"normal"}>
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
                                <TextBasic className={styles.wrapper} size="medium" bold="bold">
                                    {seminar.url && <span className={styles.red}>*</span>}
                                    {seminar.title}
                                </TextBasic>
                                {seminar.subTitle && (
                                    <div className={styles.subTitle}>
                                        <TextBasic className={styles.subTitle} size="x-small" bold="bold">
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
            <LineBasic />
        </Wrapper>
    )
}

export default Career
