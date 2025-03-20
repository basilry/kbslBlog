import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // URL 파라미터에서 이미지 URL 추출
        const { searchParams } = new URL(request.url)
        const imageUrl = searchParams.get("url")
        const width = parseInt(searchParams.get("width") || "800", 10)

        // width가 너무 크면 제한
        const maxWidth = Math.min(width, 1200)

        if (!imageUrl) {
            return NextResponse.json({ error: "URL 파라미터가 필요합니다" }, { status: 400 })
        }

        // 원본 이미지 가져오기
        const response = await fetch(imageUrl, {
            headers: {
                // 리퍼러 헤더 설정으로 구글 드라이브에서 차단 방지
                Referer: "https://drive.google.com/",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        })

        if (!response.ok) {
            return NextResponse.json({ error: "원본 이미지를 가져오는데 실패했습니다" }, { status: response.status })
        }

        // 이미지 데이터 및 헤더 추출
        const imageBuffer = Buffer.from(await response.arrayBuffer())
        const contentType = response.headers.get("content-type") || "image/jpeg"

        try {
            // 이미지 최적화 및 크기 조정
            const optimizedImageBuffer = await sharp(imageBuffer)
                .resize({ width: maxWidth, withoutEnlargement: true }) // 원본보다 크게 확대하지 않음
                .toBuffer()

            // 응답 생성 (캐싱 없음)
            return new NextResponse(optimizedImageBuffer, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    // 캐싱 방지
                    "Cache-Control": "no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            })
        } catch (sharpError) {
            console.error("이미지 처리 오류:", sharpError)
            // 원본 이미지 반환
            return new NextResponse(imageBuffer, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "no-store",
                },
            })
        }
    } catch (error) {
        console.error("이미지 프록시 에러:", error)
        return NextResponse.json({ error: "이미지 프록시 처리 중 오류가 발생했습니다" }, { status: 500 })
    }
}
