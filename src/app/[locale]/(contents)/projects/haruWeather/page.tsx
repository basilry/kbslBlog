import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("haruWeather", await pageLocale(params))
}

import { ReactElement } from "react"
import HaruWeather from "./HaruWeather"

const page = (): ReactElement => {
    return <HaruWeather />
}

export default page
