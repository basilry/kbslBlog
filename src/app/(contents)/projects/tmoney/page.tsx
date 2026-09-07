import type { Metadata } from "next"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const project = projectDetails.find((item) => item.slug === "tmoney")!

export const metadata: Metadata = {
    title: project.title,
    description: project.description,
}

export default function TmoneyPage() {
    return <ProjectDetail data={project} />
}
