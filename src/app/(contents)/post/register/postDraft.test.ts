import { describe, expect, it } from "vitest"
import { IPost } from "@interface/IPost"
import { clearPostDraft, readPostDraft, toRecoverablePostDraft, writePostDraft } from "./postDraft"

const createStorage = (): Storage => {
    const values = new Map<string, string>()
    return {
        get length() {
            return values.size
        },
        clear: () => values.clear(),
        getItem: (key) => values.get(key) ?? null,
        key: (index) => Array.from(values.keys())[index] ?? null,
        removeItem: (key) => values.delete(key),
        setItem: (key, value) => values.set(key, value),
    }
}

describe("post draft persistence", () => {
    it("round-trips a recoverable text draft and clears it only when requested", () => {
        const storage = createStorage()
        const post: IPost = {
            id: 7,
            title: "draft title",
            content: "<p>draft body</p>",
            thumbnail: "/proxy/image/thumbnail",
            createdAt: new Date(),
            updatedAt: new Date(),
            likeCount: 0,
        }
        const draft = toRecoverablePostDraft(post)

        writePostDraft(storage, draft)
        expect(readPostDraft(storage, post.id)).toEqual(draft)

        clearPostDraft(storage, post.id)
        expect(readPostDraft(storage, post.id)).toBeNull()
    })

    it("keeps the previous server thumbnail when the current thumbnail is a File", () => {
        const post = {
            id: 1,
            title: "title",
            content: "body",
            thumbnail: new File(["image"], "draft.png", { type: "image/png" }),
            createdAt: new Date(),
            updatedAt: new Date(),
            likeCount: 0,
        }

        expect(toRecoverablePostDraft(post, "/proxy/image/original").thumbnail).toBe("/proxy/image/original")
    })

    it("ignores malformed stored data", () => {
        const storage = createStorage()
        storage.setItem("kbsl-blog:post-draft:v1:new", "not-json")
        expect(readPostDraft(storage, 0)).toBeNull()
    })
})
