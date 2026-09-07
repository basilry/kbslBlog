# 로그인 비활성화 및 프런트엔드 SEO 검토

검토일: 2026-09-07
대상: basilry.kim / Next.js App Router

## 적용한 변경

| 항목 | 확인한 문제 | 조치 |
|---|---|---|
| 로그인·관리 화면 | JSON/Markdown 관리 방식에서도 로그인과 백엔드 편집 진입점이 남아 있었음 | 헤더 로그인/로그아웃, 글쓰기, 수정·삭제 UI 제거. 로그인 상태 자동 복원 중단. `/login`·`/userProfile` → `/`, `/post/register` → `/post` HTTP 308 영구 이동. 기존 컴포넌트는 비활성 상태로 보관 |
| 제목·설명·대표 URL | 대부분의 프로젝트·소개 페이지가 공통 제목·설명을 상속하고 canonical이 없었음 | 주요 공개 페이지별 메타데이터와 프로젝트 15개의 JSON 기반 메타데이터 추가. Open Graph/Twitter 정보도 같은 원본에서 생성 |
| 사이트맵 | 홈·글 목록·프로젝트 목록·글만 포함하고 프로젝트 상세 및 소개·경력 등을 누락 | 공개 페이지 목록과 프로젝트 JSON으로 사이트맵 생성. 임의의 현재 시각을 수정일로 넣지 않음 |
| 글 목록 페이지 구분 | 모든 목록 페이지의 canonical이 `/post`였음 | 2페이지부터 `/post?page=N`을 자기 대표 URL로 사용. 1페이지·잘못된 페이지 값은 정규 주소로 이동 |
| HTML 제목 구조 | 큰 제목도 `div`로만 렌더링 | 공통 TextBasic의 의미 태그 옵션 추가. 페이지 제목 h1, 절 제목 h2, 세부 제목 h3 적용. 기존 스타일 유지 |
| 글 구조화 데이터 | 게시물 정보를 설명하는 JSON-LD 없음 | 화면의 제목·설명·발행일·작성자와 일치하는 BlogPosting 추가. 본문 작성자 링크 표시. 실제 썸네일이 있을 때만 구조화 데이터 이미지 제공 |
| JSON-LD 안전성 | 새 JSON-LD 삽입 시 제목에 포함된 HTML 문자 처리 필요 | `<`를 유니코드 이스케이프로 직렬화하여 script 종료 문자열이 HTML로 해석되지 않도록 처리 |
| 비검색 페이지 | 검색·공지·후원 자리표시자 및 댓글 전용 방명록이 검색 대상으로 남음 | noindex, follow 적용. 사이트맵에서 제외. 폐쇄 주소의 영구 이동은 크롤러가 확인할 수 있도록 robots.txt 허용 |
| 이미지 설명·크기 | 프로젝트 스크린샷의 alt가 `myFace`, 소개 사진의 width/height가 0 | 프로젝트명과 화면 번호로 alt 수정, 스크린샷 지연 로딩. 소개 사진은 실제 810×1440 비율을 지정하고 alt 수정 |
| 중복 요청·이동 | 메타데이터/본문이 같은 글을 별도로 조회하고 프로젝트 링크가 추가 router.push를 호출 | 요청 단위 React cache로 글 조회 공유. 프로젝트는 Link의 기본 이동 사용 |

## 검증

- `npm run lint`: 오류 0개. 기존 raw img 및 이전 Landing 컴포넌트의 Hook 경고 등 11개는 남아 있음.
- `npm test`: 8개 파일, 30개 테스트 통과. 페이지별 canonical과 악의적인 script 종료 문자열의 JSON-LD 직렬화를 검증하는 테스트 포함.
- `npm run build`: 최종 빌드 및 TypeScript 검사 통과.
- 로컬 운영 모드 HTTP 검사: 공개 페이지 23개 모두 200, 고유 제목·설명·canonical·h1 확인. HTML에 로그인/관리 링크 없음.
- 사이트맵 23개 URL, 프로젝트 상세 15개 포함 및 중복·관리/미완성 경로 제외 확인.
- 폐쇄 관리 경로 3개 모두 HTTP 308 및 목적지 확인. 미완성/댓글 전용 페이지 noindex 확인.
- 글 JSON-LD 파싱, 작성자·대표 URL, 잘못된 페이지 값의 이동, 미공개 글의 noindex 확인.
- 로컬 브라우저에서 CLIMS 상세 페이지의 제목 계층과 로그인 없는 헤더가 정상 표시되는 것을 확인.

## 검토 범위와 후속 확인

- 소개·경력·프로젝트는 JSON, 새 글은 Markdown으로 관리한다. 기존 숫자 ID 게시물의 공개 조회와 좋아요 API는 보존했다. 프런트엔드 관리 기능을 닫았으며 별도 백엔드 자체를 폐쇄한 작업은 아니다.
- Next.js 스트리밍 중 발견되는 미공개/없는 글은 200 응답과 noindex를 함께 반환할 수 있다. 이 글들은 본문·사이트맵에 노출되지 않는다. 폐쇄한 관리 주소는 스트리밍에 앞서 308로 처리한다.
- 운영 검색 순위, 실제 Google 색인, Core Web Vitals 및 Lighthouse 점수는 이번 소스 검증으로 측정한 값이 아니다. Search Console의 색인·검색 실적과 실제 사용자 성능 데이터를 후속 확인해야 한다.
- 기존 일반 img를 Next Image로 전환하는 작업은 다양한 스크린샷 비율과 모달을 함께 확인하며 진행할 성능 개선 항목이다.
- 기존 API 글의 사이트맵/RSS 조회는 안전상 최근 100개 한도를 유지한다. 보관 글이 그 이상으로 증가하면 분할 사이트맵 또는 별도 내보내기를 검토한다.
- 구조화 데이터나 메타데이터 개선이 검색 순위·리치 결과·애드센스 승인을 보장하지는 않는다.

## 기준 문서

- [Google: 페이지별 설명](https://developers.google.com/search/docs/appearance/snippet)
- [Google: 목록 페이지별 canonical](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google: 사이트맵과 수정일](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Article 구조화 데이터](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Next.js: Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: not-found와 스트리밍 응답](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
