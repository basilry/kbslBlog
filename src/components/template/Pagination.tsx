"use client"

import { ReactElement, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import TextBasic from "@components/atom/TextBasic"
import { IPagination } from "@interface/IRoot"
import { useCoreStore } from "@lib/stores/store"
import styles from "@styles/components/template/pagination.module.scss"

interface IPaginationBasicProps<T> extends IPagination<T> {
    path: string
}

function Pagination<T>(props: IPaginationBasicProps<T>): ReactElement {
    const { path, totalPages, pageable } = props

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
            <Link
                href={{
                    pathname: `/${path}`,
                    query: { page: 1 },
                }}
            >
                <Image
                    className={styles.arrow}
                    style={{ cursor: currentPage === 0 ? "not-allowed" : "pointer" }}
                    src={darkMode ? "/pagination/firstPage_white.svg" : "/pagination/firstPage.svg"}
                    alt={"first"}
                    width={30}
                    height={30}
                />
            </Link>
            <Link href={{ pathname: `/${path}`, query: { page: currentPage - 1 } }}>
                <Image
                    className={styles.arrow}
                    style={{ cursor: currentPage === 0 ? "not-allowed" : "pointer" }}
                    src={darkMode ? "/pagination/arrowBack_white.svg" : "/pagination/arrowBack.svg"}
                    alt={"first"}
                    width={20}
                    height={20}
                />
            </Link>
            <div className={classNames(styles.pageNumWrapper, darkMode && styles.dark)}>
                {visiblePageNumbers.map((pageIndex) => {
                    const pageNum = pageIndex + 1 // 표시용 (1-based)
                    const isActive = pageIndex === currentPage // 현재 페이지 여부

                    return (
                        <Link
                            href={{ pathname: `/${path}`, query: { page: pageIndex + 1 } }}
                            key={pageIndex + 1}
                            className={isActive ? styles.active : styles.pageNum}
                        >
                            <TextBasic size="medium" bold="bold">
                                {pageNum}
                            </TextBasic>
                        </Link>
                    )
                })}
            </div>
            <Link href={{ pathname: `/${path}`, query: { page: currentPage + 2 } }}>
                <Image
                    className={styles.arrow}
                    style={{ cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer" }}
                    src={darkMode ? "/pagination/arrowForward_white.svg" : "/pagination/arrowForward.svg"}
                    alt={"first"}
                    width={20}
                    height={20}
                />
            </Link>
            <Link href={{ pathname: `/${path}`, query: { page: totalPages } }}>
                <Image
                    className={styles.arrow}
                    style={{ cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer" }}
                    src={darkMode ? "/pagination/lastPage_white.svg" : "/pagination/lastPage.svg"}
                    alt={"first"}
                    width={30}
                    height={30}
                />
            </Link>
        </div>
    )
}

export default Pagination
