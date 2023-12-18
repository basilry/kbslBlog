"use client"

import React, { useEffect, useState } from "react"
import Container from "@components/layout/Container"
import "@styles/global.scss"
import "@styles/font.scss"
import { useCoreStore } from "@lib/stores/store"

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    const { darkMode } = useCoreStore()

    const [mode, setMode] = useState<"lightMode" | "darkMode">("lightMode")

    useEffect(() => {
        if (darkMode) {
            setMode("darkMode")
        } else {
            setMode("lightMode")
        }
    }, [darkMode])

    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <title>Basilri Kim의 개인 블로그</title>
                <link rel="icon" href="/myFace.png" />
            </head>
            <body id={mode}>
                <Container>{children}</Container>
            </body>
        </html>
    )
}
