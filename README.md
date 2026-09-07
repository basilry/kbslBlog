# basilry.kim

Next.js 기반 개발 블로그와 프로젝트 포트폴리오입니다. 기존 백엔드 포스팅(`/post/{id}`)을 유지하며, 선택한 Markdown 글을 같은 사이트에 발행합니다.

## 시작하기

Node.js 22 LTS 이상과 npm을 사용합니다. `.nvmrc`는 22를 지정합니다.

```sh
npm ci
npm run dev
```

## 환경 설정

루트에 `.env.local`을 만들고 필요한 값만 지정합니다. 이 파일은 커밋하지 않습니다.

```dotenv
# 기존 공개 글 조회·좋아요 API 주소 (브라우저에 공개되는 값)
NEXT_PUBLIC_IP=https://api.basilry.kim
# 서버의 공개 글 조회 주소. 없으면 NEXT_PUBLIC_IP 사용
CONTENT_API_URL=https://api.basilry.kim
# 선택: 기존 Google Analytics 측정 ID를 교체할 때만 설정
NEXT_PUBLIC_GA_ID=G-GZDS0N484J
```

API 주소에는 실제 배포의 경로 접두사가 있다면 함께 지정해야 합니다. 관리자 비밀번호나 토큰을 `NEXT_PUBLIC_*` 변수에 넣지 않습니다. 백엔드 미설정·일시 장애는 글 없음과 구분해 표시하며, 로컬 공개 Markdown과 프로젝트 페이지는 사용할 수 있습니다.

## 글 발행

- 기존 API 글의 ID와 URL은 유지됩니다. 웹 로그인·프로필·글쓰기 경로와 수정·삭제 UI는 비활성화했습니다.
- 새로운 글은 `content/posts`의 Markdown을 원본으로 관리합니다.
- 초안은 공개 목록·상세·RSS·사이트맵에서 제외됩니다.
- 선택한 한 문서와 필요한 첨부만 가져오고, 미리보기 이후 발행을 명시적으로 확정합니다.
- 가져오기 명령과 Obsidian 링크·첨부 규칙은 [발행 가이드](docs/publishing.md)를 참고하세요.
- 기존 HTML 데이터와 이미지를 자동 삭제하거나 일괄 변환하지 않습니다.

## 검사

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check`는 위 검사를 순서대로 실행합니다. 이미지 프록시의 허용 대상·응답 제한, 이미지 업로드 실패, 초안 제외·Markdown 처리 등을 회귀 테스트합니다.

## 운영 배포

이 앱은 서버 렌더링과 이미지 API를 사용하므로 **Next.js 서버**로 배포합니다. GitHub Pages용 `out` 정적 배포는 사용하지 않습니다.

```sh
npm ci
npm run check
npm start
```

별도 EC2 환경에서 PM2를 사용한다면 검증된 빌드 후 기존 설정으로 `pm2 startOrReload ecosystem.config.js --update-env`를 실행합니다. PM2는 운영 환경에 별도 설치되어 있어야 합니다. 기존 프로세스와 환경변수·프록시 설정을 확인하고 이전 릴리스로 돌아갈 수 있게 배포합니다. 운영 환경에서는 개발 서버를 사용하지 않습니다.

현재 `www.basilry.kim` 운영 환경은 **Vercel**이며, GitHub `master` 브랜치에 연결된 배포를 사용합니다. GitHub Actions는 push/PR 시 설치·lint·타입·테스트·빌드를 검사합니다. Vercel 배포와 Actions 검사는 별도로 진행되므로, 푸시 후 두 결과를 모두 확인해야 합니다.

운영 배포 절차:

1. 로컬 검사와 변경 검토를 완료하고 `master`에 커밋·푸시합니다.
2. 해당 커밋의 GitHub Actions `Blog checks`와 `Vercel` 상태가 성공인지 확인합니다.
3. `https://www.basilry.kim`에서 변경된 경로와 실제 UI 동작을 확인합니다.
4. 문제가 있으면 이전 정상 Vercel 배포로 복구하거나 수정 커밋을 배포합니다.

배포 자격 증명은 저장소에 포함하지 않습니다. Vercel 환경변수는 프로젝트 설정에서 관리합니다.

`/feed.xml`과 `/sitemap.xml`은 공개 콘텐츠를 제공하고, `/robots.txt`는 검색 크롤러의 공개 페이지 접근을 허용합니다.

## 구성

- `src/app`: 홈, 기존 프로젝트, 공개 글, 비활성 관리 경로, 이미지 API
- `src/lib/content`: Markdown·기존 API 글 조회와 안전한 본문 렌더링
- `src/components/template/editor`: 비활성 웹 에디터 원본
- `content/posts`: Markdown 글 원본
- `public/content`: 발행 글의 첨부 자산
- `src/lib/json`: 기존 소개·프로젝트 데이터

## 데이터와 운영 경계

소개·경력·프로젝트는 `src/lib/json`, 새 글은 `content/posts`에서 관리합니다. `/login`, `/userProfile`은 홈으로, `/post/register`는 글 목록으로 영구 리디렉션합니다. 기존 페이지 구현도 `notFound()`로 비활성화했고 로그인 상태를 복원하지 않습니다. 기존 로그인·에디터 구현은 복구 참고용으로 남겨두지만 공개 페이지에서 불러오지 않습니다. 별도 백엔드의 기존 공개 글 조회와 좋아요는 유지합니다. 프런트엔드 경로 폐쇄가 백엔드 쓰기 API를 폐쇄하는 것은 아닙니다.

## 검색 메타데이터

`src/lib/seo.ts`에서 공개 페이지의 제목·설명·대표 URL·공유 메타데이터를 관리합니다. 프로젝트 메타데이터와 사이트맵은 프로젝트 JSON을 사용합니다. 글 목록은 각 페이지에 자기 대표 URL을 지정하고, 공개 글은 BlogPosting 구조화 데이터를 출력합니다. 비활성 관리 경로는 308 영구 리디렉션, 미완성·댓글 전용 페이지는 noindex 처리합니다. 검토 결과와 검증 범위는 `docs/seo-review.md`에 기록합니다.

## 공개 방문 통계

Google Analytics Data API로 오늘 방문자 수와 글 누적 조회 수를 표시합니다. 서버 자격 증명이 없으면 카운터를 숨깁니다. 집계 기준과 Vercel 설정은 [GA 통계 연결 가이드](docs/analytics.md)를 참고하세요.
