import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("desk")

import { ReactElement } from "react"
import Desk from "./Desk"

const page = (): ReactElement => {
    return <Desk />
}

export default page
