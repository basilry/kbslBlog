"use client"

import { ReactElement } from "react"
import LineBasic from "@components/atom/LineBasic"
import TextBasic from "@components/atom/TextBasic"
import Wrapper from "@components/layout/Wrapper"
import Tiptap from "@components/template/tiptap/Tiptap"
import styles from "@styles/components/template/tiptap/tiptap.module.scss"

const PostNew = (): ReactElement => {
    return (
        <Wrapper>
            <TextBasic className={styles.title} size="xxx-large" bold="bold">
                {"New Post | 새 글 쓰기"}
            </TextBasic>
            <br />
            <LineBasic />
            <br />
            <Tiptap />
        </Wrapper>
    )
}

export default PostNew
