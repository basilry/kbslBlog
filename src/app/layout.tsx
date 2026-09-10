import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import Script from "next/script"

import DeferredAnalytics from "@components/ui/DeferredAnalytics"
import Providers from "./Providers"
import "@styles/global.scss"
import "@styles/font.scss"

import "@styles/nprogress.scss"

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
    const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-GZDS0N484J"
    const measurementId = JSON.stringify(gaId).replace(/</g, "\\u003c")
    return <html lang="ko">
        <body id="darkMode">
            <Script id="blog-ga-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', ${measurementId}, { send_page_view: false });
                window.gtag('event', 'page_view', {
                    page_location: window.location.href,
                    page_referrer: document.referrer,
                    page_title: document.title
                });
            ` }} />
            <a className="skipLink" href="#main-content">본문으로 바로가기</a>
            <Providers>{children}</Providers>
            <DeferredAnalytics gaId={gaId} />
        </body>
    </html>
}
