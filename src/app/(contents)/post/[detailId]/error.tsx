"use client"

import Link from "next/link"
import type { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import styles from "@styles/pages/postDetail.module.scss"

export default function PostError({ reset }: { error: Error; reset: () => void }): ReactElement {
    return (
        <Wrapper>
            <div className={styles.errorState}>
                <h1>글을 불러오지 못했습니다</h1>
                <p>기존 글 저장소가 잠시 응답하지 않습니다.</p>
                <div>
                    <button type="button" onClick={reset}>
                        다시 시도
                    </button>
                    <Link href="/post">글 목록</Link>
                </div>
            </div>
        </Wrapper>
    )
}
