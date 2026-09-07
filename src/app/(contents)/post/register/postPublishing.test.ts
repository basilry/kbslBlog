import { describe, expect, it, vi } from "vitest"
import { PostImageUploadError, collectUploadableImageSources, preparePostContent } from "./postPublishing"

describe("preparePostContent", () => {
    it("stops publishing when an upload result is incomplete and never creates placeholders", async () => {
        const content = '<p>draft</p><img src="data:image/png;base64,AAAA"><img src="https://images.example/a.png">'

        await expect(
            preparePostContent(
                content,
                {
                    uploadBase64Images: async () => [],
                    uploadExternalImages: async () => ["/proxy/image/external"],
                },
                new Map(),
            ),
        ).rejects.toBeInstanceOf(PostImageUploadError)

        expect(content).not.toContain("PLACEHOLDER")
    })

    it("reuses a completed upload when a later phase fails and the author retries", async () => {
        const content = '<img src="data:image/png;base64,AAAA"><img src="https://images.example/a.png">'
        const cache = new Map<string, string>()
        const uploadBase64Images = vi.fn(async () => ["/proxy/image/base64"])
        const uploadExternalImages = vi
            .fn<(_: string[]) => Promise<string[]>>()
            .mockRejectedValueOnce(new Error("temporary failure"))
            .mockResolvedValueOnce(["/proxy/image/external"])

        await expect(preparePostContent(content, { uploadBase64Images, uploadExternalImages }, cache)).rejects.toThrow(
            "외부 이미지 업로드에 실패했습니다",
        )

        const prepared = await preparePostContent(content, { uploadBase64Images, uploadExternalImages }, cache)

        expect(uploadBase64Images).toHaveBeenCalledTimes(1)
        expect(uploadExternalImages).toHaveBeenCalledTimes(2)
        expect(prepared).toBe('<img src="/proxy/image/base64"><img src="/proxy/image/external">')
    })

    it("preserves existing backend proxy and Google assets", () => {
        const content = [
            '<img src="/proxy/image/already-owned">',
            '<img src="https://api.example.com/proxy/url?imageUrl=x">',
            '<img src="https://drive.google.com/file/d/abc_123/view">',
            '<img src="https://images.example/new.png">',
        ].join("")

        expect(collectUploadableImageSources(content, "https://api.example.com")).toEqual({
            base64Images: [],
            externalImages: ["https://images.example/new.png"],
        })
    })

    it("rejects unresolved blob images before calling an uploader", async () => {
        const uploadBase64Images = vi.fn()

        await expect(
            preparePostContent(
                '<img src="blob:https://blog.example/temporary">',
                { uploadBase64Images, uploadExternalImages: vi.fn() },
                new Map(),
            ),
        ).rejects.toThrow("임시 이미지")

        expect(uploadBase64Images).not.toHaveBeenCalled()
    })

    it("rejects protocol-relative remote images instead of treating them as owned paths", () => {
        expect(() => collectUploadableImageSources('<img src="//tracker.example/pixel.png">')).toThrow(
            "프로토콜이 생략된 외부 이미지 주소",
        )
    })
})
