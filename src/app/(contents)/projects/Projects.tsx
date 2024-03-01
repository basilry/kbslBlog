"use client"

import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/projects.module.scss"
import Carenote from "./Carenote"
import SolutionInit from "./SolutionInit"
import SolutionRenewal from "./SolutionRenewal"

const Projects = (): JSX.Element => {
    return (
        <Wrapper>
            <Swiper
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                loop={true}
                className={classNames(styles.swiper, "mySwiper")}
            >
                <SwiperSlide className={styles.swiperSlide}>
                    <SolutionInit />
                </SwiperSlide>
                <SwiperSlide className={styles.swiperSlide}>
                    <SolutionRenewal />
                </SwiperSlide>
                <SwiperSlide className={styles.swiperSlide}>
                    <Carenote />
                </SwiperSlide>
                {/* <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide> */}
            </Swiper>
        </Wrapper>
    )
}

export default Projects
