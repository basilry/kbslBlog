export interface ILoginReqData {
    loginId: string
    password: string
}

export interface ILoginUser {
    loginId: string
    password: string
    profileImg?: string
}

export interface IToken {
    accessToken: string
    refreshToken: string
}

export const loginUserInitData: ILoginUser = {
    loginId: "",
    password: "",
    profileImg: "",
}
