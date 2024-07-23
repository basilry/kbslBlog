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
