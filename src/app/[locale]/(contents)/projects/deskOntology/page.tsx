import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("deskOntology", await pageLocale(params))
}

import { ReactElement } from "react"
import DeskOntology from "./DeskOntology"

const page = (): ReactElement => {
    return <DeskOntology />
}

export default page
