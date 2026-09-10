# Cloudflare 방문 통계

블로그 방문자와 포스팅 조회수는 Cloudflare Worker와 D1에 저장한다. Google Analytics는 별도 유입 분석 도구다.

## 2026-09-10부터 적용하는 집계 기준

- 블로그 방문자는 같은 브라우저에서 한국 시간(Asia/Seoul) 기준 하루 1회만 집계한다. 홈, 글, 프로젝트 중 어느 페이지로 들어와도 동일하다.
- 누적 방문은 일별 방문 횟수의 누적이다. 같은 브라우저가 다음 날 들어오면 다시 1회 증가한다.
- 포스팅 조회는 해당 글을 열 때마다 증가한다. 재방문, 새로고침, 다른 경로를 거쳐 돌아오기, 뒤로·앞으로 가기 복원도 포함한다.
- 탭 전환, 해시·검색 조건 변경, 15분 갱신, 자정 타이머, 목록의 조회수 조회는 읽기 전용이다. 열린 페이지를 그대로 둔 것만으로 다음 날 방문이나 글 조회가 증가하지 않는다.
- 브라우저에는 날짜별 무작위 UUID를 localStorage에 저장하고 날짜가 바뀌면 교체한다. Web Locks를 지원하는 브라우저에서는 여러 탭의 최초 생성도 직렬화한다. 서버는 한국 날짜와 UUID의 복합키로 중복을 제거한다.
- 브라우저 저장소 삭제, 다른 브라우저·기기, 시크릿 세션은 별도 방문자로 인식한다. 저장소가 차단되면 페이지가 열려 있는 동안만 중복 제거가 가능하며, Web Locks 미지원 환경에서는 최초 동시 탭 생성의 완전한 직렬화를 보장하지 않는다. 로그인 기반 사람 식별은 하지 않는다.
- 포스팅에는 열람별 요청 ID를 별도로 사용한다. 같은 요청 재전송만 중복 제거하며 새 열람에는 새 ID를 사용한다. 전송 실패 시 동일 요청 ID로 재시도한다.
- 기존 및 신규 방문 UUID·요청 ID 기록과 누적 합계를 보존한다. 이 Worker에는 자동 삭제 동작이 없다. IP와 User-Agent를 DB에 저장하지 않는다.
- 명백한 검색봇과 허용되지 않은 Origin은 집계하지 않는다. 장애를 0으로 표시하지 않는다.

## 기존 데이터 보존

`0001` 시기에는 사용자 중복 제거, `0002` 적용 후인 2026-09-09부터는 모든 페이지 열람 합산을 사용했다. `0003_daily_site_visitors.sql`은 기존 합계를 지우거나 재계산하지 않고 새 기록부터 블로그 방문자만 일별 중복 제거한다. 과거 누적값과 전환 당일에는 이전 집계 기준의 기록이 포함되어 있다. 이를 소급한 정확한 고유 방문자 수로 해석하지 않는다. 글별 조회 합계는 계속 유지된다.

## 리소스와 호환성

- Worker: `kbsl-blog-counter`, D1: `kbsl-blog-counters`, 바인딩: `DB`
- 기록: `https://kbsl-blog-counter.basbot.workers.dev/visit`
- 통계: `https://kbsl-blog-counter.basbot.workers.dev/stats`
- 목록: `https://kbsl-blog-counter.basbot.workers.dev/views` (최대 20개)
- 상태: `https://kbsl-blog-counter.basbot.workers.dev/health`

`/visit`은 `{eventId, visitorId?, path}`를 받는다. 방문 UUID가 없는 이전 클라이언트는 글 조회만 증가시킨다. `/stats`, `/views`, 이전 `/count`는 읽기 전용이다. 공개 응답의 `todayViews`, `totalViews` 필드는 호환성을 위해 이름을 유지하되 화면에는 방문으로 표시한다. 기존 `HASH_SECRET`은 사용하지 않으며 기존 바인딩만 보존한다. `NEXT_PUBLIC_COUNTER_API_URL`의 기존 `/count` 주소도 사용할 수 있다.

## 검증과 배포

```sh
cd cloudflare/counter-worker
npm ci
npm run check
npx wrangler d1 migrations apply kbsl-blog-counters --local --persist-to .wrangler/daily-visitor-tests
npx wrangler dev --local --port 8787 --persist-to .wrangler/daily-visitor-tests
# 별도 터미널
node scripts/verify-local.mjs
```

로컬 HTTP 검증만 테스트 방문을 생성한다. 운영 데이터에는 테스트 요청을 넣지 않는다. 배포 순서는 `0003` 원격 마이그레이션 → Worker → 프런트엔드다. 이전 집계 데이터는 보존한다. 운영 검수는 읽기 전용 통계와 정상 브라우저 탐색으로 수행한다.

- [D1 batch 트랜잭션](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Wrangler 명령](https://developers.cloudflare.com/workers/wrangler/commands/)
