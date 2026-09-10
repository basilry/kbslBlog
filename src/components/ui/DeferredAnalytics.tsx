import Script from "next/script"

/** The root layout initializes the event queue before this external script loads. */
export default function DeferredAnalytics({ gaId }: { gaId: string }) {
    return <Script id="blog-ga" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
}
