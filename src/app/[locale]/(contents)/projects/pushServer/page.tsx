import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("pushServer", await pageLocale(params))
}

import { ReactElement } from "react"
import PushServer from "./PushServer"


const page = (): ReactElement => {
    return <PushServer />
}

export default page
