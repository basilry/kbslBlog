import TextBasic from "@components/atom/TextBasic"

const MenuItem = ({ menuName, krName }: IMenuItemProps): JSX.Element => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <TextBasic bold="bold" size="xx-large">
                {menuName}
            </TextBasic>
            {krName && (
                <TextBasic bold="bold" size="medium">
                    {krName}
                </TextBasic>
            )}
        </div>
    )
}

export interface IMenuItemProps {
    menuName: string
    krName?: string
}

export default MenuItem
