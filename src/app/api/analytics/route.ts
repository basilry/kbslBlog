import { NextResponse } from "next/server"
import { getAnalytics } from "@lib/analytics/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" }

export async function GET() {
    try {
        return NextResponse.json(await getAnalytics(), { headers })
    } catch {
        // Google errors can carry authorization headers; do not log or expose them.
        console.warn("Public GA counters are temporarily unavailable")
        return NextResponse.json({ available: false }, { status: 503, headers })
    }
}
