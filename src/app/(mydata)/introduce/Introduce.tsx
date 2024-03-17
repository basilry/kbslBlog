"use client"

import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/introduce.module.scss"

const Introduce = (): JSX.Element => {
    return (
        <Wrapper>
            <div className={styles.wholeWrapper}>
                <div className={styles.introduceBlock}>
                    <div className={styles.pargraphs}>
                        <div className={styles.block}>
                            <TextBasic size="xx-large" bold="bold">
                                {"About Me | 소개"}
                            </TextBasic>
                            <br />
                            <br />
                            <TextBasic size="large" bold="bold">
                                {"저는 꿈이 한 가지 있습니다."}
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "언젠가 대한민국의 IT유니콘 중 당당하게 한 자리를 차지한 기업을 만들고 싶은 '김바실리'입니다."
                                }
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "저는 제가 만든 유니콘 기업을 통해서 세상을 보다 편리하고 즐거운 세상으로 만들고 싶습니다."
                                }
                            </TextBasic>
                        </div>
                        <div className={styles.block}>
                            <TextBasic size="large" bold="bold">
                                {"처음에는"}
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">{"동적인 화면이 좋아 프론트엔드 개발자를 지향하였고,"}</TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "커리어 시작 이후에는 React.js를 기반으로 Next.js, Sass(Scss), Redux, Zustand 등의 스택을 지속적으로 사용해 왔습니다."
                                }
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "개발을 지속하다보니 백엔드에 관해서도 관심이 생겨서 Node.js, Java, AWS, CS 관련 학습도 꾸준히 진행 중입니다."
                                }
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {"최근에는 회사 실무 프로젝트를 통해 백엔드 포지션에 관련된 과업도 수행하고 있습니다."}
                            </TextBasic>
                        </div>
                        <div className={styles.block}>
                            <TextBasic size="large" bold="bold">
                                {"진정한 개발자란,"}
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "프론트엔드의 틀에만 갇혀 있지 않고 백엔드와 인프라도 모두 알 수 있어야 진정한 개발자라고 생각합니다."
                                }
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "처음 '풀스택'이라는 말을 들었을 때는 '말도 안된다'거나 '허상이다'라고 생각했었습니다만,"
                                }
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "필드에서 2년 넘게 개발을 하다보니 개발과 관련된 전 분야를 망라해야 개발자로서의 가치를 증명할 수 있다고 봅니다."
                                }
                            </TextBasic>
                        </div>
                        <div className={styles.block}>
                            <TextBasic size="large" bold="bold">
                                {"그리고 언젠가는,"}
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">
                                {
                                    "언젠가는 오롯이 혼자서 프로젝트 구조설계, 화면 개발, 에러핸들링, 서버 구축, 보안, 인프라 구축까지 할 수 있게끔 실력을 키우고 싶습니다! ;)"
                                }
                            </TextBasic>
                        </div>
                    </div>
                    <div className={styles.myPics}>
                        <img
                            src="/kbslBlog/myPics.jpg"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                    </div>
                </div>
                <LineBasic />
                <div className={styles.careerBlock}>
                    <div className={styles.careerParagraphs}>
                        <TextBasic size="xx-large" bold="bold">
                            {"Career Now | 경력"}
                        </TextBasic>
                        <br />
                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"홍익대학교 법과대학 법학 학사 졸업 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2012. 03. ~ 2017. 02."}
                            </TextBasic>
                        </div>
                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"대한민국 공군 학사장교 제138기 단기복무 중위 제대 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2017. 02. ~ 2020. 05."}
                            </TextBasic>
                        </div>

                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"강화도 퓨전한식 요식업 창업 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2020. 08. ~ 2021. 02."}
                            </TextBasic>
                        </div>

                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"사설 소프트웨어 엔지니어링 부트캠프 수료 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2021. 03. ~ 2021. 07."}
                            </TextBasic>
                        </div>

                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"헬코더스 면접/알고리즘 스터디 모집 및 진행 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2021. 07. ~ 2021. 09."}
                            </TextBasic>
                        </div>

                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"GC케어 자회사 헥톤프로젝트 웹 개발자 재직 중 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2021. 09. ~ 현 재"}
                            </TextBasic>
                        </div>

                        <br />
                        <div className={styles.cbParagraph}>
                            <TextBasic size="small" bold="bold">
                                {"한국방송통신대학교 컴퓨터과학과 학사편입 후 재학 중 |"}
                            </TextBasic>
                            <TextBasic size="small" className={"careerYear"}>
                                {"2022. 09. ~ 현 재"}
                            </TextBasic>
                        </div>
                    </div>
                </div>
                <LineBasic />
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xx-large" bold="bold">
                        {"Seminar | 연구개발"}
                    </TextBasic>
                    <br />
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"또하나의가족 솔루션 UI 라이브러리 비교 분석 보고"}
                        </TextBasic>
                        <TextBasic size="small">{"2021. 10. 13."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"AWS 아키텍트 어소시에이트 Ch 1. 분석 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2022. 05. 13."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"AWS 아키텍트 어소시에이트 Ch 2. 분석 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2022. 05. 20."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"AWS 아키텍트 어소시에이트 Ch 3. 분석 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2022. 06. 12"}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"AWS 아키텍트 어소시에이트 Ch 4. 분석 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2022. 07. 08."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"LINE 오픈챗 서버가 100배 급증하는 트래픽을 다루는 방법 - 세미나 참여 분석 공유 및 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2022. 12. 12."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"Scouter 모니터링 시스템 연구 공유"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 02. 29."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"또하나의가족 솔루션 공통모듈 설계 관련 보고"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 04. 05."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"OpenAI GPT발 LLM모델 AI 본격화 시대에 대한 찍먹 - 세미나 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 05. 26."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"AWS Korea Office Hour 외부교육 참여 및 보고"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 09. 07."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"헥톤프로젝트 제품군 클라우드 관련 조사 후 보고"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 11. 11."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"2023 대한민국 소프트웨어대전 참석 후 공유 및 보고"}
                        </TextBasic>
                        <TextBasic size="small">{"2023. 11. 30."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"헥톤 테크블로그 Spring Boot 기술 도입 분석 후 공유 및 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2024. 02. 26."}</TextBasic>
                    </div>
                    <br />
                    <div className={styles.seminarBlock}>
                        <TextBasic size="small" bold="bold">
                            {"헥톤 테크블로그 백엔드 프로젝트 디자인패턴 도입 분석 후 공유 및 발표"}
                        </TextBasic>
                        <TextBasic size="small">{"2024. 03. 15."}</TextBasic>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Introduce
