import { HTMLAttributes, ReactElement } from "react"
import classNames from "classnames"
import { TTextBold, TTextSize } from "@components/atom/TextBasic"
import styles from "@styles/components/atom/buttonBasic.module.scss"

interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
    label: string
    onClick: () => void
    fontSize?: TTextSize
    fontWeight?: TTextBold
    buttonWrapperStyle?: string
    buttonStyle?: string
}

const ButtonBasic = (props: IButtonProps): ReactElement => {
    const { buttonWrapperStyle, buttonStyle, fontSize = "medium", fontWeight = "normal", label, ...rest } = props

    return (
        <div className={classNames(styles.buttonWrapper, buttonWrapperStyle)}>
            <button className={classNames(styles.button, buttonStyle, styles[fontSize], styles[fontWeight])} {...rest}>
                {label}
            </button>
        </div>
    )
}

export default ButtonBasic
