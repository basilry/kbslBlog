import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react"
import classNames from "classnames"
import { TTextBold, TTextSize } from "@components/atom/TextBasic"
import styles from "@styles/components/atom/inputBasic.module.scss"

interface IInputBasicProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    fontSize?: TTextSize
    fontWeight?: TTextBold
    inputWrapperStyle?: string
    inputStyle?: string
}

const InputBasic = (props: IInputBasicProps): ReactElement => {
    const { inputWrapperStyle, inputStyle, fontSize = "small", fontWeight = "normal", ...rest } = props

    return (
        <div className={classNames(styles.inputBasicWrapper, inputWrapperStyle)}>
            <input
                className={classNames(styles.input, inputStyle, styles[fontSize], styles[fontWeight])}
                type={"text"}
                {...rest}
            />
        </div>
    )
}

export default InputBasic
