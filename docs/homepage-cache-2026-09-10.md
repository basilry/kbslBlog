# 홈페이지 캐시 정책

홈 `/`은 `revalidate = 300`으로 빌드 시 HTML을 만들고, 이후 5분이 지난 뒤 들어오는 요청을 계기로 갱신한다. 로컬 Markdown 글은 새 배포에 포함되므로 배포 시 홈의 최근 글에도 반영된다. 조회수와 사용자 상태는 기존 클라이언트 Provider가 별도로 처리한다.

홈에서 호출하는 `getRecentPublicPosts`만 `legacyRevalidate: 300`을 전달한다. 해당 레거시 목록 요청은 Next.js `fetch`의 `next.revalidate`를 사용한다. 기본 조회는 계속 `cache: "no-store"`이며 글 목록, 글 상세, 전체 목록을 사용하는 피드·사이트맵의 데이터 정책은 바꾸지 않았다.

레거시 API가 미설정이거나 실패하면 기존처럼 로컬 글을 보여준다. 이 결과도 홈에서 캐시되지만 영구 저장되지는 않는다. 다음 ISR 갱신에서 다시 조회하므로 서비스 복구를 반영할 수 있다. 정상 응답이 캐시에 남아 있으면 Next.js의 재검증 정책에 따라 기존 데이터를 제공할 수 있다. HTTP 200인 잘못된 JSON 응답도 fetch 단계에서 잠시 캐시될 수 있으며 다음 재검증 대상이다. 404와 서비스 장애를 구분하는 상세 조회 동작은 유지한다.

ISR은 정해진 시각에 실행하는 스케줄러가 아니다. 갱신 시점을 지난 첫 방문은 이전 HTML을 받을 수 있고, 재생성 중 방문도 이전 결과를 받을 수 있다. 따라서 정확히 5분 이내 반영을 보장하지 않는다. 서버가 페이지를 재생성해야 하므로 이 구성은 완전한 정적 파일 export가 아니며 Next.js 런타임이 필요하다.

## 검수

- 단위 테스트: 홈용 호출의 timed cache 옵션, 기본 recent·목록·전체 조회의 no-store 보존, 레거시 미설정과 실패 후 재조회, 상세 404/503 구분을 검사한다. 단위 테스트는 Next.js 자체의 ISR 캐시를 모의 구현하지 않는다.
- 통합 빌드: `/`이 정적 페이지이며 Revalidate가 5m인지 확인한다. 프로덕션 모드 응답에서 `s-maxage=300` 또는 배포 플랫폼의 이에 대응하는 캐시 동작을 확인한다.
- 홈의 최신 로컬 글과 레거시 fallback, 클라이언트 조회수 표시는 최종 화면 검수에 포함한다.

## 근거

2026-09-10 기준 설치 버전과 공식 문서 표시 버전은 Next.js 16.3.4다. 현재 저장소는 Cache Components를 활성화하지 않아 기존 ISR 설정을 사용한다.

- [Next.js fetch API](https://nextjs.org/docs/app/api-reference/functions/fetch): 요청별 `next.revalidate`와 `cache: "no-store"`의 의미 및 충돌 제약.
- [Next.js ISR 가이드](https://nextjs.org/docs/app/guides/incremental-static-regeneration): 시간 기반 재검증, 이전 페이지 제공과 백그라운드 재생성, 프로덕션에서의 검증 방식.
