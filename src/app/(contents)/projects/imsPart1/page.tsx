import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("imsPart1")

import ImsPart1 from "./ImsPart1"

const page = (): React.JSX.Element => {
    return <ImsPart1 />
}

export default page
