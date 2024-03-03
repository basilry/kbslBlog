import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import styles from "@styles/pages/projectsPics.module.scss"

const SolutionInitPics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={100}
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
                    className={classNames("mySwiper", styles.height)}
                >
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/sirMast.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/empMast1.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/sirMast2.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/empMast2.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/careProv.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                    <SwiperSlide id="bottomSlide">
                        <img
                            src="/kbslBlog/solutionPics/empMast4.png"
                            alt="myFace"
                            sizes={"100vw"}
                            width={600}
                            height={400}
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default SolutionInitPics
