"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import ButtonBasic from "@components/atom/ButtonBasic"
import ImageUploadBasic from "@components/atom/ImageUploadBasic"
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
    const [isEdit, setIsEdit] = useState(false)

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
                <div className={styles.imgWrapper}>
                    <ImageUploadBasic
                        disabled={!isEdit}
                        file={userData.profileImg}
                        onChange={(e) => setUserData({ ...userData, profileImg: e })}
                    />
                </div>
                <LabelInput
                    required
                    value={userData.loginId}
                    label={"아이디"}
                    disabled
                    errorMsg={"아이디를 확인해주세요"}
                />
                <LabelInput required value={userData.role} label={"역할"} disabled />
                <LabelInput
                    required
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    label={"이메일"}
                    validation={"email"}
                    disabled={!isEdit}
                    errorMsg={"이메일을 확인해주세요"}
                />
                <LabelInput
                    required
                    value={userData.phoneNumber}
                    onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                    label={"전화번호"}
                    validation={"phoneNumber"}
                    disabled={!isEdit}
                    errorMsg={"전화번호를 확인해주세요"}
                    maxLength={11}
                />
                <LabelInput
                    value={userData.description}
                    onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                    label={"소개"}
                    disabled={!isEdit}
                    errorMsg={"소개를 확인해주세요"}
                />

                <ButtonBasic
                    buttonStyle={styles.eachButton}
                    label={isEdit ? "저장" : "수정"}
                    fontSize={"large"}
                    fontWeight={"bold"}
                    onClick={() => setIsEdit(!isEdit)}
                />
            </div>
        </Wrapper>
    )
}

export default UserProfile
