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

export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (): void => resolve(reader.result as string)
        reader.onerror = (error): void => reject(error)
    })
}

export const handleCalDiffTime = (diff: number, createdAt: Date): string => {
    if (diff < 1) {
        return `${dayjs().diff(dayjs(createdAt), "minute")}분 전`
    } else {
        if (diff < 24) {
            return `${diff}시간 전`
        } else {
            return `${dayjs().diff(dayjs(createdAt), "day")}일 전`
        }
    }
}
