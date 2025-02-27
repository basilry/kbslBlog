import { StateCreator } from "zustand"
import { ILoginUser, IToken, loginUserInitData } from "@interface/IUser"

export const loginStore: StateCreator<IStoreLogin> = (set) => ({
    loginState: false,
    loginUser: { ...loginUserInitData },
    token: {
        accessToken: "",
        refreshToken: "",
    },
    setToken: (token: IToken) => set(() => ({ token })),
    setLoginState: (loginState: boolean) => set(() => ({ loginState })),
    setLoginUser: (loginUser: ILoginUser) => set(() => ({ loginUser })),
    initialize: () => set({ ...initialState }),
})

export interface IStoreLogin {
    loginState: boolean
    loginUser: ILoginUser
    token: IToken
    setToken: (token: IToken) => void
    setLoginState: (state: boolean) => void
    setLoginUser: (user: ILoginUser) => void
    initialize: () => void
}

export const initialState = {
    loginState: false,
    loginUser: { ...loginUserInitData },
    token: {
        accessToken: "",
        refreshToken: "",
    },
}
