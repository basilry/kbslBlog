---
title: "Markdown 발행 흐름 미리보기"
slug: publishing-pipeline-preview
description: "옵시디언에서 한 편씩 검증하고 공개하는 새 발행 흐름의 비공개 예시입니다."
publishedAt: "2026-09-07"
tags:
  - publishing
  - markdown
draft: true
---

이 파일은 발행 형식을 보여 주는 **비공개 초안**입니다. `draft: true`인 동안 글 목록, 상세 경로, sitemap, feed에 나타나지 않습니다.

## 한 편씩 선택합니다

발행 스크립트는 `--source`로 지정한 Markdown 파일 하나만 읽습니다. 기본 실행은 검증 결과만 출력하며 저장소 파일을 바꾸지 않습니다.

## 공개는 명시적으로 선택합니다

`--write`는 초안으로 가져오고, `--publish`를 직접 지정한 경우에만 `draft: false`로 가져옵니다. 가져오기 이후의 배포는 별도 작업입니다.
