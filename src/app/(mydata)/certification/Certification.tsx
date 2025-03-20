"use client"

import { ReactElement, useEffect, useState } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useCoreStore } from "@lib/stores/store"
import { formatDate } from "@lib/utils/common"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/career.module.scss"

interface ICertification {
    id: number
    title: string
    subTitle?: string
    date: string
    url?: string
}

const Certification = (): ReactElement => {
    const { darkMode } = useCoreStore()

    const [certificationList, setCertificationList] = useState<ICertification[]>([])

    const getCareer = (): void => {
        axiosInstance
            .get("/certification")
            .then((res) => {
                setCertificationList(res.data.data)
            })
            .catch(() => {
                toastCall("자격/수료 정보를 불러오지 못했습니다.", "error")
            })
    }

    useEffect(() => {
        getCareer()
    }, [])

    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xxx-large" bold="bold">
                        {"Certification | 자격증 & 수료증"}
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
                    {certificationList.map((cert) => (
                        <Link
                            key={cert.id + "_" + cert.date + "_" + cert.title}
                            href={cert.url ?? "#"}
                            target={cert.url ? "_blank" : ""}
                            scroll={false}
                        >
                            <div
                                className={classNames(
                                    styles.seminarBlock,
                                    cert.url && styles.active,
                                    darkMode && styles.dark,
                                )}
                                style={{
                                    cursor: cert.url ? "pointer" : "default",
                                }}
                            >
                                <TextBasic className={styles.wrapper} size="x-large" bold="bold">
                                    {cert.url && <span className={styles.red}>*</span>}
                                    {cert.title}
                                </TextBasic>
                                {cert.subTitle && (
                                    <div className={styles.subTitle}>
                                        <TextBasic className={styles.subTitle} size="small" bold="bold">
                                            {`/ ${cert.subTitle}`}
                                        </TextBasic>
                                    </div>
                                )}
                                <TextBasic size="x-small">{formatDate(cert.date)}</TextBasic>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Certification
