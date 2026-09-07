"use client"

import { useSyncExternalStore } from "react"
import { useLoginStore } from "@lib/stores/store"

function subscribe(notify: () => void) {
    const start = useLoginStore.persist.onHydrate(notify)
    const finish = useLoginStore.persist.onFinishHydration(notify)
    return () => { start(); finish() }
}

export function useLoginHydrated() {
    return useSyncExternalStore(subscribe, () => useLoginStore.persist.hasHydrated(), () => false)
}
