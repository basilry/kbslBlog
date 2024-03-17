import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/projectsContents.module.scss"

const HectonTechblog = (): JSX.Element => {
    return (
        <Wrapper>
            <div className={styles.eachProjectWrapper}>
                <TextBasic size="xx-large" bold="bold">
                    {"헥톤프로젝트, 테크 블로그"}
                </TextBasic>
                <br />
                <div className={styles.rangeLogo}>
                    <TextBasic size="large" bold="bold">
                        {"2024.02 ~ 진행 중 | 미정(올해 말)"}
                    </TextBasic>
                    <div className={styles.logos}>
                        <img src="/kbslBlog/hecton.png" alt="logo" width={30} height={20} />
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
                        <TextBasic size="small">{"- FullStack: 4명"}</TextBasic>
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
                    </div>
                </div>
                <br />
                <LineBasic />
            </div>
        </Wrapper>
    )
}

export default HectonTechblog
