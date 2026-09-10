import { afterEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { createElement } from "react"
import { counterDay, type CounterSnapshot } from "@lib/counters/types"

import HeaderVisitorCounter from "./HeaderVisitorCounter"
import DarkModeBasic from "@components/atom/DarkModeBasic"

const counter = vi.hoisted(() => ({ darkMode: true, state: {} as { status: string; snapshot: CounterSnapshot | null } }))
vi.mock("@components/ui/VisitorCounter", () => ({ useVisitorCounterState: () => counter.state }))
vi.mock("@lib/stores/store", () => ({ useCoreStore: (select: (state: { darkMode: boolean }) => unknown) => select({ darkMode: counter.darkMode }) }))
const snapshot = (changes: Partial<CounterSnapshot> = {}): CounterSnapshot => ({
    available: true, date: counterDay(new Date(), "Asia/Seoul"), timeZone: "Asia/Seoul",
    updatedAt: new Date().toISOString(), todayViews: 24, totalViews: 1284, postViews: {}, ...changes,
})
const render = () => renderToStaticMarkup(createElement(HeaderVisitorCounter))
afterEach(() => { counter.darkMode = true })

describe("header visitor count", () => {
    it.each(["loading", "unavailable"])("keeps both metric slots without inventing zero for %s", (status) => {
        counter.state = { status, snapshot: null }
        const html = render()
        expect(html).toContain("오늘")
        expect(html).toContain("누적")
        expect(html.match(/>—<\/span>/g)).toHaveLength(2)
        expect(html).toContain(`aria-busy="${status === "loading"}"`)
        expect(html).not.toContain("방문 0명")
    })
    it("shows a real zero and supplies unabridged totals to assistive technology", () => {
        counter.state = { status: "ready", snapshot: snapshot({ todayViews: 0, totalViews: 123456 }) }
        const html = render()
        expect(html).toContain("오늘 방문 0명, 누적 방문 123,456명")
        expect(html).toContain(">12.3만</span>")
        expect(html).toContain(">0</span>")
    })
    it.each([
        { date: "2000-01-01" }, { todayViews: -1 }, { totalViews: NaN }, { totalViews: Number.MAX_SAFE_INTEGER + 1 },
    ])("does not show stale or invalid site statistics: %o", (changes) => {
        counter.state = { status: "ready", snapshot: snapshot(changes) }
        expect(render().match(/>—<\/span>/g)).toHaveLength(2)
    })
    it("renders both theme states with a keyboard-operable button and separate icons", () => {
        for (const darkMode of [false, true]) {
            counter.darkMode = darkMode
            const html = renderToStaticMarkup(createElement(DarkModeBasic))
            expect(html).toContain('<button type="button"')
            expect(html).toContain(`aria-pressed="${darkMode}"`)
            expect(html).toContain(darkMode ? "밝은 테마로 변경" : "어두운 테마로 변경")
            expect(html).toMatch(/class="[^"]*sun[^\"]*"/)
            expect(html).toMatch(/class="[^"]*moon[^\"]*"/)
        }
    })
})

