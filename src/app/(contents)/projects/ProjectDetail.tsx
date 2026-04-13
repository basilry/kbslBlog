"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import PicsTemplate from "@app/(contents)/projects/PicsTemplate"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import { getTechStackIcon } from "@lib/utils/techStackIcons"
import styles from "@styles/pages/projectsContents.module.scss"

interface IProjectLogo {
    src: string
    alt: string
    width: number
    height: number
}

interface IAchievement {
    title: string
    details: string[]
}

interface IExtraSectionItem {
    subtitle?: string
    details: string[]
}

interface IExtraSection {
    title: string
    items: IExtraSectionItem[]
}

interface IProjectDetailData {
    title: string
    period: string
    logos: IProjectLogo[]
    description: string
    role: string[]
    techStack: string[]
    teamSize: string
    url?: string
    achievements: IAchievement[]
    extraSections?: IExtraSection[]
    images?: {
        filePath: string
        domainName: string
        fileNums: number
    }
    noImageMessage?: string
}

interface IProjectDetailProps {
    data: IProjectDetailData
}

const ProjectDetail = ({ data }: IProjectDetailProps): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={styles.list}>
                <Link href={"/projects"} className={classNames(styles.link, darkMode && styles.dark)}>
                    <img src={`/${darkMode ? "link_white" : "link"}.svg`} alt={"link"} width={15} />
                    <TextBasic size={"medium"} bold={"bold"}>
                        프로젝트 목록
                    </TextBasic>
                </Link>
            </div>
            <div className={classNames(styles.eachProjectWrapper, darkMode && styles.dark)}>
                <TextBasic size="xxx-large" bold="bold">
                    {data.title}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {data.period}
                    </TextBasic>
                    <div className={styles.logos}>
                        {data.logos.map((logo) => (
                            <img
                                key={logo.src}
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={logo.height}
                            />
                        ))}
                    </div>
                </div>
                <LineBasic />
                <br />
                <div className={styles.contentsWrapper}>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"설명"}
                        </TextBasic>
                        <TextBasic size="small">{data.description}</TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        {data.role.map((r) => (
                            <TextBasic key={r} size="small">{`- ${r}`}</TextBasic>
                        ))}
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"사용스택"}
                        </TextBasic>
                        <div>
                            {data.techStack.map((tech) => {
                                const icon = getTechStackIcon(tech)
                                return (
                                    <img
                                        key={tech}
                                        className={styles.skillImgs}
                                        src={icon.src}
                                        alt={tech}
                                        sizes={"100vw"}
                                        width={icon.width}
                                        height={icon.height}
                                    />
                                )
                            })}
                        </div>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"프로젝트 인원"}
                        </TextBasic>
                        <TextBasic size="small">{`- ${data.teamSize}`}</TextBasic>
                        {data.url && (
                            <>
                                <br />
                                <br />
                                <TextBasic size="large" bold="bold">
                                    {"서비스 주소"}
                                </TextBasic>
                                <TextBasic size="small">
                                    <a href={data.url} target="_blank" rel="noopener noreferrer">
                                        {data.url}
                                    </a>
                                </TextBasic>
                            </>
                        )}
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        {data.achievements.map((achievement, idx) => (
                            <div key={achievement.title}>
                                <TextBasic size="medium" bold="bold">
                                    {`${idx + 1}. ${achievement.title}`}
                                </TextBasic>
                                {achievement.details.map((detail) => (
                                    <TextBasic key={detail} size="small">{`- ${detail}`}</TextBasic>
                                ))}
                                {idx < data.achievements.length - 1 && <br />}
                            </div>
                        ))}
                        {data.extraSections?.map((section) => (
                            <div key={section.title}>
                                <br />
                                <TextBasic size="large" bold="bold">
                                    {section.title}
                                </TextBasic>
                                {section.items.map((item, idx) => (
                                    <div key={item.subtitle ?? idx}>
                                        {item.subtitle && (
                                            <TextBasic size="medium" bold="bold">
                                                {`${idx + 1}. ${item.subtitle}`}
                                            </TextBasic>
                                        )}
                                        {item.details.map((detail) => (
                                            <TextBasic key={detail} size="small">{`- ${detail}`}</TextBasic>
                                        ))}
                                        {idx < section.items.length - 1 && <br />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {data.images && (
                    <>
                        <br />
                        <LineBasic />
                        <div className={styles.titleWrapper}>
                            <TextBasic size="xx-large" bold="bold">
                                {"프로젝트 이미지"}
                            </TextBasic>
                            <div className={styles.imageTitle}>
                                <span className={styles.red}>*</span>
                                <TextBasic size="small">{"좌우로 드래그 해보세요!"}</TextBasic>
                            </div>
                            <PicsTemplate
                                filePath={data.images.filePath}
                                domainName={data.images.domainName}
                                fileNums={data.images.fileNums}
                            />
                        </div>
                    </>
                )}

                {data.noImageMessage && !data.images && (
                    <>
                        <br />
                        <LineBasic />
                        <div className={styles.titleWrapper}>
                            <TextBasic size="xx-large" bold="bold">
                                {"프로젝트 이미지"}
                            </TextBasic>
                            <br />
                            <TextBasic size="small">{data.noImageMessage}</TextBasic>
                        </div>
                    </>
                )}
            </div>
        </Wrapper>
    )
}

export default ProjectDetail
