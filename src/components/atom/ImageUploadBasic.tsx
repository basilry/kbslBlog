"use client"

import { ReactElement, useEffect, useRef, useState } from "react"
import Image from "next/image"
import classNames from "classnames"
import { IFile } from "@interface/IRoot"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/atom/imageUpload.module.scss"

interface IImageUploadBasicProps {
    onChange: (e: File) => void
    disabled?: boolean
    file?: IFile
}

const ImageUploadBasic = (props: IImageUploadBasicProps): ReactElement => {
    const { onChange, disabled, file } = props

    const { darkMode } = useCoreStore()

    const ref = useRef<HTMLInputElement>(null)

    const [image, setImage] = useState<string>("")

    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = (): void => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file as Blob)
        } else {
            setImage("")
        }
    }, [file])

    return (
        <div
            className={classNames(styles.imageUploadWrapper, darkMode && styles.dark, disabled && styles.disabled)}
            onClick={() => ref.current?.click()}
        >
            {!image && <Image src={darkMode ? "/user_white.svg" : "/user.svg"} alt={"user"} width={50} height={50} />}
            {image && <Image src={image} alt={"image"} fill style={{ objectFit: "cover" }} />}
            <input
                disabled={disabled}
                ref={ref}
                className={styles.input}
                type={"file"}
                onChange={(e) => e.target.files && onChange(e.target.files[0])}
            />
        </div>
    )
}

export default ImageUploadBasic
