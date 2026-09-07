# 옵시디언 Markdown 발행

새 발행 흐름은 옵시디언 보관함 전체를 동기화하지 않습니다. 선택한 Markdown 파일 한 개와 그 글이 실제로 참조하는 이미지 파일만 검증하고 가져옵니다. 사이트 배포, Git 커밋, 원격 저장소 반영은 이 스크립트가 수행하지 않습니다.

## 글 형식

글 앞부분에 다음 frontmatter를 둡니다.

```yaml
---
title: "글 제목"
slug: stable-lowercase-slug
description: "검색 결과와 글 목록에 표시할 한두 문장"
publishedAt: "2026-09-07"
tags:
  - nextjs
  - publishing
draft: true
---
```

`title`, `slug`, `description`, `publishedAt`, `tags`, `draft`가 기본 필드입니다. `updatedAt`, `project`, `thumbnail`은 선택 사항입니다. thumbnail은 HTTPS URL만 허용하며 로컬 이미지는 본문 첨부로 넣습니다. slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있고 기존 숫자 ID 글과 충돌하지 않도록 숫자만으로 만들 수 없습니다. 공개 주소는 `/post/{slug}`로 유지됩니다.

저장소의 [초안 예시](../content/posts/publishing-pipeline-preview.md)는 비밀 정보가 없는 형식 샘플이며 웹 공개 데이터 조회에서 제외됩니다. 실제 작업 중인 초안은 아래 `--write` 흐름으로 Git 제외 영역에 보관합니다.

## 검사와 미리보기

처음에는 쓰기 옵션 없이 실행합니다. 이 모드는 파일 하나와 첨부만 읽고 검증 결과를 출력합니다.

```powershell
node scripts/import-obsidian-post.mjs --source "C:\Notes\article.md"
```

옵시디언의 첨부 폴더가 글과 다른 위치라면 그 폴더를 정확히 지정합니다. 첨부 경로는 이 폴더 밖으로 나갈 수 없습니다.

```powershell
node scripts/import-obsidian-post.mjs --source "C:\Notes\article.md" --attachments-dir "C:\Notes\attachments"
```

로컬 HTML 미리보기는 저장소의 `.content-preview/{slug}/index.html`에 생성됩니다. 이 폴더는 Git에서 제외됩니다.

```powershell
node scripts/import-obsidian-post.mjs --source "C:\Notes\article.md" --attachments-dir "C:\Notes\attachments" --preview
```

스크립트는 옵시디언 이미지 문법 `![[photo.png]]`과 일반 Markdown 이미지 문법 `![설명](photo.png)`을 지원합니다. PNG, JPEG, GIF, WebP, AVIF만 복사합니다. SVG, 실행 파일, 데이터 URL, 절대 로컬 경로, 첨부 폴더를 벗어나는 경로는 거부합니다. 이미지 한 개는 10 MB, 한 글의 이미지 합계는 25 MB로 제한됩니다. 옵시디언 문서 링크 `[[다른 노트]]`는 공개 URL의 Markdown 링크로 먼저 바꿔야 합니다.

## 초안 가져오기와 공개 가져오기

초안으로 가져옵니다. 원본 frontmatter가 `draft: false`여도 `--write` 결과는 항상 `draft: true`입니다. 초안 본문과 첨부는 각각 `.content-drafts/posts`, `.content-drafts/assets/{slug}`에 보관됩니다. `.content-drafts`는 Git에서 제외되고 웹 서버도 제공하지 않습니다.

```powershell
node scripts/import-obsidian-post.mjs --source "C:\Notes\article.md" --attachments-dir "C:\Notes\attachments" --write
```

미리보기와 내용을 확인한 뒤 공개 대상으로 가져올 때만 `--publish`를 사용합니다. 이때만 첨부가 `public/content/{slug}`에 복사됩니다. 이 옵션은 로컬 콘텐츠 파일에 `draft: false`를 기록하지만 사이트를 배포하지는 않습니다.

```powershell
node scripts/import-obsidian-post.mjs --source "C:\Notes\article.md" --attachments-dir "C:\Notes\attachments" --publish
```

같은 slug의 파일이 이미 있으면 기본적으로 중단합니다. 기존 파일을 직접 검토한 뒤 갱신하려면 `--force`를 추가합니다. `--force`도 해당 slug의 파일과 새 첨부만 덮어쓰며 다른 글이나 첨부를 삭제하지 않습니다. 공개할 때는 옵시디언의 원본 노트를 다시 `--publish`로 지정합니다.

공개 전에는 다음을 확인합니다.

1. `/post/{slug}`에서 제목, 본문, 코드, 표, 이미지가 올바르게 보이는지 확인합니다.
2. `draft: false`인 글만 `/post`, `/sitemap.xml`, `/feed.xml`에 나타나고 공개 첨부 경로가 생성되는지 확인합니다.
3. 기존 숫자 주소 `/post/{id}`가 계속 열리는지 확인합니다.
4. 변경 파일을 검토하고 평소의 배포 절차를 별도로 실행합니다.

## 기존 HTML 글

기존 백엔드의 `/posts`와 `/posts/{id}` 계약은 유지됩니다. 읽기 서버는 응답 시간과 크기에 상한을 두고 HTML을 허용 목록으로 정제합니다. 일반 문단, 제목, 목록, 표, 코드, 밑줄, 위·아래 첨자, 강조와 YouTube 또는 YouTube nocookie HTTPS iframe을 지원합니다. 이벤트 속성, 스크립트, 임의 iframe은 제거합니다. 기존 서비스가 응답하지 않으면 로컬 공개 글은 계속 표시하고 기존 글 영역은 일시 장애로 안내합니다.

글 목록은 새 Markdown 발행 글을 먼저 두고 기존 글 보관함을 이어서 페이지로 조회합니다. 기존 글 보관함 자체에는 전체 페이지를 계속 탐색할 수 있는 제한이 없습니다. sitemap과 feed 생성은 요청 비용을 제한하기 위해 기존 글의 앞 5페이지, 최대 100개까지만 확인하며 feed에는 그중 최신 50개를 싣습니다. 글이 이 범위를 넘으면 목록과 직접 주소는 유지되지만 오래된 기존 글 일부가 sitemap이나 feed에 포함되지 않을 수 있습니다.
