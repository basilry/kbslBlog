"use client"

import { useLocale } from "@lib/i18n/context"
import { translateData, translateText } from "@lib/i18n/translate"
import { ReactElement } from "react"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import originalData from "@lib/json/career.json"
import { useCoreStore } from "@lib/stores/store"
import { formatArchiveDate } from "@lib/i18n/config"
import { DateFormat, formatDate } from "@lib/utils/common"
import styles from "@styles/pages/career.module.scss"

interface ICareer {
    id: number
    title: string
    startDate: string
    endDate: string
}

const Career = (): ReactElement => {
    const locale = useLocale()
    const t = (text: string) => translateText(text, locale)
    const careerData = translateData(originalData, locale)
    const { darkMode } = useCoreStore()

    const careerList: ICareer[] = careerData

    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
                <div className={styles.careerBlock}>
                    <div className={styles.careerParagraphs}>
                        <div className={styles.headerWrapper}>
                            <TextBasic as="h1" className={styles.title} size="xxx-large" bold="bold">
                                {t("Career Now | 경력")}
                            </TextBasic>
                        </div>
                        <br />
                        <LineBasic />
                        <br />
                        {careerList.map((row) => (
                            <div
                                key={row.id + "_" + row.startDate + "_" + row.title}
                                className={classNames(styles.seminarBlock, darkMode && styles.dark)}
                            >
                                <TextBasic as="h2" className={styles.wrapper} size="x-large" bold="bold">
                                    {row.title}
                                </TextBasic>
                                <br />
                                <TextBasic size="x-small">
                                    {(locale === "en" ? formatArchiveDate(row.startDate, true) : formatDate(row.startDate, DateFormat.MONTH_DATE)) +
                                        " ~ " +
                                        (locale === "en" ? formatArchiveDate(row.endDate, true) : formatDate(row.endDate, DateFormat.MONTH_DATE))}
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
