import { staticPageMetadata } from "@lib/seo"

export const metadata = staticPageMetadata("/projects")

import Projects from "./Projects"

const page = (): React.JSX.Element => {
    return <Projects />
}

export default page
