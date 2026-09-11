import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { staticPageMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return staticPageMetadata("/certification", await pageLocale(params))
}

import { ReactElement } from "react"
import Certification from "@app/(mydata)/certification/Certification"

const Page = (): ReactElement => {
    return <Certification />
}

export default Page
