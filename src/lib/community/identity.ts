import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { isIP } from "node:net"

const signature = (id: string, secret: string) => createHmac("sha256", secret).update(`community-browser:v1:${id}`).digest("hex")
export const browserCookieName = () => process.env.NODE_ENV === "production" ? "__Host-basilry-community" : "basilry-community"
export const returnCookieName = () => process.env.NODE_ENV === "production" ? "__Host-basilry-community-return" : "basilry-community-return"
export function createBrowserIdentity(secret: string) {
    const id = randomUUID()
    return `${id}.${signature(id, secret)}`
}
export function readBrowserIdentity(value: string | undefined, secret: string): string | null {
    if (!value || !/^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(value)) return null
    const [id, supplied] = value.split(".")
    if (!timingSafeEqual(Buffer.from(supplied, "hex"), Buffer.from(signature(id, secret), "hex"))) return null
    return createHash("sha256").update(`community-like:${id}`).digest("hex")
}

// Only Vercel's overwritten header is trusted. Never consume caller-supplied forwarding headers on other hosts.
export function networkIdentity(request: Request, secret: string, date = new Date()): string | null {
    if (process.env.VERCEL !== "1") return null
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim()
    if (!ip || !isIP(ip)) throw new Error("Missing trusted network identity")
    return createHmac("sha256", secret).update(`community-network:${date.toISOString().slice(0, 10)}:${ip}`).digest("hex")
}
