import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("hectonTechblog", await pageLocale(params))
}

import HectonTechblog from "./HectonTechblog"

const page = (): React.JSX.Element => {
    return <HectonTechblog />
}

export default page
