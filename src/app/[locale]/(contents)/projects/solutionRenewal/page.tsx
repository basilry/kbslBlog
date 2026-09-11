import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("solutionRenewal", await pageLocale(params))
}

import SolutionRenewal from "./SolutionRenewal"

const page = (): React.JSX.Element => {
    return <SolutionRenewal />
}

export default page
