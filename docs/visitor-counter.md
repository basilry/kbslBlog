# Cloudflare 방문 통계

블로그 하단의 오늘 조회 수와 전체 누적 조회 수, 글 상단과 포스팅 목록의 누적 조회 수는 Cloudflare Worker와 D1에 저장한다. Google Analytics는 유입 분석용으로 유지하지만 공개 카운터의 데이터 원본으로 사용하지 않는다.

## 집계 기준

- 오늘 조회는 한국 날짜를 기준으로 모든 페이지 진입 횟수를 합산한다.
- 전체 누적 조회는 날짜에 관계없이 모든 페이지 진입 횟수를 합산한다.
- 글 조회는 해당 글을 열 때마다 증가한다. 같은 브라우저의 재방문과 새로고침도 매번 집계한다.
- 사이트 내부에서 다른 경로로 이동하거나 브라우저의 뒤로·앞으로 가기로 다시 열 때도 집계한다. 같은 화면에서의 단순 탭 전환, 해시 이동, 검색 조건 변경은 새 열람으로 보지 않는다.
- 사용자별 UUID를 저장하거나 전송하지 않는다. 기존 브라우저 식별값은 삭제한다. IP나 User-Agent도 D1에 저장하지 않는다.
- 페이지를 열 때마다 새 요청 ID를 만든다. 이는 사용자 식별자가 아니며 메모리에만 존재한다. 동일한 열람 요청의 중복 전송만 막고, 새로운 열람은 항상 새 ID로 집계한다. 요청 ID 기록은 7일이 지난 뒤 정리하며 누적 합계는 유지한다.
- 15분 주기 갱신, 탭이 다시 보일 때의 갱신, 자정 갱신 및 목록의 글 조회수 조회는 읽기 전용 API를 사용한다.
- 명백한 검색봇 User-Agent와 허용되지 않은 Origin은 집계하지 않는다. 일반 페이지는 사이트 합계만, 글 상세는 사이트 합계와 해당 글 조회 수를 함께 증가시킨다.
- 공개 API 장애나 한도 초과 시 실패를 0으로 표시하지 않는다. 접속 차단이나 네트워크 장애로 전달되지 않은 열람은 집계되지 않을 수 있다.

공개 카운터는 사람 수가 아닌 접속·열람 횟수이므로 단위는 `회`다. 악의적인 조작을 완전히 막는 용도로 사용하지 않는다.

2026-09-09부터 사용자별 중복 제거를 중단했다. `0002_count_page_views.sql`은 기존 전체·일일 합계를 새 테이블의 시작값으로 보존하고 글별 합계도 유지한다. 과거에 중복 제거로 기록되지 않은 열람은 복원할 수 없으므로 새 기준의 완전한 집계는 변경 시점부터 적용된다. Google Analytics 기록을 소급해서 합치지 않는다. 이전 테이블은 롤백을 위해 보존하되 새 Worker는 사용자 해시를 읽거나 추가하지 않는다.

## Cloudflare 리소스

- Worker: `kbsl-blog-counter`
- D1: `kbsl-blog-counters`
- 열람 기록 엔드포인트: `https://kbsl-blog-counter.basbot.workers.dev/visit`
- 읽기 전용 통계 엔드포인트: `https://kbsl-blog-counter.basbot.workers.dev/stats`
- 목록 조회 엔드포인트: `https://kbsl-blog-counter.basbot.workers.dev/views` (조회수 증가 없이 최대 20개 글을 일괄 조회)
- 상태 확인: `https://kbsl-blog-counter.basbot.workers.dev/health`

Worker의 D1 바인딩은 `DB`이며 집계용 비밀키는 필요하지 않다. 기존 `HASH_SECRET`은 새 코드에서 사용하지 않으며 롤백용 기존 바인딩만 보존한다. 이전 프론트엔드가 호출하는 `/count`는 호환 응답만 반환하며 숫자를 증가시키지 않는다. 환경변수 `NEXT_PUBLIC_COUNTER_API_URL`은 기존 `/count` 주소를 그대로 사용해도 된다. 새 프론트엔드가 `/visit`, `/stats`, `/views` 주소를 파생한다.

## 개발과 검증

```sh
cd cloudflare/counter-worker
npm ci
npm run check
```

별도 로컬 D1을 이용하는 HTTP 통합 검증:

```sh
npx wrangler d1 migrations apply kbsl-blog-counters --local --persist-to .wrangler/page-view-tests
npx wrangler dev --local --port 8787 --persist-to .wrangler/page-view-tests
# 별도 터미널에서 실행
node scripts/verify-local.mjs
```

통합 검증 스크립트는 localhost만 허용한다. 운영 데이터에 테스트 열람을 넣지 않는다. 기존 값 보존, 한국 날짜 전환, 동일 요청 재전송은 단위 테스트로 검증하고, 반복 열람·동시 증가·읽기 전용 갱신·Origin 차단은 실제 로컬 Worker와 D1으로 검증한다.

운영 배포 순서는 `0002_count_page_views.sql` 적용 → Worker 배포 → 프론트엔드 배포다. 이전 화면의 자동 갱신은 `/count` 호환 응답으로 처리하므로 배포 도중 허위 열람이 쌓이지 않는다. 배포 후 같은 브라우저에서 글 새로고침과 사이트 내부 이동을 확인한다.

현재 무료 한도는 Workers 요청 100,000회/일, D1 읽기 5,000,000행/일, 쓰기 100,000행/일, 총 저장 공간 5GB다. Cloudflare가 한도를 변경할 수 있으므로 운영 중에는 대시보드의 사용량과 공식 문서를 확인한다.

- [Workers 한도](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 가격과 무료 한도](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 Worker API](https://developers.cloudflare.com/d1/worker-api/)
