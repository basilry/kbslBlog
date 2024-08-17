"use client"

import { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const SolutionRenewal = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={styles.list}>
                <Link href={"/projects"} className={classNames(styles.link, darkMode && styles.dark)}>
                    <img src={`/kbslBlog/${darkMode ? "link_white" : "link"}.svg`} alt={"link"} width={15} />
                    <TextBasic size={"medium"} bold={"bold"}>
                        프로젝트 목록
                    </TextBasic>
                </Link>
            </div>
            <div className={classNames(styles.eachProjectWrapper, darkMode && styles.dark)}>
                <TextBasic size="xxx-large" bold="bold">
                    {"또하나의가족, Solution | Renewal"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2023.07 ~ 2023.09 | 3개월"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={20} />
                        <Image placeholder="blur" src="/kbslBlog/ddogaLogo.svg" alt="logo" width={120} height={30} />
                    </div>
                </div>
                <LineBasic />
                <br />
                <div className={styles.contentsWrapper}>
                    <div className={classNames(styles.paragraphs, styles.renewal)}>
                        <TextBasic size="large" bold="bold">
                            {"설명"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 장기요양보험공단의 고시 변경으로 인한 비즈니스 로직 및 기능 다수의 변경 필요성 존재로 프로젝트 리뉴얼 진행되었습니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">{"- 회사 사업 방향성 변화로 프로젝트 '보류'되었습니다."}</TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 프론트엔드 개발자"}</TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"사용스택"}
                        </TextBasic>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/typescript.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/nextjs.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/sass.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/zustand.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={80}
                                height={60}
                            />
                        </div>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/prettier.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/eslint.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/mysql.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/aws.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                        </div>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"프로젝트 인원"}
                        </TextBasic>
                        <TextBasic size="small">{"- F/E: 3명"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 2명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 프로젝트 구조 및 컴포넌트 개발"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 프로젝트의 폴더 및 파일 구조 설계에 참여하여 전체 시스템의 안정성 강화."}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 아토믹 디자인 원칙에 기반하여 원자(Atoms) 71개, 분자(Molecules) 38개, 모달(Modals) 31개의 공통 컴포넌트 분류 및 설계를 수행, 프로젝트 개발 속도 및 안정성 향상에 기여."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 샘플링 페이지 개발로 사용자 경험 개선 및 디자인 일관성 유지에 기여."}
                        </TextBasic>
                    </div>
                </div>

                <br />

                <LineBasic />

                <div className={styles.titleWrapper}>
                    <TextBasic size="xx-large" bold="bold">
                        {"프로젝트 이미지"}
                    </TextBasic>
                    <div className={styles.imageTitle}>
                        <span className={styles.red}>*</span>
                        <TextBasic size="small">{"데이터가 없습니다"}</TextBasic>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default SolutionRenewal
