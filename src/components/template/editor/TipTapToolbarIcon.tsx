"use client"

import { ReactElement } from "react"
import Image from "next/image"
import ButtonBasic from "@components/atom/ButtonBasic"

interface ITipTapToolbarIconProps {
    iconSrc: string
    onClick: () => void
}

const TipTapToolbarIcon = ({ iconSrc, onClick }: ITipTapToolbarIconProps): ReactElement => {
    return (
        <ButtonBasic onClick={onClick} type={"icon"}>
            <Image src={iconSrc} alt={"bold"} width={25} height={25} />
        </ButtonBasic>
    )
}

export default TipTapToolbarIcon
