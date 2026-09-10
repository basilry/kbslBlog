// Keep the request even when a child emits a toast before Providers subscribes.
let requested = false
const listeners = new Set<() => void>()

export function requestToastNotifications() {
    if (requested) return
    requested = true
    listeners.forEach((listener) => listener())
}

export const getToastRequested = () => requested
export const getServerToastRequested = () => false
export function subscribeToastNotifications(listener: () => void) {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
}
