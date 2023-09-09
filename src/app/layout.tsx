import React from "react"
import Layout from "@components/layout/Layout"
import "@styles/global.scss"
import "@styles/font.scss"

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <title>Basilri Kim의 개인 블로그</title>
                <link rel="icon" href="/favicon.svg" />
            </head>
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    )
}
