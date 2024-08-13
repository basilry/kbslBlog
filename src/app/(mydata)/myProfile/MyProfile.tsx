"use client"

import { ReactElement } from "react"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/pages/myProfile.module.scss"

const MyProfile = (): ReactElement => {
    const { darkMode } = useCoreStore()

    return (
        <Wrapper>
            <div className={classNames(styles.box, styles.topBox, !darkMode && styles.dark)}>
                <img
                    className={styles.pics}
                    src={"/kbslBlog/myPics2.jpg"}
                    sizes={"100vw"}
                    width={0}
                    height={0}
                    alt={"myPics2"}
                />
                <div className={styles.textWrapper}>
                    <TextBasic size="xx-large" bold="bold">
                        {"김바실리"}
                    </TextBasic>
                    <br />
                    <br />
                    <br />
                    <TextBasic size="large">{"#생년월일 | 1992.03.17."}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">#성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;별 | 남</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">{"#취미는요 | 맛있는거 먹기, 자기개발 하기, 미래 생각하기"}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">{"#소중한내 | 현 여친&예비 와이프"}</TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">
                        {"#가보고픈 | 포르투갈, 노르웨이, 이탈리아, 프랑스, 홍콩, 싱가폴..."}
                    </TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">
                        {"#내꿈은요 | 연남동 꼬마빌딩 건물주(1층에는 무조건 브런치카페)"}
                    </TextBasic>
                    <br />
                    <br />
                    <TextBasic size="large">{"#언젠가는 | 건물주가 되리라"}</TextBasic>
                </div>
            </div>

            {/*<LineBasic />*/}

            {/*<div className={classNames(styles.box, styles.secondBox, !darkMode && styles.dark)}>*/}
            {/*    <TextBasic size="xx-large" bold="bold">*/}
            {/*        {"여행기록001"}*/}
            {/*    </TextBasic>*/}
            {/*    <br />*/}
            {/*    <TextBasic size="large">*/}
            {/*        {*/}
            {/*            "오사카 도톤보리의 뒷골목입니다. 좋아하는 분위기의 골목이었어요! 부부께서 하시는 이자카야도 정말 맛있었습니다. 일본어를 조금만 더 잘했으면 옆 테이블의 손님들과 이야기하며 즐겼을텐데 말이죠 ^^;"*/}
            {/*        }*/}
            {/*    </TextBasic>*/}
            {/*    <div className={styles.osakaWrapper}>*/}
            {/*        <img*/}
            {/*            className={styles.pics}*/}
            {/*            src={"/kbslBlog/osaka.jpg"}*/}
            {/*            sizes={"100vw"}*/}
            {/*            width={0}*/}
            {/*            height={0}*/}
            {/*            alt={"myPics2"}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<LineBasic />*/}

            {/*<div className={classNames(styles.box, styles.thirdBox, !darkMode && styles.dark)}>*/}
            {/*    <div className={styles.titleWrapper}>*/}
            {/*        <TextBasic size="xx-large" bold="bold">*/}
            {/*            {"여행기록002"}*/}
            {/*        </TextBasic>*/}
            {/*        <br />*/}
            {/*        <TextBasic size="large">*/}
            {/*            {*/}
            {/*                "교토 료칸이 생각나네요.. 아라시야마의 료칸도 좋았고, 우리나라 북촌이랑 인사동 느낌이랑 비슷한 기요미즈데라 올라가는 길도 좋았습니다! 아쉽게도 기요미즈데라점 스타벅스는 사람이 너무 많아서 들어가지도 못하고 나왔네요 ㅎㅎ"*/}
            {/*            }*/}
            {/*        </TextBasic>*/}
            {/*    </div>*/}
            {/*    <div className={styles.kyotoWrapper}>*/}
            {/*        <img*/}
            {/*            className={styles.pics}*/}
            {/*            src={"/kbslBlog/kyoto.jpg"}*/}
            {/*            sizes={"100vw"}*/}
            {/*            width={0}*/}
            {/*            height={0}*/}
            {/*            alt={"myPics2"}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <LineBasic />
        </Wrapper>
    )
}

export default MyProfile
