"use client"

import { useEffect, useState } from "react"
import nProgress from "nprogress"

const RootLoading = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false)
    const handleLoading = (): nProgress.NProgress => nProgress.start()
    const doneLoading = (): nProgress.NProgress => nProgress.done()

    useEffect(() => {
        setIsLoading(true)
        handleLoading()
    }, [])

    useEffect(() => {
        if (isLoading) {
            setIsLoading(false)
            doneLoading()
        }
    }, [isLoading])

    return <div style={{ minHeight: "100vh", height: "100vh" }}></div>
}

export default RootLoading
