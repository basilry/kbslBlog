"use client"

import { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import PicsTemplate from "@app/(contents)/projects/PicsTemplate"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const Carenote = (): ReactElement => {
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
                    {"또하나의가족, 돌봄노트"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2023.09 ~ 2024.01 | 5개월"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/hecton.png" alt="logo" width={30} height={20} />
                        <Image placeholder="blur" src="/ddoga_logo.svg" alt="logo" width={115} height={30} />
                    </div>
                </div>
                <LineBasic />
                <br />
                <div className={styles.contentsWrapper}>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"설명"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 타사 솔루션과 연동되는 요양기관 가정통신문 및 어르신 요양기록을 확인하는 모바일 웹 프로젝트입니다."
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 프론트엔드 개발자."}</TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"사용스택"}
                        </TextBasic>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/skills/typescript.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/nextjs.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/sass.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/zustand.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={80}
                                height={60}
                            />
                        </div>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/skills/prettier.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/eslint.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/mssql.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={160}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/aws.svg"
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
                        <TextBasic size="small">{"- F/E: 2명"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 2명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 프로젝트 관리 및 커뮤니케이션"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 프론트엔드 WBS 작성 및 개발 전반 관리로 프로젝트 팀의 커뮤니케이션 및 협업 효율성 향상"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 팀원 간 협업을 최적화하고 작업 효율성을 극대화하기 위한 관리 및 조정 역할 수행"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 개발 환경 및 시스템 안정성 강화"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 프로젝트의 폴더 및 파일 구조 설계를 전담, 개발 환경 구축 및 전체 시스템 안정성 강화"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 프로젝트의 정량적인 개발 성과 기여"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 아토믹 디자인 원칙을 적용한 공통 컴포넌트 분류 및 개발로 UI 개발의 일관성 및 효율성 증진"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- Zustand 기반 중앙 상태관리 및 Axios를 활용한 API 서비스 개발로 데이터 관리 및 서버 연동 강화"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"4. 개발 속도 및 안정성 향상"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 다양한 util(cookie.ts, constants.ts, common.ts, bridge.ts 등) 및 커스텀 훅 개발로 프로젝트 개발 속도 향상"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- types 폴더 구성 및 내부 공통 타입/인터페이스 module화 하여 23개의 .d.ts 파일로 관리 및 16개의 init 파일 구성으로 프로젝트 안정성 강화"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- ErrorBoundary 등 커스텀 에러 페이지를 통한 에러핸들링 및 Suspense Loading 처리와 같은 레이아웃 단위 관리 수행으로 UX 측면의 안정성 향상"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"5. 협업 및 프로젝트 기여"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 모바일 네이티브 앱과의 협업으로 연동 및 전체 프로젝트의 주요 페이지 개발로 정량적 성과 기여"
                            }
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
                        <TextBasic size="small">{"좌우로 드래그 해보세요!"}</TextBasic>
                    </div>

                    <PicsTemplate filePath={"carenotePics"} domainName={"carenote"} fileNums={6} />
                </div>
            </div>
        </Wrapper>
    )
}

export default Carenote
