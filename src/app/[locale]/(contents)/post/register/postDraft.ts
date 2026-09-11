import { IPost } from "@interface/IPost"

const DRAFT_PREFIX = "kbsl-blog:post-draft:v1"

export type RecoverablePostDraft = {
    version: 1
    postId: number
    title: string
    content: string
    thumbnail: string
    savedAt: string
}

export const getPostDraftKey = (postId: number): string => `${DRAFT_PREFIX}:${postId === 0 ? "new" : postId}`

export const toRecoverablePostDraft = (post: IPost, previousThumbnail = ""): RecoverablePostDraft => ({
    version: 1,
    postId: post.id,
    title: post.title,
    content: post.content,
    thumbnail: typeof post.thumbnail === "string" ? post.thumbnail : previousThumbnail,
    savedAt: new Date().toISOString(),
})

export const readPostDraft = (storage: Storage, postId: number): RecoverablePostDraft | null => {
    try {
        const value = storage.getItem(getPostDraftKey(postId))
        if (!value) return null

        const draft = JSON.parse(value) as Partial<RecoverablePostDraft>
        if (
            draft.version !== 1 ||
            draft.postId !== postId ||
            typeof draft.title !== "string" ||
            typeof draft.content !== "string" ||
            typeof draft.thumbnail !== "string" ||
            typeof draft.savedAt !== "string"
        ) {
            return null
        }

        return draft as RecoverablePostDraft
    } catch {
        return null
    }
}

export const writePostDraft = (storage: Storage, draft: RecoverablePostDraft): void => {
    storage.setItem(getPostDraftKey(draft.postId), JSON.stringify(draft))
}

export const clearPostDraft = (storage: Storage, postId: number): void => {
    storage.removeItem(getPostDraftKey(postId))
}
