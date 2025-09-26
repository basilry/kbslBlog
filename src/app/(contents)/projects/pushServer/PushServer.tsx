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

const PushServer = (): ReactElement => {
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
                    {"또하나의가족, 플랫폼 전반 핑거푸시 외부 API 연동 및 로직 개발"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2024.08 ~ 2024.09 | 2개월"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/hecton.png" alt="logo" width={30} height={20} />
                        <Image src="/ddoga_logo.svg" alt="logo" width={120} height={30} />
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
                                "또하나의가족 플랫폼 전반에서 유저를 대상으로 한 모바일 핑거푸시 알람 서비스를 외부 API와 연동하고, 기존에 존재하고 있던 백엔드와 스케줄러 서버에 존재하는 개별 API 서비스 쪽에 로직을 심어서 새롭게 마케팅 범위를 확장하는 프로젝트입니다."
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 프로젝트 전반 : 기획 및 정책 협의"}</TextBasic>
                        <TextBasic size="small">{"- 또하나의가족 스케줄러 : 백엔드 개발자"}</TextBasic>
                        <TextBasic size="small">{"- 또하나의가족 : 풀스택 개발자"}</TextBasic>
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
                                width={60}
                                height={60}
                            />
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
                                src="/skills/mysql.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
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
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/skills/nodejs.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/expressjs.png"
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
                        <TextBasic size="small">{"- PM: 1명"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 2명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 또하나의가족 플랫폼 | 핑거푸시 API 연동을 위한 기획 분석 및 정책 협의"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 새로운 기획자 및 팀과의 협업이기도 하고, 플랫폼 전반에 적용되는 대규모 업데이트 건이다 보니 자세한 기획 분석과 정책적 분야에서의 협의가 필요"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                " 이에 플랫폼 신규개발을 담당하는 팀과 운영개발을 담당하는 팀과 협업을 통해 정보를 취합하고 목록화 하며, 정책 기획서의 세부사항을 회의를 통해 명확화"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 또하나의가족 스케줄러 | 핑거푸시 API 및 개별 로직 연동"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"  - 총 3가지 로직 개발"}
                            <TextBasic size="small">
                                {"1) 한 번이라도 요양상담의 답변을 받은 유저에게 매주 월요일 대량발송"}
                            </TextBasic>
                            <TextBasic size="small">
                                {"2) 요양상담을 접수하지 않고 이탈한 사용자에게 익일 대량발송"}
                            </TextBasic>
                            <TextBasic size="small">
                                {"3) 한 주 간 조회수가 가장 높았던 요양정보를 금요일에 일괄발송"}
                            </TextBasic>
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 또하나의가족 | 상담이탈자 이벤트 이력 추가 로직 연동"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 프론트에서 상담 접속 시 백엔드의 신규 서비스 엔드포인트를 통해 이벤트 이력 추가 로직 연동 처리 및 이와 관련된 프로시저 신규 개발"
                            }
                        </TextBasic>
                        <br />
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default PushServer
