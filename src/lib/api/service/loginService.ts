import { AxiosPromise } from "axios"
import { ILoginUser } from "@interface/IUser"
import axiosInstance from "@lib/api/axiosInstance"

export function login(param: ILoginUser): AxiosPromise {
    const covertParam = {
        userId: param.userId,
        password: param.password,
    }

    return axiosInstance.post("/login/req", {
        serviceId: "LOGIN001",
        params: { json: { ...covertParam } },
    })
}
