import type { Metadata } from "next"

// Placeholder/comment-only pages are not search landing pages.
export const metadata: Metadata = { robots: { index: false, follow: true } }

import Visitor from "./Visitor"

const page = (): React.JSX.Element => {
    return <Visitor />
}

export default page
