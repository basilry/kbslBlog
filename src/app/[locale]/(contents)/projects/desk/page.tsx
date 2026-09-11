import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("desk", await pageLocale(params))
}

import { ReactElement } from "react"
import Desk from "./Desk"

const page = (): ReactElement => {
    return <Desk />
}

export default page
