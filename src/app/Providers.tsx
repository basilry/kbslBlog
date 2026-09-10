"use client"

import { useEffect, type ReactNode } from "react"
import { VisitorCounterProvider } from "@components/ui/VisitorCounter"
import LazyToastNotifications from "@components/ui/LazyToastNotifications"
import Container from "@components/layout/Container"
import { useCoreStore } from "@lib/stores/store"

export default function Providers({ children }: { children: ReactNode }) {
    const darkMode = useCoreStore((state) => state.darkMode)
    useEffect(() => {
        void useCoreStore.persist.rehydrate()
    }, [])
    useEffect(() => { document.body.id = darkMode ? "darkMode" : "lightMode" }, [darkMode])
    return <VisitorCounterProvider><Container>
        {children}
        <LazyToastNotifications />
        <div id="modal-root" />
    </Container></VisitorCounterProvider>
}
