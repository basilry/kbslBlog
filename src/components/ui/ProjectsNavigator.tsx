"use client"

import { useLocale } from "@lib/i18n/context"
import { translateText } from "@lib/i18n/translate"
import { stripLocale } from "@lib/i18n/config"
import Link from "@components/ui/LocaleLink"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/ui/projectsFooter.module.scss"

const PROJECTS_NAME = [
    {
        idx: 0,
        id: "solutionInit",
        name: "솔루션",
    },
    { idx: 1, id: "solutionRenewal", name: "솔루션 리뉴얼" },
    { idx: 2, id: "carenote", name: "돌봄노트" },
    { idx: 3, id: "imsPart1", name: "통합관리시스템 Part 1." },
    { idx: 4, id: "hectonTechblog", name: "헥톤 테크블로그" },
]

const ProjectsNavigator = (): React.JSX.Element => {
    const locale = useLocale()
    const { darkMode } = useCoreStore()
    const pathname = stripLocale(usePathname()).split("/")[2]
    const nowMenu = PROJECTS_NAME.filter((row) => row.id === pathname)[0]
    const prevIdx = nowMenu?.idx - 1 >= 0 ? nowMenu.idx - 1 : 4
    const nextIdx = nowMenu?.idx + 1 < 5 ? nowMenu.idx + 1 : 0

    return (
        <div className={classNames(styles.footerWrapper, darkMode && styles.dark)}>
            <Link href={`/projects/${PROJECTS_NAME[prevIdx].id}`} className={styles.link}>
                <TextBasic size="xx-small" bold="bold">{`< ${translateText(PROJECTS_NAME[prevIdx]?.name, locale)}`}</TextBasic>
            </Link>
            <Link href={`/projects/${PROJECTS_NAME[nextIdx].id}`} className={styles.link}>
                <TextBasic size="xx-small" bold="bold">{` ${translateText(PROJECTS_NAME[nextIdx]?.name, locale)} >`}</TextBasic>
            </Link>
        </div>
    )
}

export default ProjectsNavigator
