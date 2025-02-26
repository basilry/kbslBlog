"use client"

import { ReactElement, useRef } from "react"
import Image from "next/image"
import classNames from "classnames"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/imageUpload.module.scss"

const ImageUploadBasic = (): ReactElement => {
    const { darkMode } = useCoreStore()

    const ref = useRef<HTMLInputElement>(null)

    return (
        <div
            className={classNames(styles.imageUploadWrapper, darkMode && styles.dark)}
            onClick={() => ref.current?.click()}
        >
            <Image src={darkMode ? "/user_white.svg" : "/user.svg"} alt={"user"} width={50} height={50} />
            <input ref={ref} className={styles.input} type={"file"} />
        </div>
    )
}

export default ImageUploadBasic
