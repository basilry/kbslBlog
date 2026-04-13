"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const SolutionInit = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "solutionInit")!

    return <ProjectDetail data={data} />
}

export default SolutionInit
