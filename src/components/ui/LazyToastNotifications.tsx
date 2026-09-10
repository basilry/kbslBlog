"use client"

import dynamic from "next/dynamic"
import { useSyncExternalStore } from "react"
import { getServerToastRequested, getToastRequested, subscribeToastNotifications } from "@lib/utils/toastNotificationStore"

const ToastNotifications = dynamic(() => import("./ToastNotifications"), { ssr: false })

export default function LazyToastNotifications() {
    const requested = useSyncExternalStore(subscribeToastNotifications, getToastRequested, getServerToastRequested)
    // react-toastify queues the first toast until its container registers.
    return requested ? <ToastNotifications /> : null
}
