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

const ImsPart2 = (): ReactElement => {
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
                    {"또하나의가족, IMS(통합관리시스템) Part 2."}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="large" bold="bold">
                        {"2024.04 ~ 2024.05 | 2개월"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/hecton.png" alt="logo" width={30} height={20} />
                        <Image src="/ddoga_logo.svg" alt="logo" width={115} height={30} />
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
                            {"- 자사에서 인수한 복지용구 사업소 내부 및 외부 영업사원 관리 백오피스 모바일 웹 프로젝트"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 기존 개발된 파트인 수급자 조회 부분 고도화 및 신규 프로젝트인 관리자 사이트 내 공지사항 목록과 검색기능 개발"
                            }
                        </TextBasic>
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
                                src="/skills/emotion.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={100}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/reactquery.svg"
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
                                src="/skills/mui.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                        </div>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/skills/java.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/springboot.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={100}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/jpa.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/hibernate.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={140}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/skills/querydsl.png"
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
                        <TextBasic size="small">{"- PM: 1명"}</TextBasic>
                        <TextBasic size="small">{"- F/E: 3명(PL 1명 포함)"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 2명(PL 1명 포함)"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 통합관리시스템 | 수급자조회 고도화"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 기존 통합관리시스템 내 수급자조회 페이지 내 검색조건 일원화, 수급자 검색이력 BottomUpSheet 모달 공통 컴포넌트화, 고객 상세 페이지 내 구매 가능한 복지용구 물품 목록 검색 기능 추가"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 디자이너와 피그마를 통한 협업으로 시안과 통일성 있는 스타일링 적용"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 통합관리시스템 관리자 | 공지사항 신규 개발"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 통합관리시스템 관리자 프로젝트 신규개발건 중 공지사항 목록과 검색조건, 그리고 개별 로우에서 데이터 수정을 할 수 있게끔 개발"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- React-Query와 React-Hool-Form을 통해 무한스크롤이 아닌 숫자클릭 형태의 페이지네이션 기능 신규개발"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 즉, 개별 탭과 검색조건, 페이지네이션을 종합한 검색가능한 목록 조회 페이지 구성"}
                        </TextBasic>
                        <br />
                        <TextBasic size="small">
                            <span className={styles.red}>*</span>
                            {"백엔드를 키워야하는 신규 입사자가 있어 풀스택이 아닌 프론트엔드 파트에 집중"}
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
                    <PicsTemplate filePath={"ims2Pics"} domainName={"ims"} fileNums={5} />
                </div>
            </div>
        </Wrapper>
    )
}

export default ImsPart2
