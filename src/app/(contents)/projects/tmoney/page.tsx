import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("tmoney")

import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const project = projectDetails.find((item) => item.slug === "tmoney")!


export default function TmoneyPage() {
    return <ProjectDetail data={project} />
}
