import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}`,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    responseType: "json",
    withCredentials: true,
    timeout: 5000,
})

const requestSuccessHandler = (request: any): Promise<any> => {
    return request
}

const requestErrorHandler = (error: any): Promise<any> => {
    return Promise.reject({
        ...error,
    })
}

const responseSuccessHandler = (response: any): Promise<any> => {
    return response
}

const responseErrorHandler = (error: any): Promise<any> => {
    if (!error.response) {
        error = {
            ...error,
            response: { data: { message: "error", code: "9999" } },
        }
    }
    return Promise.reject({
        ...error,
    })
}

axiosInstance.interceptors.request.use()

axiosInstance.interceptors.request.use(
    (request: any): Promise<any> => requestSuccessHandler(request),
    (error: any): Promise<any> => requestErrorHandler(error),
)

axiosInstance.interceptors.request.use((config): InternalAxiosRequestConfig => {
    return config
})

axiosInstance.interceptors.response.use(
    (response: any): Promise<any> => responseSuccessHandler(response),
    (error: any): Promise<any> => responseErrorHandler(error),
)

export default axiosInstance
