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

const ImsPart1 = (): ReactElement => {
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
                    {"또하나의가족, 통합관리시스템 Part1."}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="x-large" bold="bold">
                        {"2024.02 ~ 2024.03(진행 중) | 2개월"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={20} />
                        <Image placeholder="blur" src="/kbslBlog/ddoga_logo.svg" alt="logo" width={115} height={30} />
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
                                "- 자사에서 인수한 복지용구 사업소 내부 및 외부 영업사원 관리 백오피스 모바일 웹 프로젝트입니다."
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 풀스택 개발자"}</TextBasic>
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
                                src="/kbslBlog/skills/emotion.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={100}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/reactquery.svg"
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
                                src="/kbslBlog/skills/mui.svg"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                        </div>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/java.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/springboot.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={100}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/jpa.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/hibernate.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={140}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/querydsl.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={60}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/mssql.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={160}
                                height={50}
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
                        <TextBasic size="small">{"- PM: 1명"}</TextBasic>
                        <TextBasic size="small">{"- F/E: 2명(PL 1명 포함)"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 2명(PL 1명 포함)"}</TextBasic>
                        <TextBasic size="small">{"- FullStack: 1명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 프론트엔드 | 정량적인 개발 성과 기여"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 수급자 조회, 직원 입사허용/입사거절/퇴사 처리, 직원 상세 조회 등의 신규 기능개발을 위해 페이지 및 컴포넌트 작성"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 디자이너와 피그마를 통한 협업으로 시안과 통일성 있는 스타일링 적용"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 프론트엔드 | 공통 컴포넌트 리팩토링"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- Table, DateRangePicker 등 공통 컴포넌트 중 기능이 부족한 컴포넌트들을 담당받아 완결성 있게끔 처리"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 백엔드 | 정량적인 개발 성과 기여"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 수급자 조회, 직원 비밀번호/휴대폰번호 변경, 고객 목록 조회, 고객 검색 조회 등의 신규 기능개발을 위해 controller, dto, service 개발"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 포스트맨을 통해 화면을 개발한 프론트엔드 개발자와 지속적으로 협업 진행하며 동기화"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"4. 장기요양공단 스크래핑 모듈 API 프로젝트 서버와의 통신 및 F/E, B/E 연계 전반 담당"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 클라이언트에서 API 서버로 조회 파라미터 값을 보내게 되면 HashMap, ObjectMapper으로 데이터 바인딩 하여 RestTemplate을 통해 스크래핑 모듈 API로 송신"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 스크래핑 모듈 API에서 수신한 데이터는 재차 ObjectMapper로 받아 JsonNode로 파싱 후 클라이언트로 API 송신 처리"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 클라이언트에서는 API 서버에서 수신한 데이터를 통해 조회 처리"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"5. 단위 테스트 이후 프론트 프로젝트 전반에 적용되는 피드백 적용 담당"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 각 인풋 엘리먼트의 validation을 위해 react-imask 처리를 이름/사번/휴대번호/인정번호 등으로 세분화하여 구성 및 적용"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- react-hook-form이 적용된 부분의 각 페이지별 선언부에 해당 데이터 적용에 대한 라이프사이클 시점을 onBlur로 조정 외 다수"
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
                    <PicsTemplate filePath={"imsPics"} domainName={"ims"} fileNums={6} />
                </div>
            </div>
        </Wrapper>
    )
}

export default ImsPart1
