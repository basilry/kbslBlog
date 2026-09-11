"use client"

import { useRouter } from "next/navigation"
import { ReactElement, ReactNode, useState } from "react"
import { axiosInstance } from "@lib/api/axiosInstance"
import type { LegacyEditorPost } from "@lib/content"
import styles from "@styles/pages/postDetail.module.scss"

interface PostReaderShellProps {
    children: ReactNode
    legacyPost?: LegacyEditorPost
}

export default function PostReaderShell({ children, legacyPost }: PostReaderShellProps): ReactElement {
    const router = useRouter()
    const [message, setMessage] = useState("")
    const [busy, setBusy] = useState(false)
    const updateLike = async (): Promise<void> => {
        if (!legacyPost || busy) return
        setBusy(true)
        setMessage("")
        try {
            await axiosInstance.post(`/posts/${legacyPost.id}/like`)
            setMessage("좋아요를 반영했습니다.")
            router.refresh()
        } catch {
            setMessage("좋아요를 반영하지 못했습니다.")
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            {children}
            {legacyPost && (
                <div className={styles.readerActions}>
                    <button type="button" onClick={updateLike} disabled={busy}>
                        좋아요 {legacyPost.likeCount}
                    </button>
                    {message && <p role="status">{message}</p>}
                </div>
            )}
        </>
    )
}
