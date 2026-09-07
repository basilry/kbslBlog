import { HTMLAttributes } from "react"
import classNames from "classnames"
import styles from "@styles/components/atom/textBasic.module.scss"

const TextBasic = ({ as: Tag = "div", children, bold, className, size, ...rest }: ITextBasicProps): React.JSX.Element => {
    return (
        <Tag
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
        </Tag>
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

export interface ITextBasicProps extends HTMLAttributes<HTMLElement> {
    as?: "div" | "h1" | "h2" | "h3" | "p"
    className?: string
    children: React.ReactNode
    size?: TTextSize
    bold?: TTextBold
}

export default TextBasic
