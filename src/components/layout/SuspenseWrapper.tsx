import { Suspense } from "react"
import RootLoading from "@app/loading"

const SuspenseWrapper = ({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element => {
    return <Suspense fallback={<RootLoading />}>{children}</Suspense>
}

export default SuspenseWrapper
