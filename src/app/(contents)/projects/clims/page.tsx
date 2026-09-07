import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("clims")

import { ReactElement } from "react"
import Clims from "./Clims"

const page = (): ReactElement => {
    return <Clims />
}

export default page
