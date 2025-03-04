export interface ILogo {
    src?: string
    alt?: string
    width?: number
    height?: number
}

export interface IFile {
    lastModified?: number
    lastModifiedDate?: Date
    name?: string
    size?: number
    type?: string
    webkitRelativePath?: string
}

export interface IPagination<T> {
    content: T[]
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElement: number
    pageable: IPageable
    size: number
    sort: ISort
    totalElements: number
    totalPages: number
}

export interface IPageable {
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    sort: ISort
    unpaged: boolean
}

export interface ISort {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}
