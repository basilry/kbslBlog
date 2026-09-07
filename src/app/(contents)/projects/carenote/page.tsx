import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("carenote")

import Carenote from "./Carenote"

const page = (): React.JSX.Element => {
    return <Carenote />
}

export default page
