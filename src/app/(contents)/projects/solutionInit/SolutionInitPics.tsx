"use client"

import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import styles from "@styles/pages/projectsPics.module.scss"

const SolutionInitPics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/sirMast.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/empMast1.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/sirMast2.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/empMast2.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/careProv.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/solutionPics/empMast4.png" alt="myFace" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default SolutionInitPics
