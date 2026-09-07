export interface CounterSnapshot {
    available: true
    date: string
    timeZone: "Asia/Seoul"
    updatedAt: string
    todayVisitors: number
    totalVisitors: number
    postViews: Record<string, number>
}

export type CounterResponse = CounterSnapshot | { available: false }

export interface PostViewsSnapshot {
    available: true
    updatedAt: string
    postViews: Record<string, number>
}

export type PostViewsResponse = PostViewsSnapshot | { available: false }

export function counterDay(date: Date, timeZone: string): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date)
}
