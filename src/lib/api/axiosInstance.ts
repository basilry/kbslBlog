import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_IP}`,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    responseType: "json",
    withCredentials: true,
    timeout: 30000,
})

export const axiosInstanceMultipart: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_IP}`,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "json",
    withCredentials: true,
    timeout: 30000,
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

axiosInstance.interceptors.request.use(
    (request: any): Promise<any> => requestSuccessHandler(request),
    (error: any): Promise<any> => requestErrorHandler(error),
)

axiosInstance.interceptors.request.use((config): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
        const loginData = localStorage.getItem("login")
        if (loginData) {
            try {
                const parsed = JSON.parse(loginData)
                const accessToken = parsed.state?.token?.accessToken
                if (accessToken) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`
                }
            } catch (error) {
                console.error("Failed to parse login data", error)
            }
        }
    }

    return config
})

axiosInstance.interceptors.response.use(
    (response: any): Promise<any> => responseSuccessHandler(response),
    (error: any): Promise<any> => responseErrorHandler(error),
)

axiosInstanceMultipart.interceptors.request.use(
    (request: any): Promise<any> => requestSuccessHandler(request),
    (error: any): Promise<any> => requestErrorHandler(error),
)

axiosInstanceMultipart.interceptors.request.use((config): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
        const loginData = localStorage.getItem("login")
        if (loginData) {
            try {
                const parsed = JSON.parse(loginData)
                const accessToken = parsed.state?.token?.accessToken
                if (accessToken) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`
                }
            } catch (error) {
                console.error("Failed to parse login data", error)
            }
        }
    }

    return config
})

axiosInstanceMultipart.interceptors.response.use(
    (response: any): Promise<any> => responseSuccessHandler(response),
    (error: any): Promise<any> => responseErrorHandler(error),
)
