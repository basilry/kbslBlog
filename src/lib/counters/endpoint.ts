export function counterEndpoint(route: "visit" | "stats" | "views"): string {
    const configured = process.env.NEXT_PUBLIC_COUNTER_API_URL || "https://kbsl-blog-counter.basbot.workers.dev/count"
    return `${configured.replace(/\/(?:count|visit|stats|views)\/?$/, "").replace(/\/$/, "")}/${route}`
}
