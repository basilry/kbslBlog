import { projectMetadata } from "@lib/seo"

export const metadata = projectMetadata("haruWeather")

import { ReactElement } from "react"
import HaruWeather from "./HaruWeather"

const page = (): ReactElement => {
    return <HaruWeather />
}

export default page
