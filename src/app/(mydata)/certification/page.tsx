import { staticPageMetadata } from "@lib/seo"

export const metadata = staticPageMetadata("/certification")

import { ReactElement } from "react"
import Certification from "@app/(mydata)/certification/Certification"

const Page = (): ReactElement => {
    return <Certification />
}

export default Page
