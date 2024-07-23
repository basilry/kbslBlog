import SuspenseWrapper from "@components/layout/SuspenseWrapper"

const layout = ({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element => {
    return <SuspenseWrapper>{children}</SuspenseWrapper>
}

export default layout
