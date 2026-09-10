import { beforeEach, describe, expect, it, vi } from "vitest"

beforeEach(() => vi.resetModules())

describe("deferred notification activation", () => {
    it("retains a toast emitted before the provider subscribes", async () => {
        const store = await import("./toastNotificationStore")
        expect(store.getToastRequested()).toBe(false)
        store.requestToastNotifications()
        const unsubscribe = store.subscribeToastNotifications(vi.fn())
        expect(store.getToastRequested()).toBe(true)
        expect(store.getServerToastRequested()).toBe(false)
        unsubscribe()
    })

    it("activates once and retains the container across later notifications", async () => {
        const store = await import("./toastNotificationStore")
        const listener = vi.fn()
        const unsubscribe = store.subscribeToastNotifications(listener)
        store.requestToastNotifications()
        store.requestToastNotifications()
        expect(listener).toHaveBeenCalledTimes(1)
        unsubscribe()
        store.requestToastNotifications()
        expect(listener).toHaveBeenCalledTimes(1)
        expect(store.getToastRequested()).toBe(true)
    })
})
