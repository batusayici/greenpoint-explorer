import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/july-2026-cards.json", import.meta.url)), "utf8"),
);

test("seed has exactly 34 cards across the six layers", () => {
  // 2026-07-02 (Batu): per-station G-closure cards cut — closure context lives
  // in the banner; the layer keeps the action cards (adopt + advocacy).
  // 2026-07-08 weekly refresh: Jul 7–12 roundup in, 10 past events out.
  // 2026-07-15 limited-launch refresh: 18 past events out, 12 in from the
  // Greenpointers Jul 16–22 roundup, plus the two content-type seeds under
  // test — 3 deals (`discount`) and 3 `news` cards.
  // Evening of 2026-07-15: first Gmail ingest run — +1 event (WORD Journal
  // Club) +1 news (Rockaway Rocket); PRESS deal dropped by Batu (multi-location).
  // Same evening: live-music layer (Batu) — 4 venue cards + 2 Good Room nights.
  assert.equal(seed.cards.length, 42);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 8, "8 discovery cards");
  assert.equal(count((c) => c.category === "event"), 19, "19 event cards (17 + 2 Good Room nights)");
  assert.equal(count((c) => c.category === "discount"), 3, "3 deal cards");
  assert.equal(count((c) => c.category === "news"), 4, "4 news cards");
  assert.equal(count((c) => c.filters.includes("live_music")), 8, "8 in the Live Music layer (4 venues, 2 club nights, 2 jazz events)");
  assert.equal(count((c) => c.category === "subscription"), 1, "1 subscription card (Falu House)");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 3, "3 G-train campaign/action cards");
});

test("no fully-past events linger in the seed (refresh discipline)", () => {
  // Refreshed 2026-07-15; recurring series carry their series end date.
  const refreshDay = Date.parse("2026-07-15T00:00:00-04:00");
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    assert.ok(Date.parse(c.endsAt) >= refreshDay, `${c.id} ended before the 2026-07-15 refresh`);
  }
});

test("deals carry the expiry contract; recurring deals are flagged, dated deals are not", () => {
  // Limited launch: expired deals vanish at render time (isExpiredDeal), so
  // endsAt is load-bearing on every deal. recurring marks endsAt as merely
  // verified-through (UI suppresses the "ends" line) — a dated one-night deal
  // must NOT carry it.
  const deals = seed.cards.filter((c) => c.category === "discount");
  assert.equal(deals.length, 3);
  for (const c of deals) {
    assert.ok(c.endsAt, `${c.id} missing endsAt`);
    assert.ok(c.filters.includes("deals"), `${c.id} missing deals filter`);
  }
  assert.equal(seed.cards.find((c) => c.id === "elborn-wine-night").recurring, undefined, "one-night deal is not recurring");
  assert.equal(seed.cards.find((c) => c.id === "poochs-parlor-first-groom").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "greenpoint-fish-oyster-hh").recurring, true);
});

test("news cards name their publisher and sit in the news layer", () => {
  const news = seed.cards.filter((c) => c.category === "news");
  assert.equal(news.length, 4);
  for (const c of news) {
    assert.ok(c.filters.includes("news"), `${c.id} missing news filter`);
    assert.ok(c.sourceLinks.some((s) => s.publisher), `${c.id} missing publisher`);
  }
});

test("the G-closure campaign card is a durable object: timeline, graph links, actions", () => {
  // The doc's flagship example ("What Changed Near Me?"): one card that answers
  // what changed / over what time / what's connected / what can I do.
  const c = seed.cards.find((x) => x.id === "g-train-closures");
  assert.ok(c, "g-train-closures campaign card exists");
  assert.equal(c.category, "g_train_support");
  assert.ok(c.timeline.length >= 3, "source-backed closure timeline");
  for (const rid of ["adopt-a-business", "g-advocacy-mta", "sailor-and-siren", "sotteatery"]) {
    assert.ok(c.relatedCardIds.includes(rid), `links to ${rid}`);
  }
  assert.ok(c.actions.some((a) => a.type === "file_complaint" && a.url), "complaint action");
  assert.ok(c.actions.some((a) => a.filterId === "g_train"), "internal action opens the G-Train layer");
  assert.ok(c.sourceLinks.some((s) => s.publisher === "MTA"), "MTA is cited for closure dates");
});

test("every action is tappable — url, share, internal filter, or derivable directions", () => {
  // Untappable actions produce no action_tap evidence; the go/no-go bar is
  // "action, not interest", so dead actions are banned from the seed.
  for (const c of seed.cards) {
    for (const a of c.actions) {
      const tappable =
        a.url != null ||
        a.type === "share" ||
        a.filterId != null ||
        (a.type === "visit" && (c.address != null || c.lat != null));
      assert.ok(tappable, `${c.id}: dead action "${a.label}"`);
    }
  }
});

test("free-ness is designated only where the source states it (tester feedback #2)", () => {
  const free = seed.cards.filter((c) => c.free === true).map((c) => c.id).sort();
  assert.deepEqual(free, [
    "kombucha-workshop-library",
    "morning-yoga-transmitter",
    "open-studio-library",
    "summer-music-bushwick-inlet",
    "summer-of-horrors-brooklyn-brewery",
    "word-journal-club",
  ]);
});

test("reader-facing copy spells out Shop Small Greenpoint (no bare acronym)", () => {
  for (const c of seed.cards) {
    for (const text of [c.title, c.summary, c.whyItMatters ?? "", ...c.actions.map((a) => a.label)]) {
      assert.ok(!/\bSSG\b/.test(text), `${c.id}: "${text}"`);
    }
  }
});

test("the G-Train layer covers who's open during the shutdown, not just the asks", () => {
  // "Still open this weekend" framing (spec v1 scope): every new business and
  // the subscription club are in the affected corridors and stay reachable.
  for (const c of seed.cards) {
    if (c.filters.includes("new") || c.category === "subscription") {
      assert.ok(c.filters.includes("g_train"), `${c.id} missing g_train`);
    }
  }
});

test("every dated event carries a Today-lens window (start and end)", () => {
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    if (c.startsAt != null || c.endsAt != null) {
      assert.ok(c.endsAt != null, `${c.id} missing endsAt — it would stay 'live' forever`);
    }
  }
});

test("the hidden-engagement addendum cards carry their contract", () => {
  // The Dandelion Wine tasting exemplar (Jul 2) aged out in the 2026-07-08
  // refresh — the pattern lives on in the spec; the subscription half stays.
  const club = seed.cards.find((c) => c.id === "falu-tinned-fish-club");
  assert.ok(club, "Falu House Tinned Fish Club exists");
  assert.ok(club.filters.includes("clubs_signups"));
  assert.ok(club.actions.some((a) => a.type === "join"), "club has a one-tap join action");
});

test("every card validates", () => {
  for (const card of seed.cards) {
    const r = validateCard(card);
    assert.deepEqual(r.errors, [], `card ${card.id}`);
  }
});

test("every card is geocoded inside Greenpoint (run scripts/geocode-demand-cards.mjs)", () => {
  for (const card of seed.cards) {
    assert.ok(inGreenpoint(card), `${card.id} has no derived coords`);
  }
});

test("world-cup cluster carries geocoded venues", () => {
  const wc = seed.cards.find((c) => c.id === "world-cup-watch");
  assert.ok(wc, "world-cup-watch card exists");
  assert.ok(wc.venues.length >= 6, "at least 6 of the 10 bars resolved");
  for (const v of wc.venues) {
    if (v.lat != null) assert.ok(inGreenpoint(v), `venue ${v.name}`);
  }
  assert.ok(wc.venues.filter((v) => v.lat != null).length >= 6, "at least 6 venues have coords");
});

test("ids are unique", () => {
  assert.equal(new Set(seed.cards.map((c) => c.id)).size, seed.cards.length);
});

test("relatedCardIds resolve to real cards (place-graph integrity)", () => {
  const ids = new Set(seed.cards.map((c) => c.id));
  for (const c of seed.cards) {
    for (const rid of c.relatedCardIds ?? []) {
      assert.ok(ids.has(rid), `${c.id} links to unknown card "${rid}"`);
    }
  }
  // Densified 2026-07-03: the G-train cluster is reciprocal around the
  // campaign card, and the one organic pair (Socceria is a World Cup venue).
  const byId = (id) => seed.cards.find((c) => c.id === id);
  assert.deepEqual(byId("adopt-a-business").relatedCardIds, ["g-train-closures", "g-advocacy-mta"]);
  assert.deepEqual(byId("g-advocacy-mta").relatedCardIds, ["g-train-closures", "adopt-a-business"]);
  assert.ok(byId("sailor-and-siren").relatedCardIds.includes("g-train-closures"));
  assert.ok(byId("sotteatery").relatedCardIds.includes("g-train-closures"));
  assert.deepEqual(byId("world-cup-watch").relatedCardIds, ["socceria", "warsaw-concerts"]);
  assert.deepEqual(byId("socceria").relatedCardIds, ["world-cup-watch"]);
  // Live-music layer: venue ↔ its show nights.
  assert.deepEqual(byId("good-room").relatedCardIds, ["good-room-analog-soul", "good-room-bda"]);
  assert.deepEqual(byId("good-room-analog-soul").relatedCardIds, ["good-room"]);
  // 2026-07-15 refresh: events at/with an on-map business link both ways.
  // (The Jul 7–12 pairs aged out with their events.)
  assert.deepEqual(byId("giggles-and-wiggles").relatedCardIds, ["infant-cpr-giggles"]);
  assert.deepEqual(byId("infant-cpr-giggles").relatedCardIds, ["giggles-and-wiggles"]);
  assert.deepEqual(byId("falu-tinned-fish-club").relatedCardIds, ["falu-tinned-fish-jazz"]);
  assert.deepEqual(byId("falu-tinned-fish-jazz").relatedCardIds, ["falu-tinned-fish-club"]);
});
