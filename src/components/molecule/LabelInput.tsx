"use client"

import { ReactElement } from "react"
import InputBasic, { IInputBasicProps } from "@components/atom/InputBasic"
import TextBasic, { ITextBasicProps } from "@components/atom/TextBasic"
import styles from "@styles/components/molecule/labelInput.module.scss"

type ILabelInputProps = IInputBasicProps &
    Omit<ITextBasicProps, "children"> & {
        label: string
        errorMsg?: string
    }

const LabelInput = (props: ILabelInputProps): ReactElement => {
    const { value, onChange, label, errorMsg, disabled, ...rest } = props

    return (
        <div className={styles.labelInputWrapper}>
            <TextBasic size={"large"}>{label}</TextBasic>
            <InputBasic inputStyle={styles.labelInput_input} value={value} onChange={onChange} disabled={disabled} />
            {errorMsg && <TextBasic size={"x-small"}>{errorMsg}</TextBasic>}
        </div>
    )
}

export default LabelInput
