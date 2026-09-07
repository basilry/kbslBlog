import { describe, expect, it } from "vitest"
import { analyticsDay } from "./types"
import { parseReports, reportRequests, type BatchReport } from "./reports"

const now = new Date("2026-09-07T06:00:00Z")
const paths = ["/post/example", "/post/no-views"]
function reports(): BatchReport {
    return { reports: [
        { metricHeaders: [{ name: "totalUsers" }], rows: [{ metricValues: [{ value: "7" }] }], rowCount: 1, metadata: { timeZone: "Asia/Seoul" } },
        { metricHeaders: [{ name: "screenPageViews" }], dimensionHeaders: [{ name: "pagePath" }], rowCount: 2, rows: [
            { dimensionValues: [{ value: "/post/example" }], metricValues: [{ value: "12" }] },
            { dimensionValues: [{ value: "/post/example/" }], metricValues: [{ value: "3" }] },
        ] },
    ] }
}

describe("public GA reports", () => {
    it("uses Korea's day boundary instead of the server's UTC date", () => {
        expect(analyticsDay(new Date("2026-09-07T14:59:59Z"), "Asia/Seoul")).toBe("2026-09-07")
        expect(analyticsDay(new Date("2026-09-07T15:00:00Z"), "Asia/Seoul")).toBe("2026-09-08")
    })
    it("queries total visitors and cumulative views only on production hosts and public post paths", () => {
        const requests = reportRequests(paths, "2026-09-07")
        expect(requests[0]).toMatchObject({ dateRanges: [{ startDate: "2026-09-07", endDate: "2026-09-07" }], metrics: [{ name: "totalUsers" }] })
        expect(requests[1]).toMatchObject({ metrics: [{ name: "screenPageViews" }], dimensions: [{ name: "pagePath" }] })
        const query = JSON.stringify(requests)
        expect(query).toContain('"www.basilry.kim"')
        expect(query).toContain('"/post/example/"')
        expect(query).not.toContain("localhost")
        expect(query).not.toContain("/post/register")
    })
    it("sums trailing slash variants and treats missing rows as zero only after successful reporting", () => {
        const snapshot = parseReports(reports(), paths, "2026-09-07", now)
        expect(snapshot.todayVisitors).toBe(7)
        expect(snapshot.postViews).toEqual({ "/post/example": 15, "/post/no-views": 0 })
        expect(snapshot).not.toHaveProperty("reports")
    })
    it("does not expose unrequested paths returned by upstream", () => {
        const data = reports()
        data.reports![1].rows![1].dimensionValues![0].value = "/post/private-draft"
        expect(parseReports(data, paths, "2026-09-07", now).postViews).not.toHaveProperty("/post/private-draft")
    })
    it("does not turn a missing or redacted report into zero", () => {
        expect(() => parseReports({}, paths, "2026-09-07", now)).toThrow()
        const data = reports()
        data.reports![0].metadata!.subjectToThresholding = true
        expect(() => parseReports(data, paths, "2026-09-07", now)).toThrow()
    })
    it("rejects incomplete pagination and invalid counts", () => {
        const truncated = reports()
        truncated.reports![1].rowCount = 3
        expect(() => parseReports(truncated, paths, "2026-09-07", now)).toThrow()
        const invalid = reports()
        invalid.reports![0].rows![0].metricValues![0].value = "-1"
        expect(() => parseReports(invalid, paths, "2026-09-07", now)).toThrow()
    })
    it("rejects reports crossing midnight or using an unexpected timezone", () => {
        expect(() => parseReports(reports(), paths, "2026-09-07", new Date("2026-09-07T15:00:00Z"))).toThrow()
        const data = reports()
        data.reports![0].metadata!.timeZone = "America/Los_Angeles"
        expect(() => parseReports(data, paths, "2026-09-07", now)).toThrow()
    })
    it("accepts a successful empty property without fabricating unavailable data", () => {
        const data: BatchReport = { reports: [{ metricHeaders: [{ name: "totalUsers" }], metadata: { timeZone: "Asia/Seoul" } }] }
        expect(reportRequests([], "2026-09-07")).toHaveLength(1)
        expect(parseReports(data, [], "2026-09-07", now)).toMatchObject({ available: true, todayVisitors: 0, postViews: {} })
    })
})
