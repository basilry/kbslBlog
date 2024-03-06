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
import "swiper/css/navigation"
import { useCoreStore } from "@lib/stores/store"
// import Script from "next/script"

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
                <meta name="author" content="Kim Basilri(Zannavi)" />
                <meta name="application-name" content="KBSL's BLog" />
                <title>{"KBSL's Blog"}</title>
                <link rel="icon" href="/kbslBlog/myFace.png" />
                {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-GZDS0N484J" />
                <script>
                    {` window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-GZDS0N484J');`}
                </script> */}
            </head>
            <body id={mode}>
                <Container>{children}</Container>
            </body>
        </html>
    )
}
