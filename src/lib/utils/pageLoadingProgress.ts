import NProgress from "nprogress"

let pendingLoads = 0

// Nested Suspense fallbacks share one bar; only the last completion ends it.
export function beginPageLoading(): () => void {
    if (pendingLoads++ === 0) {
        NProgress.configure({ showSpinner: false, minimum: 0.12, trickleSpeed: 240 })
        NProgress.start()
    }
    let finished = false
    return () => {
        if (finished) return
        finished = true
        pendingLoads -= 1
        if (pendingLoads === 0) NProgress.done()
    }
}
