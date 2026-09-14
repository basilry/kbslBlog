"use client"

import { useState } from "react"
import { communityErrorMessage, communityMessages } from "@lib/community/messages"
import { useCommunity } from "./PostCommunityProvider"
import styles from "@styles/components/postCommunity.module.scss"

export default function PostLikes() {
    const { state, busy, loading, error, locale, mutate, reload } = useCommunity()
    const m = communityMessages(locale)
    const [feedback, setFeedback] = useState("")
    const like = async () => {
        if (!state || busy) return
        const desired = !state.liked
        setFeedback("")
        try { await mutate("like", { liked: desired }); setFeedback(desired ? m.likeSaved : m.likeRemoved) }
        catch (failure) { setFeedback(communityErrorMessage(failure, locale)) }
    }
    return <div className={styles.likes}>
        <p>{m.likeHint}</p>
        <button type="button" className={styles.likeButton} aria-pressed={state?.liked ?? false} aria-label={state?.liked ? m.liked : m.like}
            disabled={!state || busy || loading || Boolean(error)} onClick={like}>
            <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
            <span>{m.like}</span><strong>{state ? state.likes.toLocaleString(locale) : "—"}</strong>
        </button>
        {error && <button type="button" className={styles.textButton} onClick={() => void reload()} disabled={loading}>{m.retry}</button>}
        <span className={styles.feedback} role="status">{feedback}</span>
    </div>
}
