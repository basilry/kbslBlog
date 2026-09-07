import { staticPageMetadata } from "@lib/seo"

export const metadata = staticPageMetadata("/introduce")

import Introduce from "@app/(mydata)/introduce/Introduce"

const page = (): React.JSX.Element => {
    return <Introduce />
}

export default page
