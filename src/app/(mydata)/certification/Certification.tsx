"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import certificateJson from "@lib/json/certificate.json"
import { useCoreStore } from "@lib/stores/store"
import { formatDate } from "@lib/utils/common"
import styles from "@styles/pages/career.module.scss"

const Certification = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
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
                    <LineBasic />
                    <br />
                    {certificateJson.map((cert) => (
                        <Link
                            key={cert.id + cert.date}
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
