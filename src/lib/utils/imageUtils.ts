/**
 * 구글 드라이브 이미지 관련 유틸리티 함수
 */

/**
 * 구글 드라이브 URL인지 확인하는 함수
 * @param url 확인할 URL
 * @returns boolean 구글 드라이브 URL 여부
 */
export function isGoogleDriveImage(url: string): boolean {
    if (!url) return false
    return url.includes("drive.google.com") || url.includes("googleusercontent.com")
}

/**
 * 구글 드라이브 이미지 URL을 최적화하는 함수
 * - 백엔드 프록시 서버를 통해 이미지 제공
 * @param url 원본 URL
 * @returns string 최적화된 URL
 */
export function optimizeGoogleDriveImageUrl(url: string): string {
    if (!url) {
        console.log("URL이 비어있습니다.")
        return ""
    }

    console.log("최적화 시작 URL:", url)

    try {
        // URL 중복 방지: 이미 전체 URL 형식인 경우
        if (url.startsWith("http") && (url.includes("/proxy/image/") || url.includes("/proxy/url"))) {
            console.log("이미 전체 URL 포함된 프록시 URL:", url)
            return url
        }

        // 이미 프록시 처리된 URL인 경우 (상대 경로)
        if (url.includes("/proxy/image/") || url.includes("/proxy/url")) {
            console.log("프록시 상대 경로 URL:", url)
            // 환경 변수와 함께 전체 URL 구성
            return `${process.env.NEXT_PUBLIC_IP}${url}`
        }

        // 파일 ID 추출
        const fileId = getFileIdFromUrl(url)

        if (fileId) {
            // 백엔드 프록시 URL 생성
            const proxyUrl = `${process.env.NEXT_PUBLIC_IP}/proxy/image/${fileId}`
            console.log("프록시 URL로 변환:", proxyUrl)
            return proxyUrl
        } else if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
            // ID를 추출할 수 없지만 구글 드라이브 URL인 경우, URL 인코딩하여 전달
            const encodedUrl = encodeURIComponent(url)
            const proxyUrl = `${process.env.NEXT_PUBLIC_IP}/proxy/url?imageUrl=${encodedUrl}`
            console.log("URL 기반 프록시 변환:", proxyUrl)
            return proxyUrl
        }

        // 구글 드라이브 이미지가 아니면 원본 URL 반환
        return url
    } catch (error) {
        console.error("이미지 URL 최적화 실패:", error)
        return url // 오류 시 원본 URL 반환
    }
}

/**
 * URL에서 구글 드라이브 파일 ID를 추출하는 함수
 * @param url 구글 드라이브 URL
 * @returns string | null 파일 ID 또는 null
 */
function getFileIdFromUrl(url: string): string | null {
    // 이미 최적화된 URL에서 ID 추출
    if (url.includes("export=view&id=")) {
        const match = url.match(/id=([^&]+)/)
        if (match && match[1]) return match[1]
    }

    // id= 파라미터에서 추출
    if (url.includes("id=")) {
        const match = url.match(/id=([^&]+)/)
        if (match && match[1]) return match[1]
    }

    // /file/d/ 경로에서 추출
    if (url.includes("/file/d/")) {
        const match = url.match(/\/file\/d\/([^/]+)/)
        if (match && match[1]) return match[1]
    }

    return null
}
