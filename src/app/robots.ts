import type { MetadataRoute } from "next"
import { SITE_URL } from "@lib/content"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Retired routes must remain crawlable so their permanent redirects can be seen.
                disallow: ["/api/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
