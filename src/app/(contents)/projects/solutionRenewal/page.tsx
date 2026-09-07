import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("solutionRenewal")

import SolutionRenewal from "./SolutionRenewal"

const page = (): React.JSX.Element => {
    return <SolutionRenewal />
}

export default page
