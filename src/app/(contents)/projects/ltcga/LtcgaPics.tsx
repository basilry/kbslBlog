"use client"

import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ReactElement } from "react"
import styles from "@styles/pages/projectsPics.module.scss"
import classNames from "classnames"

const LtcgaPics = (): ReactElement => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock)}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga1.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga2.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga3.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga4.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga5.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga6.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga7.png" alt="myFace"/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/ddogaPics/ddoga8.png" alt="myFace"/>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default LtcgaPics