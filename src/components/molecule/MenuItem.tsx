import Link from "next/link"
import TextBasic from "@components/atom/TextBasic"

const MenuItem = ({ menuName }: IMenuItemProps): JSX.Element => {
    const menuPath = menuName.slice(0, 1).toLowerCase() + menuName.slice(1)

    return (
        <Link href={`/${menuPath}`}>
            <TextBasic bold="bold" size="xx-large">
                {menuName}
            </TextBasic>
        </Link>
    )
}

export interface IMenuItemProps {
    menuName: string
}

export default MenuItem
