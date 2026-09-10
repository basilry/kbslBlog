# 공통 리소스 지연 로딩

- `PicsTemplate`만 사용하는 Swiper 기본/페이지네이션 CSS를 해당 컴포넌트로 옮겼다. 실제로 활성화하지 않은 Navigation/Scrollbar 모듈은 제거했다. 페이지네이션 색상과 위치는 프로젝트 CSS 모듈 내부로 이동했다.
- 알림 호출은 현재 비활성 관리 화면(Login, UserProfile, PostRegister)에만 있다. `Providers`는 작은 알림 요청 구독만 유지하며 첫 `toastCall`에서 ToastContainer와 CSS를 동적으로 불러온다. react-toastify 11.0.5의 컨테이너 등록 전 큐를 사용하므로 최초 알림도 표시된다. 컨테이너는 한 번 활성화되면 루트에 계속 남아 화면 이동 직후 성공 알림도 유지한다. 호출이 구독보다 빨라도 요청 상태를 저장한다.
- Google Analytics 초기화 큐를 `beforeInteractive`로 만들고 외부 gtag는 Next.js `lazyOnload`로 페이지 load 및 idle 이후 불러온다. `TrackedLink`는 기존 `window.gtag`를 그대로 호출해 다운로드 전 클릭을 큐에 넣는다. 최초 페이지 주소와 referrer는 초기화 시점 값을 기록한다. 기존 환경변수와 fallback 측정 ID를 유지한다. 극히 짧은 방문은 외부 분석 스크립트가 로드되기 전에 종료되어 집계되지 않을 수 있다.
- 특정 성능 측정 도구를 감지하는 분기는 없다. 공통 Container의 framer-motion은 독서 진행률에 사용 중이라 이번 변경에서는 유지했다.

루트 layout에 초기화 `Script`를 직접 배치하고 `DeferredAnalytics`는 외부 스크립트만 지연 로드한다. 기존 `GoogleAnalytics`, Toast CSS, Swiper CSS import를 제거했다. 종합 빌드와 실제 브라우저의 페이지네이션/알림/분석 검증은 통합 담당자가 진행한다.

초기 주소와 referrer를 영구 `config`에 넣으면 SPA 후속 이벤트에 오래된 값이 적용될 위험이 있어, 초기 `config`는 `send_page_view: false`만 지정한다. 최초 `page_view`를 별도 이벤트로 한 번 큐에 넣어 주소/referrer/제목을 이 이벤트에만 적용한다. Google 공식 문서에 따르면 Enhanced Measurement의 후속 history 이벤트는 `config`의 `send_page_view`와 독립적으로 발생하므로 기존 자동 SPA 탐색 측정 설정을 유지한다. 원격 gtag가 로드되기 전 빠르게 발생하는 중간 SPA 탐색은 자동 history 측정이 관찰하지 못할 수 있다.

근거: [Google Analytics 페이지뷰 측정](https://developers.google.com/analytics/devguides/collection/ga4/views), [SPA 측정](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).
