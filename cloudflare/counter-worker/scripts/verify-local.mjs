import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"

// Never seed production counters with automated test visits.
const base = new URL(process.env.COUNTER_ENDPOINT || "http://127.0.0.1:8787")
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Integration tests require a local Worker")
const path = "/post/counter-integration"
const origin = "https://www.basilry.kim"
async function post(route, body, extra = {}) {
    const response = await fetch(new URL(route, base), {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: origin, "User-Agent": "Mozilla/5.0 Counter verification", Cookie: "same-browser=1", ...extra },
        body: JSON.stringify(body),
    })
    return { status: response.status, body: await response.json() }
}
const initial = (await post("/stats", { path })).body
assert.equal(initial.available, true)
const eventId = randomUUID()
const visitorId = randomUUID()
const first = await post("/visit", { eventId, visitorId, path })
assert.equal(first.status, 200)
assert.equal(first.body.totalViews, initial.totalViews + 1)
const retry = await post("/visit", { eventId, visitorId, path })
assert.equal(retry.body.totalViews, first.body.totalViews)
const reloaded = await post("/visit", { eventId: randomUUID(), visitorId, path })
assert.equal(reloaded.body.totalViews, initial.totalViews + 1)
assert.equal(reloaded.body.todayViews, initial.todayViews + 1)
assert.equal(reloaded.body.postViews[path], initial.postViews[path] + 2)
await Promise.all(Array.from({ length: 10 }, () => post("/visit", { eventId: randomUUID(), visitorId, path })))
const afterConcurrent = (await post("/stats", { path })).body
assert.equal(afterConcurrent.totalViews, initial.totalViews + 1)
assert.equal(afterConcurrent.postViews[path], initial.postViews[path] + 12)
const concurrentRetryId = randomUUID()
await Promise.all(Array.from({ length: 10 }, () => post("/visit", { eventId: concurrentRetryId, visitorId, path })))
const afterRetried = (await post("/stats", { path })).body
assert.equal(afterRetried.totalViews, initial.totalViews + 1)
assert.equal(afterRetried.postViews[path], initial.postViews[path] + 13)
await post("/visit", { eventId: randomUUID(), visitorId, path: null })
await post("/visit", { eventId: randomUUID(), visitorId: randomUUID(), path: null })
// A previous client can still record a post opening, but cannot inflate the
// daily browser count by sending a fresh event ID without a browser ID.
await post("/visit", { eventId: randomUUID(), path })
for (let index = 0; index < 3; index++) {
    await post("/stats", { path })
    await post("/views", { paths: [path] })
    await post("/count", { visitorId: randomUUID(), path })
}
assert.equal((await post("/visit", { eventId: randomUUID(), path }, { Origin: "https://example.com" })).status, 403)
assert.equal((await post("/visit", { eventId: "bad", path })).status, 400)
assert.equal((await post("/visit", { eventId: randomUUID(), visitorId: "bad", path })).status, 400)
assert.equal((await post("/visit", { eventId: randomUUID(), path }, { "User-Agent": "Googlebot" })).body.available, false)
const final = (await post("/stats", { path })).body
assert.equal(final.totalViews, initial.totalViews + 2)
assert.equal(final.todayViews, initial.todayViews + 2)
assert.equal(final.postViews[path], initial.postViews[path] + 14)
console.log("PASS: daily same-browser dedupe, repeat post views, concurrent retries, separate browsers, non-post routes, previous clients, read-only polling, legacy polling, origin/validation/bot rejection")
