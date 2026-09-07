import { analyticsDay, type AnalyticsSnapshot } from "./types"

interface Report {
    metricHeaders?: { name?: string }[]
    dimensionHeaders?: { name?: string }[]
    rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[]
    rowCount?: number
    metadata?: { timeZone?: string; subjectToThresholding?: boolean; dataLossFromOtherRow?: boolean }
}

export interface BatchReport { reports?: Report[] }

const hosts = { filter: { fieldName: "hostName", inListFilter: { values: ["www.basilry.kim", "basilry.kim"] } } }

export function reportRequests(paths: string[], day: string) {
    const requests: object[] = [{
        dateRanges: [{ startDate: day, endDate: day }],
        metrics: [{ name: "totalUsers" }],
        dimensionFilter: hosts,
        limit: "1",
    }]
    if (paths.length) requests.push({
        dateRanges: [{ startDate: "2020-01-01", endDate: day }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: { andGroup: { expressions: [hosts, {
            filter: { fieldName: "pagePath", inListFilter: { values: paths.flatMap((path) => [path, `${path}/`]), caseSensitive: true } },
        }] } },
        limit: String(paths.length * 2),
    })
    return requests
}

function metric(value: string | undefined): number {
    if (!value || !/^\d+$/.test(value)) throw new Error("Invalid aggregate")
    const count = Number(value)
    if (!Number.isSafeInteger(count)) throw new Error("Invalid aggregate")
    return count
}

function completeReport(report: Report | undefined, expectedMetric: string): Report {
    if (!report || report.metricHeaders?.[0]?.name !== expectedMetric ||
        report.metadata?.subjectToThresholding || report.metadata?.dataLossFromOtherRow ||
        (report.rowCount ?? 0) > (report.rows?.length ?? 0)) throw new Error("Incomplete report")
    return report
}

export function parseReports(batch: BatchReport, paths: string[], day: string, now: Date): AnalyticsSnapshot {
    const visitors = completeReport(batch.reports?.[0], "totalUsers")
    const timeZone = visitors.metadata?.timeZone || "Asia/Seoul"
    if (timeZone !== "Asia/Seoul" || analyticsDay(now, timeZone) !== day) throw new Error("Reporting day changed")
    if ((visitors.rows?.length ?? 0) > 1) throw new Error("Invalid total")
    const todayVisitors = visitors.rows?.length ? metric(visitors.rows[0].metricValues?.[0]?.value) : 0
    const postViews: Record<string, number> = Object.fromEntries(paths.map((path) => [path, 0]))
    if (paths.length) {
        const views = completeReport(batch.reports?.[1], "screenPageViews")
        if (views.dimensionHeaders?.[0]?.name !== "pagePath") throw new Error("Invalid dimension")
        for (const row of views.rows ?? []) {
            const path = row.dimensionValues?.[0]?.value?.replace(/\/$/, "")
            if (!path || !Object.hasOwn(postViews, path)) continue
            const count = postViews[path] + metric(row.metricValues?.[0]?.value)
            if (!Number.isSafeInteger(count)) throw new Error("Invalid aggregate")
            postViews[path] = count
        }
    }
    return { available: true, date: day, timeZone, updatedAt: now.toISOString(), todayVisitors, postViews }
}
