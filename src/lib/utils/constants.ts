import dayjs from "dayjs"

export const FIRST_TOTAL_YEAR_DATE = "20210913"
export const FIRST_FRONT_YEAR_DATE = "20211201"
export const FIRST_BACK_YEAR_DATE = "20220101"
export const FIRST_FULL_YEAR_DATE = "20240101"
export const TODAY = dayjs().format("YYYYMMDD")
export const TOTAL_YEAR = dayjs(TODAY).diff(FIRST_TOTAL_YEAR_DATE, "year")
export const FRONT_YEAR = dayjs(TODAY).diff(FIRST_FRONT_YEAR_DATE, "month")
export const BACK_YEAR = dayjs(TODAY).diff(FIRST_BACK_YEAR_DATE, "month")
export const FULL_YEAR = dayjs(TODAY).diff(FIRST_FULL_YEAR_DATE, "month")
