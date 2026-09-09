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
const first = await post("/visit", { eventId, path })
assert.equal(first.status, 200)
assert.equal(first.body.totalViews, initial.totalViews + 1)
const retry = await post("/visit", { eventId, path })
assert.equal(retry.body.totalViews, first.body.totalViews)
const reloaded = await post("/visit", { eventId: randomUUID(), path })
assert.equal(reloaded.body.totalViews, initial.totalViews + 2)
assert.equal(reloaded.body.todayViews, initial.todayViews + 2)
assert.equal(reloaded.body.postViews[path], initial.postViews[path] + 2)
await Promise.all(Array.from({ length: 10 }, () => post("/visit", { eventId: randomUUID(), path })))
const afterConcurrent = (await post("/stats", { path })).body
assert.equal(afterConcurrent.totalViews, initial.totalViews + 12)
assert.equal(afterConcurrent.postViews[path], initial.postViews[path] + 12)
await post("/visit", { eventId: randomUUID(), path: null })
for (let index = 0; index < 3; index++) {
    await post("/stats", { path })
    await post("/views", { paths: [path] })
    await post("/count", { visitorId: randomUUID(), path })
}
assert.equal((await post("/visit", { eventId: randomUUID(), path }, { Origin: "https://example.com" })).status, 403)
assert.equal((await post("/visit", { eventId: "bad", path })).status, 400)
assert.equal((await post("/visit", { eventId: randomUUID(), path }, { "User-Agent": "Googlebot" })).body.available, false)
const final = (await post("/stats", { path })).body
assert.equal(final.totalViews, initial.totalViews + 13)
assert.equal(final.todayViews, initial.todayViews + 13)
assert.equal(final.postViews[path], initial.postViews[path] + 12)
console.log("PASS: repeated same-browser openings, retry safety, concurrent increments, non-post routes, read-only polling, legacy polling, origin/validation/bot rejection")
