"use client"

import { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import LtcgaPics from "@app/(contents)/projects/ltcga/LtcgaPics"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const Ltcga = (): ReactElement => {
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
                    {"또하나의가족, 플랫폼 고도화 - 장기요양등급신청"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="large" bold="bold">
                        {"2024.06 ~ 2024.07 | 2개월"}
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
                                "- '또하나의가족': 장기요양수급자와 장기요양기관 사이의 공급&수급을 이어주는 플랫폼 서비스. 고도화가 꾸준히 진행되면서 요양기관이 높은 등급을 받기 위한 가이드 컨텐츠와 수급자의 장기요양등급신청 전 등급확인을 위한 테스트 기능도 추가됨"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- '또하나의가족 관리자' : 또하나의가족 서비스 내 컨텐츠, 또하나의가족 파트너스(요양기관 전용) 내부 공지 등에 대해 본사에서 관리하는 어드민 프로젝트"
                            }
                        </TextBasic>
                        <br />
                        <br />
                        <TextBasic size="large" bold="bold">
                            {"포지션"}
                        </TextBasic>
                        <TextBasic size="small">{"- 또하나의가족 관리자 : 풀스택 개발자"}</TextBasic>
                        <TextBasic size="small">{"- 또하나의가족 : 프론트엔드 개발자"}</TextBasic>
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
                        </div>
                        <div>
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/nodejs.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/expressjs.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={80}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/mysql.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/kendoui.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={100}
                                height={50}
                            />
                            <img
                                className={styles.skillImgs}
                                src="/kbslBlog/skills/angularjs.png"
                                alt="myFace"
                                sizes={"100vw"}
                                width={60}
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
                        <TextBasic size="small">{"- FullStack: 2명(PL 1명 포함)"}</TextBasic>
                        <TextBasic size="small">{"- B/E: 1명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 또하나의가족 관리자 | 대시보드 고도화"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 또하나의가족 관리자(이하 관리자)는 레거시한 스택(angular.js 1.8v, jsp, java가 하나의 프로젝트)으로 구성되어 있기에 별도의 소스분석 기간이 필요"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 대시보드 부분에는 기존 회원가입수, 기관등록수 등이 존재했으며, 장기요양등급테스트와 등급신청에 대한 내용은 금번에 신규로 추가"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 대시보드는 KendoUI 내 그래프를 통해 구성하였으며, 하단부 테이블은 angular 문법의 jsp로 구성"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 또하나의가족 관리자 | 장기요양등급신청 관리 신규 메뉴 개발"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 장기요양등급신청 관리에 대한 별도 메뉴 페이지 신규개발을 통해 등급신청과 관련된 웹팩스 발송이력 관리 기능 개발"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 목록 테이블에서는 전반적인 정보와 발송완료 구분을 할 수 있고 재전송 버튼이 존재하며, 개별 로우 클릭시 발생하는 상세 모달에서는 해당 수급자의 상세정보와 등급신청시 실제 신청자가 누군지에 대한 정보 및 해당 수급자의 전체 등급신청 발송이력 확인 가능(재전송 기능 존재)"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 재전송 기능은 Java의 controller를 통해 service파일의 interface, impl 파일을 거쳐 '또하나의가족 Message 서버'를 통해 '바로빌(웹팩스 발송업체)'에게 데이터를 전송하고, 추가적으로 웹팩스 발송 history를 관리하기 위해 MySQL Procedure에 이력을 쌓게끔 호출하여 결과 반환값을 받는 형식으로 구성"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. 또하나의가족 | 수급자 조회 기능 신규 페이지 개발"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 또하나의가족 플랫폼을 통해 메뉴에는 표출하지 않되 외부 불특정 다수 유저들이 접근 가능하게 공개 페이지로 장기요양수급자를 조회할 수 있게 하는 신규 기능 개발"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 장기요양인정번호와 수급자 명을 통해, 해당 수급자가 어떤 등급과 퍼센티지를 갖고 있고 어떠한 복지용구를 구입/대여가능한지에 대해 조회 가능하게 구성"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 기존의 통합관리시스템에서 사용하고 있는 장기요양공단 스크래핑 서버의 API를 확장 활용"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"4. 또하나의가족 | 장기요양등급신청 기능 신규 개발"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 장기요양등급신청 기능 신규개발을 할 수 있는 단계별 신청 페이지 구성"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 기존 장기요양등급테스트와 연계되어 테스트가 끝나면 신청 페이지로 이동할 수 있게끔 가이드"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 장기요양등급신청에 대해 웹펙스 기능을 추가하여 필요한 서류 업로드 및 정보 입력 시 직접 공단 방문 혹은 팩스를 보내지 않아도 손쉽게 등급신청을 할 수 있게하는 기능 추가"
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

                    <LtcgaPics />
                </div>
            </div>
        </Wrapper>
    )
}

export default Ltcga
