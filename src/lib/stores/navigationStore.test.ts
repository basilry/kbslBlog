import { afterEach, describe, expect, it, vi } from "vitest"
import { useNavigationStore } from "./navigationStore"

const subscriptions: Array<() => void> = []
afterEach(() => {
    subscriptions.splice(0).forEach((unsubscribe) => unsubscribe())
    useNavigationStore.getState().setOpen(false)
    vi.unstubAllGlobals()
})

describe("sidebar update isolation", () => {
    it("does not notify content/theme/auth subscribers or write persisted settings", async () => {
        const write = vi.fn()
        vi.stubGlobal("localStorage", { getItem: () => null, setItem: write, removeItem: vi.fn() })
        const { useCoreStore, useLoginStore } = await import("./store")
        const coreChanged = vi.fn()
        const loginChanged = vi.fn()
        subscriptions.push(useCoreStore.subscribe(coreChanged), useLoginStore.subscribe(loginChanged))
        useNavigationStore.getState().setOpen(true)
        useNavigationStore.getState().setOpen(false)
        expect(coreChanged).not.toHaveBeenCalled()
        expect(loginChanged).not.toHaveBeenCalled()
        expect(write).not.toHaveBeenCalled()
    })

    it("notifies only for real open/close transitions and keeps the action stable", () => {
        const changed = vi.fn()
        subscriptions.push(useNavigationStore.subscribe(changed))
        const { setOpen } = useNavigationStore.getState()
        setOpen(false)
        setOpen(true)
        setOpen(true)
        setOpen(false)
        setOpen(false)
        expect(changed).toHaveBeenCalledTimes(2)
        expect(useNavigationStore.getState().setOpen).toBe(setOpen)
    })
})
