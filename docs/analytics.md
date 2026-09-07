# GA 방문 통계 연결

블로그 하단에 **오늘 방문자 수**, 글 상단에 **해당 글 누적 조회 수**를 표시한다. 공개 GET `/api/analytics`가 Google Analytics Data API의 `batchRunReports`를 서버에서 호출한다. 별도 DB는 사용하지 않는다.

## 집계 정의

- 오늘 방문자: `totalUsers`. GA가 구분한 사용자 수이며 실제 사람 수와 완전히 같지는 않다. 기본 GA 보고서의 `activeUsers`와는 다른 지표다.
- 글 누적 조회: `screenPageViews`를 `pagePath`별 집계. 같은 사용자의 반복 조회도 포함한다. 2020-01-01 이후 GA에 수집된 기록을 사용하며, 수집되지 않은 과거 조회는 복원할 수 없다.
- 운영 호스트 `www.basilry.kim`, `basilry.kim`만 집계한다. localhost 및 Vercel 미리보기 도메인을 제외한다.
- 공개 글 목록에 존재하는 경로만 조회·공개한다. 쿼리 문자열은 제외하고 끝 슬래시 유무의 조회를 합친다.
- 날짜는 한국 시간 기준이다. GA 속성의 보고 시간대를 `Asia/Seoul`로 맞춰야 하며 다른 시간대의 응답은 표시하지 않는다.
- 서버 캐시는 15분, 화면은 15분 간격과 탭 복귀 시 갱신한다. 자정에는 전날의 숫자를 숨기고 다시 조회한다. GA 자체 처리 지연은 별도로 존재한다.
- 인증 미설정·API 오류·불완전하거나 임계값으로 제한된 보고서는 숫자를 숨긴다. 조회 실패를 0으로 표시하지 않는다. 정상적으로 조회한 결과가 비어 있을 때만 0으로 표시한다.

## 서버 인증 설정

현재 확인한 블로그 속성은 **KBSL's Blog → blog / 430656761**이다. `G-GZDS0N484J`는 수집용 측정 ID이며 조회 API 인증용이 아니다.

1. 접근 가능한 네트워크에서 Google Cloud 프로젝트의 **Google Analytics Data API**를 활성화한다.
2. 블로그 통계 조회 전용 서비스 계정을 만든다. GA 조회만을 위해 Google Cloud 프로젝트의 소유자/편집자 역할을 부여할 필요는 없다.
3. GA 관리 → 해당 속성의 액세스 관리에서 서비스 계정 이메일에 **뷰어** 역할을 부여한다. 서비스 계정에는 사용자 초대 알림이 필요 없다.
4. 서비스 계정의 JSON 자격 증명을 Vercel 프로젝트의 **Production 서버 환경변수**에 저장한다.

| 환경변수 | 값 |
|---|---|
| `GA_PROPERTY_ID` | `430656761` (생략 시 이 속성 사용) |
| `GA_SERVICE_ACCOUNT_JSON` | 서비스 계정 JSON 문서 전체. 공개 변수로 만들지 않는다. |

자격 증명을 소스나 `NEXT_PUBLIC_*`에 넣지 않는다. 로컬 검증 시에만 Git에서 제외된 `.env.local`을 사용한다. 서버 구현은 JSON의 `client_email`과 `private_key`만 읽으며, JSON에 포함된 임의의 엔드포인트는 사용하지 않는다. 인증 범위는 `analytics.readonly`다.

5. Vercel 환경변수 적용 후 재배포한다.
6. `/api/analytics`에서 `available: true`, 날짜·오늘 방문자·글별 조회 수가 반환되는지 확인한다. 비밀키·토큰·GA 원본 보고서는 응답에 포함하지 않는다.
7. GA 탐색 보고서에서 같은 날짜·호스트·지표·글 경로로 비교한다. 실시간 보고서는 최근 30분 범위여서 오늘 합계와 직접 비교하지 않는다.

## 현재 검증 범위

한국 날짜 경계, 조회 지표·호스트 필터, 경로별 합산, 비공개 경로 제외, 빈 정상 응답과 오류 구분, 보고서 누락·제한 및 시간대 불일치를 테스트한다. 인증 미설정 상태에서는 화면에 가짜 수치를 출력하지 않는다.

2026-09-07 작업 환경에서 Google Cloud 콘솔이 티머니 비업무사이트 차단 정책으로 차단된 것을 확인했다. 이 환경에서 새 서비스 계정 생성과 실데이터 인증은 완료하지 못했다. 코드 검증과 실제 GA 계정 연결 완료를 구분해야 한다.

## 공식 문서

- [Data API 시작하기와 조회 권한](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart)
- [batchRunReports](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports)
- [지표·측정기준](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [보고 데이터의 차이와 처리 지연](https://developers.google.com/analytics/devguides/reporting/data/v1/reporting-data-expectations)
