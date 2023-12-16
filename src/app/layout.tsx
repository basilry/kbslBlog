import React from "react"
import Container from "@components/layout/Container"
import "@styles/global.scss"
import "@styles/font.scss"

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <title>Basilri Kim의 개인 블로그</title>
                <link rel="icon" href="/myFace.png" />
            </head>
            <body>
                <Container>{children}</Container>
            </body>
        </html>
    )
}
