import { test } from "node:test";
import assert from "node:assert/strict";
import { cardIdFromPath, deepLinkUrl, resolveDeepLink } from "./deepLink.js";

// Phase 3.1 share infra: per-card deep links are real paths (/e/<slug>) so
// every event gets a crawlable URL (answer-engine decision 2026-07-21).

test("cardIdFromPath extracts the slug from /e/<slug>", () => {
  assert.equal(cardIdFromPath("/e/sailor-and-siren"), "sailor-and-siren");
});

test("cardIdFromPath tolerates a trailing slash", () => {
  assert.equal(cardIdFromPath("/e/sailor-and-siren/"), "sailor-and-siren");
});

test("cardIdFromPath decodes percent-encoded slugs", () => {
  assert.equal(cardIdFromPath("/e/caf%C3%A9"), "café");
});

test("cardIdFromPath returns null for non-card paths", () => {
  assert.equal(cardIdFromPath("/"), null);
  assert.equal(cardIdFromPath("/e/"), null);
  assert.equal(cardIdFromPath("/e"), null);
  assert.equal(cardIdFromPath("/explorer.html"), null);
  assert.equal(cardIdFromPath("/e/foo/bar"), null);
});

test("deepLinkUrl builds a card path and preserves the query string", () => {
  assert.equal(deepLinkUrl("wasabi-closing", "?src=wave1"), "/e/wasabi-closing?src=wave1");
  assert.equal(deepLinkUrl("wasabi-closing", ""), "/e/wasabi-closing");
});

test("deepLinkUrl with no card returns the root, query preserved", () => {
  assert.equal(deepLinkUrl(null, "?src=wave1"), "/?src=wave1");
  assert.equal(deepLinkUrl(null, ""), "/");
});

// 2026-07-23 (UX eval F6, decision Q1-A): a dead /e/ link must be
// distinguishable from a plain visit so the feed can say "that one's
// wrapped" instead of failing silently.
test("resolveDeepLink: live slug opens; dead or unknown slug reports dead; plain paths don't", () => {
  const now = new Date("2026-07-23T12:00:00-04:00");
  const cards = new Map([
    ["live-show", { id: "live-show", endsAt: "2026-07-25T23:59:00-04:00" }],
    ["past-show", { id: "past-show", endsAt: "2026-07-20T23:59:00-04:00" }],
  ]);
  assert.deepEqual(resolveDeepLink("/e/live-show", cards, now), { id: "live-show", dead: false });
  assert.deepEqual(resolveDeepLink("/e/past-show", cards, now), { id: null, dead: true });
  assert.deepEqual(resolveDeepLink("/e/never-existed", cards, now), { id: null, dead: true });
  assert.deepEqual(resolveDeepLink("/", cards, now), { id: null, dead: false });
});
