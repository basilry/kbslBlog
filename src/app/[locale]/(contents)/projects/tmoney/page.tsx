import { pageLocale, type LocalePageProps } from "@lib/i18n/server"
import { projectMetadata } from "@lib/seo"

export async function generateMetadata({ params }: LocalePageProps) {
    return projectMetadata("tmoney", await pageLocale(params))
}

import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const project = projectDetails.find((item) => item.slug === "tmoney")!


export default function TmoneyPage() {
    return <ProjectDetail data={project} />
}
