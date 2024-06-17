import { ILogo } from "@interface/IRoot"

export interface IMainProjects {
    id?: number
    title?: string
    period?: string
    logos?: ILogo[]
    description?: string
}
