import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { staticPageMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return staticPageMetadata("/career", await pageLocale(params))
}

import { ReactElement } from "react"
import Career from "./Career"

const page = (): ReactElement => {
    return <Career />
}

export default page
