import { getPublicPost } from "@lib/content/posts"
import { communityPostKey } from "@lib/community/config"
import { CommunityError, checkDatabaseError, communityClients, communityFailure, communityIdentity, communityJson, readCommunityJson } from "@lib/community/server"
import type { CommunityState } from "@lib/community/types"
import { networkIdentity } from "@lib/community/identity"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
type Context = { params: Promise<{ postId: string }> }

async function handle(request: Request, context: Context, write: boolean) {
    try {
        // Validate the request before any service-role operation. Never accept user IDs or counts from the browser.
        const payload = write ? await readCommunityJson(request) : null
        const { postId } = await context.params
        const postKey = communityPostKey(postId)
        if (!postKey) throw new CommunityError("not_found", 404)
        const post = await getPublicPost(postId)
        if (!post) throw new CommunityError("not_found", 404)
        const offset = write ? 0 : Number(new URL(request.url).searchParams.get("offset") ?? "0")
        if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) throw new CommunityError("invalid_input")
        const clients = await communityClients()
        const { user, browserHash } = await communityIdentity(clients)
        if (payload) {
            const actions = ["like", "create", "edit", "delete", "report", "hide", "restore"]
            if (typeof payload.action !== "string" || !actions.includes(payload.action)) throw new CommunityError("invalid_input")
            if (payload.action !== "like" && !user) throw new CommunityError("unauthorized", 401)
            // Whitelist fields; identity and post membership are supplied by this handler.
            const fields = Object.fromEntries(["id", "body", "name", "parentId", "updatedAt", "liked", "reason"].filter(key => key in payload).map(key => [key, payload[key]]))
            if (payload.action === "like") {
                if (typeof fields.liked !== "boolean") throw new CommunityError("invalid_input")
            } else {
                if (typeof fields.id !== "string" || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(fields.id)) throw new CommunityError("invalid_input")
                if (fields.parentId != null && (typeof fields.parentId !== "string" || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(fields.parentId))) throw new CommunityError("invalid_input")
                if (["create", "edit"].includes(payload.action) && (typeof fields.body !== "string" || !fields.body.trim() || fields.body.length > 2000)) throw new CommunityError("invalid_input")
                if (payload.action === "create" && (typeof fields.name !== "string" || !fields.name.trim() || fields.name.length > 30 || /[\u0000-\u001f\u007f]/.test(fields.name))) throw new CommunityError("invalid_input")
                if (payload.action === "edit" && (typeof fields.updatedAt !== "string" || !Number.isFinite(Date.parse(fields.updatedAt)))) throw new CommunityError("invalid_input")
            }
            const { error } = await clients.database.rpc("community_write", { p_post_key: postKey, p_browser_hash: browserHash, p_user_id: user?.id ?? null, p_action: payload.action, p_payload: fields, p_network_hash: networkIdentity(request, clients.config.cookieSecret) })
            checkDatabaseError(error)
        }
        const { data, error } = await clients.database.rpc("community_snapshot", { p_post_key: postKey, p_browser_hash: browserHash, p_user_id: user?.id ?? null, p_offset: offset })
        checkDatabaseError(error)
        if (!data) throw new CommunityError("unavailable", 503)
        const snapshot = data as Omit<CommunityState, "user"> & { displayName: string | null; moderator: boolean }
        return communityJson({
            likes: Number(snapshot.likes) + Math.max(0, post.likeCount), liked: snapshot.liked,
            commentCount: snapshot.commentCount, comments: snapshot.comments, hasMore: snapshot.hasMore,
            // Do not expose OAuth emails, IDs, tokens, or provider metadata in the public API.
            user: user ? { name: snapshot.displayName ?? "", moderator: snapshot.moderator } : null,
        } satisfies CommunityState)
    } catch (error) { return communityFailure(error) }
}
export const GET = (request: Request, context: Context) => handle(request, context, false)
export const POST = (request: Request, context: Context) => handle(request, context, true)
