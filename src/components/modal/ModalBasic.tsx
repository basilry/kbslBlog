"use client"

import { ReactElement, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/modalBasic.module.scss"

interface IModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactElement
}

const ModalBasic = ({ isOpen, onClose, title, children }: IModalProps): ReactElement => {
    const { darkMode } = useCoreStore()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    if (!isOpen) return <></>

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={classNames(styles.modal, darkMode && styles.dark)} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    {title && (
                        <TextBasic size={"xx-large"} bold={"bold"}>
                            {title}
                        </TextBasic>
                    )}
                    <Image
                        className={styles.closeButton}
                        src={darkMode ? "/kbslBlog/xmark-solid_white.svg" : "/kbslBlog/xmark-solid.svg"}
                        alt="sidebarCloseBtn"
                        width={30}
                        height={30}
                        onClick={onClose}
                    />
                </div>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement,
    )
}

export default ModalBasic
