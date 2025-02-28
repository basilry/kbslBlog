import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react"
import classNames from "classnames"
import { TTextBold, TTextSize } from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/inputBasic.module.scss"

export interface IInputBasicProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    value: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    fontSize?: TTextSize
    fontWeight?: TTextBold
    inputWrapperStyle?: string
    inputStyle?: string
    type?: TInputBasicType
}

type TInputBasicType = "" | "title"

const InputBasic = (props: IInputBasicProps): ReactElement => {
    const { darkMode } = useCoreStore()

    const { inputWrapperStyle, inputStyle, fontSize = "small", fontWeight = "normal", disabled, type, ...rest } = props

    return (
        <div className={classNames(styles.inputBasicWrapper, inputWrapperStyle)}>
            <input
                className={classNames(
                    styles.input,
                    inputStyle,
                    styles[fontSize],
                    styles[fontWeight],
                    disabled && styles.disabled,
                    darkMode && styles.dark,
                    type && styles[type],
                )}
                type={"text"}
                disabled={disabled}
                {...rest}
            />
        </div>
    )
}

export default InputBasic
