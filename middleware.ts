import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest): NextResponse {
    // 구글 드라이브 이미지 URL 패턴 확인
    const url = request.nextUrl.clone()

    // 이미지 요청 패턴 확인 (구글 드라이브 URL)
    if (url.pathname.includes("/api/image-proxy") && url.searchParams.has("url")) {
        const imageUrl = url.searchParams.get("url") || ""

        // 구글 드라이브 URL 최적화
        if (imageUrl.includes("drive.google.com") || imageUrl.includes("googleusercontent.com")) {
            // URL을 최적화된 형식으로 변환
            let optimizedUrl = imageUrl

            // 일반 구글 드라이브 공유 URL을 직접 다운로드 URL로 변환
            if (imageUrl.includes("drive.google.com/file/d/")) {
                const fileId = imageUrl.split("/file/d/")[1].split("/")[0]
                optimizedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
            }

            // 구글 문서 뷰어 URL을 직접 다운로드 URL로 변환
            if (imageUrl.includes("/view?usp=sharing")) {
                optimizedUrl = imageUrl.replace("/view?usp=sharing", "/uc?export=view")
            }

            // 최적화된 URL 설정
            url.searchParams.set("url", optimizedUrl)

            // 이미지 크기 제한 설정 (없는 경우 기본값 800px)
            if (!url.searchParams.has("width")) {
                url.searchParams.set("width", "800")
            }

            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

// 미들웨어가 적용될 경로 패턴 설정
export const config = {
    matcher: [
        "/api/image-proxy/:path*", // 이미지 프록시 API 경로
        "/((?!api|_next/static|_next/image|favicon.ico).*)", // 콘텐츠 페이지
    ],
}
