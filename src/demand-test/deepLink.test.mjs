import { test } from "node:test";
import assert from "node:assert/strict";
import { cardIdFromPath, deepLinkUrl } from "./deepLink.js";

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
