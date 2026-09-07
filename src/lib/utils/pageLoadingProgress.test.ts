import { afterEach, describe, expect, it, vi } from "vitest"
import NProgress from "nprogress"
import { beginPageLoading } from "./pageLoadingProgress"

vi.mock("nprogress", () => ({ default: { configure: vi.fn(), start: vi.fn(), done: vi.fn() } }))
const finishers: Array<() => void> = []
afterEach(() => {
    finishers.splice(0).forEach((finish) => finish())
    vi.clearAllMocks()
})

describe("page loading progress lifecycle", () => {
    it("keeps the bar running while any nested fallback is still visible", () => {
        const outer = beginPageLoading()
        const inner = beginPageLoading()
        finishers.push(outer, inner)
        expect(NProgress.start).toHaveBeenCalledTimes(1)
        outer()
        expect(NProgress.done).not.toHaveBeenCalled()
        inner()
        expect(NProgress.done).toHaveBeenCalledTimes(1)
    })

    it("cleans up once and starts normally on the next navigation", () => {
        const first = beginPageLoading()
        finishers.push(first)
        first()
        first()
        expect(NProgress.done).toHaveBeenCalledTimes(1)
        const next = beginPageLoading()
        finishers.push(next)
        expect(NProgress.start).toHaveBeenCalledTimes(2)
        next()
        expect(NProgress.done).toHaveBeenCalledTimes(2)
    })
})
