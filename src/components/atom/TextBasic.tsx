import { DetailedHTMLProps, HTMLAttributes } from "react"
import classNames from "classnames"
import styles from "@styles/components/atom/textBasic.module.scss"

const TextBasic = ({ children, bold, className, size, ...rest }: ITextBasicProps): JSX.Element => {
    return (
        <div
            className={classNames(
                styles.text,
                className && styles[className],
                className,
                size && styles[size],
                bold && styles[bold],
            )}
            {...rest}
        >
            {children}
        </div>
    )
}

export type TTextSize =
    | "xx-small"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
    | "xxx-large"
    | "xxxx-large"

export type TTextBold = "normal" | "bold"

export interface ITextBasicProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    className?: string
    children: React.ReactNode
    size?: TTextSize
    bold?: TTextBold
}

export default TextBasic
