"use client"

import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/projects.module.scss"
import Carenote from "./Carenote"
import ImsPart1 from "./ImsPart1"
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
                modules={[Pagination, Navigation]}
                loop={true}
                className={classNames(styles.swiper, "mySwiper")}
                navigation={true}
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
                <SwiperSlide className={styles.swiperSlide}>
                    <ImsPart1 />
                </SwiperSlide>
            </Swiper>
        </Wrapper>
    )
}

export default Projects
