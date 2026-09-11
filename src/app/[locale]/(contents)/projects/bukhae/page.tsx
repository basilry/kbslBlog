import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("bukhae", await pageLocale(params))
}

import { ReactElement } from "react"
import Bukhae from "./Bukhae"

const page = (): ReactElement => {
    return <Bukhae />
}

export default page
