import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import localFont from "next/font/local"
import { GoogleAnalytics } from "@next/third-parties/google"
import Providers from "./Providers"
import "@styles/global.scss"
import "@styles/font.scss"
import "@styles/toast.scss"
import "@styles/nprogress.scss"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const pretendard = localFont({ src: "../../public/font/PretendardVariable.woff2", display: "swap" })
export const metadata: Metadata = {
    metadataBase: new URL("https://www.basilry.kim"),
    title: { default: "김바실리 — 개발 기록과 프로젝트", template: "%s | basilry.kim" },
    description: "웹 개발부터 AI까지, 직접 만들고 운영하며 배운 내용을 기록합니다.",
    authors: [{ name: "김바실리" }],
    icons: { icon: "/myFace.png" },
    openGraph: { type: "website", locale: "ko_KR", siteName: "basilry.kim", images: [{ url: "/myFace.png", alt: "김바실리" }] },
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
}
export const viewport: Viewport = { width: "device-width", initialScale: 1 }
export default function RootLayout({ children }: { children: ReactNode }) {
    return <html lang="ko" className={pretendard.className}>
        <body id="darkMode">
            <a className="skipLink" href="#main-content">본문으로 바로가기</a>
            <Providers>{children}</Providers>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-GZDS0N484J"} />
        </body>
    </html>
}
