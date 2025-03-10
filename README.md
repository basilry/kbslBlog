# 깃헙 개인 블로그 프로젝트 진행

by Kim Basilri.

<br/>

### 프로젝트 시작일

- 2023.09.03

<br/>

### 프로젝트 설명

- 처음에는 네이버 블로그로 TIL과 개인적인 일기를 작성하고 있었고, 회사 취직 이후에는 여러 번 개인 사이트를 만들어보려고 시도를 하였으나 여유가 없어 시도만 하고 완료하지 못했습니다. 이제 만 2년차가 되어서야
  진심으로 실천에 옮기려 합니다. 프론트와 백, 그리고 인프라까지 모두 제 손으로 처음부터 끝까지 만들어 보겠습니다.

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

- F/E 리팩토링 진행
    - [x] Main
    - [x] Career
    - [ ] Projects
- B/E 신규개발 진행
    - [ ] DB 스키마 및 ERD 설계
    - [ ] MySQL RDS 생성
    - [x] Spring-Boot 프로젝트 생성
    - [x] Spring Security 및 JWT 등 보안 설정
    - [x] JPA 설정 및 Entity 생성
    - [ ] 컨트롤러 및 서비스 파일 구성
    - [ ] F/E 연동
- AWS 인프라 EC2 셋팅
    - [x] F/E 배포
    - [ ] B/E 배포
- F/E 신규개발 진행
    - [ ] Login
    - [ ] PostWrite
    - [ ] PostList
    - [ ] PostDetail

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


- 2023.12.16 ~ 17
    - layout 개발 1차 완료
        - Header, Sidebar, Footer 개발 1차 완료
        - Header쪽 로그인, 유저프로필은 추후 개발 진행
        - Sidebar에 있는 메뉴리스트 각 페이지와 링크 연결 완료
        - Footer는 기능 없음. 단순 렌더
    - Main 페이지 개발 진행 중
        - 소개글, 커리어연도, 프로젝트 간략한 소개로 구성
        - 그 밑에 세미나 관련글, 블로그 글도 연동 예정


- 2024.03.01 ~ 03
    - 폰트 변경 - Pretendard
    - 메인 종결
    - Career 개발 1차 완료
    - Visitor 개발 완료
        - giscus 설치하여 방명록 생성
    - Projects 개발 1차 완료
    - 배포 진행
        - Github Pages로 정적 배포
        - next/Image 컴포넌트 깨짐현상으로 별도 라이브러리 적용
        - flow:
            - dev 개발 후 push
            - master PR
            - 완료시 자동 배포 및 gh-pages pull 후 배포 진행
    - 1차 개발 목표 도달


- 2025.02.07 ~
    - F/E 리팩토링 진행
        - Main
        - Career
    - B/E 신규개발 진행
        - Spring-Boot 프로젝트 생성
        - Spring Security 및 JWT 등 보안 설정
        - JPA 설정 및 Entity 생성
        - 컨트롤러 및 서비스 파일 구성
    - AWS 인프라 EC2 셋팅
        - F/E 배포
