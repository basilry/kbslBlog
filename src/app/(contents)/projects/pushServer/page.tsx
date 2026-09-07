import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("pushServer")

import { ReactElement } from "react"
import PushServer from "./PushServer"


const page = (): ReactElement => {
    return <PushServer />
}

export default page
