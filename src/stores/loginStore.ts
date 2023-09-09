import { StateCreator } from "zustand"
import { ILoginUser, loginUserInitData } from "@interface/IUser"
import { login } from "@service/loginService"

export interface IStoreLogin {
    loginState: boolean
    loginUser: ILoginUser
    doLogin: (param: ILoginUser) => Promise<void>
}

export const loginStore: StateCreator<IStoreLogin> = (set) => ({
    loginState: false,
    loginUser: { ...loginUserInitData },
    doLogin: async (param: ILoginUser): Promise<void> => {
        console.log(param)

        const result = await login(param)
        const { data } = result

        if (data.returnCode === "100") {
            set({ loginState: true, loginUser: param })
        } else {
            set({ loginState: false, loginUser: { ...loginUserInitData } })
            alert("login failed")
        }
    },
})
