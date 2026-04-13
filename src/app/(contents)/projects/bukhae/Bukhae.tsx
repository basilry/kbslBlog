"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const Bukhae = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "bukhae")!

    return <ProjectDetail data={data} />
}

export default Bukhae
