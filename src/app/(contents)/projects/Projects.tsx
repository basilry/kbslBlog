"use client"

import React, { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import mainProjects from "@lib/json/mainProjects.json"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projects.module.scss"

const Projects = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <TextBasic as="h1" size="xxx-large" bold="bold">
                {"Projects | 참여한 프로젝트 목록"}
            </TextBasic>
            <br />

            <div className={classNames(styles.mainBot, darkMode && styles.dark)}>
                {mainProjects.map((row) => (
                    <Link
                        key={row.id}
                        href={row.url}
                    >
                        <div className={styles.botBlock}>
                            <div className={styles.workContents}>
                                <TextBasic as="h2" size="x-large" bold="bold">
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
