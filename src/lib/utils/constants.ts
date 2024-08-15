import dayjs from "dayjs"

export const FIRST_TOTAL_YEAR_DATE = "20210913"
export const FIRST_FRONT_YEAR_DATE = "20210913"
export const FIRST_BACK_YEAR_DATE = "20220101"
export const FIRST_FULL_YEAR_DATE = "20240101"
export const TODAY = dayjs().format("YYYYMMDD")
export const TOTAL_YEAR = dayjs(TODAY).diff(FIRST_TOTAL_YEAR_DATE, "year")
export const FRONT_YEAR = dayjs(TODAY).diff(FIRST_FRONT_YEAR_DATE, "month")
export const BACK_YEAR = dayjs(TODAY).diff(FIRST_BACK_YEAR_DATE, "month")
export const FULL_YEAR = dayjs(TODAY).diff(FIRST_FULL_YEAR_DATE, "month")

// const MENU_LIST = ["Main", "Search", "Career", "Notice", "Post", "Projects", "Visitor", "Donate"]
// const MENU_LIST_KR = ["메인", "블로그 글 검색", "자기소개", "공지사항", "포스팅", "프로젝트 목록", "방명록", "후원"]
export const MENU_LIST = ["Introduce", "Career", "Projects", "Visitor"]
export const MENU_LIST_KR = ["소개", "경력", "프로젝트 목록", "방명록"]
