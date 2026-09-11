import { localizedFeed } from "@lib/content/feed"
import { pageLocale, type LocalePageProps } from "@lib/i18n/server"

export const dynamic = "force-dynamic"
export async function GET(_request: Request, { params }: LocalePageProps): Promise<Response> {
    return localizedFeed(await pageLocale(params))
}
