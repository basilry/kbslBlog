"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const SolutionRenewal = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "solutionRenewal")!

    return <ProjectDetail data={data} />
}

export default SolutionRenewal
