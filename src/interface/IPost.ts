export interface IPost {
    id: number
    title: string
    thumbnail: string | File
    content: string
    createdAt: Date
    updatedAt: Date
    likeCount: number
}
