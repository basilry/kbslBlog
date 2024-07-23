import { toast } from "react-toastify"

type TToastType = "success" | "error" | "warning" | "info"

// 토스트 메시지 호출 함수
export const toastCall = (msg: string, type: TToastType): any => {
    switch (type) {
        case "success":
            return toast.success(msg, { theme: "colored" })
        case "error":
            return toast.error(msg, { theme: "colored" })
        case "warning":
            return toast.warning(msg, { theme: "colored" })
        case "info":
            return toast.info(msg, { theme: "colored" })
    }
}

export const errorToast = (message?: string) => {
    return toast.error(message || "일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.", {
        theme: "colored",
    })
}
