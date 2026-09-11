import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("imsPart1", await pageLocale(params))
}

import ImsPart1 from "./ImsPart1"

const page = (): React.JSX.Element => {
    return <ImsPart1 />
}

export default page
