import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("bukhae")

import { ReactElement } from "react"
import Bukhae from "./Bukhae"

const page = (): ReactElement => {
    return <Bukhae />
}

export default page
