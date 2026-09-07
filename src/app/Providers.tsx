"use client"

import { useEffect, type ReactNode } from "react"
import { ToastContainer } from "react-toastify"
import Container from "@components/layout/Container"
import { useCoreStore, useLoginStore } from "@lib/stores/store"

export default function Providers({ children }: { children: ReactNode }) {
    const darkMode = useCoreStore((state) => state.darkMode)
    useEffect(() => {
        void useCoreStore.persist.rehydrate()
        void useLoginStore.persist.rehydrate()
    }, [])
    useEffect(() => { document.body.id = darkMode ? "darkMode" : "lightMode" }, [darkMode])
    return <Container>
        {children}
        <ToastContainer position="bottom-right" autoClose={4000} theme={darkMode ? "dark" : "light"} />
        <div id="modal-root" />
    </Container>
}
