import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("deskOntology")

import { ReactElement } from "react"
import DeskOntology from "./DeskOntology"

const page = (): ReactElement => {
    return <DeskOntology />
}

export default page
