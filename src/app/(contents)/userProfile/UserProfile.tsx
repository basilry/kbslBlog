"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import ImageUploadBasic from "@components/atom/ImageUploadBasic"
import InputBasic from "@components/atom/InputBasic"
import Wrapper from "@components/layout/Wrapper"
import LabelInput from "@components/molecule/LabelInput"
import { ILoginUser } from "@interface/IUser"
import { useLoginStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/userProfile.module.scss"

const UserProfile = (): ReactElement => {
    const router = useRouter()

    const { loginState, loginUser } = useLoginStore()

    const [userData, setUserData] = useState<ILoginUser>(loginUser)

    useEffect(() => {
        if (!loginState || !loginUser.loginId) {
            router.push("/login")
            toastCall("로그인이 필요합니다", "error")
        }
    }, [loginState])

    if (!loginState || !loginUser.loginId) return <></>

    return (
        <Wrapper>
            <div className={styles.userProfileWrapper}>
                <ImageUploadBasic />
                <LabelInput value={userData.loginId} label={"아이디"} disabled errorMsg={"아이디를 입력해주세요"} />
                {/*<InputBasic value={userData.loginId} disabled />*/}
                <InputBasic value={userData.email} disabled />
                <InputBasic value={userData.name} disabled />
                <InputBasic value={userData.phoneNumber} disabled />
                <InputBasic value={userData.role} disabled />
                <InputBasic value={userData.description} disabled />
            </div>
        </Wrapper>
    )
}

export default UserProfile
