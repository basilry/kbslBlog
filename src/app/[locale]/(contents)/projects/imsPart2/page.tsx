import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("imsPart2", await pageLocale(params))
}

import { ReactElement } from "react"
import ImsPart2 from "@app/(contents)/projects/imsPart2/ImsPart2"

const page = (): ReactElement => {
    return <ImsPart2 />
}

export default page
