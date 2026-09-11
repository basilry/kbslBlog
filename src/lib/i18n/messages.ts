import type { Locale } from "./config"
const ko = {
    posts: "글", projects: "프로젝트", author: "김바실리", menu: "주 메뉴", openMenu: "메뉴 열기", closeMenu: "메뉴 닫기", quickLinks: "빠른 이동",
    categories: "카테고리", categoryHint: "관심 있는 주제부터 읽어보세요.", categoryNav: "포스팅 카테고리", allPosts: "전체 글", writing: "포스팅",
    searchTitle: "포스팅 검색", searchDescription: "제목, 본문, 태그에서 원하는 글을 찾아보세요.", writingDescription: "개발과 제품을 만들며 배운 내용을 기록합니다.",
    legacyOrder: "새 발행 글을 먼저 보여 드리고, 이전 글 보관함을 이어서 표시합니다.", clearSearch: "검색 지우기", results: "검색 결과", relevance: "관련도순 · 같은 관련도는 최신순", writingNote: "기록을 하나씩, 꾸준히.",
    truncated: "기존 글이 많아 최근 글 일부만 표시합니다.", noResults: "검색 결과가 없습니다", unavailable: "글을 불러올 수 없습니다", noCategoryPosts: "아직 이 주제의 글이 없습니다", noPosts: "공개된 글이 없습니다",
    searchSuggestion: "검색어를 줄이거나 다른 단어로 검색해 보세요.", retry: "잠시 후 이 페이지를 다시 열어 주세요.", otherCategories: "다른 카테고리에서 기록을 살펴보세요.", draftNotice: "초안은 준비가 끝난 뒤 이곳에 공개됩니다.",
    searchAll: "모든 카테고리에서 검색", viewAll: "전체 글 보기", postList: "글 목록", tags: "태그", pagination: "글 목록 페이지", previous: "이전", next: "다음",
    search: "검색", searchPlaceholder: "제목, 본문, 태그 검색", searchHint: "단어를 띄어 쓰면 모든 단어가 포함된 글을 찾습니다.", recentSearches: "최근 검색어", browserOnly: "이 브라우저에만 저장됩니다.", clearAll: "전체 삭제", noRecent: "최근 검색어가 없습니다.", loadingSearch: "검색을 준비하고 있습니다.",
    postNavigation: "이전 글과 다음 글", morePosts: "다른 글 읽기", previousPost: "이전 글", nextPost: "다음 글", firstPost: "첫 번째 글입니다.", latestPost: "가장 최근 글입니다.", comments: "댓글",
    contents: "이 글의 목차", contentsNav: "본문 목차", skip: "본문으로 바로가기", views: "조회수", loadingViews: "조회수를 불러오는 중입니다", unavailableViews: "조회수를 잠시 불러올 수 없습니다", checking: "확인 중…", cumulativeViews: "누적 열람 횟수 · 재방문과 새로고침 포함",
    today: "오늘", total: "누적", rss: "RSS 구독", language: "언어 선택",
}
const en: typeof ko = {
    posts: "Posts", projects: "Projects", author: "Basilri Kim", menu: "Main menu", openMenu: "Open menu", closeMenu: "Close menu", quickLinks: "Quick links",
    categories: "Categories", categoryHint: "Start with a topic that interests you.", categoryNav: "Post categories", allPosts: "All posts", writing: "Posts",
    searchTitle: "Search posts", searchDescription: "Find posts by title, body or tags.", writingDescription: "Notes on building software and products, and what I learn along the way.",
    legacyOrder: "New posts appear first, followed by the earlier archive.", clearSearch: "Clear search", results: "Search results", relevance: "By relevance, then newest first", writingNote: "One post at a time.",
    truncated: "Only some recent posts from the earlier archive are shown.", noResults: "No results found", unavailable: "Posts are unavailable", noCategoryPosts: "No posts in this category yet", noPosts: "No published posts yet",
    searchSuggestion: "Try fewer words or a different search term.", retry: "Please try this page again in a moment.", otherCategories: "Explore another category.", draftNotice: "Posts will appear here when they are ready to publish.",
    searchAll: "Search all categories", viewAll: "View all posts", postList: "Post list", tags: "Tags", pagination: "Post pagination", previous: "Previous", next: "Next",
    search: "Search", searchPlaceholder: "Search titles, text and tags", searchHint: "Separate words with spaces to find posts containing every word.", recentSearches: "Recent searches", browserOnly: "Saved in this browser only.", clearAll: "Clear all", noRecent: "No recent searches yet.", loadingSearch: "Preparing search…",
    postNavigation: "Previous and next posts", morePosts: "Read another post", previousPost: "Previous post", nextPost: "Next post", firstPost: "This is the first post.", latestPost: "This is the latest post.", comments: "Comments",
    contents: "On this page", contentsNav: "Article contents", skip: "Skip to content", views: "Views", loadingViews: "Loading views", unavailableViews: "Views are temporarily unavailable", checking: "Loading…", cumulativeViews: "Total page views, including return visits and reloads",
    today: "Today", total: "Total", rss: "Subscribe via RSS", language: "Choose language",
}
export const messages = (locale: Locale) => locale === "en" ? en : ko
