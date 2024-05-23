import dayjs from "dayjs"

export enum DateFormat {
    DEFAULT_DATE = "YYYYMMDD",
    DEFAULT_DATE_TIME = "YYYY.MM.DD HH:mm",
    VIEW_DATE = "YYYY. MM. DD.",
    MONTH_DATE = "YYYY. MM.",
}

export const date = (...value: any[]): dayjs.Dayjs => {
    return dayjs(...value)
}

export const formatDate = (time: string | number | undefined, formatter = DateFormat.VIEW_DATE): string => {
    if (!time) {
        return "현 재"
    }

    return date(time).format(formatter)
}
