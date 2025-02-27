"use client"

import { ReactElement, useEffect, useState } from "react"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore } from "@lib/stores/store"
import { DateFormat, formatDate } from "@lib/utils/common"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/career.module.scss"

interface ICareer {
    id: number
    title: string
    startDate: string
    endDate: string
}

const Career = (): ReactElement => {
    const { darkMode } = useCoreStore()

    const [careerList, setCareerList] = useState<ICareer[]>([])

    const getCareer = (): void => {
        axiosInstance
            .get("/career")
            .then((res) => {
                setCareerList(res.data.data)
            })
            .catch(() => {
                toastCall("경력 정보를 불러오지 못했습니다.", "error")
            })
    }

    useEffect(() => {
        getCareer()
    }, [])

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
                        {careerList.map((row) => (
                            <div
                                key={row.id + "_" + row.startDate + "_" + row.title}
                                className={classNames(styles.seminarBlock, darkMode && styles.dark)}
                            >
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
