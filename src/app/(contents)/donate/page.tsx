import type { Metadata } from "next"

// Placeholder/comment-only pages are not search landing pages.
export const metadata: Metadata = { robots: { index: false, follow: true } }

const page = (): React.JSX.Element => {
    return <div>기부해주세용</div>
}

export default page
