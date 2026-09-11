"use client"

import Link from "@components/ui/LocaleLink"
import type { ReactElement } from "react"
import { useLoginHydrated } from "@lib/hooks/useLoginHydrated"
import { useLoginStore } from "@lib/stores/store"
import styles from "@styles/pages/postList.module.scss"

export default function PostListAdminAction(): ReactElement | null {
    const hydrated = useLoginHydrated()
    const { loginState, loginUser } = useLoginStore()
    if (!hydrated || !loginState || !loginUser.loginId) return null

    return (
        <Link href="/post/register" className={styles.writeLink}>
            새 글 쓰기
        </Link>
    )
}
