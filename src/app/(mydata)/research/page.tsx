import { staticPageMetadata } from "@lib/seo"

export const metadata = staticPageMetadata("/research")

import { ReactElement } from "react"
import Research from "@app/(mydata)/research/Research"

const Page = (): ReactElement => {
    return <Research />
}

export default Page
