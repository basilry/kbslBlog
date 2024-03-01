import classNames from "classnames"
import styles from "@styles/components/atom/textBasic.module.scss"

const TextBasic = ({ children, bold, className, size }: ITextBasicProps): JSX.Element => {
    return (
        <div
            className={classNames(
                styles.text,
                className && styles[className],
                size && styles[size],
                bold && styles[bold],
            )}
        >
            {children}
        </div>
    )
}

export type TTextSize = "x-small" | "small" | "medium" | "large" | "x-large" | "xx-large"

export type TTextBold = "normal" | "bold"

export interface ITextBasicProps {
    className?: string
    children: React.ReactNode
    size?: TTextSize
    bold?: TTextBold
}

export default TextBasic
