# Pretendard 로딩

`src/styles/font.scss`만 Pretendard를 선언한다. `layout.tsx`에서 `next/font/local`을 함께 사용하거나 전체 폰트를 preload하면 중복 다운로드가 다시 생긴다. 전역 Sass 폰트 변수는 같은 `Pretendard` family와 시스템 sans-serif 대체 글꼴을 사용한다. `font-display: swap`은 유지한다.

## 배포 파일과 문자 보존

- [공식 Pretendard v1.3.9](https://github.com/orioncactus/pretendard/tree/v1.3.9)의 가변 다이나믹 서브셋 92개를 `/font/pretendard-1.3.9/`에서 자체 호스팅한다. 브라우저 실행 시 외부 CDN에 의존하지 않는다.
- 기존 원본 `public/font/PretendardVariable.woff2`는 공식 v1.3.9 원본과 SHA256가 일치한다: `9599f12fd42fc0bce1cd50b47a0c022e108d7aa64dd0d1bb0ed44f3282d900b4`.
- 공식 분할 파일은 수정하지 않는다. CSS에서는 family와 URL만 사이트에 맞춰 바꾼다. 원본과 분할 파일의 가변 weight 축은 같다. CSS weight 범위는 공식 선언인 45–920을 따른다.
- 공식 분할 CSS는 원본의 14,336개 codepoint 중 2,307개를 선언하지 않는다. 확장 라틴, 그리스어, 기호 등 이 문자에만 기존 원본 파일을 요청하는 별도 `unicode-range` 선언을 추가했다. 92개 분할과 원본 fallback 범위는 겹치지 않는다. 본문에서 추출한 문자 목록으로 글꼴을 잘라내지 않는다.
- 원본 2,057,688바이트를 두 경로로 항상 요청하던 방식과 달리 화면에 등장하는 문자에 해당하는 청크만 요청한다. 92개 전체 합계는 2,957,724바이트지만 한 화면에서 모두 요청하지 않는다. 희귀문자가 필요한 화면은 원본도 요청하므로 해당 페이지의 절감량은 작아질 수 있다. 실제 요청량은 화면 텍스트와 브라우저로 검증한다.
- 원본과 분할 파일 모두 [SIL OFL 1.1](https://github.com/orioncactus/pretendard/blob/v1.3.9/LICENSE)이며 `public/font/OFL.txt`에 공식 라이선스를 그대로 보관한다.

## 재현과 검증

생성 결과를 저장소에 포함하므로 일반 Next.js 빌드에 Python이나 추가 npm 의존성은 필요하지 않다. 업데이트/검증 시 Python에 `fonttools[woff]==4.61.1`을 설치한다. 이번 검증의 Brotli 버전은 1.2.0이다.

```sh
python -m pip install 'fonttools[woff]==4.61.1'
python scripts/sync-pretendard.py --download --verify
```

다운로드는 공식 v1.3.9 경로를 사용하며, 저장된 `manifest.json`의 SHA256와 다르면 중단한다. 기존 자산으로 CSS만 다시 만들 때는 네트워크 없이 실행한다.

```sh
python scripts/sync-pretendard.py --generate --verify
```

검증은 분할 파일의 실제 cmap과 CSS unicode-range의 교집합을 합친 후 원본 fallback 범위를 더해 원본 14,336개 문자를 모두 지원하는지 확인한다. 모든 파일의 SHA256, weight 축, 라이선스도 확인한다. 시스템 Python 대신 별도 경로에 설치한 fontTools를 사용할 때는 `--fonttools-path PATH`를 지정한다. 공식 자산 버전을 바꾸는 경우에는 고정 URL과 원본 SHA256, manifest를 함께 명시적으로 검토한다.
