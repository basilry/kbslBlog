"use client"

import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import classNames from "classnames"
import Wrapper from "@components/layout/Wrapper"
import NoImage from "@components/ui/NoImage"
import styles from "@styles/pages/projects.module.scss"
import Carenote from "./Carenote"
import CarenotePics from "./CarenotePics"
import ImsPart1 from "./ImsPart1"
import ImsPart1Pics from "./ImsPart1Pics"
import SolutionInit from "./SolutionInit"
import SolutionInitPics from "./SolutionInitPics"
import SolutionRenewal from "./SolutionRenewal"

const Projects = (): JSX.Element => {
    return (
        <Wrapper>
            <Swiper
                onSlideChange={(): void => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
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
                    <SolutionInitPics />
                </SwiperSlide>
                <SwiperSlide className={styles.swiperSlide}>
                    <SolutionRenewal />
                    <NoImage />
                </SwiperSlide>
                <SwiperSlide className={styles.swiperSlide}>
                    <Carenote />
                    <CarenotePics />
                </SwiperSlide>
                <SwiperSlide className={styles.swiperSlide}>
                    <ImsPart1 />
                    <ImsPart1Pics />
                </SwiperSlide>
            </Swiper>
        </Wrapper>
    )
}

export default Projects
