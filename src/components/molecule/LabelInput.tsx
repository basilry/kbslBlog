"use client"

import { ReactElement, useCallback, useEffect, useState } from "react"
import InputBasic, { IInputBasicProps } from "@components/atom/InputBasic"
import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/components/molecule/labelInput.module.scss"

type ILabelInputProps = IInputBasicProps & {
    label: string
    required?: boolean
    validation?: TLabelInputValidation
    errorMsg?: string
}

type TLabelInputValidation = "email" | "password" | "phoneNumber"

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
const phoneNumberReg = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/

const LabelInput = (props: ILabelInputProps): ReactElement => {
    const { label, required, validation, errorMsg, value, ...rest } = props

    const [isError, setIsError] = useState(false)

    const handleError = useCallback(
        (type: TLabelInputValidation): boolean => {
            switch (type) {
                case "email":
                    return !emailReg.test(value)
                case "password":
                    return !passwordReg.test(value)
                case "phoneNumber":
                    return !phoneNumberReg.test(value)
                default:
                    return false
            }
        },
        [value],
    )

    useEffect(() => {
        if (validation) {
            setIsError(handleError(validation))
        }
    }, [handleError, validation, value])

    return (
        <div className={styles.labelInputWrapper}>
            <div className={styles.labelWrapper}>
                <TextBasic size={"large"}>{label}</TextBasic>
                {required && <span className={styles.red}>*</span>}
            </div>
            <InputBasic inputStyle={styles.labelInput_input} value={value} {...rest} />
            {isError && (
                <TextBasic className={styles.errMsg} size={"small"}>
                    {errorMsg}
                </TextBasic>
            )}
        </div>
    )
}

export default LabelInput
