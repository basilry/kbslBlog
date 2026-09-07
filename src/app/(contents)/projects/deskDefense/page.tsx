import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("deskDefense")

import { ReactElement } from "react"
import DeskDefense from "./DeskDefense"

const page = (): ReactElement => {
    return <DeskDefense />
}

export default page
