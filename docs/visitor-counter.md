# Cloudflare 방문 통계

블로그 하단의 오늘 방문자 수와 전체 누적 방문자 수, 글 상단과 포스팅 목록의 누적 조회 수는 무료 Cloudflare Worker와 D1에 저장한다. Google Analytics는 유입 분석용으로 유지하지만 공개 카운터의 데이터 원본으로 사용하지 않는다.

## 집계 기준

- 오늘 방문자는 브라우저별로 한국 날짜 하루에 한 번 집계한다.
- 전체 누적 방문자는 같은 브라우저를 최초 한 번만 집계한다.
- 글 조회 수도 같은 브라우저와 글에 대해 하루에 한 번 반영한다. 다음 날 다시 읽으면 누적 조회 수가 증가한다.
- 브라우저에는 무작위 UUID만 저장한다. Worker는 UUID를 비밀키로 HMAC 처리하며 D1에는 원본 UUID, IP, User-Agent를 저장하지 않는다.
- 명백한 검색봇 User-Agent, 허용되지 않은 Origin, 글 URL이 아닌 경로는 집계하지 않는다.
- 전날의 일일 중복 방지 행은 다음 정상 요청에서 삭제한다. 전체 방문자 익명 해시와 글별 누적 합계는 계속 보존한다.
- 공개 API 장애나 한도 초과 시 숫자를 숨기며 실패를 0으로 표시하지 않는다.

브라우저 식별자가 삭제되거나 다른 브라우저·기기를 사용하면 새로운 방문자로 집계된다. 공개 카운터는 로그인 기반 사용자를 뜻하지 않으며 악의적인 조작을 완전히 막는 용도로 사용하지 않는다.
전체 누적 방문자와 글 조회 수는 Cloudflare 카운터를 운영에 배포한 시점부터 쌓인다. 이전 Google Analytics 기록을 D1에 소급해서 합치지 않는다.

## Cloudflare 리소스

- Worker: `kbsl-blog-counter`
- D1: `kbsl-blog-counters`
- 공개 엔드포인트: `https://kbsl-blog-counter.basbot.workers.dev/count`
- 목록 조회 엔드포인트: `https://kbsl-blog-counter.basbot.workers.dev/views` (조회수 증가 없이 최대 20개 글을 일괄 조회)
- 상태 확인: `https://kbsl-blog-counter.basbot.workers.dev/health`

Worker의 D1 바인딩은 `DB`, HMAC 비밀 바인딩은 `HASH_SECRET`이다. 비밀값은 Cloudflare 암호화 바인딩으로만 저장하고 소스 및 Wrangler 설정에 넣지 않는다.

## 개발과 검증

```sh
cd cloudflare/counter-worker
npm ci
npm run check
```

스키마는 `migrations/0001_create_counters.sql`에서 관리한다. 운영 마이그레이션은 배포 전에 적용하고, Worker 배포 후 `/health`와 허용·차단 Origin, 같은 브라우저의 중복 제거, 다른 브라우저의 증가를 확인한다.

현재 무료 한도는 Workers 요청 100,000회/일, D1 읽기 5,000,000행/일, 쓰기 100,000행/일, 총 저장 공간 5GB다. Cloudflare가 한도를 변경할 수 있으므로 운영 중에는 대시보드의 사용량과 공식 문서를 확인한다.

- [Workers 한도](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 가격과 무료 한도](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 Worker API](https://developers.cloudflare.com/d1/worker-api/)
