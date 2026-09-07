const GOOGLE_DRIVE_HOSTS = new Set(["drive.google.com", "drive.usercontent.google.com"])

const isGoogleusercontentHost = (hostname: string): boolean =>
    hostname === "googleusercontent.com" || hostname.endsWith(".googleusercontent.com")

const parseHttpUrl = (value: string): URL | null => {
    try {
        const url = new URL(value)
        return url.protocol === "https:" || url.protocol === "http:" ? url : null
    } catch {
        return null
    }
}

export function isGoogleDriveImage(url: string): boolean {
    const parsedUrl = parseHttpUrl(url)
    if (!parsedUrl) return false

    const hostname = parsedUrl.hostname.toLowerCase()
    return GOOGLE_DRIVE_HOSTS.has(hostname) || isGoogleusercontentHost(hostname)
}

export function normalizeGoogleDriveImageUrl(url: string): string {
    const parsedUrl = parseHttpUrl(url)
    if (!parsedUrl || parsedUrl.hostname.toLowerCase() !== "drive.google.com") return url

    const filePathMatch = parsedUrl.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)/)
    const fileId = filePathMatch?.[1] || parsedUrl.searchParams.get("id")

    if (!fileId || !/^[A-Za-z0-9_-]+$/.test(fileId)) return url

    const normalizedUrl = new URL("https://drive.google.com/uc")
    normalizedUrl.searchParams.set("export", "view")
    normalizedUrl.searchParams.set("id", fileId)
    return normalizedUrl.toString()
}

const isProxyPath = (pathname: string): boolean => pathname === "/proxy/url" || pathname.startsWith("/proxy/image/")

export function isManagedImageUrl(url: string, backendBaseUrl = process.env.NEXT_PUBLIC_IP || ""): boolean {
    if (!url) return false

    if (url.startsWith("/") && !url.startsWith("//")) {
        try {
            return isProxyPath(new URL(url, "https://local.invalid").pathname)
        } catch {
            return false
        }
    }

    const parsedUrl = parseHttpUrl(url)
    const parsedBackend = parseHttpUrl(backendBaseUrl)
    if (!parsedUrl || !parsedBackend || parsedUrl.origin !== parsedBackend.origin) return false

    return isProxyPath(parsedUrl.pathname)
}

const joinBackendUrl = (path: string, backendBaseUrl: string): string => {
    if (!backendBaseUrl) return path
    return `${backendBaseUrl.replace(/\/$/, "")}${path}`
}

export function optimizeGoogleDriveImageUrl(url: string): string {
    if (!url) return url

    const backendBaseUrl = process.env.NEXT_PUBLIC_IP || ""
    if (isManagedImageUrl(url, backendBaseUrl)) {
        return url.startsWith("/") ? joinBackendUrl(url, backendBaseUrl) : url
    }

    const parsedUrl = parseHttpUrl(url)
    if (!parsedUrl || !isGoogleDriveImage(url)) return url

    const normalizedUrl = normalizeGoogleDriveImageUrl(url)
    const normalizedParsedUrl = parseHttpUrl(normalizedUrl)
    const fileId =
        normalizedParsedUrl?.hostname === "drive.google.com" ? normalizedParsedUrl.searchParams.get("id") : null
    if (fileId && /^[A-Za-z0-9_-]+$/.test(fileId)) {
        return joinBackendUrl(`/proxy/image/${encodeURIComponent(fileId)}`, backendBaseUrl)
    }

    return joinBackendUrl(`/proxy/url?imageUrl=${encodeURIComponent(url)}`, backendBaseUrl)
}
