# 깃헙 개인 블로그 프로젝트 진행

by Kim Basilri.

<br/>

### 프로젝트 시작일
- 2023.09.03

<br/>

### 프로젝트 설명
- 처음에는 네이버 블로그로 TIL과 개인적인 일기를 작성하고 있었고, 회사 취직 이후에는 여러 번 개인 사이트를 만들어보려고 시도를 하였으나 여유가 없어 시도만 하고 완료하지 못했습니다. 이제 만 2년차가 되어서야 진심으로 실천에 옮기려 합니다. 프론트와 백, 그리고 인프라까지 모두 제 손으로 처음부터 끝까지 만들어 보겠습니다.

<br/>

### 전체 기술스택
- F/E
  - Next.js 13, TypeScript
  - zustand, scss(Sass), axios
  - classNames, lodash
  - Prettier, Eslint
- B/E
  - Java, Spring-Boot, JPA
  - Redis, MySQL
- Infra
  - EC2, S3, RDS
  - CloudFront, Route 53
  - PM2
- Analyze
  - Sentry
  - Google Analytics
- Tool
  - F/E - Intellij
  - B/E - Intellij, DBeaver

<br/>

### 프로젝트 계획 플로우
- [x] 프로젝트 구조 잡기
  - [x] 레포생성
  - [x] 프로젝트 기술스택 확정
  - [x] 계획일정 작성
- F/E
  - [x] 기본 프로젝트 개발환경 설정
    - [x] 라이브러리 및 필요 스택 설치
    - [x] eslint, prettier관련 json 설정
    - [x] 에디터 관련 라이브러리 찾기 및 설치
  - [x] 폴더 및 파일 구조 구성하기
    - app
      - 대메뉴
        - 소메뉴
          - page.tsx, ~~container.tsx
      - page.tsx
      - layout.tsx
      - Authentication.tsx
    - components
      - atom, molecule
    - interface
      - IUser.ts
    - lib
      - common.ts, store.ts, axiosInstance.ts..
    - service
      - getDataService.ts, loginService.ts..
    - stores
      - loginStore.ts..
    - styles
      - components
        - atom, molecule
      - layout
        - layout.module.scss
      - pages
  - [ ] 공통 레이아웃 구성하기
    - [x] Header
      - [ ] 메인링크, 공지사항, white/black 버전 버튼, 로그인 버튼, 개별 유저 프로필 사진(클릭시 유저정보)
    - [ ] Sidebar
      - [ ] 검색 인풋, 메뉴 목록, 방문자 수, 월간 방문자 그래프, 기부버튼
    - [ ] Footer
      - [ ] copyright, 깃헙 링크, 로켓펀치 링크, 링크드인 링크
  - [ ] 공통 컴포넌트 구성하기
    - [ ] Input, Button, Textarea..
  - [ ] 페이지 구성하기
    - [ ] Main
    - [ ] Login
    - [ ] SignUp
    - [ ] Introduce
    - [ ] UserDetail
    - [ ] PostingList
    - [ ] NewPost
    - [ ] PostDetail
    - [ ] GuestBook
    - [ ] GuestAnalyze
    - [ ] Error
- B/E
  - [ ] 레이아웃 잡기
  - [ ] xml 구성하기
  - [ ] 보안요소 구성하기
- Infra
  - [ ] VPC, 라우팅 테이블, EC2 구성하기(F/E, B/E용으로 각 1개 씩)
  - [ ] RDS 환경 설정 및 DB 툴 연결
  - [ ] EC2 내부 프로젝트 런칭 환경 설정
  - [ ] S3 및 CloudFront 연계 설정


<br/>

### 진척과정
- 2023.09.03
  - 프로젝트 기술스택 초안 설정
  - F/E 프로젝트 레포 구성
  - Next.js 13 버전 설치 및 필수 라이브러리 설치
  - 전체 계획 흐름 작성
  - prettier, eslint 설정 파일 작성


- 2023.09.09
  - 에디터 라이브러리 확정 및 설치 - quill
  - axiosInstance.ts 파일 생성 및 axios 기본 설정
    - 로그인 관련 api service 및 store 추가
  - 전체 프로젝트 레이아웃 구성
    - Layout.tsx 
    - Header.tsx, Sidebar.tsx, Footer.tsx, Loading.tsx
  - 네이버 무료폰트 적용 - 마루부리
