import { isGoogleDriveImage, isManagedImageUrl } from "@lib/utils/imageUtils"

export type ImageUploadCache = Map<string, string>

export type PostImageUploaders = {
    uploadBase64Images: (images: string[]) => Promise<unknown>
    uploadExternalImages: (urls: string[]) => Promise<unknown>
}

export class PostImageUploadError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        this.name = "PostImageUploadError"
    }
}

const IMAGE_SRC_PATTERN = /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(.*?)\2/gi
const BASE64_IMAGE_PATTERN = /^data:image\/(?:avif|gif|jpe?g|png|webp);base64,[a-z0-9+/=\s]+$/i

type ImageSources = {
    base64Images: string[]
    externalImages: string[]
}

const unique = (values: string[]): string[] => Array.from(new Set(values))

export const collectUploadableImageSources = (content: string, backendBaseUrl = ""): ImageSources => {
    const base64Images: string[] = []
    const externalImages: string[] = []

    let match: RegExpExecArray | null
    IMAGE_SRC_PATTERN.lastIndex = 0
    while ((match = IMAGE_SRC_PATTERN.exec(content)) !== null) {
        const source = match[3]
        if (BASE64_IMAGE_PATTERN.test(source)) {
            base64Images.push(source)
            continue
        }
        if (source.startsWith("data:") || source.startsWith("blob:")) {
            throw new PostImageUploadError("저장할 수 없는 임시 이미지가 본문에 있습니다")
        }
        if (source.startsWith("//")) {
            throw new PostImageUploadError("프로토콜이 생략된 외부 이미지 주소는 저장할 수 없습니다")
        }
        if (source.startsWith("/") || isGoogleDriveImage(source) || isManagedImageUrl(source, backendBaseUrl)) {
            continue
        }

        try {
            const url = new URL(source)
            if (url.protocol === "http:" || url.protocol === "https:") externalImages.push(source)
        } catch {
            // Relative editor assets are kept as-is.
        }
    }

    return { base64Images: unique(base64Images), externalImages: unique(externalImages) }
}

const isUsableUploadedUrl = (value: unknown): value is string => {
    if (typeof value !== "string" || value.length === 0 || value.startsWith("blob:") || value.startsWith("data:")) {
        return false
    }
    if (value.startsWith("/")) return true

    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

const uploadAndCache = async (
    sources: string[],
    upload: (sources: string[]) => Promise<unknown>,
    cache: ImageUploadCache,
    failureMessage: string,
): Promise<void> => {
    const missingSources = sources.filter((source) => !cache.has(source))
    if (missingSources.length === 0) return

    let result: unknown
    try {
        result = await upload(missingSources)
    } catch (error) {
        throw new PostImageUploadError(failureMessage, { cause: error })
    }

    if (!Array.isArray(result) || result.length > missingSources.length) {
        throw new PostImageUploadError(`${failureMessage} 업로드 결과가 요청과 일치하지 않습니다`)
    }

    if (Array.isArray(result)) {
        missingSources.forEach((source, index) => {
            const uploadedUrl = result[index]
            if (isUsableUploadedUrl(uploadedUrl)) cache.set(source, uploadedUrl)
        })
    }

    if (result.length !== missingSources.length || missingSources.some((source) => !cache.has(source))) {
        throw new PostImageUploadError(`${failureMessage} 업로드 결과가 요청과 일치하지 않습니다`)
    }
}

export const preparePostContent = async (
    content: string,
    uploaders: PostImageUploaders,
    cache: ImageUploadCache,
    backendBaseUrl = "",
): Promise<string> => {
    if (/__IMAGE_PLACEHOLDER_|__EXTERNAL_IMAGE_PLACEHOLDER_/.test(content)) {
        throw new PostImageUploadError("해결되지 않은 이미지 자리표시자가 본문에 있습니다")
    }

    const { base64Images, externalImages } = collectUploadableImageSources(content, backendBaseUrl)

    await uploadAndCache(base64Images, uploaders.uploadBase64Images, cache, "본문 이미지 업로드에 실패했습니다.")
    await uploadAndCache(externalImages, uploaders.uploadExternalImages, cache, "외부 이미지 업로드에 실패했습니다.")

    const preparedContent = content.replace(
        IMAGE_SRC_PATTERN,
        (fullMatch, prefix: string, quote: string, source: string) => {
            const uploadedUrl = cache.get(source)
            return uploadedUrl ? `${prefix}${quote}${uploadedUrl}${quote}` : fullMatch
        },
    )

    return preparedContent
}
