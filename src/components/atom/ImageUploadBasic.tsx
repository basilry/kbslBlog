"use client"

import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react"
import Image from "next/image"
import classNames from "classnames"
import { IFile } from "@interface/IRoot"
import { useCoreStore } from "@lib/stores/store"
import { convertFileToBase64 } from "@lib/utils/common"
import styles from "@styles/components/atom/imageUpload.module.scss"

interface IImageUploadBasicProps {
    onChange: (e: string) => void
    disabled?: boolean
    file?: IFile | string | null
}

const ImageUploadBasic = (props: IImageUploadBasicProps): ReactElement => {
    const { onChange, disabled, file } = props

    const { darkMode } = useCoreStore()

    const ref = useRef<HTMLInputElement>(null)

    const [image, setImage] = useState<string>("")

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const selectedFile = e.target.files && e.target.files[0]
        if (!selectedFile) return

        const base64 = await convertFileToBase64(selectedFile)
        onChange(base64)
    }

    useEffect(() => {
        if (file) {
            if (typeof file === "string") {
                setImage(file)
            } else {
                convertFileToBase64(file as File).then((base64) => setImage(base64))
            }
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
            <input disabled={disabled} ref={ref} className={styles.input} type={"file"} onChange={handleFileChange} />
        </div>
    )
}

export default ImageUploadBasic
