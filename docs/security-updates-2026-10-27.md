# 2026-10-27 의존성 보안 업데이트

## 변경 결과

| 영역 | 패키지 | 이전 | 이후 | 관련 권고 |
| --- | --- | --- | --- | --- |
| 루트 | react, react-dom | 19.2.8 | 19.2.9 | GHSA-xqc2-xf4c-x3h3, GHSA-h3gv-c5rc-p453 |
| 루트 | @tiptap/* (32개) | ^2.11.5 | ^3.32.0 | GHSA-cp6q-959q-f8rh, prosemirror-view GHSA-c8x8-7fp4-3x9w, markdown-it 제거 |
| 루트 | sanitize-html | ^2.17.0 | ^2.18.1 | GHSA-x3q4-9hxx-gx8m, GHSA-374f-7chj-9948, GHSA-cv27-6wvh-8x7j, GHSA-c9rx-x947-fp3h |
| 루트 | axios (follow-redirects 1.16.2) | ^1.18.0 | ^1.20.0 | GHSA-x97p-jq2g-jp4f, GHSA-542g-h47m-68v8, GHSA-3pq3-5fj3-cg6v, GHSA-mghh-pgcx-3jjj, GHSA-q3jh-wrc6-jgq8, GHSA-8r9p-f939-6h3c |
| 루트 | vitest (vite 8.3.5) | ^4.0.0 | ^4.1.12 | GHSA-qxg6-89mg-rqv8, GHSA-xp26-3454-mjgp |
| Worker | wrangler (miniflare, undici, sharp) | 4.129.0 | 4.153.0 | sharp GHSA-wq5f-xc86-pv6w 등 |
| Worker | vitest | 4.1.11 | 4.1.12 | 위와 동일 |

- Next 16.4.2, sharp 0.35.5, Node 24.22.1 요구는 직전 커밋에서 이미 반영되어 있어 유지했습니다.
- lockfile 갱신으로 zod, brace-expansion, source-map-js 등 전이 의존성도 수정 버전으로 올라갔습니다.
- Tiptap 3 전환에 맞춰 `Editor.tsx`를 수정했습니다. StarterKit 3에 기본 포함된 Link·Underline은 기존 별도 설정을 유지하기 위해 끄고, TrailingNode도 기존 출력 유지를 위해 끕니다. `setContent`의 두 번째 인자는 `{ emitUpdate: false }`로 바꿨습니다. 웹 에디터는 현재 비활성 경로(`post/register`는 `notFound()`)입니다.

## 검증 (Node 24.22.1)

- `npm audit`: 루트 48개 -> 0개, Worker 8개 -> 0개.
- ESLint 오류 0개. 기존 이미지 최적화·Hook 의존성 경고 11개는 남아 있습니다.
- TypeScript 검사 통과, Vitest 21개 파일 102개 테스트 통과, Next 프로덕션 빌드 통과.
- Worker `npm run check` 통과: 타입 생성, tsc, 테스트 7개, `wrangler deploy --dry-run`.
- Tiptap 3 스키마 확인: 제목 에디터의 mark 구성이 기존과 같고, 본문 에디터의 확장 중복 경고가 없습니다.

## 제외한 항목

- next 16.4.3: 보안 수정이 없습니다.
- axios 1.21.0: 기본 헤더 동작이 바뀌는 변경을 포함합니다. 보안 수정은 1.20.0에 있습니다.
- GitHub Actions v4 -> v7, marked 18, swiper 14, TypeScript 7, html-react-parser 6: 보안 권고가 없는 메이저 업데이트입니다.

## 운영 확인

- 운영 반영은 `master` 머지 후 Vercel 배포로 이루어집니다. 배포 로그에서 Node 24.22.1과 빌드 성공을 확인합니다.
- Tiptap 에디터를 다시 활성화할 때는 링크·이미지·정렬 등 툴바 동작을 브라우저에서 별도로 확인합니다.
