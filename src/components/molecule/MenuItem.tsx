import Link from "next/link"
import TextBasic from "@components/atom/TextBasic"

const MenuItem = ({ menuName, krName }: IMenuItemProps): JSX.Element => {
    const menuPath = menuName.slice(0, 1).toLowerCase() + menuName.slice(1)

    return (
        <Link href={`/${menuPath}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <TextBasic bold="bold" size="xx-large">
                    {menuName}
                </TextBasic>
                {krName && (
                    <TextBasic bold="bold" size="large">
                        {krName}
                    </TextBasic>
                )}
            </div>
        </Link>
    )
}

export interface IMenuItemProps {
    menuName: string
    krName?: string
}

export default MenuItem
