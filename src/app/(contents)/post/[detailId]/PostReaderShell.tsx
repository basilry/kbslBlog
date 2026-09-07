"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { ReactElement, ReactNode, useState } from "react"
import { axiosInstance } from "@lib/api/axiosInstance"
import { useLoginStore } from "@lib/stores/store"
import type { LegacyEditorPost } from "@lib/content"
import styles from "@styles/pages/postDetail.module.scss"

const PostRegister = dynamic(() => import("@app/(contents)/post/register/PostRegister"), {
    ssr: false,
    loading: () => <p className={styles.adminStatus}>편집기를 불러오고 있습니다.</p>,
})

interface PostReaderShellProps {
    children: ReactNode
    legacyPost?: LegacyEditorPost
}

export default function PostReaderShell({ children, legacyPost }: PostReaderShellProps): ReactElement {
    const router = useRouter()
    const { loginState, loginUser } = useLoginStore()
    const [editing, setEditing] = useState(false)
    const [message, setMessage] = useState("")
    const [busy, setBusy] = useState(false)
    const canManage = Boolean(legacyPost && loginState && loginUser.loginId)

    if (editing && legacyPost) {
        return (
            <PostRegister
                originPostData={{
                    ...legacyPost,
                    createdAt: new Date(legacyPost.createdAt),
                    updatedAt: new Date(legacyPost.updatedAt),
                }}
                setEdit={(next) => {
                    setEditing(next)
                    router.refresh()
                }}
            />
        )
    }

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

    const deletePost = async (): Promise<void> => {
        if (!legacyPost || busy || !window.confirm("이 글을 삭제할까요?")) return
        setBusy(true)
        setMessage("")
        try {
            await axiosInstance.delete(`/posts/${legacyPost.id}`)
            router.push("/post")
            router.refresh()
        } catch {
            setMessage("글을 삭제하지 못했습니다.")
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
                    {canManage && (
                        <>
                            <button type="button" onClick={() => setEditing(true)} disabled={busy}>
                                수정
                            </button>
                            <button type="button" onClick={deletePost} disabled={busy}>
                                삭제
                            </button>
                        </>
                    )}
                    {message && <p role="status">{message}</p>}
                </div>
            )}
        </>
    )
}
