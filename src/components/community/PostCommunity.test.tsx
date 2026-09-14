// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { CommunityComment, CommunityState } from "@lib/community/types"
import type { Locale } from "@lib/i18n/config"
import PostCommunityProvider from "./PostCommunityProvider"
import PostComments from "./PostComments"
import PostLikes from "./PostLikes"

vi.mock("@components/ui/Giscus", () => ({ default: () => <div data-testid="legacy-comments">Previous GitHub discussion</div> }))
const reply: CommunityComment = { id: "22222222-2222-4222-8222-222222222222", parentId: "11111111-1111-4111-8111-111111111111", name: "Another reader", body: "A preserved reply", status: "visible", createdAt: "2026-09-14T00:00:00Z", updatedAt: "2026-09-14T00:00:00Z", mine: false, author: false, reported: false, reportCount: 0 }
const comment: CommunityComment = { id: "11111111-1111-4111-8111-111111111111", parentId: null, name: "Reader", body: "An existing comment", status: "visible", createdAt: "2026-09-14T00:00:00Z", updatedAt: "2026-09-14T00:00:00Z", mine: true, author: false, reported: false, reportCount: 0, replies: [reply] }
const initial: CommunityState = { likes: 12, liked: false, commentCount: 0, comments: [], hasMore: false, user: null }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
function setup(postId: string, locale: Locale = "en") {
    return render(<PostCommunityProvider postId={postId} locale={locale} options={{ enabled: true, providers: ["google", "kakao"] }}><PostLikes /><PostComments /></PostCommunityProvider>)
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear() })

describe("post community interaction", () => {
    it("supports keyboard likes, optimistic feedback, and rollback after a failed request", async () => {
        let complete: (response: Response) => void = () => {}
        const fetchMock = vi.fn().mockResolvedValueOnce(json(initial))
            .mockImplementationOnce(() => new Promise<Response>(resolve => { complete = resolve }))
            .mockResolvedValueOnce(json({ error: "unavailable" }, 503))
        vi.stubGlobal("fetch", fetchMock)
        setup("like-test")
        const user = userEvent.setup()
        const button = screen.getByRole("button", { name: "Like" })
        await waitFor(() => expect(button.hasAttribute("disabled")).toBe(false))
        button.focus()
        await user.keyboard("{Enter}")
        expect(button.getAttribute("aria-pressed")).toBe("true")
        expect(within(button).getByText("13")).toBeTruthy()
        complete(json({ ...initial, likes: 13, liked: true }))
        await screen.findByText("Like saved.")
        await user.click(button)
        await screen.findByText("Couldn't load comments and likes. Please try again shortly.")
        expect(button.getAttribute("aria-pressed")).toBe("true")
        expect(within(button).getByText("13")).toBeTruthy()
        expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ action: "like", liked: true })
        expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({ action: "like", liked: false })
    })
    it("restores a draft after authentication and renders submitted text without interpreting HTML", async () => {
        const postId = "draft-login-test", text = '<script>alert("hello")</script>'
        let loggedIn = false
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            if (!init?.body) return json({ ...initial, user: loggedIn ? { name: "", moderator: false } : null })
            const payload = JSON.parse(String(init.body))
            return json({ ...initial, user: { name: "Reader", moderator: false }, commentCount: 1, comments: [{ ...comment, id: payload.id, body: payload.body, replies: [] }] })
        })
        vi.stubGlobal("fetch", fetchMock)
        const first = setup(postId)
        const user = userEvent.setup()
        await screen.findByText("Be the first to leave a comment.")
        await user.type(screen.getByRole("textbox", { name: "Public nickname" }), "Reader")
        await user.type(screen.getByRole("textbox", { name: "Your comment" }), text)
        expect(sessionStorage.getItem(`basilry:comment-draft:v1:${postId}`)).toContain("script")
        first.unmount(); loggedIn = true
        const second = setup(postId)
        await screen.findByRole("button", { name: "Post comment" })
        expect((screen.getByRole("textbox", { name: "Your comment" }) as HTMLTextAreaElement).value).toBe(text)
        await user.click(screen.getByRole("button", { name: "Post comment" }))
        await screen.findByText(text)
        expect(second.container.querySelector("script")).toBeNull()
        expect((screen.getByRole("textbox", { name: "Your comment" }) as HTMLTextAreaElement).value).toBe("")
    })
    it("keeps a failed comment and reuses its id when the reader retries", async () => {
        const payloads: Record<string, unknown>[] = []
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            if (!init?.body) return json({ ...initial, user: { name: "Reader", moderator: false } })
            const payload = JSON.parse(String(init.body)); payloads.push(payload)
            if (payloads.length === 1) throw new TypeError("network lost")
            return json({ ...initial, user: { name: "Reader", moderator: false }, commentCount: 1, comments: [{ ...comment, id: payload.id, body: payload.body, replies: [] }] })
        })
        vi.stubGlobal("fetch", fetchMock)
        setup("retry-test")
        const user = userEvent.setup()
        await screen.findByRole("button", { name: "Post comment" })
        await user.type(screen.getByRole("textbox", { name: "Your comment" }), "Please keep my draft")
        await user.click(screen.getByRole("button", { name: "Post comment" }))
        await screen.findByText("Couldn't load comments and likes. Please try again shortly.")
        expect((screen.getByRole("textbox", { name: "Your comment" }) as HTMLTextAreaElement).value).toBe("Please keep my draft")
        await user.click(screen.getByRole("button", { name: "Post comment" }))
        await screen.findByText("Comment saved.")
        expect(payloads).toHaveLength(2)
        expect(payloads[0].id).toBe(payloads[1].id)
    })
    it("confirms deletion while retaining replies and loads GitHub comments on request", async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(json({ ...initial, user: { name: "Reader", moderator: false }, comments: [comment], commentCount: 2 }))
            .mockResolvedValueOnce(json({ ...initial, user: { name: "Reader", moderator: false }, comments: [{ ...comment, status: "deleted", body: "", name: "" }], commentCount: 1 }))
        vi.stubGlobal("fetch", fetchMock)
        setup("delete-test")
        const user = userEvent.setup()
        await screen.findByText("An existing comment")
        expect(screen.queryByTestId("legacy-comments")).toBeNull()
        await user.click(screen.getByText("View previous GitHub comments"))
        await screen.findByTestId("legacy-comments")
        await user.click(screen.getByRole("button", { name: "Delete" }))
        expect(fetchMock).toHaveBeenCalledTimes(1)
        await user.click(screen.getByRole("button", { name: "Delete comment" }))
        await screen.findByText("This comment was deleted by its author.")
        expect(screen.getByText("A preserved reply")).toBeTruthy()
        expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ action: "delete", id: comment.id })
    })
    it("shows localized sign-in controls and does not offer editing for another reader's comment", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ ...initial, comments: [{ ...comment, mine: false }], commentCount: 2 })))
        setup("ko-test", "ko")
        await screen.findByText("An existing comment")
        expect(screen.getByRole("button", { name: "Google로 계속하기" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "카카오로 계속하기" })).toBeTruthy()
        expect(screen.queryByRole("button", { name: "수정" })).toBeNull()
        expect(screen.queryByRole("button", { name: "삭제" })).toBeNull()
        const user = userEvent.setup()
        await user.click(screen.getByRole("button", { name: "답글" }))
        expect(screen.getByText("Reader님에게 답글 작성 중")).toBeTruthy()
        expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "댓글 내용" }))
    })
    it("keeps the legacy discussion reachable during a community service outage", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ error: "unavailable" }, 503)))
        setup("offline-test")
        await screen.findByRole("alert")
        expect(screen.getByRole("button", { name: "Like" }).hasAttribute("disabled")).toBe(true)
        const user = userEvent.setup()
        await user.click(screen.getByText("View previous GitHub comments"))
        await screen.findByTestId("legacy-comments")
    })
})
