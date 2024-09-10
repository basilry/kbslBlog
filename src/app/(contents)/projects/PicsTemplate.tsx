"use client"

import { ReactElement, useState } from "react"
import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ModalBasic from "@components/modal/ModalBasic"
import styles from "@styles/pages/projectsPics.module.scss"

interface IPicsTemplate {
    filePath: string
    domainName: string
    fileNums: number
}

const PicsTemplate = ({ filePath, domainName, fileNums = 6 }: IPicsTemplate): ReactElement => {
    const [open, setOpen] = useState({ doOpen: false, idx: -1 })

    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    {new Array(fileNums).fill(0).map((_, idx) => (
                        <SwiperSlide className={styles.block} onClick={() => setOpen({ doOpen: true, idx: idx + 1 })}>
                            <img
                                className={styles.projectImages}
                                src={`/kbslBlog/${filePath}/${domainName}${idx + 1}.png`}
                                alt="myFace"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <ModalBasic isOpen={open.doOpen} onClose={() => setOpen({ doOpen: false, idx: -1 })} title={"상세화면"}>
                <img className={styles.modalImages} src={`/kbslBlog/${filePath}/${domainName}${open.idx}.png`} alt="myFace" />
            </ModalBasic>
        </div>
    )
}

export default PicsTemplate
