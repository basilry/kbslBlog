import Image from "next/image"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/pages/solutionInit.module.scss"

const ImsPart1 = (): JSX.Element => {
    return (
        <div>
            <TextBasic size="xx-large" bold="bold">
                {"4. 또하나의가족, 통합관리시스템 Part1."}
            </TextBasic>
            <br />
            <TextBasic size="large" bold="bold">
                {"2024.02 ~ 2024.03(진행 중) | 2개월"}
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
                            "- 자사에서 인수한 복지용구 사업소 내부 및 외부 영업사원 관리 백오피스 모바일 웹 프로젝트입니다."
                        }
                    </TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"포지션"}
                    </TextBasic>
                    <TextBasic size="small">{"- 풀스택 개발자."}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"성과"}
                    </TextBasic>
                    <TextBasic size="medium">{"1. 프론트엔드 | 정량적인 개발 성과 기여"}</TextBasic>
                    <TextBasic size="small">
                        {
                            "- 수급자 조회, 직원 입사허용/입사거절/퇴사 처리, 직원 상세 조회 등의 신규 기능개발을 위해 페이지 및 컴포넌트 작성"
                        }
                    </TextBasic>
                    <TextBasic size="small">
                        {"- 디자이너와 피그마를 통한 협업으로 시안과 통일성 있는 스타일링 적용"}
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">{"2. 프론트엔드 | 공통 컴포넌트 리팩토링"}</TextBasic>
                    <TextBasic size="small">
                        {
                            "- Table, DateRangePicker 등 공통 컴포넌트 중 기능이 부족한 컴포넌트들을 담당받아 완결성 있게끔 처리"
                        }
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">{"3. 백엔드 | 정량적인 개발 성과 기여"}</TextBasic>
                    <TextBasic size="small">
                        {
                            "- 수급자 조회, 직원 비밀번호/휴대폰번호 변경, 고객 목록 조회, 고객 검색 조회 등의 신규 기능개발을 위해 controller, dto, service 개발"
                        }
                    </TextBasic>
                    <TextBasic size="small">
                        {"- 포스트맨을 통해 화면을 개발한 프론트엔드 개발자와 지속적으로 협업 진행하며 동기화"}
                    </TextBasic>
                    <br />
                    <TextBasic size="medium">
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
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"사용스택"}
                    </TextBasic>
                    <TextBasic size="small">
                        {"- F/E: TypeScript, Next.js 13v, Emotion, React-Query, Zustand, ESLint, Prettier, MUI"}
                    </TextBasic>
                    <TextBasic size="small">{"- B/E: Java 17, SpringBoot, JPA, Hibernate, QueryDsl, MSSQL"}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large" bold="bold">
                        {"프로젝트 인원"}
                    </TextBasic>
                    <TextBasic size="small">{"- PM: 1명"}</TextBasic>
                    <TextBasic size="small">{"- F/E: 3명(PL 1명 포함)"}</TextBasic>
                    <TextBasic size="small">{"- B/E: 3명(PL 1명 포함)"}</TextBasic>
                </div>
                {/*TODO: 이미지 클릭시 모달 띄워서 크게 보여주기 */}
                <div className={styles.picsWrapper}>
                    <div className={styles.picsBlock}>
                        <Image
                            placeholder="blur"
                            src="/imsPics/ims1.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                        <Image
                            placeholder="blur"
                            src="/imsPics/ims2.png"
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
                            src="/imsPics/ims3.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={0}
                            height={0}
                            className={styles.pics}
                        />
                        <Image
                            placeholder="blur"
                            src="/imsPics/ims4.png"
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

export default ImsPart1
