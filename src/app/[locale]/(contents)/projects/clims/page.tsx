import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("clims", await pageLocale(params))
}

import { ReactElement } from "react"
import Clims from "./Clims"

const page = (): ReactElement => {
    return <Clims />
}

export default page
