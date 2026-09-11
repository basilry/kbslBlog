"use client"
import { useLocale } from "@lib/i18n/context"
import Link from "@components/ui/LocaleLink"
export default function NotFound() {
    const en = useLocale() === "en"
    return <section style={{ maxWidth: 900, margin: "0 auto", padding: "100px 28px" }}>
        <h1>{en ? "Page not found" : "페이지를 찾을 수 없습니다."}</h1>
        <p style={{ margin: "20px 0" }}>{en ? "This page has moved or is not published yet." : "주소가 바뀌었거나 아직 공개되지 않은 페이지입니다."}</p>
        <Link href="/post">{en ? "Back to posts →" : "글 목록으로 돌아가기 →"}</Link>
    </section>
}
