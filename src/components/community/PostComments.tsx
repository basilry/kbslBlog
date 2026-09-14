"use client"

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react"
import Image from "next/image"
import Giscus from "@components/ui/Giscus"
import type { CommunityAction, CommunityComment, SocialProvider } from "@lib/community/types"
import { communityErrorMessage, communityMessages } from "@lib/community/messages"
import { useCommentDraft } from "@lib/community/draft"
import { useCommunity } from "./PostCommunityProvider"
import styles from "@styles/components/postCommunity.module.scss"

const noSubscription = () => () => {}
function CommentItem({ comment, onReply }: { comment: CommunityComment; onReply: (comment: CommunityComment) => void }) {
    const { state, locale, busy, mutate } = useCommunity()
    const m = communityMessages(locale)
    const [mode, setMode] = useState<"edit" | "delete" | "report" | null>(null)
    const [body, setBody] = useState(comment.body)
    const [reason, setReason] = useState("spam")
    const [feedback, setFeedback] = useState("")
    const [failed, setFailed] = useState(false)
    const submit = async (action: CommunityAction, payload: Record<string, unknown> = {}) => {
        setFeedback(""); setFailed(false)
        try {
            await mutate(action, { id: comment.id, ...payload })
            setMode(null)
            setFeedback(action === "report" ? m.reportSaved : action === "delete" ? m.removed : m.changed)
        } catch (error) { setFeedback(communityErrorMessage(error, locale)); setFailed(true) }
    }
    const date = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(comment.createdAt))
    return <li className={styles.comment} id={`comment-${comment.id}`}>
        <div className={styles.commentHeader}>
            <span className={styles.avatar} aria-hidden="true">{comment.name.slice(0, 1) || "·"}</span>
            <strong>{comment.name || (locale === "ko" ? "삭제된 댓글" : "Deleted comment")}</strong>
            {comment.author && comment.status !== "deleted" && <span className={styles.badge}>{m.author}</span>}
            <time dateTime={comment.createdAt}>{date}</time>
            {comment.updatedAt !== comment.createdAt && comment.status === "visible" && <span>{m.edited}</span>}
        </div>
        {comment.status !== "visible" && <p className={styles.tombstone}>{comment.status === "deleted" ? m.deleted : m.hidden}</p>}
        {mode === "edit" ? <form className={styles.inlineForm} onSubmit={event => { event.preventDefault(); void submit("edit", { body, updatedAt: comment.updatedAt }) }}>
            <label htmlFor={`edit-${comment.id}`}>{m.body}</label>
            <textarea id={`edit-${comment.id}`} value={body} onChange={event => setBody(event.target.value)} maxLength={2000} rows={4} required autoFocus />
            <div className={styles.actions}><button className={styles.primary} disabled={busy || !body.trim()}>{busy ? m.saving : m.save}</button><button type="button" disabled={busy} onClick={() => setMode(null)}>{m.cancel}</button></div>
        </form> : comment.body && <p className={styles.commentBody}>{comment.body}</p>}
        <div className={styles.commentActions}>
            {!comment.parentId && comment.status === "visible" && (comment.replies?.length ?? 0) < 50 && <button type="button" disabled={busy} onClick={() => onReply(comment)}>{m.reply}</button>}
            {comment.mine && comment.status === "visible" && <button type="button" disabled={busy} onClick={() => { setBody(comment.body); setMode("edit"); setFeedback("") }}>{m.edit}</button>}
            {comment.mine && comment.status !== "deleted" && <button type="button" disabled={busy} onClick={() => { setMode("delete"); setFeedback("") }}>{m.remove}</button>}
            {state?.user && !comment.mine && comment.status === "visible" && <button type="button" disabled={busy || comment.reported} onClick={() => { setMode("report"); setFeedback("") }}>{comment.reported ? m.reported : m.report}</button>}
            {state?.user?.moderator && comment.status !== "deleted" && <button type="button" disabled={busy} onClick={() => void submit(comment.status === "hidden" ? "restore" : "hide")}>{comment.status === "hidden" ? m.restore : m.hide}</button>}
            {state?.user?.moderator && comment.reportCount > 0 && <span className={styles.reportCount}>{m.reports} {comment.reportCount}</span>}
        </div>
        {mode === "delete" && <div className={styles.inlineForm}>
            <p>{m.deleteQuestion}</p>
            <div className={styles.actions}><button type="button" className={styles.danger} disabled={busy} onClick={() => void submit("delete")}>{m.deleteConfirm}</button><button type="button" disabled={busy} onClick={() => setMode(null)}>{m.cancel}</button></div>
        </div>}
        {mode === "report" && <form className={styles.inlineForm} onSubmit={event => { event.preventDefault(); void submit("report", { reason }) }}>
            <label htmlFor={`reason-${comment.id}`}>{m.reportLabel}</label>
            <select id={`reason-${comment.id}`} value={reason} onChange={event => setReason(event.target.value)}><option value="spam">{m.spam}</option><option value="abuse">{m.abuse}</option><option value="other">{m.other}</option></select>
            <div className={styles.actions}><button className={styles.primary} disabled={busy}>{m.reportSubmit}</button><button type="button" disabled={busy} onClick={() => setMode(null)}>{m.cancel}</button></div>
        </form>}
        {feedback && <p className={styles.feedback} role={failed ? "alert" : "status"}>{feedback}</p>}
        {Boolean(comment.replies?.length) && <ol className={styles.replies}>{comment.replies!.map(reply => <CommentItem key={reply.id} comment={reply} onReply={onReply} />)}</ol>}
    </li>
}

export default function PostComments() {
    const { postId, locale, options, state, loading, busy, error, reload, mutate, signIn, signOut } = useCommunity()
    const m = communityMessages(locale)
    const [draft, setDraft] = useCommentDraft(postId)
    const [feedback, setFeedback] = useState("")
    const [failed, setFailed] = useState(false)
    const [authBusy, setAuthBusy] = useState(false)
    const [legacyOpen, setLegacyOpen] = useState(false)
    const textarea = useRef<HTMLTextAreaElement>(null)
    const authFailed = useSyncExternalStore(noSubscription, () => new URLSearchParams(location.search).get("community-auth") === "failed", () => false)
    const name = draft.name ?? state?.user?.name ?? ""
    const reply = (comment: CommunityComment) => {
        setDraft({ ...draft, parent: { id: comment.id, name: comment.name }, id: null })
        textarea.current?.focus()
    }
    const login = async (provider: SocialProvider) => {
        setFeedback(""); setFailed(false); setAuthBusy(true)
        try {
            const saved = setDraft({ ...draft, name })
            if (!saved && draft.body) throw new Error("draft_unavailable")
            await signIn(provider)
        } catch (failure) { setFeedback(communityErrorMessage(failure, locale)); setFailed(true); setAuthBusy(false) }
    }
    const logout = async () => {
        setAuthBusy(true); setFeedback("")
        try { await signOut() } catch (failure) { setFeedback(communityErrorMessage(failure, locale)); setFailed(true) }
        finally { setAuthBusy(false) }
    }
    const submit = async (event: FormEvent) => {
        event.preventDefault()
        if (!state?.user || busy || !draft.body.trim() || !name.trim()) return
        setFeedback(""); setFailed(false)
        // Save the retry ID before sending. A lost response/reload cannot create duplicate comments.
        const pending = { ...draft, name, id: draft.id ?? crypto.randomUUID() }
        setDraft(pending)
        try {
            await mutate("create", { id: pending.id, name, body: draft.body, parentId: draft.parent?.id ?? null })
            setDraft({ body: "", name, parent: null, id: null })
            setFeedback(m.saved)
        } catch (failure) { setFeedback(communityErrorMessage(failure, locale)); setFailed(true) }
    }
    return <div className={styles.community} id="comments">
        <header className={styles.heading}><h2>{m.comments} {state && <span>{state.commentCount.toLocaleString(locale)}</span>}</h2><p>{m.intro}</p></header>
        {authFailed && !state?.user && <p className={styles.error} role="alert">{m.errors.auth_failed}</p>}
        {error && <div className={styles.error} role="alert"><p>{communityErrorMessage(error, locale)}</p><button type="button" disabled={loading} onClick={() => void reload()}>{loading ? m.loading : m.retry}</button></div>}
        <form className={styles.composer} onSubmit={submit}>
            {draft.parent && <div className={styles.replying}><span>{locale === "ko" ? `${draft.parent.name}${m.replying}` : `${m.replying} ${draft.parent.name}`}</span><button type="button" disabled={busy} onClick={() => setDraft({ ...draft, parent: null, id: null })}>{m.cancel}</button></div>}
            <div className={styles.nameRow}><label htmlFor="comment-name">{m.name}</label>{state?.user && <button type="button" className={styles.textButton} disabled={authBusy || busy} onClick={logout}>{m.logout}</button>}</div>
            <input id="comment-name" name="nickname" value={name} placeholder={m.namePlaceholder} onChange={event => setDraft({ ...draft, name: event.target.value, id: null })} maxLength={30} required autoComplete="nickname" disabled={busy || authBusy} />
            <label htmlFor="comment-body" className={styles.srOnly}>{m.body}</label>
            <textarea id="comment-body" ref={textarea} name="comment" value={draft.body} placeholder={m.placeholder} onChange={event => setDraft({ ...draft, body: event.target.value, id: null })} maxLength={2000} rows={5} required disabled={busy || authBusy} />
            <div className={styles.composerFooter}><p>{m.privacy}</p><span aria-live="off">{draft.body.length.toLocaleString(locale)} / 2,000</span></div>
            {loading && !state ? <p className={styles.loading} role="status">{m.loading}</p> : state?.user ? <button className={styles.primary} disabled={busy || authBusy || !draft.body.trim() || !name.trim() || Boolean(error)}>{busy ? m.saving : m.submit}</button> : <div className={styles.login}>
                <p>{m.loginHint}</p><div className={styles.loginButtons}>{options.providers.map(provider => <button key={provider} type="button" className={provider === "kakao" ? styles.kakao : styles.google} disabled={authBusy || busy || !state || Boolean(error)} onClick={() => void login(provider)}>
                    {provider === "google" ? <Image src="/community/google-g.png" alt="" width={20} height={20} unoptimized /> : <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.6 6.6l-1 3.6 4.2-2.4c.7.1 1.4.2 2.2.2 5.5 0 10-3.6 10-8S17.5 3 12 3Z" /></svg>}
                    {m[provider]}
                </button>)}</div>
            </div>}
            <p className={styles.feedback} role={failed ? "alert" : "status"}>{feedback}</p>
        </form>
        <div aria-busy={loading}>
            {state?.comments.length === 0 && !error && <p className={styles.empty}>{m.empty}</p>}
            {Boolean(state?.comments.length) && <ol className={styles.commentList}>{state!.comments.map(comment => <CommentItem key={comment.id} comment={comment} onReply={reply} />)}</ol>}
            {state?.hasMore && <button type="button" className={styles.loadMore} disabled={loading || busy} onClick={() => void reload(true)}>{loading ? m.loading : m.more}</button>}
        </div>
        <details className={styles.legacy} onToggle={event => setLegacyOpen(event.currentTarget.open)}><summary>{m.legacy}</summary><p>{m.legacyHint}</p>{legacyOpen && <Giscus emotion={false} />}</details>
    </div>
}
