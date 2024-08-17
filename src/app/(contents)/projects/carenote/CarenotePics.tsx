import { Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import styles from "@styles/pages/projectsPics.module.scss"

const CarenotePics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock)}>
                <Swiper pagination={true} modules={[Navigation, Pagination, Scrollbar]} className="mySwiper">
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote1.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote2.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote3.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote4.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote5.png" alt="myFace" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.block}>
                        <img className={styles.projectImages} src="/kbslBlog/carenotePics/carenote6.png" alt="myFace" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default CarenotePics
