"use client"

import React, { ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import mainProjects from "@lib/json/mainProjects.json"
import { useCoreStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/projects.module.scss"

const Projects = (): ReactElement => {
    const { darkMode } = useCoreStore()
    const router = useRouter()

    return (
        <Wrapper>
            <TextBasic size="xxx-large" bold="bold">
                {"Projects | 참여한 프로젝트 목록"}
            </TextBasic>
            <br />

            <div className={classNames(styles.mainBot, darkMode && styles.dark)}>
                {mainProjects.map((row) => (
                    <Link
                        key={row.id}
                        href={row.url}
                        onClick={(): void => {
                            if (row.url) {
                                router.push(row.url)
                                toastCall(`해당 프로젝트로 이동합니다.`, "success")
                            } else {
                                toastCall("준비중입니다", "info")
                            }
                        }}
                        scroll={Boolean(row.url.length > 0)}
                    >
                        <div className={styles.botBlock}>
                            <div className={styles.workContents}>
                                <TextBasic size="x-large" bold="bold">
                                    {row.title}
                                </TextBasic>
                                <TextBasic size="large" bold="bold">
                                    {row.period}
                                </TextBasic>
                                <LineBasic />
                                <div className={styles.contents}>
                                    <div className={styles.ciLogo}>
                                        {row?.logos?.map((logo) => (
                                            <img
                                                key={logo.src}
                                                src={logo.src ?? ""}
                                                alt={logo.alt ?? ""}
                                                width={logo.width}
                                                height={logo.height}
                                            />
                                        ))}
                                    </div>
                                    <TextBasic size="small" bold="bold">
                                        {row.description}
                                    </TextBasic>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Wrapper>
    )
}

export default Projects
