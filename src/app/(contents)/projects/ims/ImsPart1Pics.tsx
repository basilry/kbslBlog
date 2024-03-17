import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import styles from "@styles/pages/projectsPics.module.scss"

const ImsPart1Pics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={-40}
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
                        <img src="/kbslBlog/imsPics/ims1.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img src="/kbslBlog/imsPics/ims2.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img src="/kbslBlog/imsPics/ims3.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img src="/kbslBlog/imsPics/ims4.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img src="/kbslBlog/imsPics/ims5.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img src="/kbslBlog/imsPics/ims6.png" alt="myFace" sizes={"100vw"} width={300} height={400} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default ImsPart1Pics
