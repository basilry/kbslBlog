"use client"

import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ReactElement } from "react"
import styles from "@styles/pages/projectsPics.module.scss"
import classNames from "classnames"

const ImsPart2Pics = (): ReactElement => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock)}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims7.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims8.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims9.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims10.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims11.png" alt="myFace" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default ImsPart2Pics
