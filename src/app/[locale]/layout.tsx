import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import Script from "next/script"
import { notFound } from "next/navigation"
import { isLocale, LOCALES } from "@lib/i18n/config"
import { LocaleProvider } from "@lib/i18n/context"
import { messages } from "@lib/i18n/messages"

import DeferredAnalytics from "@components/ui/DeferredAnalytics"
import Providers from "./Providers"
import "@styles/global.scss"
import "@styles/font.scss"

import "@styles/nprogress.scss"

const baseMetadata: Metadata = {
    metadataBase: new URL("https://www.basilry.kim"),
    title: { default: "김바실리 — 개발 기록과 프로젝트", template: "%s | basilry.kim" },
    description: "웹 개발부터 AI까지, 직접 만들고 운영하며 배운 내용을 기록합니다.",
    authors: [{ name: "김바실리" }],
    icons: { icon: "/myFace.png" },
    openGraph: { type: "website", locale: "ko_KR", siteName: "basilry.kim", images: [{ url: "/myFace.png", alt: "김바실리" }] },
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
}
export const viewport: Viewport = { width: "device-width", initialScale: 1 }
export const dynamicParams = false
export function generateStaticParams() { return LOCALES.map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    if (!isLocale(locale)) notFound()
    const m = messages(locale)
    return { ...baseMetadata, title: { default: locale === "en" ? "Basilri Kim — Software, writing and projects" : "김바실리 — 개발 기록과 프로젝트", template: "%s | basilry.kim" },
        description: m.writingDescription, authors: [{ name: m.author }],
        openGraph: { ...baseMetadata.openGraph, locale: locale === "en" ? "en_US" : "ko_KR" },
        alternates: { types: { "application/rss+xml": `/${locale}/feed.xml` } },
    }
}
export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = await params
    if (!isLocale(locale)) notFound()
    const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-GZDS0N484J"
    const measurementId = JSON.stringify(gaId).replace(/</g, "\\u003c")
    return <html lang={locale}>
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
            <a className="skipLink" href="#main-content">{messages(locale).skip}</a>
            <LocaleProvider locale={locale}><Providers>{children}</Providers></LocaleProvider>
            <DeferredAnalytics gaId={gaId} />
        </body>
    </html>
}
