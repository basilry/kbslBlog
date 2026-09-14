# 게시 시각 기록

게시글의 날짜와 시각은 `publishedAt`에 시간대를 포함한 ISO 문자열로 저장한다. 화면에서는 언어와 관계없이 한국 시간(KST), 24시간제, 분 단위로 표시한다. 원문과 번역은 같은 글의 최초 발행 시각을 공유한다.

2026-09-14에 날짜만 있던 기존 공개 글 6개의 시각을 보완했다. 각 글이 처음 추가된 발행 커밋을 확인한 다음, GitHub에 기록된 Vercel의 성공 상태(`Deployment has completed`) 생성 시각을 사용했다. 본문과 기존 날짜는 보존했다. 영어 번역을 별도 글로 재발행한 시각으로 바꾸지는 않았다.

| 글 | 최초 배포 완료 시각(KST) | 확인한 발행 커밋의 배포 상태 |
| --- | --- | --- |
| ai-progress-and-my-next-income | 2026-09-07 14:36:47 | [a09543e](https://api.github.com/repos/basilry/kbslBlog/commits/a09543edba48ba507f4b8aa3beffd8f7ba8e5f82/status) |
| building-an-ai-fullstack-course | 2026-09-08 10:10:47 | [aef0eac](https://api.github.com/repos/basilry/kbslBlog/commits/aef0eac63c7c787d0ee8d8758055e6ff112136d3/status) |
| building-an-agent-market-with-astra-and-x402 | 2026-09-09 11:23:33 | [32fcff6](https://api.github.com/repos/basilry/kbslBlog/commits/32fcff65742eb9e9f81c7c23a851a68d33464070/status) |
| remote-work-autonomy-and-accountability | 2026-09-10 10:02:01 | [bc07796](https://api.github.com/repos/basilry/kbslBlog/commits/bc0779608b3da3d952a2b4cf426cce72f4dda060/status) |
| humanoid-personhood-and-democracy | 2026-09-10 15:22:08 | [cf32d89](https://api.github.com/repos/basilry/kbslBlog/commits/cf32d895c5ac51f18b42c8b96af2ee0a7c9475ae/status) |
| iphone-duo-cyborg-communication-security | 2026-09-11 10:54:49 | [5991fa0](https://api.github.com/repos/basilry/kbslBlog/commits/5991fa076c0e988362bd9414683f7338f7bfb682/status) |

앞으로 날짜만 적힌 새 초안을 발행할 때는 가져오기 도구가 발행 작업 시각을 기록한다. 기존 글을 수정할 때는 최초 발행 시각을 유지한다. 정확한 시각을 지정하거나 과거 글을 이전하는 방법은 [발행 문서](publishing.md)를 따른다. 날짜만 남은 자료에는 확인하지 않은 시간을 만들어 넣지 않는다.
