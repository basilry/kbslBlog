"use client"

import { HTMLAttributes, ReactElement } from "react"
import classNames from "classnames"
import { TTextBold, TTextSize } from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/buttonBasic.module.scss"

interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
    onClick: () => void
    children?: ReactElement
    label?: string
    fontSize?: TTextSize
    fontWeight?: TTextBold
    buttonWrapperStyle?: string
    buttonStyle?: string
    type?: TButtonType
}

type TButtonType = "submit" | "reset" | "icon" | ""

const ButtonBasic = (props: IButtonProps): ReactElement => {
    const {
        buttonWrapperStyle,
        buttonStyle,
        fontSize = "medium",
        fontWeight = "normal",
        label,
        type,
        children,
        ...rest
    } = props

    const { darkMode } = useCoreStore()

    return (
        <div className={classNames(styles.buttonWrapper, buttonWrapperStyle)}>
            <button
                className={classNames(
                    styles.button,
                    buttonStyle,
                    styles[fontSize],
                    styles[fontWeight],
                    type && styles[type],
                    !darkMode && styles.white,
                )}
                {...rest}
            >
                {label && label}
                {children && children}
            </button>
        </div>
    )
}

export default ButtonBasic
