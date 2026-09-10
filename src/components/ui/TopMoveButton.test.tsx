import { afterEach, describe, expect, it, vi } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import TopMoveButton from "./TopMoveButton"

const state = vi.hoisted(() => ({ visible: false, darkMode: false }))
vi.mock("react", async (importOriginal) => ({
    ...await importOriginal<typeof import("react")>(),
    useEffect: () => {},
    useState: () => [state.visible, () => {}],
}))
vi.mock("@lib/stores/store", () => ({ useCoreStore: (select: (state: { darkMode: boolean }) => unknown) => select({ darkMode: state.darkMode }) }))
afterEach(() => vi.unstubAllGlobals())

describe("back to top control", () => {
    it("is hidden near the top, and exposes an accessible icon button after scrolling", () => {
        state.visible = false
        expect(renderToStaticMarkup(createElement(TopMoveButton))).toContain('hidden=""')
        state.visible = true
        const html = renderToStaticMarkup(createElement(TopMoveButton))
        expect(html).not.toContain('hidden=""')
        expect(html).toContain('aria-label="페이지 맨 위로"')
        expect(html).toContain('aria-hidden="true"')
        expect(html).not.toContain('>Top<')
    })
    it.each([false, true])("honors reduced motion: %s", (reduced) => {
        const scrollTo = vi.fn()
        vi.stubGlobal("window", { scrollTo, matchMedia: () => ({ matches: reduced }) })
        TopMoveButton().props.onClick()
        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: reduced ? "instant" : "smooth" })
    })
})
