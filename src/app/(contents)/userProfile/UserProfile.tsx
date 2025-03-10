"use client"

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next-nprogress-bar"
import ButtonBasic from "@components/atom/ButtonBasic"
import ImageUploadBasic from "@components/atom/ImageUploadBasic"
import Wrapper from "@components/layout/Wrapper"
import LabelInput from "@components/molecule/LabelInput"
import { ILoginUser } from "@interface/IUser"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useLoginStore } from "@lib/stores/store"
import { toastCall } from "@lib/utils/toastCall"
import styles from "@styles/pages/userProfile.module.scss"

const UserProfile = (): ReactElement => {
    const router = useRouter()

    const { loginState, loginUser, setLoginUser } = useLoginStore()

    const [userData, setUserData] = useState<ILoginUser>(loginUser)
    const [isEdit, setIsEdit] = useState(false)

    const getMyInfo = (): void => {
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

    const saveMyInfo = (): void => {
        axiosInstance
            .put("/users/me", userData)
            .then((res) => {
                if (res.data.code === 200) {
                    setLoginUser(userData)
                }

                toastCall("나의 정보 수정 완료", "success")
                setIsEdit(false)

                getMyInfo()
            })
            .catch(() => {
                toastCall("나의 정보 수정 실패", "error")
            })
    }

    useEffect(() => {
        getMyInfo()
    }, [])

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
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    label={"이름"}
                    validation={"name"}
                    maxLength={20}
                    disabled={!isEdit}
                    errorMsg={"이름을 확인해주세요"}
                />
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
                    type={isEdit ? "" : "reset"}
                    onClick={() => {
                        if (!isEdit) {
                            setIsEdit(true)
                            toastCall("유저 프로필 수정을 시작합니다", "success")
                        } else {
                            saveMyInfo()
                        }
                    }}
                />
            </div>
        </Wrapper>
    )
}

export default UserProfile
