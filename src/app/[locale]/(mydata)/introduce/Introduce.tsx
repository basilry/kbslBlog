"use client"

import { useLocale } from "@lib/i18n/context"
import { translateData, translateText } from "@lib/i18n/translate"
import { ReactElement } from "react"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import originalData from "@lib/json/introduce.json"
import styles from "@styles/pages/introduce.module.scss"

const SECTION_TITLES: Record<string, string> = {
    dream: "저는 꿈이 한 가지 있습니다.",
    careerPath: "처음에는",
    philosophy: "진정한 개발자란,",
    futureGoal: "그리고 언젠가는,",
}

const Introduce = (): ReactElement => {
    const locale = useLocale()
    const t = (text: string) => translateText(text, locale)
    const introduceData = translateData(originalData, locale)
    return (
        <Wrapper>
            <div className={styles.introduceBlock}>
                <div className={styles.pargraphs}>
                    <div className={styles.block}>
                        <TextBasic as="h1" size="xxx-large" bold="bold">
                            {introduceData.title}
                        </TextBasic>
                        <br />
                        <br />
                    </div>
                    {introduceData.sections.map((section) => (
                        <div key={section.key} className={styles.block}>
                            <TextBasic as="h2" size="x-large" bold="bold">
                                {t(SECTION_TITLES[section.key] ?? section.key)}
                            </TextBasic>
                            <br />
                            <TextBasic size="medium">{section.content}</TextBasic>
                        </div>
                    ))}
                </div>
                <div className={styles.myPics}>
                    <img
                        src={introduceData.profileImage}
                        alt={t("개발자 김바실리")}
                        sizes={"100vw"}
                        width={810}
                        height={1440}
                        className={styles.pics}
                    />
                </div>
            </div>
        </Wrapper>
    )
}

export default Introduce
