import { lookup } from "node:dns/promises"
import { BlockList, isIP } from "node:net"

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 12_000
export const MAX_IMAGE_PIXELS = 40_000_000
export const MAX_PROXY_REDIRECTS = 3
export const PROXY_TIMEOUT_MS = 8_000

const ALLOWED_EXACT_HOSTS = new Set(["drive.google.com", "drive.usercontent.google.com"])

const normalizeHostname = (hostname: string): string => hostname.toLowerCase().replace(/\.$/, "")

export const isAllowedImageUrl = (value: string): boolean => {
    if (!value || value.length > 2_048) return false

    try {
        const url = new URL(value)
        if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) {
            return false
        }

        const hostname = normalizeHostname(url.hostname)
        return (
            ALLOWED_EXACT_HOSTS.has(hostname) ||
            hostname === "googleusercontent.com" ||
            hostname.endsWith(".googleusercontent.com")
        )
    } catch {
        return false
    }
}

const blockedAddresses = new BlockList()
blockedAddresses.addSubnet("0.0.0.0", 8, "ipv4")
blockedAddresses.addSubnet("10.0.0.0", 8, "ipv4")
blockedAddresses.addSubnet("100.64.0.0", 10, "ipv4")
blockedAddresses.addSubnet("127.0.0.0", 8, "ipv4")
blockedAddresses.addSubnet("169.254.0.0", 16, "ipv4")
blockedAddresses.addSubnet("172.16.0.0", 12, "ipv4")
blockedAddresses.addSubnet("192.0.0.0", 24, "ipv4")
blockedAddresses.addSubnet("192.0.2.0", 24, "ipv4")
blockedAddresses.addSubnet("192.168.0.0", 16, "ipv4")
blockedAddresses.addSubnet("198.18.0.0", 15, "ipv4")
blockedAddresses.addSubnet("198.51.100.0", 24, "ipv4")
blockedAddresses.addSubnet("203.0.113.0", 24, "ipv4")
blockedAddresses.addSubnet("224.0.0.0", 4, "ipv4")
blockedAddresses.addSubnet("240.0.0.0", 4, "ipv4")
blockedAddresses.addSubnet("::", 128, "ipv6")
blockedAddresses.addSubnet("::1", 128, "ipv6")
blockedAddresses.addSubnet("100::", 64, "ipv6")
blockedAddresses.addSubnet("2001:db8::", 32, "ipv6")
blockedAddresses.addSubnet("fc00::", 7, "ipv6")
blockedAddresses.addSubnet("fe80::", 10, "ipv6")
blockedAddresses.addSubnet("ff00::", 8, "ipv6")

export const isPublicIpAddress = (address: string): boolean => {
    const normalizedAddress = address.replace(/^\[|\]$/g, "").toLowerCase()
    const version = isIP(normalizedAddress)
    if (version === 4) return !blockedAddresses.check(normalizedAddress, "ipv4")
    if (version === 6) return !blockedAddresses.check(normalizedAddress, "ipv6")
    return false
}

export type HostResolver = (hostname: string) => Promise<ReadonlyArray<{ address: string }>>

const defaultResolver: HostResolver = async (hostname) => lookup(hostname, { all: true, verbatim: true })

export const assertSafeRemoteUrl = async (url: URL, resolveHost: HostResolver = defaultResolver): Promise<void> => {
    if (!isAllowedImageUrl(url.toString())) {
        throw new ImageProxyError(403, "허용되지 않은 이미지 주소입니다")
    }

    const addresses = await resolveHost(url.hostname)
    if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIpAddress(address))) {
        throw new ImageProxyError(403, "공개 네트워크의 이미지 주소만 사용할 수 있습니다")
    }
}

export class ImageProxyError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message)
        this.name = "ImageProxyError"
    }
}

export const readResponseWithLimit = async (response: Response): Promise<Buffer> => {
    const declaredSize = Number(response.headers.get("content-length"))
    if (Number.isFinite(declaredSize) && declaredSize > MAX_IMAGE_BYTES) {
        throw new ImageProxyError(413, "이미지 파일이 너무 큽니다")
    }
    if (!response.body) throw new ImageProxyError(502, "원본 이미지 응답이 비어 있습니다")

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let totalBytes = 0

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        totalBytes += value.byteLength
        if (totalBytes > MAX_IMAGE_BYTES) {
            await reader.cancel()
            throw new ImageProxyError(413, "이미지 파일이 너무 큽니다")
        }
        chunks.push(value)
    }

    return Buffer.concat(chunks, totalBytes)
}
