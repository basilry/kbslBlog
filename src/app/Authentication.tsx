"use client"

import { ReactElement } from "react"
import { useRouter } from "next/navigation"
import Landing from "@app/Landing"
// import { useLoginStore } from "@lib/stores/store"

function Authentication(): ReactElement {
    const router = useRouter()
    // const { loginState } = useLoginStore()
    // TODO: 백엔드 로그인 상태 구현 필요
    const loginState = true

    if (loginState) {
        return <Landing />
        // return <Main />
    } else {
        router.replace("/login")
    }

    return <></>
}

export default Authentication
