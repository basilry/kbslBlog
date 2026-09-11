import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("solutionInit", await pageLocale(params))
}

import SolutionInit from "./SolutionInit"

const page = (): React.JSX.Element => {
    return <SolutionInit />
}

export default page
