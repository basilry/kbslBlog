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
# 기존 브라우저 로그인·편집 API의 기본 주소 (브라우저에 공개되는 값)
NEXT_PUBLIC_IP=https://api.basilry.kim
# 서버의 공개 글 조회 주소. 없으면 NEXT_PUBLIC_IP 사용
CONTENT_API_URL=https://api.basilry.kim
# 선택: 기존 Google Analytics 측정 ID를 교체할 때만 설정
NEXT_PUBLIC_GA_ID=G-GZDS0N484J
```

API 주소에는 실제 배포의 경로 접두사가 있다면 함께 지정해야 합니다. 관리자 비밀번호나 토큰을 `NEXT_PUBLIC_*` 변수에 넣지 않습니다. 백엔드 미설정·일시 장애는 글 없음과 구분해 표시하며, 로컬 공개 Markdown과 프로젝트 페이지는 사용할 수 있습니다.

## 글 발행

- 기존 API 글의 ID와 URL은 유지됩니다. 웹 에디터도 과도기 동안 유지합니다.
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

기존 EC2에서 PM2를 사용한다면 검증된 빌드 후 기존 설정으로 `pm2 startOrReload ecosystem.config.js --update-env`를 실행합니다. PM2는 운영 환경에 별도 설치되어 있어야 합니다. 기존 프로세스와 환경변수·프록시 설정을 확인하고 이전 릴리스로 돌아갈 수 있게 배포합니다. 운영 환경에서는 개발 서버를 사용하지 않습니다.

GitHub Actions는 push/PR 시 설치·lint·타입·테스트·빌드를 검사합니다. EC2 배포 자격 증명이나 자동 배포 연결은 이 저장소에 추가하지 않았습니다. **GitHub push와 실제 운영 서버 배포는 별도입니다.**

`/feed.xml`과 `/sitemap.xml`은 공개 콘텐츠를 제공하고, `/robots.txt`는 기존 AI 크롤러 차단 의도를 유지합니다.

## 구성

- `src/app`: 홈, 기존 프로젝트, 공개 글, 관리 페이지, 이미지 API
- `src/lib/content`: Markdown·기존 API 글 조회와 안전한 본문 렌더링
- `src/components/template/editor`: 과도기 웹 에디터
- `content/posts`: Markdown 글 원본
- `public/content`: 발행 글의 첨부 자산
- `src/lib/json`: 기존 소개·프로젝트 데이터

## 데이터와 운영 경계

별도 백엔드의 `/authenticate`, `/users/me`, `/posts`, `/file/*`, `/proxy/*` 계약을 유지합니다. 프런트엔드의 로그인 표시로 서버 권한이 보장되지는 않으므로, 기존 백엔드에서 관리자 쓰기·삭제 권한을 검증해야 합니다. 저장 중 오류가 나면 초안을 보존하고 중복 제출을 막습니다. localStorage 초안은 현재 브라우저에만 보관되며 서버 백업을 대신하지 않습니다.
