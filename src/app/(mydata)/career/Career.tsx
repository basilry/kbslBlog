"use client"

import { ReactElement } from "react"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import careerJson from "@lib/json/career.json"
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
                        <LineBasic />
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
            </div>
        </Wrapper>
    )
}

export default Career
