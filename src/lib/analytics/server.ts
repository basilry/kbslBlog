import { unstable_cache } from "next/cache"
import { JWT } from "google-auth-library"
import { getAllPublicPostSummaries } from "@lib/content"
import { analyticsDay, type AnalyticsResponse } from "./types"
import { parseReports, reportRequests, type BatchReport } from "./reports"

const PROPERTY_ID = "430656761"
const REVALIDATE_SECONDS = 15 * 60

function credentials() {
    const raw = process.env.GA_SERVICE_ACCOUNT_JSON
    if (!raw) return null
    const value = JSON.parse(raw)
    if (typeof value.client_email !== "string" || !value.client_email.endsWith(".iam.gserviceaccount.com") ||
        typeof value.private_key !== "string" || !value.private_key.includes("-----BEGIN PRIVATE KEY-----")) {
        throw new Error("Invalid analytics credentials")
    }
    // Use only the two required fields; never trust endpoints from a credentials document.
    return { client_email: value.client_email, private_key: value.private_key }
}

const cachedSnapshot = unstable_cache(async (propertyId: string, day: string) => {
    const identity = credentials()
    if (!identity) throw new Error("Analytics is not configured")
    const { items } = await getAllPublicPostSummaries()
    const paths = [...new Set(items.map((post) => post.href))]
    const client = new JWT({
        email: identity.client_email, key: identity.private_key,
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
        transporterOptions: { timeout: 10_000, retry: false },
    })
    const response = await client.request<BatchReport>({
        url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
        method: "POST",
        data: { requests: reportRequests(paths, day) },
        timeout: 10_000,
        retry: false,
    })
    return parseReports(response.data, paths, day, new Date())
}, ["public-ga-counters-v1"], { revalidate: REVALIDATE_SECONDS })

export async function getAnalytics(): Promise<AnalyticsResponse> {
    if (!process.env.GA_SERVICE_ACCOUNT_JSON) return { available: false }
    const propertyId = process.env.GA_PROPERTY_ID || PROPERTY_ID
    if (!/^\d+$/.test(propertyId)) throw new Error("Invalid analytics property")
    const day = analyticsDay(new Date(), "Asia/Seoul")
    const snapshot = await cachedSnapshot(propertyId, day)
    // A cached response must never show yesterday's visitors as today's.
    if (snapshot.date !== analyticsDay(new Date(), snapshot.timeZone)) return { available: false }
    return snapshot
}
