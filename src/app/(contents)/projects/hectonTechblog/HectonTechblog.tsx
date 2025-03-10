"use client"

import { ReactElement } from "react"
import Link from "next/link"
import classNames from "classnames"
import PicsTemplate from "@app/(contents)/projects/PicsTemplate"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/projectsContents.module.scss"

const HectonTechblog = (): ReactElement => {
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
                    {"헥톤프로젝트, 테크 블로그"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="large" bold="bold">
                        {"2024.02 ~ 2024.09 | 이직으로 인한 중지"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/hecton.png" alt="logo" width={30} height={20} />
                    </div>
                </div>
                <LineBasic />
                <br />
                <div className={styles.contentsWrapper}>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"설명"}
                        </TextBasic>
                        <TextBasic size="small">{"- 헥톤프로젝트 테크 블로그 사이드 프로젝트입니다."}</TextBasic>
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
                        <TextBasic size="small">{"- FullStack: 6명"}</TextBasic>
                        <br />
                        <br />
                    </div>
                    <div className={styles.paragraphs}>
                        <TextBasic size="large" bold="bold">
                            {"성과"}
                        </TextBasic>
                        <TextBasic size="medium" bold="bold">
                            {"1. 기술 스택 도입을 위한 기술 조사 및 검토 후 발표"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 스프링 부트 프레임워크를 사용한 백엔드 서버 구축과 추후 운영에 대한 기술 조사 및 검토 후 발표"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 조사과정 중 자바와 스프링 프레임워크, 그리고 JVM 등에 대한 역사와 장/단점 등에 대한 깊은 조사 및 공유를 통해 기술 스택 도입에 대한 정당성을 확보"
                            }
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"2. 백엔드 프로젝트 아키텍처 설계 및 구현을 위한 디자인 패턴 조사 및 검토 후 발표"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 아키텍처 설계 레벨에서의 디자인 패턴 조사(Layerd Architecture)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 전반적인 폴더/파일 구조 형태 관련 디자인 패턴 조사(MVC)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 비즈니스 로직 관련 디자인 패턴 조사(Factory Method Pattern)"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- JPA 도입을 위한 디자인 패턴 조사(Repository Pattern, Data Mapper Pattern)"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"3. ERD 스키마 설계를 통한 데이터베이스 테이블 구조 구성 및 검토 후 발표"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"4. 백엔드 프로젝트 초기 기반 셋팅 및 빌드를 위한 보안 분야 조사 및 검토 후 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"- Spring Boot를 통한 기반 셋팅"}</TextBasic>
                        <TextBasic size="small">
                            {"- Spring Security와 JWT를 적절히 통합한 보안 파일 구조 설계"}
                        </TextBasic>
                        <TextBasic size="small">{"- 기반이 되는 자사 프로젝트 N개 분석 후 발표"}</TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"5. 프로젝트 전반 와이어프레임(Wireframe) 및 기획문서 구성"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- uizard의 AI 구성 보조 툴을 이용하여 프로젝트 전반 페이지에 해당하는 내용 구성"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 해당 내용 중 실제 버튼 클릭 시 해당되는 페이지로 이동하게끔 하는 목업 단계의 디자인 구성"
                            }
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 최종적으로 전체 페이지 구성 후 PPT 스토리북형태로 구성하여 검토 후 발표"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 금문제로 인해 uizard에서 회사 디자인 툴인 figma로 순차 이동 중"}
                        </TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"6. 프로젝트 실제 개발을 위한 메뉴 인터페이스 및 WBS 구성"}
                        </TextBasic>
                        <TextBasic size="small">
                            {
                                "- 기반작업, 프론트엔드, 백엔드를 포함하여 요구사항 명세/디자인시안/기획에 기반한 메뉴 인터페이스 구성"
                            }
                        </TextBasic>
                        <TextBasic size="small">{"- 이를 바탕으로한 WBS 공수 구성하여 담당자 할당"}</TextBasic>
                        <br />
                        <TextBasic size="medium" bold="bold">
                            {"7. 실제 개발 진행"}
                        </TextBasic>
                        <TextBasic size="small">{"1) BackEnd"}</TextBasic>
                        <TextBasic size="small">
                            {"- Spring Security와 JWT를 통합한 보안 구조 설계에 기반한 실제 개발 완료"}
                        </TextBasic>
                        <TextBasic size="small">
                            {"- 로그인 개발 시 토큰을 지속적으로 refresh 할 수 있게끔 기반 작업 처리 완료"}
                        </TextBasic>
                        <TextBasic size="small">{"2) FrontEnd"}</TextBasic>
                        <TextBasic size="small">{"- 프로젝트 공통 컴포넌트 13개 개발 진행"}</TextBasic>
                        <TextBasic size="small">
                            {
                                "- 종류 : Button, Selectbox, Typography, Thubnail, Input, Textarea, Profile, WriteButton, Toggle, DatePicker, Progressbar, Modal, EditorViewer"
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

                    <PicsTemplate filePath={"blogPics"} domainName={"blog"} fileNums={6} />
                </div>
            </div>
        </Wrapper>
    )
}

export default HectonTechblog
