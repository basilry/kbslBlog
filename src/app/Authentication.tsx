"use client"

import { ReactElement, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLoginStore } from "@lib/stores/store"

function Authentication(): ReactElement {
    const router = useRouter()
    // const { loginState } = useLoginStore()
    // TODO: 백엔드 로그인 상태 구현 필요
    const loginState = true

    useEffect(() => {
        if (loginState) {
            router.replace("/main")
        } else {
            router.replace("/login")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <></>
}

export default Authentication
