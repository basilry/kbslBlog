"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const ImsPart1 = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "imsPart1")!

    return <ProjectDetail data={data} />
}

export default ImsPart1
