"use client"

import { ReactElement } from "react"
import ProjectDetail from "@app/(contents)/projects/ProjectDetail"
import projectDetails from "@lib/json/projectDetails.json"

const HaruWeather = (): ReactElement => {
    const data = projectDetails.find((p) => p.slug === "haruWeather")!

    return <ProjectDetail data={data} />
}

export default HaruWeather
