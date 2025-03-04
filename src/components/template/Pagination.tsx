import { ReactElement } from "react"
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
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i)

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
                onClick={() => onChangePage(pageable.pageNumber - 1)}
            />
            {pageNumbers.map((pageIndex) => {
                const pageNum = pageIndex + 1 // 표시용 (1-based)
                const isActive = pageIndex === currentPage // 현재 페이지 여부

                return (
                    <TextBasic
                        key={pageIndex}
                        size="large"
                        bold="bold"
                        onClick={() => onChangePage(pageIndex)}
                        className={isActive ? styles.active : styles.pageNum}
                    >
                        {pageNum}
                    </TextBasic>
                )
            })}
            <Image
                className={styles.arrow}
                src={darkMode ? "/pagination/arrowForward_white.svg" : "/pagination/arrowForward.svg"}
                alt={"first"}
                width={20}
                height={20}
                onClick={() => onChangePage(pageable.pageNumber + 1)}
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
