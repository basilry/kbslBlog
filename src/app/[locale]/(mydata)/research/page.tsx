import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { staticPageMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return staticPageMetadata("/research", await pageLocale(params))
}

import { ReactElement } from "react"
import Research from "@app/(mydata)/research/Research"

const Page = (): ReactElement => {
    return <Research />
}

export default Page
