import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { staticPageMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return staticPageMetadata("/projects", await pageLocale(params))
}

import Projects from "./Projects"

const page = (): React.JSX.Element => {
    return <Projects />
}

export default page
