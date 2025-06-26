"use client"

import React, { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import classNames from "classnames"
import Container from "@components/layout/Container"
import "@styles/global.scss"
import "@styles/font.scss"
import "@styles/toast.scss"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "@styles/nprogress.scss"
import SuspenseWrapper from "@components/layout/SuspenseWrapper"
import { useCoreStore } from "@lib/stores/store"

const inter = Inter({ subsets: ["latin"] })
const pretendardFont = localFont({
    src: "../../public/font/PretendardVariable.woff2",
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
    const { darkMode } = useCoreStore()

    const [mode, setMode] = useState<"lightMode" | "darkMode">("darkMode")
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
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <title>{"basilry.kim"}</title>
                <link rel="icon" href="/myFace.png" />
            </head>
            <body id={mode}>
                <SuspenseWrapper>
                    <Container>
                        <ProgressBar color="#b024d6" options={{ showSpinner: true }} />
                        {children}
                        <ToastContainer
                            position="bottom-right"
                            autoClose={1800}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                        <div id="modal-root"></div>
                    </Container>

                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
                </SuspenseWrapper>
            </body>
        </html>
    )
}
