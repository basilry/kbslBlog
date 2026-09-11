import { languageTag, localeHref, type Locale } from "./i18n/config"
import { translateText } from "./i18n/translate"
import type { Metadata } from "next"
import { SITE_URL, type PublicPostSummary } from "./content/types"
import projectDetails from "./json/projectDetails.json"
import { postCategoryLabel, postListHref, type PostCategoryFilter } from "./content/categories"

export const publicPages = {
    "/": { title: "김바실리 — 개발 기록과 프로젝트", description: "웹 개발부터 AI까지, 직접 만들고 운영하며 배운 내용을 기록합니다." },
    "/post": { title: "글", description: "개발과 제품을 만들며 배운 내용을 기록합니다." },
    "/projects": { title: "프로젝트", description: "김바실리가 참여한 웹 서비스와 AI 프로젝트의 개발 배경, 담당 업무, 기술 스택과 성과를 소개합니다." },
    "/introduce": { title: "개발자 김바실리 소개", description: "개발자 김바실리의 성장 과정, 개발 철학과 앞으로 만들고 싶은 서비스를 소개합니다." },
    "/career": { title: "개발 경력", description: "김바실리의 웹 개발 경력과 프로젝트 참여 이력입니다. 프론트엔드와 백엔드 개발 경험을 정리했습니다." },
    "/research": { title: "연구·학습 기록", description: "웹 개발과 소프트웨어 기술에 관한 김바실리의 발표, 연구개발 및 학습 자료를 모았습니다." },
    "/certification": { title: "자격증·교육 수료", description: "김바실리가 취득한 자격증과 교육 수료 이력을 정리했습니다." },
} as const

export function languageAlternates(path: string) {
    return { ko: new URL(localeHref(path, "ko"), SITE_URL).href, en: new URL(localeHref(path, "en"), SITE_URL).href, "x-default": new URL(path, SITE_URL).href }
}

export function pageMetadata(path: string, title: string, description: string, locale?: Locale): Metadata {
    const url = new URL(locale ? localeHref(path, locale) : path, SITE_URL).href
    const image = { url: `${SITE_URL}/myFace.png`, alt: locale === "en" ? "Basilri Kim" : "김바실리" }
    return {
        title,
        description,
        alternates: { canonical: url, ...(locale ? { languages: languageAlternates(path) } : {}), types: { "application/rss+xml": `${SITE_URL}${locale ? localeHref("/feed.xml", locale) : "/feed.xml"}` } },
        openGraph: { type: "website", url, title, description, siteName: "basilry.kim", locale: locale === "en" ? "en_US" : "ko_KR", images: [image] },
        twitter: { card: "summary", title, description, images: [image.url] },
    }
}

export function staticPageMetadata(path: keyof typeof publicPages, locale?: Locale): Metadata {
    const { title, description } = publicPages[path]
    return pageMetadata(path, translateText(title, locale ?? "ko"), translateText(description, locale ?? "ko"), locale)
}

export function projectMetadata(slug: string, locale?: Locale): Metadata {
    const project = projectDetails.find((item) => item.slug === slug)
    if (!project) throw new Error(`Missing project metadata: ${slug}`)
    return pageMetadata(`/projects/${slug}`, translateText(project.title, locale ?? "ko"), translateText(project.description, locale ?? "ko"), locale)
}

export function postListMetadata(page: number, category: PostCategoryFilter = "all", locale?: Locale): Metadata {
    const { description } = publicPages["/post"]
    const title = locale === "en" ? (category === "all" ? "Posts" : `${postCategoryLabel(category, locale)} posts`) : category === "all" ? "글" : `${postCategoryLabel(category)} 글`
    return pageMetadata(postListHref(page, category), page === 1 ? title : locale === "en" ? `${title} · Page ${page}` : `${title} · ${page}페이지`, translateText(description, locale ?? "ko"), locale)
}

export function blogPosting(post: PublicPostSummary) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `${SITE_URL}${post.href}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${post.href}` },
        datePublished: post.publishedAt,
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        ...(post.thumbnail ? { image: [new URL(post.thumbnail, SITE_URL).href] } : {}),
        author: { "@type": "Person", name: post.locale === "en" ? "Basilri Kim" : "김바실리", url: `${SITE_URL}${post.locale ? localeHref("/introduce", post.locale) : "/introduce"}` },
        inLanguage: languageTag(post.locale ?? "ko"),
        keywords: post.tags.join(", "),
        ...(post.category ? { articleSection: postCategoryLabel(post.category, post.locale ?? "ko") } : {}),
    }
}

// Escape HTML-sensitive characters so article text cannot close the script element.
export function serializeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c")
}
