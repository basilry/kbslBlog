import { describe, expect, it, vi } from "vitest"
import sharp from "sharp"
import { NextRequest } from "next/server"
import { GET } from "./route"
import { normalizeGoogleDriveImageUrl } from "@lib/utils/imageUtils"
import { fetchRemoteImage, optimizeImage } from "./imageProxyService"
import {
    ImageProxyError,
    MAX_IMAGE_BYTES,
    assertSafeRemoteUrl,
    isAllowedImageUrl,
    isPublicIpAddress,
    readResponseWithLimit,
} from "./imageProxyPolicy"

const publicResolver = async (): Promise<Array<{ address: string }>> => [{ address: "142.250.66.1" }]

describe("image proxy policy", () => {
    it("allows only the intended HTTPS Google image hosts", () => {
        expect(isAllowedImageUrl("https://drive.google.com/uc?id=abc")).toBe(true)
        expect(isAllowedImageUrl("https://lh3.googleusercontent.com/image")).toBe(true)
        expect(isAllowedImageUrl("https://drive.google.com.evil.example/image")).toBe(false)
        expect(isAllowedImageUrl("http://drive.google.com/image")).toBe(false)
        expect(isAllowedImageUrl("data:text/html,<script>alert(1)</script>")).toBe(false)
        expect(isAllowedImageUrl("https://user:pass@drive.google.com/image")).toBe(false)
        expect(isAllowedImageUrl("https://drive.google.com:8443/image")).toBe(false)
        expect(isAllowedImageUrl("http://2130706433/image")).toBe(false)
    })

    it("rejects private, loopback, link-local and mapped addresses", () => {
        for (const address of [
            "127.0.0.1",
            "10.0.0.1",
            "169.254.169.254",
            "192.168.1.1",
            "240.0.0.1",
            "::1",
            "0:0:0:0:0:0:0:1",
            "fd00::1",
            "fe80::1",
            "::ffff:127.0.0.1",
            "0:0:0:0:0:ffff:7f00:1",
        ]) {
            expect(isPublicIpAddress(address), address).toBe(false)
        }
        expect(isPublicIpAddress("142.250.66.1")).toBe(true)
        expect(isPublicIpAddress("2607:f8b0:400a:801::200e")).toBe(true)
    })

    it("rejects an allowed hostname when DNS resolves to a private address", async () => {
        await expect(
            assertSafeRemoteUrl(new URL("https://drive.google.com/image"), async () => [{ address: "127.0.0.1" }]),
        ).rejects.toMatchObject({ status: 403 })
    })

    it("revalidates redirect targets before a second fetch", async () => {
        const fetchImpl = vi.fn(
            async () => new Response(null, { status: 302, headers: { location: "https://evil.example/private" } }),
        )

        await expect(
            fetchRemoteImage(new URL("https://drive.google.com/uc?id=abc"), new AbortController().signal, {
                fetchImpl,
                resolveHost: publicResolver,
            }),
        ).rejects.toMatchObject({ status: 403 })
        expect(fetchImpl).toHaveBeenCalledTimes(1)
    })

    it("keeps a legitimate Google redirect chain working", async () => {
        const fetchImpl = vi
            .fn<typeof fetch>()
            .mockResolvedValueOnce(
                new Response(null, {
                    status: 302,
                    headers: { location: "https://lh3.googleusercontent.com/image" },
                }),
            )
            .mockResolvedValueOnce(new Response("image", { status: 200 }))

        const response = await fetchRemoteImage(
            new URL("https://drive.google.com/uc?id=abc"),
            new AbortController().signal,
            { fetchImpl, resolveHost: publicResolver },
        )

        expect(response.status).toBe(200)
        expect(fetchImpl).toHaveBeenCalledTimes(2)
    })

    it("normalizes a Drive share URL idempotently without middleware redirects", () => {
        const normalized = normalizeGoogleDriveImageUrl("https://drive.google.com/file/d/abc_123/view?usp=sharing")
        expect(normalized).toBe("https://drive.google.com/uc?export=view&id=abc_123")
        expect(normalizeGoogleDriveImageUrl(normalized)).toBe(normalized)
    })

    it("rejects declared oversized bodies before buffering", async () => {
        const response = new Response("small", {
            headers: { "content-length": String(MAX_IMAGE_BYTES + 1) },
        })
        await expect(readResponseWithLimit(response)).rejects.toMatchObject({ status: 413 })
    })

    it("rejects streamed oversized bodies when content-length is absent", async () => {
        const response = new Response(new Uint8Array(MAX_IMAGE_BYTES + 1))
        await expect(readResponseWithLimit(response)).rejects.toMatchObject({ status: 413 })
    })

    it("returns a non-executable error for the original data-URL active-content trigger", async () => {
        const payload = "data:text/html,<script>alert(1)</script>"
        const request = new NextRequest(`https://blog.example/api/image-proxy?url=${encodeURIComponent(payload)}`)
        const response = await GET(request)

        expect(response.status).toBe(403)
        expect(response.headers.get("content-type")).toContain("application/json")
        expect(response.headers.get("x-content-type-options")).toBe("nosniff")
        expect(await response.text()).not.toContain("<script>")
    })

    it("outputs a known safe image type and never falls back to raw HTML", async () => {
        const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } })
            .png()
            .toBuffer()
        const optimized = await optimizeImage(png, 800)
        expect((await sharp(optimized).metadata()).format).toBe("webp")

        await expect(optimizeImage(Buffer.from("<script>alert(1)</script>"), 800)).rejects.toEqual(
            expect.objectContaining<Partial<ImageProxyError>>({ status: 415 }),
        )
    })
})
