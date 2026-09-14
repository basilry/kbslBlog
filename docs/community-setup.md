# 댓글·좋아요 연결 안내

Google·카카오 로그인 댓글과 비로그인 좋아요를 기존 Next.js 블로그에 추가했다. 이 문서는 운영 연결과 검증에 필요한 설정을 정리한다. 기존 `DeskOntology` 프로젝트는 사용하지 않는다.

## 현재 상태

2026-09-14 블로그용 Supabase 프로젝트와 원격 DB 설치를 완료했다. 로컬 API에서 실제 DB의 댓글·좋아요 조회가 정상 응답하며, 비로그인 좋아요 추가·재조회·동일 요청 재시도·취소까지 확인했다. 테스트 좋아요는 취소해 원래 집계로 복원했다.

Google·카카오 제공자는 같은 날 확인 시점에 모두 비활성 상태다. 개발자 앱 연결, 실제 계정 로그인과 댓글 작성 검증, 운영 배포는 남아 있다. Chrome 제어 도구의 정책 정보 로딩 오류로 대시보드 설정과 실제 화면의 시각 검증은 직접 진행하지 못했다.

아래 코드와 마이그레이션은 로컬에 준비되어 있다. `COMMUNITY_ENABLED=true`와 필수 설정이 모두 있어야 상세 페이지가 새 댓글로 전환된다. 설정이 없으면 기존 Giscus와 기존 숫자 ID 글의 좋아요 기능이 유지된다. 설정 값을 바꾼 뒤에는 개발 서버를 재시작하고, 운영에서는 다시 빌드·배포한다.

로컬 검증 결과: 테스트 25개 파일·130건 통과, 변경 파일 ESLint 오류·경고 없음, 전체 타입 검사와 프로덕션 빌드 성공. 실제 연결 값을 넣고 새 기능을 활성화한 프로덕션 빌드도 성공했다. 기존 코드의 ESLint 경고 11건과 Sass 경고 23건은 남아 있다. 브라우저 번들에 실제 연결 키나 서버 비밀키 변수 참조가 포함되지 않는 것도 확인했다. Chrome 제어 도구 오류로 실제 화면의 시각 검증은 아직 수행하지 못했다.

## 1. 블로그용 Supabase 프로젝트

현재 연결한 프로젝트의 생성과 SQL 설치는 완료했다. 다음 절차는 새 환경을 처음 준비할 때 사용한다.

1. Supabase 대시보드에서 `basilry's Org` → **New project**를 연다.
2. 이름은 `basilry-community`로 지정한다. 기존 프로젝트와 다른 DB를 만든다.
3. 비밀번호는 비밀번호 관리자에 보관한다. 블로그 코드에 DB 비밀번호를 넣을 필요는 없다.
4. 지역은 선택 목록에 있는 **Northeast Asia (Seoul), ap-northeast-2**를 권장한다. 운영 서버의 위치와 주요 독자를 고려해 다른 지역을 선택할 수도 있다. [지원 지역](https://supabase.com/docs/guides/platform/regions)
5. 프로젝트가 준비되면 **SQL Editor**에서 `supabase/migrations/202609140001_community.sql` 전체를 한 번 실행한다. 전용 프로젝트의 신규 테이블과 함수만 만든다. 같은 SQL을 재실행하는 방식으로 업데이트하지 않는다.

무료 요금제의 비활성 프로젝트 일시중지 조건은 운영 전에 확인한다. 현재 Free로 표시된다는 사실만으로 운영 중 계속 활성 상태가 보장되는 것은 아니다. 유료 전환은 이 개발 작업에 포함하지 않았다. [Supabase 요금 안내](https://supabase.com/pricing)

## 2. 프로젝트 연결 값

저장소 루트 `.env.local`에 아래 값을 입력한다. 이 파일은 Git에서 제외된다. 기존 파일에 다른 설정이 있으면 보존하고 필요한 항목만 추가한다. 예시는 `.env.example`에 있다.

저장소를 여러 폴더에 복제했다면 실제로 `npm run dev`를 실행하는 폴더의 `.env.local`을 확인한다. 원본 폴더의 파일이나 Vercel에 등록한 환경변수는 다른 작업 폴더로 자동 복사되지 않는다.

| 변수 | 값 |
| --- | --- |
| `SUPABASE_URL` | 프로젝트의 URL, 예: `https://프로젝트참조.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | 프로젝트 API Keys의 publishable key. 구형 프로젝트의 anon key도 이 변수에 입력 가능 |
| `SUPABASE_SECRET_KEY` | 프로젝트 API Keys의 secret key. 구형 프로젝트의 service_role key도 가능. 서버 전용 |
| `COMMUNITY_COOKIE_SECRET` | 32자 이상의 무작위 비밀 문자열. 배포마다 바꾸지 않음 |
| `COMMUNITY_AUTH_PROVIDERS` | `google,kakao`. 준비된 제공자만 임시로 `google` 또는 `kakao`로 지정 가능 |
| `COMMUNITY_SITE_URL` | 개발은 `http://localhost:3000`, 운영은 `https://www.basilry.kim` |
| `COMMUNITY_ENABLED` | DB와 로그인 설정을 끝낸 뒤 `true` |

비밀키와 OAuth Client Secret은 채팅이나 Git에 올리지 않는다. 이 구현은 Supabase API 키를 브라우저에 전달하지 않으며 `NEXT_PUBLIC_` 변수를 사용하지 않는다. 공개 닉네임 이외의 소셜 계정 정보도 댓글 API 응답에 포함하지 않는다.

Vercel에서는 동일한 변수를 프로젝트의 Environment Variables에 등록한다. Preview 환경을 사용할 때는 `COMMUNITY_SITE_URL`을 해당 미리보기의 정확한 HTTPS 주소로 지정하고 아래 Supabase 허용 URL에도 그 callback 주소를 추가한다. 운영 키를 임의의 다른 프로젝트에 재사용하지 않는다.

Windows의 회사 네트워크에서 Node가 `SELF_SIGNED_CERT_IN_CHAIN` 오류를 반환하면 시스템 신뢰 인증서 사용 여부를 확인한다. 이번 로컬 검증에서는 `node --help`로 `--use-system-ca` 지원을 확인한 뒤, 아래처럼 해당 PowerShell 세션에만 옵션을 적용해 연결했다. TLS 인증서 검증은 유지한다.

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --use-system-ca').Trim())
npm run dev -- --hostname 127.0.0.1 --port 3000
```

## 3. 로그인 후 돌아올 주소

Supabase **Authentication → URL Configuration**:

- Site URL: `https://www.basilry.kim`
- Redirect URLs: `https://www.basilry.kim/api/auth/callback`
- 개발용 Redirect URL: `http://localhost:3000/api/auth/callback`

개발 서버의 포트를 바꾸면 `.env.local`의 `COMMUNITY_SITE_URL`과 이 허용 URL도 같은 포트로 바꾼다. 원래 글 주소와 언어는 10분 동안 유지되는 HttpOnly 쿠키에 저장하므로 callback URL에 글마다 다른 쿼리를 추가할 필요가 없다. 성공·취소 후 모두 원래 글의 댓글 위치로 돌아온다. 임시 댓글은 해당 탭의 sessionStorage에 보관한다. [Redirect URL 설정](https://supabase.com/docs/guides/auth/redirect-urls), [Next.js 인증 클라이언트](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)

## 4. Google·카카오 개발자 앱

두 제공자에 등록할 OAuth Redirect URI는 블로그 주소와 다르다:

```text
https://프로젝트참조.supabase.co/auth/v1/callback
```

프로젝트의 **Authentication → Sign In / Providers**에서 표시되는 실제 callback 주소를 복사한다.

### Google

Google Cloud / Google Auth Platform에서 웹 애플리케이션 OAuth 클라이언트를 만들고 위 Supabase callback을 승인된 Redirect URI에 등록한다. 동의 화면의 앱 이름·연락처·대상 사용자를 설정하고, 테스트 모드에서는 로그인할 계정을 테스트 사용자에 등록한다. 발급된 Client ID와 Client Secret을 **Supabase → Authentication → Google**에 넣고 활성화한다. 공개 이용에 필요한 게시·검증 상태는 Google 콘솔에서 확인한다. [Google 연결 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)

### 카카오

Kakao Developers에서 앱을 만들고 카카오 로그인을 활성화한다. REST API key 설정의 Kakao Login Redirect URI에 위 Supabase callback을 넣고, Kakao Login Client Secret도 활성화한다. REST API key와 Client Secret을 **Supabase → Authentication → Kakao**에 입력한다.

이 구현은 `profile_nickname profile_image` 범위를 요청하며 이메일을 요청하지 않는다. 카카오 앱에 필요한 프로필 동의 항목을 설정하고 Supabase Kakao 제공자에서 **Allow users without an email**을 켠다. 공개 댓글의 닉네임은 작성자가 입력하고, 소셜 프로필 사진은 화면에 표시하지 않는다. [카카오 연결 문서](https://supabase.com/docs/guides/auth/social-login/auth-kakao)

Google 버튼 로고는 [Google 공식 로그인 브랜드 자료](https://developers.google.com/identity/branding-guidelines)의 `g-logo.png`를 로컬 정적 파일로 보관했다. 로그인 버튼을 표시하는 데 외부 Google 스크립트를 로드하지 않는다.

## 5. 작성자 표시와 댓글 관리

블로그 작성자 계정으로 한 번 로그인한 뒤 Supabase **Authentication → Users**에서 해당 사용자의 UUID를 확인한다. SQL Editor에서 실제 UUID로 아래 명령을 실행한다.

```sql
insert into public.community_moderators(user_id)
values ('작성자-계정의-실제-UUID'::uuid)
on conflict do nothing;
```

이 목록의 계정은 작성자 배지가 표시되고, 댓글에서 숨기기·다시 표시 및 신고 수를 볼 수 있다. 공개 프로필이나 사용자 수정 가능한 `user_metadata`로 권한을 부여하지 않는다. 댓글 작성자는 자기 댓글만 수정·삭제한다. 관리자도 다른 사람의 본문을 대신 수정하지 않는다.

댓글 작성 권한은 Supabase에서 확인한 Google·카카오 연결 계정에만 부여한다. Supabase의 익명 로그인이나 별도의 이메일·비밀번호 계정이 만들어져 있더라도 이 API에서 댓글 작성자로 취급하지 않는다.

신고 상세를 확인하려면 운영자가 SQL Editor에서 다음처럼 조회할 수 있다. 일반 독자에게는 신고 내용과 신고자 UUID를 공개하지 않는다.

```sql
select r.comment_id, c.post_key, c.author_name, c.body, c.status,
       r.reason, r.created_at
from public.community_reports r
join public.community_comments c on c.id = r.comment_id
order by r.created_at desc;
```

## 동작과 데이터 보존

- 한국어·영어 경로에서 같은 `post/slug`를 사용한다. 숫자 ID 글은 `post/숫자ID`를 사용한다. 댓글 추가 때문에 Markdown을 다시 빌드하지 않는다.
- 좋아요는 서버가 서명한 브라우저 쿠키 기준이다. 로그인 전후에도 같은 식별자를 사용하므로 같은 브라우저에서 두 번 합산되지 않는다. 다른 기기·브라우저·쿠키 삭제를 포함한 사람당 1회를 보장하지 않는다.
- 좋아요 쿠키의 유효기간은 발급 후 1년이다. 쿠키가 삭제되거나 만료되면 이전 브라우저 식별자를 복구할 수 없다.
- 기존 숫자 ID 글의 좋아요 합계를 서버에서 읽고 새 좋아요에 더한다. 새 API로 전환하면 과거 좋아요 버튼을 함께 노출하지 않는다. 기존 집계나 GitHub 댓글을 삭제·초기화하지 않는다.
- 기존 Giscus는 **기존 GitHub 댓글 보기**를 펼칠 때 로드한다. 기존 작성자를 새 소셜 계정에 임의로 연결하지 않는다. GitHub 쪽 데이터와 기존 작성 기능 자체는 변경하지 않는다.
- 댓글은 텍스트만 받는다. 댓글당 2,000자, 닉네임 30자, 답글은 한 단계·원 댓글당 50개까지다. 원 댓글 10개씩 이전 댓글을 더 불러온다.
- 삭제된 댓글의 본문은 지우고 답글은 남긴다. 숨긴 댓글의 본문은 일반 독자와 작성자에게 보내지 않으며 관리자에게만 보인다. 숨김 해제는 관리자가 할 수 있다.
- 닉네임 변경은 이후 작성한 댓글에 적용된다. 소셜 계정을 바꾸거나 다른 계정으로 로그인하면 이전 계정의 수정 권한이 넘어가지 않는다.
- 비로그인 좋아요 요청은 브라우저당 분당 30회, 댓글 작성은 계정당 분당 5회, 전체 댓글 변경은 계정당 분당 20회로 제한한다. Vercel에서는 플랫폼이 설정한 클라이언트 IP의 일별 HMAC으로 네트워크당 분당 60회 변경 제한도 적용한다. 원본 IP는 DB에 저장하지 않는다. 다른 호스팅으로 옮길 경우 신뢰할 수 있는 프록시·요청 제한 구성을 별도로 연결해야 한다. [Vercel 요청 헤더](https://vercel.com/docs/headers/request-headers)
- 요청 제한 기록은 이후 요청이 처리될 때 7일보다 오래된 행을 정리한다. Supabase Auth의 사용자 보관·탈퇴 관리는 프로젝트 운영자의 관리 대상이다.
- `.env.local`의 쿠키 비밀키를 바꾸면 기존 브라우저 식별자를 읽을 수 없다. 키가 유지되어야 기존 좋아요 취소 상태도 이어진다.

## 검증과 운영 전 확인

로컬에서 `npm run check`를 실행한다. 테스트에는 실제 PostgreSQL 엔진인 PGlite에서 마이그레이션을 실행하는 DB 검증, Next.js API 검증, jsdom에서의 화면 입력·클릭·키보드 검증이 포함된다. 테스트 라이브러리를 위해 Node 22.22.2, 24.15.0 이상 또는 26 이상을 사용한다.

외부 프로젝트 연결 후에는 `npm run dev`로 실행하고 아래 항목을 실제 브라우저에서 확인한다. 로컬 테스트의 가짜 인증 응답이 실제 Google·카카오 로그인의 성공을 증명하는 것은 아니다.

1. Google·카카오로 각각 로그인하고 한국어·영어 원래 글로 복귀한다. 승인 취소 후에도 작성 중이던 댓글이 남는다.
2. 작성·수정·삭제·답글·신고를 확인하고 다른 계정에서 수정·삭제가 허용되지 않는지 확인한다.
3. 관리자 계정에서 숨김·복원을 확인한다. 비로그인 응답에 숨긴 본문이 포함되지 않아야 한다.
4. 같은 글의 한국어·영어 페이지에서 좋아요·댓글이 공유되는지 확인한다. 새로고침, 재시도, 로그인 전후, 좋아요 취소도 확인한다.
5. 모바일 폭과 밝은·어두운 테마에서 입력창, 로그인 버튼, 답글을 확인한다. Supabase가 응답하지 않아도 글 본문은 읽을 수 있어야 한다.
6. 실제 인증 검증을 마치고 기존 글의 합계를 확인한 뒤 운영 환경에 연결·배포한다.

연결에 문제가 있으면 `COMMUNITY_ENABLED=false`로 바꾸고 다시 배포하여 기존 댓글 화면으로 되돌릴 수 있다. Supabase에 저장된 새 댓글·좋아요는 삭제되지 않는다. 두 서비스에 작성 내용이 나뉠 수 있으므로 운영 전환 시점은 기록한다.
