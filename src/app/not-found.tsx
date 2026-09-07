import Link from "next/link"
export default function NotFound() {
    return <section style={{ maxWidth: 900, margin: "0 auto", padding: "100px 28px" }}>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p style={{ margin: "20px 0" }}>주소가 바뀌었거나 아직 공개되지 않은 페이지입니다.</p>
        <Link href="/post">글 목록으로 돌아가기 →</Link>
    </section>
}
