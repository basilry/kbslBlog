"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import ButtonBasic from "@components/atom/ButtonBasic"
import InputBasic from "@components/atom/InputBasic"
import TextBasic from "@components/atom/TextBasic"
import { ILoginReqData } from "@interface/IUser"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useLoginStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/login.module.scss"

const initLoginData: ILoginReqData = {
    loginId: "",
    password: "",
}

const Login = (): ReactElement => {
    const router = useRouter()
    const { loginUser, loginState, setLoginState, setLoginUser, setToken } = useLoginStore()

    const [loginData, setLoginData] = useState<ILoginReqData>(initLoginData)

    const doLogin = (): void => {
        axiosInstance
            .post("/authenticate", loginData)
            .then((res) => {
                if (res.status === 200) {
                    setLoginState(true)
                    setToken(res.data.data)

                    getMyInfo()
                }

                toastCall("로그인 성공", "success")
            })
            .catch(() => {
                toastCall("로그인 실패", "error")
            })
    }

    const getMyInfo = (): void => {
        if (loginUser.loginId) return

        axiosInstance
            .get("/users/me")
            .then((res) => {
                if (res.data.code === 200) {
                    setLoginUser(res.data.data)
                }

                toastCall("나의 정보 불러오기 완료", "success")
            })
            .catch(() => {
                toastCall("나의 정보 불러오기 실패", "error")
            })
    }

    useEffect(() => {
        if (loginState) {
            router.replace("/")
        }
    }, [loginState, router])

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.titleWrapper}>
                <TextBasic size={"xxx-large"} bold={"bold"}>
                    {"KBSL's BLOG"}
                </TextBasic>
            </div>
            <div className={styles.inputWrapper}>
                <InputBasic
                    inputWrapperStyle={styles.eachInput}
                    placeholder={"아이디"}
                    value={loginData.loginId}
                    onChange={(e) => setLoginData({ ...loginData, loginId: e.target.value })}
                />
                <InputBasic
                    inputWrapperStyle={styles.eachInput}
                    type={"password"}
                    placeholder={"비밀번호"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            doLogin()
                        }
                    }}
                />
            </div>
            <div className={styles.buttonWrapper}>
                <ButtonBasic buttonStyle={styles.eachButton} label={"로그인"} onClick={() => doLogin()} />
            </div>
        </div>
    )
}

export default Login
