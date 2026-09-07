import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("solutionInit")

import SolutionInit from "./SolutionInit"

const page = (): React.JSX.Element => {
    return <SolutionInit />
}

export default page
