import type { Metadata } from "next"

// Placeholder/comment-only pages are not search landing pages.
export const metadata: Metadata = { robots: { index: false, follow: true } }

const page = (): React.JSX.Element => {
    return <div>공지사항</div>
}

export default page
