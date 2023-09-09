export interface ILoginUser {
    userId: string
    password: string
    accessToken: string
    refreshToken: string
}

export const loginUserInitData: ILoginUser = {
    userId: "",
    password: "",
    accessToken: "",
    refreshToken: "",
}
