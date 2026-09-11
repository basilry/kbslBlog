import type { Metadata } from "next"
import { pageLocale, type LocalePageProps } from "@lib/i18n/server"

// Placeholder/comment-only pages are not search landing pages.
export const metadata: Metadata = { robots: { index: false, follow: true } }

const page = async ({ params }: LocalePageProps) => {
    return <div>{await pageLocale(params) === "en" ? "Support this blog" : "기부해주세용"}</div>
}

export default page
