"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const Desk = (): ReactElement => {
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
                    {"Desk (6esk.com)"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2025.03 ~ 현재 | 진행 중"}
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
                                "- AI 기반 글로벌 금융 뉴스 인텔리전스 플랫폼으로, 현대 투자자를 위한 실시간 뉴스 분석 서비스입니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- Euronews, Financial Times, Reuters 등 주요 글로벌 금융 매체에서 30분 단위로 뉴스를 자동 수집하고, AI 파이프라인을 통해 관련성 분석, 핵심 인사이트 추출, 한국어 번역을 수행합니다."
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 현재 무료 베타로 운영 중이며, Bukhae(북해)의 첫 번째 핵심 서비스입니다."
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 서비스 기획 및 프로덕트 오너"}</TextBasic>
                        <TextBasic size="small">
                            {"- 프론트엔드 개발: Next.js 기반 UI/UX 설계 및 구현"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- AI 파이프라인: 뉴스 수집·분석·번역 파이프라인 설계 및 구축"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 인프라: 서버 구축 및 자동화 배포 관리"}
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
                            <a href="https://6esk.com" target="_blank" rel="noopener noreferrer">
                                {"https://6esk.com"}
                            </a>
                        </TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"주요 기능"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 실시간 브리핑"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 30분 단위로 큐레이션된 글로벌 금융 뉴스를 제공하며, 노이즈를 제거하고 핵심 시장 시그널에 집중합니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 3관점 AI 분석"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 주요 뉴스에 대해 낙관적(긍정적 시장 잠재력), 비관적(리스크 요인), 현실적(균형 잡힌 평가) 세 가지 분석 관점을 자동 생성합니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 스마트 필터링 및 검색"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 카테고리(경제, 정치, 기술), 출처, 시간대, 날짜 범위, 키워드 기반의 맞춤형 필터링으로 원하는 정보를 빠르게 탐색합니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"4. 컨텍스트 이벤트 맵핑"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 뉴스 이벤트 간 인과관계를 시각적 그래프로 표현하여, 개별 헤드라인이 아닌 전체 시장 내러티브를 파악할 수 있도록 지원합니다."
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"5. 딥리서치 리포트"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 선택한 주제에 대해 수십 개의 소스를 분석하여 6단계 종합 분석 리포트를 수 분 내에 자동 생성합니다."
                            }
                        </TextBasic>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Desk
