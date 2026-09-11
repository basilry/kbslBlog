import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { LocaleProvider } from "@lib/i18n/context"
import LanguageSwitcher from "./LanguageSwitcher"
import LocaleLink from "./LocaleLink"

vi.mock("next/navigation", async original => ({
    ...await original<typeof import("next/navigation")>(),
    usePathname: () => "/en/search",
    useSearchParams: () => new URLSearchParams("q=mental+privacy&category=ai-agents&page=2"),
}))

describe("header language control", () => {
    it("renders both languages and preserves the current search in a native form", () => {
        const html = renderToStaticMarkup(<LocaleProvider locale="en"><LanguageSwitcher /></LocaleProvider>)
        expect(html).toContain('action="/language"')
        expect(html).toContain('value="/search?q=mental+privacy&amp;category=ai-agents&amp;page=2"')
        expect(html).toContain('value="en" lang="en" selected=""')
        expect(html).toContain("한국어")
        expect(html).toContain("English")
        expect(html).toContain("<noscript>")
    })
    it("retains English on public links and keeps external and asset links unchanged", () => {
        for (const [href, expected] of [["/post/article", "/en/post/article"], ["/projects", "/en/projects"], ["/feed.xml", "/en/feed.xml"], ["/ko/post/article", "/ko/post/article"], ["/content/image.webp", "/content/image.webp"], ["https://example.test", "https://example.test"]]) {
            const html = renderToStaticMarkup(<LocaleProvider locale="en"><LocaleLink href={href}>Link</LocaleLink></LocaleProvider>)
            expect(html).toContain(`href="${expected}"`)
        }
    })
})
