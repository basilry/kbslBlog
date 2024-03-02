"use client"

import Image from "next/image"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/pages/solutionInit.module.scss"

const SolutionInit = (): JSX.Element => {
    return (
        <div>
            <TextBasic size="xx-large" bold="bold">
                {"1. 또하나의가족, Solution"}
            </TextBasic>
            <br />
            <TextBasic size="large" bold="bold">
                {"2021.12 ~ 2023.06 | 1년 6개월"}
            </TextBasic>
            <LineBasic />
            <br />
            <br />
            <div className={styles.contentsWrapper}>
                <div className={styles.paragraphs}>
                    <TextBasic size="large" bold="bold">
                        {"설명"}
                    </TextBasic>
                    <TextBasic size="small">
                        {
                            "- 장기요양기관 내 어르신 대상 장기요양 행위를 기록하고 시설을 관리하는 백오피스 솔루션 웹 프로젝트입니다."
                        }
                    </TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"포지션"}
                    </TextBasic>
                    <TextBasic size="small">{"- 주 포지션으로는 프론트엔드 개발자를 담당하였습니다."}</TextBasic>
                    <TextBasic size="small">
                        {
                            "- 서브 포지션으로는 프로시저 쿼리 개발과 AWS 인프라 이슈 확인 및 F/E와 B/E 스테이징(검증) 서버 구축을 담당하였습니다."
                        }
                    </TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"성과"}
                    </TextBasic>
                    <TextBasic size="medium">{"1. 프로젝트 관리자 시스템 개발"}</TextBasic>
                    <TextBasic size="small">
                        {"- 기본적인 메뉴, 마스터코드, 권한 관리 기능 개발을 통한 프로젝트 관리 강화."}
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">{"2. 프로젝트의 정량적인 개발 성과 기여"}</TextBasic>
                    <TextBasic size="small">
                        {
                            "- 총 84개 페이지 중 31개 신규 페이지 개발 및 프로시저 쿼리 개발, 프론트엔드와 백엔드 모두에서 기여"
                        }
                    </TextBasic>
                    <TextBasic size="small">
                        {"- AWS EC2 서버 및 ELB 관리, 검증서버 구축으로 프로젝트 인프라 관리 향상."}
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">{"3. 코드 품질 및 개발 속도 향상"}</TextBasic>
                    <TextBasic size="small">
                        {"- Prettier, ESLint, SonarQube를 통한 코드 품질 관리, 정적분석 수정사항 지속 반영"}
                    </TextBasic>
                    <TextBasic size="small">
                        {"- B/E 프로시저 공통모듈화 11건, F/E 공통모듈화 43건 수행하여 프로젝트 개발 속도 향상"}
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">{"4. 프로젝트 전체 품질 및 협업 강화"}</TextBasic>
                    <TextBasic size="small">{"- 지속적인 소스 코드 및 쿼리 리팩토링으로 프로젝트 품질 향상"}</TextBasic>
                    <TextBasic size="small">
                        {"- Notion을 통한 기술 및 트러블슈팅 공유로 커뮤니케이션 활성화"}
                    </TextBasic>
                    <TextBasic size="small">{"- 스크럼 회의록 작성 및 공유로 팀 내 협업 강화"}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"사용스택"}
                    </TextBasic>
                    <TextBasic size="small">
                        {"- TypeScript, Next.js 12v, Sass, Redux, Prettier, ESLint, MySQL, AWS(EC2, ELB..)"}
                    </TextBasic>
                    <TextBasic size="small">{"- Kendo UI, OzViewer"}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"프로젝트 인원"}
                    </TextBasic>
                    <TextBasic size="small">{"- F/E: 4명"}</TextBasic>
                    <TextBasic size="small">{"- B/E: 2명"}</TextBasic>
                </div>
                {/*TODO: 이미지 클릭시 모달 띄워서 크게 보여주기 */}
                <div className={styles.picsWrapper}>
                    <div className={styles.picsBlock}>
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/sirMast.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/empMast1.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                    </div>
                    <div className={styles.picsBlock}>
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/sirMast2.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/empMast2.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                    </div>
                    <div className={styles.picsBlock}>
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/careProv.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                        <Image
                            placeholder="blur"
                            src="/kbslBlog/solutionPics/empMast4.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                    </div>
                </div>
            </div>

            <br />

            <LineBasic />
        </div>
    )
}

export default SolutionInit
