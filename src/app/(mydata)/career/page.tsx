import { staticPageMetadata } from "@lib/seo"

export const metadata = staticPageMetadata("/career")

import { ReactElement } from "react"
import Career from "./Career"

const page = (): ReactElement => {
    return <Career />
}

export default page
