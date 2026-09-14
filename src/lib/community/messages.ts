import type { Locale } from "@lib/i18n/config"

const ko = {
    like: "좋아요", liked: "좋아요 취소", likeHint: "이 글이 도움이 되었다면 좋아요를 남겨 주세요.",
    likeSaved: "좋아요를 반영했습니다.", likeRemoved: "좋아요를 취소했습니다.",
    comments: "댓글", loading: "불러오는 중…", retry: "다시 시도", empty: "첫 댓글을 남겨 주세요.",
    intro: "글을 읽고 떠오른 생각이나 질문을 남겨 주세요.", name: "공개 닉네임", namePlaceholder: "댓글에 표시할 이름",
    body: "댓글 내용", placeholder: "어떤 생각이 드셨나요?", submit: "댓글 남기기", saving: "저장 중…",
    google: "Google로 계속하기", kakao: "카카오로 계속하기", loginHint: "소셜 계정으로 로그인하면 댓글을 남길 수 있습니다.",
    privacy: "댓글과 닉네임은 공개됩니다. 이메일은 표시하지 않습니다.", logout: "로그아웃",
    reply: "답글", replying: "님에게 답글 작성 중", cancel: "취소", edit: "수정", save: "저장", remove: "삭제",
    deleteQuestion: "이 댓글을 삭제할까요? 답글은 남아 있습니다.", deleteConfirm: "댓글 삭제",
    deleted: "작성자가 삭제한 댓글입니다.", hidden: "관리자가 숨긴 댓글입니다.", edited: "수정됨", author: "블로그 작성자",
    report: "신고", reported: "신고됨", reportLabel: "신고 사유", spam: "스팸·광고", abuse: "욕설·괴롭힘", other: "기타",
    reportSubmit: "신고 보내기", reportSaved: "신고를 접수했습니다.", hide: "숨기기", restore: "다시 표시", reports: "신고",
    more: "이전 댓글 더 보기", legacy: "기존 GitHub 댓글 보기", legacyHint: "이전에 남긴 댓글은 그대로 보관되어 있습니다.",
    saved: "댓글을 저장했습니다.", removed: "댓글을 삭제했습니다.", changed: "변경 사항을 저장했습니다.",
    errors: {
        unavailable: "댓글과 좋아요를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        not_configured: "댓글 서비스를 준비하고 있습니다. 기존 GitHub 댓글은 아래에서 볼 수 있습니다.",
        unauthorized: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
        forbidden: "이 작업을 수행할 권한이 없습니다.", not_found: "해당 글이나 댓글을 찾을 수 없습니다.",
        conflict: "댓글이 변경되었습니다. 새로 불러온 내용을 확인하고 다시 수정해 주세요.",
        rate_limited: "요청이 많습니다. 1분 뒤 다시 시도해 주세요.", invalid_input: "닉네임과 댓글 내용을 확인해 주세요.",
        invalid_parent: "답글을 남길 수 없는 댓글입니다. 댓글 목록을 새로 불러와 주세요.",
        thread_full: "이 댓글의 답글이 가득 찼습니다. 새 댓글로 남겨 주세요.", too_large: "댓글은 2,000자까지 작성할 수 있습니다.",
        auth_failed: "로그인을 완료하지 못했습니다. 작성 중인 내용은 보관했습니다. 다시 시도해 주세요.",
        draft_unavailable: "작성 중인 댓글을 보관할 수 없습니다. 내용을 복사해 둔 뒤 빈 입력창에서 로그인해 주세요.",
    },
}
type Messages = { [K in keyof typeof ko]: K extends "errors" ? Record<keyof typeof ko.errors, string> : string }
const en: Messages = {
    like: "Like", liked: "Unlike", likeHint: "Found this useful? Leave a like.", likeSaved: "Like saved.", likeRemoved: "Like removed.",
    comments: "Comments", loading: "Loading…", retry: "Try again", empty: "Be the first to leave a comment.",
    intro: "Share a thought or ask a question about this post.", name: "Public nickname", namePlaceholder: "Name shown with your comment",
    body: "Your comment", placeholder: "What are your thoughts?", submit: "Post comment", saving: "Saving…",
    google: "Continue with Google", kakao: "Continue with Kakao", loginHint: "Sign in with a social account to leave a comment.",
    privacy: "Your comment and nickname are public. Your email is never displayed.", logout: "Sign out",
    reply: "Reply", replying: "Replying to", cancel: "Cancel", edit: "Edit", save: "Save", remove: "Delete",
    deleteQuestion: "Delete this comment? Replies will remain.", deleteConfirm: "Delete comment",
    deleted: "This comment was deleted by its author.", hidden: "This comment was hidden by a moderator.", edited: "Edited", author: "Blog author",
    report: "Report", reported: "Reported", reportLabel: "Reason for reporting", spam: "Spam or advertising", abuse: "Abuse or harassment", other: "Other",
    reportSubmit: "Send report", reportSaved: "Report received.", hide: "Hide", restore: "Restore", reports: "Reports",
    more: "Load earlier comments", legacy: "View previous GitHub comments", legacyHint: "Previously posted comments are still available here.",
    saved: "Comment saved.", removed: "Comment deleted.", changed: "Changes saved.",
    errors: {
        unavailable: "Couldn't load comments and likes. Please try again shortly.",
        not_configured: "Comments are being set up. Previous GitHub comments are available below.",
        unauthorized: "Your session has expired. Please sign in again.", forbidden: "You don't have permission to do this.",
        not_found: "This post or comment could not be found.", conflict: "This comment changed. Reload it before editing again.",
        rate_limited: "Too many requests. Please try again in a minute.", invalid_input: "Please check your nickname and comment.",
        invalid_parent: "Replies are no longer available for this comment. Please reload the comments.",
        thread_full: "This thread is full. Please start a new comment.", too_large: "Comments can contain up to 2,000 characters.",
        auth_failed: "Sign-in wasn't completed. Your draft has been kept. Please try again.",
        draft_unavailable: "Your draft couldn't be saved. Copy it somewhere safe, then clear the text before signing in.",
    },
}
export const communityMessages = (locale: Locale): Messages => locale === "en" ? en : ko
export function communityErrorMessage(error: unknown, locale: Locale) {
    const errors = communityMessages(locale).errors
    const code = error instanceof Error ? error.message : String(error)
    return errors[code as keyof typeof errors] ?? errors.unavailable
}
