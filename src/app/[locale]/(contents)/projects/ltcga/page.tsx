import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("ltcga", await pageLocale(params))
}

import { ReactElement } from "react"
import Ltcga from "@app/(contents)/projects/ltcga/Ltcga"

const page = (): ReactElement => {
    return <Ltcga />
}

export default page
