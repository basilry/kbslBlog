# 🚀 basilry.kim | 프론트엔드

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13-black?style=flat-square&logo=next.js" alt="Next.js 13" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Zustand-4.x-8A2BE2?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/SCSS-1.x-CC6699?style=flat-square&logo=sass" alt="SCSS" />
  <img src="https://img.shields.io/badge/ESLint-8.x-4B32C3?style=flat-square&logo=eslint" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-3.x-F7B93E?style=flat-square&logo=prettier" alt="Prettier" />
  <img src="https://img.shields.io/badge/TipTap-2.x-13B5EA?style=flat-square" alt="TipTap" />
</p>

## 📝 프로젝트 소개

basilry.kim 프론트엔드는 Next.js 13 기반의 현대적인 블로그 웹 애플리케이션입니다. 심플하고 직관적인 UI/UX를 제공하며, 사용자 경험을 최우선으로 고려한 디자인을 갖추고 있습니다.

### 주요 특징
- ✅ 서버 사이드 렌더링(SSR)을 통한 빠른 초기 로딩
- ✅ 모바일 친화적인 반응형 디자인
- ✅ 다크 모드 지원
- ✅ 풍부한 마크다운 에디터
- ✅ 이미지 최적화 및 지연 로딩

## 🔧 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 13 (App Router)
- **언어**: TypeScript 5.x
- **상태 관리**: Zustand 4.x
- **스타일링**: SCSS (Sass), classNames
- **HTTP 클라이언트**: Axios
- **에디터**: TipTap
- **코드 품질**: ESLint, Prettier

### 개발 도구
- **IDE**: IntelliJ
- **패키지 관리**: npm
- **배포**: AWS EC2

## 📁 프로젝트 구조

```
src/
├── app/                   # Next.js 13 App Router
│   ├── (contents)/        # 주요 컨텐츠 페이지
│   │   ├── post/          # 포스트 관련 페이지
│   │   └── projects/      # 프로젝트 관련 페이지
│   ├── globals.css        # 전역 스타일
│   └── layout.tsx         # 루트 레이아웃
├── components/            # 재사용 가능한 컴포넌트
│   ├── atom/              # 기본 UI 컴포넌트
│   ├── layout/            # 레이아웃 관련 컴포넌트
│   ├── template/          # 템플릿 컴포넌트
│   └── ui/                # UI 관련 컴포넌트
├── interface/             # TypeScript 인터페이스
├── lib/                   # 유틸리티 함수 및 설정
│   ├── api/               # API 관련 코드
│   ├── stores/            # Zustand 스토어
│   └── utils/             # 유틸리티 함수
└── styles/                # 스타일 파일
    ├── components/        # 컴포넌트별 스타일
    └── pages/             # 페이지별 스타일
```

## 📚 주요 기능

### 네비게이션
- 반응형 헤더 및 사이드바
- 다크 모드 전환
- 사용자 인증 상태 표시

### 포스트 관련
- 포스트 목록 보기 (페이지네이션)
- 포스트 상세 보기
- 포스트 작성 및 수정 (TipTap 에디터)
- 이미지 업로드 및 크롭 기능
- 좋아요 기능

### 사용자 관련
- 로그인/로그아웃
- 프로필 관리
- 사용자별 작성 글 보기

## 🏃‍♂️ 시작하기

### 필수 조건
- Node.js 18 이상
- npm 9 이상

### 설치 방법
```bash
# 저장소 클론
git clone https://github.com/username/kbslBlog.git

# 디렉토리 이동
cd kbslBlog

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 운영 서버 실행
npm run pm2
```

### 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.


## 📅 개발 로드맵

### 완료된 작업
- ✅ 메인 페이지 리팩토링
- ✅ 경력 페이지 리팩토링
- ✅ 레이아웃 구성 (헤더, 사이드바, 푸터)
- ✅ 다크 모드 구현
- ✅ 포스트 목록 및 상세 페이지
- ✅ TipTap 에디터 구현
- ✅ 이미지 업로드 및 크롭 기능

### 진행 중인 작업
- 🔄 프로젝트 페이지 리팩토링
- 🔄 이미지 최적화
- 🔄 로그인 시스템 구현
- 🔄 포스트 작성 페이지

### 예정된 작업
- ⏳ 사용자 프로필 페이지
- ⏳ 검색 기능 개선
- ⏳ 성능 최적화
- ⏳ 댓글 시스템 구현

## 📝 개발 기록

### 2025년
- **3월 21일 ~ 3월 20일**
  - 이미지 프록시 URL 처리 로직 개선
  - 썸네일 이미지 크롭 기능 추가

- **3월 19일 ~ 3월 18일**
  - TipTap 에디터에 이미지 드래그 앤 드롭 기능 추가
  - 에디터 포커스 이슈 수정
  - lowlight 버전 업데이트 및 관련 코드 수정

- **3월 17일 ~ 3월 15일**
  - 포스트 목록 페이지에 로딩 인디케이터 추가
  - 포스트 상세 페이지 이미지 로딩 최적화
  - 좋아요 기능 구현

- **3월 14일 ~ 3월 13일**
  - 포스트 등록 페이지 구현
  - 이미지 업로드 컴포넌트 개발
  - TipTap 에디터 구글 드라이브 이미지 확장 구현

- **3월 12일 ~ 3월 11일**
  - 포스트 상세 페이지 구현
  - 마크다운 파싱 로직 구현
  - 이미지 로딩 플레이스홀더 추가

- **3월 10일 ~ 3월 9일**
  - 포스트 목록 페이지 구현
  - 페이지네이션 컴포넌트 개발
  - 썸네일 이미지 처리 로직 구현

- **3월 8일 ~ 3월 3일**
  - TipTap 에디터 초기 설정
  - 에디터 툴바 구현
  - 에디터 컨텐츠 저장 로직 구현

- **2월 27일 ~ 2월 7일**
  - 프로젝트 페이지 개발 1차 완료
  - 다크 모드 테마 구현
  - Zustand 상태 관리 세팅

- **2월 6일 ~ 2월 1일**
  - 경력 페이지 리팩토링 완료
  - 메인 페이지 리팩토링 완료
  - axios 인스턴스 설정 및 API 연동 준비

- **1월 31일 ~ 1월 25일**
  - AWS EC2 배포 설정
  - Next.js 13 앱 라우터 마이그레이션
  - 프로젝트 폴더 구조 재설계

### 2024년
- **3월 3일 ~ 3월 1일**
  - 방명록 기능 개발 완료 (giscus 활용)
  - 폰트 변경 - Pretendard
  - Github Pages 배포

- **1월 ~ 2월**
  - Career 페이지 개발
  - Visitor 페이지 개발
  - Projects 페이지 개발 1차 완료

### 2023년
- **12월 17일 ~ 12월 16일**
  - 레이아웃 개발 1차 완료
  - Header, Sidebar, Footer 개발

- **9월 9일**
  - 에디터 라이브러리 선택 - quill
  - axios 기본 설정
  - 전체 프로젝트 레이아웃 구성
  - 네이버 무료폰트 적용 - 마루부리

- **9월 3일**
  - 프로젝트 기술스택 초안 설정
  - Next.js 13 설치 및 필수 라이브러리 설치
  - prettier, eslint 설정

## 📜 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 기여자

- **basilry** - *초기 작업* - [GitHub](https://github.com/basilry)

---

<p align="center">© 2025 kbslBlog. All rights reserved.</p>
