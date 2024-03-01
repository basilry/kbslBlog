"use client"

import React, { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import classNames from "classnames"
import Container from "@components/layout/Container"
import "@styles/global.scss"
import "@styles/font.scss"
import "@styles/nprogress.scss"
import "swiper/css"
import "swiper/css/pagination"
import { useCoreStore } from "@lib/stores/store"

const inter = Inter({ subsets: ["latin"] })
const pretendardFont = localFont({
    src: "../../public/font/PretendardVariable.woff2",
})

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
        <html lang="ko" className={classNames(pretendardFont.className, inter.className)}>
            <head>
                <meta charSet="utf-8" />
                <title>{"KBSL's Blog"}</title>
                <link rel="icon" href="/myFace.png" />
            </head>
            <body id={mode}>
                <Container>{children}</Container>
            </body>
        </html>
    )
}
