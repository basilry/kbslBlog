"use client"

import { ReactElement, useEffect, useState } from "react"
import Image from "next/image"
import TextBasic from "@components/atom/TextBasic"
import { IPagination } from "@interface/IRoot"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/pagination.module.scss"

interface IPaginationBasicProps<T> extends IPagination<T> {
    onChangePage: (page: number) => void
}

function Pagination<T>(props: IPaginationBasicProps<T>): ReactElement {
    const { onChangePage, totalPages, pageable } = props

    const { darkMode } = useCoreStore()

    const currentPage = pageable?.pageNumber
    const [pagesToShow, setPagesToShow] = useState(10)

    // 전체 페이지 배열 생성: [0, 1, 2, ..., totalPages - 1]
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i)

    // 현재 그룹 계산 (예: 0~4: group 0, 5~9: group 1, …)
    const currentGroup = Math.floor(currentPage / pagesToShow)
    const startIndex = currentGroup * pagesToShow
    const endIndex = Math.min(startIndex + pagesToShow, totalPages)
    const visiblePageNumbers = pageNumbers.slice(startIndex, endIndex)

    // 이전 그룹 이동: 현재 그룹이 0보다 크면 이전 그룹의 첫 페이지로 이동
    const handlePrevGroup = (): void => {
        if (currentGroup > 0) {
            const newPage = (currentGroup - 1) * pagesToShow
            onChangePage(newPage)
        }
    }

    // 다음 그룹 이동: endIndex가 totalPages보다 작으면 다음 그룹의 첫 페이지로 이동
    const handleNextGroup = (): void => {
        if (endIndex < totalPages) {
            const newPage = currentGroup * pagesToShow + pagesToShow
            onChangePage(newPage)
        }
    }

    const updatePagesToShow = (): void => {
        if (window.innerWidth < 768) {
            setPagesToShow(5)
        } else {
            setPagesToShow(10)
        }
    }

    useEffect(() => {
        updatePagesToShow()
        window.addEventListener("resize", updatePagesToShow)
        return () => window.removeEventListener("resize", updatePagesToShow)
    }, [])

    return (
        <div className={styles.paginationWrapper}>
            <Image
                className={styles.arrow}
                src={darkMode ? "/pagination/firstPage_white.svg" : "/pagination/firstPage.svg"}
                alt={"first"}
                width={30}
                height={30}
                onClick={() => onChangePage(0)}
            />
            <Image
                className={styles.arrow}
                src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                alt={"first"}
                width={20}
                height={20}
                onClick={handlePrevGroup}
            />
            <div className={styles.pageNumWrapper}>
                {visiblePageNumbers.map((pageIndex) => {
                    const pageNum = pageIndex + 1 // 표시용 (1-based)
                    const isActive = pageIndex === currentPage // 현재 페이지 여부

                    return (
                        <TextBasic
                            key={pageIndex}
                            size="medium"
                            bold="bold"
                            className={isActive ? styles.active : styles.pageNum}
                            onClick={() => onChangePage(pageIndex)}
                        >
                            {pageNum}
                        </TextBasic>
                    )
                })}
            </div>
            <Image
                className={styles.arrow}
                src={darkMode ? "/pagination/arrowForward_white.svg" : "/pagination/arrowForward.svg"}
                alt={"first"}
                width={20}
                height={20}
                onClick={handleNextGroup}
            />
            <Image
                className={styles.arrow}
                src={darkMode ? "/pagination/lastPage_white.svg" : "/pagination/lastPage.svg"}
                alt={"first"}
                width={30}
                height={30}
                onClick={() => onChangePage(totalPages - 1)}
            />
        </div>
    )
}

export default Pagination
