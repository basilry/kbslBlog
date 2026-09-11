"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const Desk = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "desk")!

    return <ProjectDetail data={data} />
}

export default Desk
