import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("ltcga")

import { ReactElement } from "react"
import Ltcga from "@app/(contents)/projects/ltcga/Ltcga"

const page = (): ReactElement => {
    return <Ltcga />
}

export default page
