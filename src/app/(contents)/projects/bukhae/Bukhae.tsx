"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const Bukhae = (): ReactElement => {
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
                    {"Bukhae (북해)"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2025.01 ~ 현재 | 진행 중"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/myFace.png" alt="logo" width={30} height={30} />
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
                                "- AI와 블록체인 기술을 결합하여 금융의 미래를 다시 쓰는 핀테크 스타트업 프로젝트입니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 투명하고 안전한 금융 생태계 구축을 목표로, AI 기반 금융 뉴스 분석(Desk), AGI 핀테크 어시스턴트, 블록체인 경제 플랫폼 등 다수의 제품을 기획·개발하고 있습니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 혁신(Innovation), 신뢰(Trust), 투명성(Transparency)의 3대 핵심 가치를 기반으로 전통 금융의 한계를 넘어서는 서비스를 지향합니다."
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- CEO / 대표"}</TextBasic>
                        <TextBasic size="small">
                            {"- 서비스 기획 및 비즈니스 전략 수립"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 프론트엔드 / 백엔드 개발 리드"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- AI 파이프라인 설계 및 인프라 관리"}
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"사용스택"}
                        </TextBasic>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/skills/typescript.svg"
                                alt="typescript"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/nextjs.svg"
                                alt="nextjs"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/sass.svg"
                                alt="sass"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/vercel.svg"
                                alt="vercel"
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
                        <TextBasic size="small">{"- AI 전문가, 개발자, 디자이너 포함 팀 구성"}</TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"서비스 주소"}
                        </TextBasic>
                        <TextBasic size="small">
                            <a href="https://bukhae.com" target="_blank" rel="noopener noreferrer">
                                {"https://bukhae.com"}
                            </a>
                        </TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"주요 제품"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. Desk (AI 뉴스 분석)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- AI 기반 실시간 금융 뉴스 수집·분석·요약 서비스로, 30분 단위로 글로벌 주요 금융 매체의 뉴스를 자동 수집합니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 3가지 관점(낙관/비관/현실) AI 분석, 시각적 인과관계 맵핑, 딥리서치 리포트 생성 등의 기능을 제공합니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. AGI FinTech (준비 중)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 사용자 리스크 프로필 기반 맞춤형 투자 포트폴리오 추천, 24시간 이상 거래 감시를 통한 사기 탐지, AI 추론 과정 투명성 보고서를 제공하는 대화형 금융 AI 어시스턴트입니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 블록체인 경제 플랫폼 (준비 중)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 24시간 토큰화 거래, 규제 준수 메커니즘, 고가치 자산의 분할 소유를 통한 탈중앙화 자산 거래 플랫폼입니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"핵심 가치"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- Innovation: 전통 금융의 한계를 넘어서는 혁신적 기술 적용"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- Trust: 사용자 자산과 데이터 보호를 최우선으로 하는 신뢰 구축"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- Transparency: 개방적 프로세스를 통한 공정한 접근 제공"}
                        </TextBasic>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Bukhae
