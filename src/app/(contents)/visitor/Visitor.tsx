"use client"

import { ReactElement } from "react"
import Wrapper from "@components/layout/Wrapper"
import Giscus from "@components/ui/Giscus"

const Visitor = (): ReactElement => {
    return (
        <Wrapper>
            <Giscus />
        </Wrapper>
    )
}

export default Visitor
