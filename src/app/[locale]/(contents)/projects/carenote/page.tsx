import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("carenote", await pageLocale(params))
}

import Carenote from "./Carenote"

const page = (): React.JSX.Element => {
    return <Carenote />
}

export default page
