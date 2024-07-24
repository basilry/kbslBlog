"use client"

import { Fragment } from "react"
import Link from "next/link"
import classNames from "classnames"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import carrerJson from "@lib/json/career.json"
import seminarJson from "@lib/json/seminar.json"
import { useCoreStore } from "@lib/stores/store"
import { DateFormat, formatDate } from "@lib/utils/common"
import styles from "@styles/pages/introduce.module.scss"

const Introduce = (): JSX.Element => {
    const { darkMode } = useCoreStore()

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
                        {carrerJson.map((row) => (
                            <Fragment key={row.title}>
                                <div className={styles.cbParagraph}>
                                    <TextBasic size="small" bold="bold">
                                        {row.title}
                                    </TextBasic>
                                    <TextBasic size="small" className={"careerYear"}>
                                        {formatDate(row.startDate, DateFormat.MONTH_DATE) +
                                            " ~ " +
                                            formatDate(row.endDate, DateFormat.MONTH_DATE)}
                                    </TextBasic>
                                </div>
                                <br />
                            </Fragment>
                        ))}
                    </div>
                </div>
                <LineBasic />
                <div className={styles.seminarAndRND}>
                    <TextBasic size="xx-large" bold="bold">
                        {"Activity | 연구개발 & 교육 & 보고 & 수료"}
                    </TextBasic>
                    <div className={styles.dotWrapper}>
                        <span className={styles.red}>*</span>
                        <TextBasic size={"x-small"} bold={"normal"}>
                            {": 외부 링크로 연결됩니다."}
                        </TextBasic>
                    </div>
                    <br />
                    <br />
                    {seminarJson.map((seminar) => (
                        <Link
                            key={seminar.id + seminar.date}
                            href={seminar.url ?? "#"}
                            target={seminar.url ? "_blank" : ""}
                            scroll={false}
                        >
                            <div
                                className={classNames(
                                    styles.seminarBlock,
                                    seminar.url && styles.active,
                                    darkMode && styles.dark,
                                )}
                                style={{
                                    cursor: seminar.url ? "pointer" : "default",
                                }}
                            >
                                <TextBasic className={styles.wrapper} size="medium" bold="bold">
                                    {seminar.url && <span className={styles.red}>*</span>}
                                    {seminar.title}
                                </TextBasic>
                                {seminar.subTitle && (
                                    <div className={styles.subTitle}>
                                        <TextBasic className={styles.subTitle} size="x-small" bold="bold">
                                            {"/ " + seminar.subTitle}
                                        </TextBasic>
                                    </div>
                                )}
                                <TextBasic size="x-small">{formatDate(seminar.date)}</TextBasic>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <LineBasic />
        </Wrapper>
    )
}

export default Introduce
