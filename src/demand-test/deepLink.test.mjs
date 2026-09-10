import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cardIdFromPath,
  deepLinkUrl,
  resolveDeepLink,
  lensFromSearch,
  lensFromPath,
  lensPagePath,
  LENS_PAGES,
} from "./deepLink.js";
import { FILTERS } from "./filterCards.js";

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

// 2026-08-15 (adversarial review, finding F2): outbound channel links promise
// a view ("every kids thing, on one map") — the link must land on that view,
// not on the general feed with the filter chip left as an exercise. Unknown
// or missing values fall back to null (caller keeps "all") so a stale link
// can never narrow the page to nothing.
test("lensFromSearch accepts a real filter id and rejects everything else", () => {
  assert.equal(lensFromSearch("?lens=family_kids"), "family_kids");
  assert.equal(lensFromSearch("?src=parents&lens=family_kids"), "family_kids");
  assert.equal(lensFromSearch("?lens=not-a-lens"), null);
  assert.equal(lensFromSearch("?lens="), null);
  assert.equal(lensFromSearch(""), null);
  assert.equal(lensFromSearch("?src=parents"), null);
});

// ---- lens landing pages (2026-09-10) ---------------------------------------
// A lens on a query string can never have its own share preview: Facebook keys
// its preview on the `og:url` in the head, so every `?lens=` variant collapses
// back to the root object. Proved from the other side on 2026-09-10 — a query
// string Facebook had never seen previewed correctly on its first post, because
// the root had already been scraped. A distinct preview needs a distinct URL,
// which is why these are paths and not parameters.

test("lensFromPath maps the two published lens paths", () => {
  assert.equal(lensFromPath("/kids"), "family_kids");
  assert.equal(lensFromPath("/civic"), "civic");
});

test("lensFromPath tolerates a trailing slash", () => {
  assert.equal(lensFromPath("/kids/"), "family_kids");
});

test("lensFromPath returns null for anything else", () => {
  // Deliberately including the lens IDS themselves: only the published paths
  // resolve, so adding a lens to FILTER_IDS never silently opens a URL that
  // has no prerendered page behind it.
  assert.equal(lensFromPath("/family_kids"), null);
  assert.equal(lensFromPath("/food_drink"), null);
  assert.equal(lensFromPath("/"), null);
  assert.equal(lensFromPath("/kids/extra"), null);
  assert.equal(lensFromPath("/e/some-card"), null);
});

test("every published lens path names a real lens", () => {
  for (const [path, id] of Object.entries(LENS_PAGES)) {
    assert.ok(FILTERS.some((f) => f.id === id), `${path} points at unknown lens ${id}`);
    assert.ok(/^[a-z-]+$/.test(path), `${path} is not a plain lowercase path segment`);
  }
});

test("a lens path does not collide with the card path shape", () => {
  for (const path of Object.keys(LENS_PAGES)) {
    assert.equal(cardIdFromPath(`/${path}`), null);
  }
});

test("deepLinkUrl returns to the lens page it started on, not to the root", () => {
  // The history effect runs on first render with no card selected, so without
  // a base path a reader who opened /kids had the address bar rewritten to /
  // before touching anything — and closing a card would strand them on the
  // general feed. Copying the URL at that point shares the wrong page.
  assert.equal(deepLinkUrl(null, "?src=parents", "/kids"), "/kids?src=parents");
  assert.equal(deepLinkUrl("storytime", "?src=parents", "/kids"), "/e/storytime?src=parents");
  assert.equal(deepLinkUrl(null, "", "/civic"), "/civic");
});

test("deepLinkUrl still defaults to the root", () => {
  assert.equal(deepLinkUrl(null, "?src=wave2"), "/?src=wave2");
  assert.equal(deepLinkUrl(null, ""), "/");
});

test("lensPagePath names the page a pathname belongs to, or the root", () => {
  assert.equal(lensPagePath("/kids"), "/kids");
  assert.equal(lensPagePath("/kids/"), "/kids");
  assert.equal(lensPagePath("/civic"), "/civic");
  assert.equal(lensPagePath("/"), "/");
  assert.equal(lensPagePath("/e/some-card"), "/");
});
