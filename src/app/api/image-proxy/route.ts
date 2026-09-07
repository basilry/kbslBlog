import { NextRequest, NextResponse } from "next/server"
import { normalizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"
import { ImageProxyError, PROXY_TIMEOUT_MS, readResponseWithLimit } from "./imageProxyPolicy"
import { fetchRemoteImage, optimizeImage } from "./imageProxyService"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"])

const errorResponse = (message: string, status: number): NextResponse =>
    NextResponse.json(
        { error: message },
        {
            status,
            headers: {
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
            },
        },
    )

export async function GET(request: NextRequest): Promise<NextResponse> {
    const imageUrl = request.nextUrl.searchParams.get("url")
    const widthValue = request.nextUrl.searchParams.get("width") || "800"

    if (!imageUrl) return errorResponse("URL 파라미터가 필요합니다", 400)
    if (!/^\d+$/.test(widthValue)) return errorResponse("width는 양의 정수여야 합니다", 400)

    const requestedWidth = Number(widthValue)
    if (!Number.isSafeInteger(requestedWidth) || requestedWidth < 1) {
        return errorResponse("width는 양의 정수여야 합니다", 400)
    }
    const width = Math.min(requestedWidth, 1_200)

    let normalizedUrl: URL
    try {
        normalizedUrl = new URL(normalizeGoogleDriveImageUrl(imageUrl))
    } catch {
        return errorResponse("유효한 이미지 URL이 필요합니다", 400)
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS)

    try {
        const response = await fetchRemoteImage(normalizedUrl, controller.signal)
        if (!response.ok) throw new ImageProxyError(502, "원본 이미지를 가져오지 못했습니다")

        const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase()
        if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType)) {
            throw new ImageProxyError(415, "지원하는 이미지 형식이 아닙니다")
        }

        const imageBuffer = await readResponseWithLimit(response)
        const optimizedImageBuffer = await optimizeImage(imageBuffer, width)

        return new NextResponse(new Uint8Array(optimizedImageBuffer), {
            status: 200,
            headers: {
                "Content-Type": "image/webp",
                "Content-Length": String(optimizedImageBuffer.byteLength),
                "Cache-Control": "no-store, must-revalidate",
                "X-Content-Type-Options": "nosniff",
            },
        })
    } catch (error) {
        if (error instanceof ImageProxyError) return errorResponse(error.message, error.status)
        if (controller.signal.aborted) return errorResponse("원본 이미지 요청 시간이 초과되었습니다", 504)

        console.error("이미지 프록시 처리 오류:", error)
        return errorResponse("이미지 프록시 처리 중 오류가 발생했습니다", 500)
    } finally {
        clearTimeout(timeout)
    }
}
