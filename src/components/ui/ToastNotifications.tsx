"use client"

import { ToastContainer } from "react-toastify"
import { useCoreStore } from "@lib/stores/store"
import "@styles/toast.scss"

/** Loaded on the first notification and retained across client navigation. */
export default function ToastNotifications() {
    const darkMode = useCoreStore((state) => state.darkMode)
    return <ToastContainer position="bottom-right" autoClose={4000} theme={darkMode ? "dark" : "light"} />
}
