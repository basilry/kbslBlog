import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("deskDefense", await pageLocale(params))
}

import { ReactElement } from "react"
import DeskDefense from "./DeskDefense"

const page = (): ReactElement => {
    return <DeskDefense />
}

export default page
