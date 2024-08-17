"use client"

import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import styles from "@styles/pages/projectsPics.module.scss"

const ImsPart1Pics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock)}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims1.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims2.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims3.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims4.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims5.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/imsPics/ims6.png" alt="myFace" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default ImsPart1Pics
