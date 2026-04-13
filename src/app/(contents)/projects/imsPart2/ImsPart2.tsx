"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const ImsPart2 = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "imsPart2")!

    return <ProjectDetail data={data} />
}

export default ImsPart2
