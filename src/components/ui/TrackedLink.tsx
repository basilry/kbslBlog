"use client"

import Link from "next/link"
import type { ComponentProps } from "react"

type Props = ComponentProps<typeof Link> & { eventName: string; label: string }

export default function TrackedLink({ eventName, label, onClick, ...props }: Props) {
    return <Link {...props} onClick={(event) => {
        window.gtag?.("event", eventName, { content_id: label })
        onClick?.(event)
    }} />
}
