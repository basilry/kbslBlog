export type SocialProvider = "google" | "kakao"
export interface CommunityOptions { enabled: boolean; providers: SocialProvider[] }
export interface CommunityComment {
    id: string
    parentId: string | null
    name: string
    body: string
    status: "visible" | "deleted" | "hidden"
    createdAt: string
    updatedAt: string
    mine: boolean
    author: boolean
    reported: boolean
    reportCount: number
    replies?: CommunityComment[]
}
export interface CommunityState {
    likes: number
    liked: boolean
    commentCount: number
    comments: CommunityComment[]
    hasMore: boolean
    user: { name: string; moderator: boolean } | null
}
export type CommunityAction = "like" | "create" | "edit" | "delete" | "report" | "hide" | "restore"
