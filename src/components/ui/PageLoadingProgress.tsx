"use client"

import { useEffect } from "react"
import { beginPageLoading } from "@lib/utils/pageLoadingProgress"

export default function PageLoadingProgress() {
    useEffect(() => beginPageLoading(), [])
    return null
}
