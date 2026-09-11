"use client"

import Link from "@components/ui/LocaleLink"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/postDetail.module.scss"
import { useLocale } from "@lib/i18n/context"

export default function PostError({ reset }: { error: Error; reset: () => void }): ReactElement {
    const en = useLocale() === "en"
    return (
        <Wrapper>
            <div className={styles.errorState}>
                <h1>{en ? "Unable to load this post" : "글을 불러오지 못했습니다"}</h1>
                <p>{en ? "The post archive is temporarily unavailable." : "기존 글 저장소가 잠시 응답하지 않습니다."}</p>
                <div>
                    <button type="button" onClick={reset}>
                        {en ? "Try again" : "다시 시도"}
                    </button>
                    <Link href="/post">{en ? "Post list" : "글 목록"}</Link>
                </div>
            </div>
        </Wrapper>
    )
}
