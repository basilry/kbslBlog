import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("hectonTechblog")

import HectonTechblog from "./HectonTechblog"

const page = (): React.JSX.Element => {
    return <HectonTechblog />
}

export default page
