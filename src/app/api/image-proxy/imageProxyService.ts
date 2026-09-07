import sharp from "sharp"
import {
    assertSafeRemoteUrl,
    ImageProxyError,
    MAX_IMAGE_BYTES,
    MAX_IMAGE_DIMENSION,
    MAX_IMAGE_PIXELS,
    MAX_PROXY_REDIRECTS,
} from "./imageProxyPolicy"
import type { HostResolver } from "./imageProxyPolicy"

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const ALLOWED_SHARP_FORMATS = new Set(["jpeg", "png", "webp", "gif", "avif"])

type FetchImageDependencies = {
    fetchImpl?: typeof fetch
    resolveHost?: HostResolver
}

const waitForSafetyCheck = async (url: URL, signal: AbortSignal, resolveHost?: HostResolver): Promise<void> => {
    if (signal.aborted) throw signal.reason

    let abortHandler: (() => void) | undefined
    const aborted = new Promise<never>((_, reject) => {
        abortHandler = () => reject(signal.reason || new DOMException("Aborted", "AbortError"))
        signal.addEventListener("abort", abortHandler, { once: true })
    })

    try {
        await Promise.race([assertSafeRemoteUrl(url, resolveHost), aborted])
    } finally {
        if (abortHandler) signal.removeEventListener("abort", abortHandler)
    }
}

export const fetchRemoteImage = async (
    initialUrl: URL,
    signal: AbortSignal,
    { fetchImpl = fetch, resolveHost }: FetchImageDependencies = {},
): Promise<Response> => {
    let currentUrl = initialUrl

    for (let redirectCount = 0; redirectCount <= MAX_PROXY_REDIRECTS; redirectCount += 1) {
        await waitForSafetyCheck(currentUrl, signal, resolveHost)

        const response = await fetchImpl(currentUrl, {
            headers: {
                Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif",
                Referer: "https://drive.google.com/",
                "User-Agent": "kbsl-blog-image-proxy/1.0",
            },
            redirect: "manual",
            signal,
        })

        if (!REDIRECT_STATUSES.has(response.status)) return response
        if (redirectCount === MAX_PROXY_REDIRECTS) {
            throw new ImageProxyError(502, "원본 이미지의 리다이렉트가 너무 많습니다")
        }

        const location = response.headers.get("location")
        if (!location) throw new ImageProxyError(502, "원본 이미지의 리다이렉트 주소가 없습니다")
        await response.body?.cancel()
        currentUrl = new URL(location, currentUrl)
    }

    throw new ImageProxyError(502, "원본 이미지를 가져오지 못했습니다")
}

export const optimizeImage = async (imageBuffer: Buffer, width: number): Promise<Buffer> => {
    try {
        const image = sharp(imageBuffer, {
            failOn: "warning",
            limitInputPixels: MAX_IMAGE_PIXELS,
            sequentialRead: true,
        })
        const metadata = await image.metadata()
        const pageCount = metadata.pages || 1
        const pageHeight = metadata.pageHeight || metadata.height || 0
        const totalPixels = (metadata.width || 0) * pageHeight * pageCount

        if (
            !metadata.format ||
            !ALLOWED_SHARP_FORMATS.has(metadata.format) ||
            !metadata.width ||
            !metadata.height ||
            metadata.width > MAX_IMAGE_DIMENSION ||
            pageHeight > MAX_IMAGE_DIMENSION ||
            totalPixels > MAX_IMAGE_PIXELS
        ) {
            throw new ImageProxyError(415, "안전하게 처리할 수 없는 이미지입니다")
        }

        const optimizedImageBuffer = await image
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer()

        if (optimizedImageBuffer.byteLength > MAX_IMAGE_BYTES) {
            throw new ImageProxyError(413, "변환된 이미지 파일이 너무 큽니다")
        }

        return optimizedImageBuffer
    } catch (error) {
        if (error instanceof ImageProxyError) throw error
        throw new ImageProxyError(415, "지원하는 이미지 형식이 아닙니다")
    }
}
