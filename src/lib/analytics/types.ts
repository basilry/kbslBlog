export interface AnalyticsSnapshot {
    available: true
    date: string
    timeZone: string
    updatedAt: string
    todayVisitors: number
    postViews: Record<string, number>
}

export type AnalyticsResponse = AnalyticsSnapshot | { available: false }

export function analyticsDay(date: Date, timeZone: string): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
}
