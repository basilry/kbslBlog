"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const Clims = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "clims")!

    return <ProjectDetail data={data} />
}

export default Clims
