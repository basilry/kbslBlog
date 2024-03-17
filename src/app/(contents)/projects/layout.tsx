import SuspenseWrapper from "@components/layout/SuspenseWrapper"
import ProjectsNavigator from "@components/ui/ProjectsNavigator"

const layout = ({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element => {
    return (
        <SuspenseWrapper>
            <ProjectsNavigator />
            {children}
            <ProjectsNavigator />
        </SuspenseWrapper>
    )
}

export default layout
