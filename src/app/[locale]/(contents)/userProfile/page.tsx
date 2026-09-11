import { notFound } from "next/navigation"

// Management now happens in JSON/Markdown files. Keep legacy components dormant.
export default function Page() {
    notFound()
}
