import { IFile } from "@interface/IRoot"

export interface ILoginReqData {
    loginId: string
    password: string
}

export interface ILoginUser {
    loginId: string
    email: string
    name: string
    phoneNumber: string
    role: string
    description: string
    profileImg: IFile
}

export interface IToken {
    accessToken: string
    refreshToken: string
}

export const loginUserInitData: ILoginUser = {
    loginId: "",
    email: "",
    name: "",
    phoneNumber: "",
    role: "",
    description: "",
    profileImg: {},
}
