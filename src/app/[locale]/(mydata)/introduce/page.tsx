import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { staticPageMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return staticPageMetadata("/introduce", await pageLocale(params))
}

import Introduce from "@app/(mydata)/introduce/Introduce"

const page = (): React.JSX.Element => {
    return <Introduce />
}

export default page
