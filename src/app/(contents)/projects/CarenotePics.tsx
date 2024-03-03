import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import styles from "@styles/pages/projectsPics.module.scss"

const CarenotePics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={-30}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                    modules={[Navigation]}
                    loop={true}
                    className="mySwiper"
                >
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote1.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote2.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote3.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote4.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote5.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/carenotePics/carenote6.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={500}
                            height={500}
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default CarenotePics
