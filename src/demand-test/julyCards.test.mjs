import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/july-2026-cards.json", import.meta.url)), "utf8"),
);

test("seed has exactly 71 cards across the six layers", () => {
  // 2026-07-02 (Batu): per-station G-closure cards cut — closure context lives
  // in the banner; the layer keeps the action cards (adopt + advocacy).
  // 2026-07-08 weekly refresh: Jul 7–12 roundup in, 10 past events out.
  // 2026-07-15 limited-launch refresh: 18 past events out, 12 in from the
  // Greenpointers Jul 16–22 roundup, plus the two content-type seeds under
  // test — 3 deals (`discount`) and 3 `news` cards.
  // Evening of 2026-07-15: first Gmail ingest run — +1 event (WORD Journal
  // Club) +1 news (Rockaway Rocket); PRESS deal dropped by Batu (multi-location).
  // Same evening: live-music layer (Batu) — 4 venue cards + 2 Good Room nights,
  // then the full Troost nightly program (troostny.com/calendar/, Jul 15–22).
  // 2026-07-16 venue-calendar expansion (Batu): locally-owned-only hard gate —
  // Warsaw removed (Live Nation-operated), Trom Yorke night expired out;
  // +7 venue/business cards (Eavesdrop, Lot Radio, Greenpoint Comedy Club,
  // Film Noir Cinema, Scrappleland, Flower Cat, Hide & Seek), +17 events from
  // their published calendars, +1 subscription, +1 support, +1 news.
  // Later on 2026-07-16 (ChatGPT-gap check): community-institution sweep —
  // Greenpoint Library venue + 6 day cards from the branch's own calendar,
  // plus the Friends of Transmitter Park Longevity Stick class (Jul 23).
  // 2026-07-21 weekly refresh: 36 past events + the one-night El Born deal
  // expired out; +21 events from the venue-calendar re-pull for the Jul 23–27
  // back half (Troost 5, Eavesdrop 6, Good Room 2, Film Noir 3, GCC 3, Hide &
  // Seek weekend DJs) plus the Tend x Franca sidewalk seconds sale (Gmail), then
  // +4 Greenpoint Library day cards (Thu/Fri/Sat/Mon; Fri had garden + movie,
  // Sun had no branch programming) from the BPL branch calendar sweep.
  // 2026-07-22 Wednesday Greenpointers pull (first same-day roundup ingest):
  // 5 Jul-21 events expired out; +15 events from the 7/23–29 roundup (BIP jazz,
  // Madeline's acrylics, cannabis botany, Makers Terrace, PLAY Kids movie night,
  // BCC crafty hour, Pilates breathwork, Threes DJ night, mom run club, City of
  // Water Day, Pooch's adoption day, Held Space astrology, Disabled & Hungry
  // launch, library book club 7/29, Greenpoint Loft ecstatic dance). 6 roundup
  // items verified to Williamsburg addresses and skipped (Salotto→84 Withers,
  // Twisted Spine workshop→306 Grand, Artful Souls→105 S 5th, Rude Mouth→359
  // Metropolitan, Joy Flower Pot→713 Lorimer, Tracksmith→Grand St + MPJ Park).
  // Later on 2026-07-22 (Batu): +2 news from this week's Greenpointers front
  // page — Wasabi closing Jul 27 after 26 years (638 Manhattan Ave) and
  // Swaine's fall opening at 577 Lorimer (boundary call: Williamsburg side of
  // the envelope, added on Batu's explicit ask, Domino-yoga precedent).
  // Evening of 2026-07-22 (Batu's open-tab review): +1 subscription (Greenpoint
  // Trash Club — Wednesday 7:30pm cleanups, rotating bar meetup pinned weekly),
  // +2 events (Town Square SummerStarz free movie at Transmitter Park;
  // Acme Fish Friday pickup at 30 Gem St). Skipped: CIBONE Hozubag (Tokyo
  // multi-location brand, locally-owned gate), Dashi Okume + Dobbin St (no
  // current listings). The Newtown Creek Superfund CAG meeting (Jul 29,
  // Queens Landing Boathouse) was first skipped as LIC, then added on Batu's
  // call as civic_action — Greenpoint-related, nearby, pinned at the exact
  // spot across the creek (geocodes inside the envelope).
  // 2026-07-22 (coverage scan → Batu's ask): +1 event — It's My Park volunteer
  // day at Transmitter Park (Jul 26), from the NYC Parks per-park page (missed
  // by Greenpointers + newsletters; the residual-gap catch this scan exists for).
  assert.equal(seed.cards.length, 88);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 8, "8 discovery cards");
  assert.equal(count((c) => c.category === "event"), 52, "52 event cards");
  assert.equal(count((c) => c.category === "discount"), 2, "2 deal cards");
  assert.equal(count((c) => c.category === "news"), 7, "7 news cards");
  assert.equal(count((c) => c.filters.includes("live_music")), 27, "27 in the Live Music layer (venues + show nights + jazz events)");
  assert.equal(count((c) => c.category === "subscription"), 3, "3 subscription cards (Falu House, Flower Cat, Trash Club)");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 5, "3 G-train cards + Film Noir support + Newtown Creek CAG");
});

test("no fully-past events linger in the seed (refresh discipline)", () => {
  // Refreshed 2026-07-22; recurring series carry their series end date.
  const refreshDay = Date.parse("2026-07-22T00:00:00-04:00");
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    assert.ok(Date.parse(c.endsAt) >= refreshDay, `${c.id} ended before the 2026-07-22 refresh`);
  }
});

test("deals carry the expiry contract; recurring deals are flagged, dated deals are not", () => {
  // Limited launch: expired dated cards vanish at render time (isExpiredCard), so
  // endsAt is load-bearing on every deal. recurring marks endsAt as merely
  // verified-through (UI suppresses the "ends" line) — a dated one-night deal
  // must NOT carry it.
  const deals = seed.cards.filter((c) => c.category === "discount");
  assert.equal(deals.length, 2);
  for (const c of deals) {
    assert.ok(c.endsAt, `${c.id} missing endsAt`);
    assert.ok(c.filters.includes("deals"), `${c.id} missing deals filter`);
  }
  // 2026-07-21: the one-night El Born wine-night deal expired out; the two
  // survivors are both recurring standing offers (verified-through dated).
  assert.equal(seed.cards.find((c) => c.id === "poochs-parlor-first-groom").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "greenpoint-fish-oyster-hh").recurring, true);
});

test("news cards name their publisher and sit in the news layer", () => {
  const news = seed.cards.filter((c) => c.category === "news");
  assert.equal(news.length, 7);
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
    "bushwick-inlet-jazz-0723",
    "city-of-water-day-0725",
    "disabled-hungry-launch-0725",
    "giggles-run-club-0725",
    "greenpoint-trash-club",
    "its-my-park-transmitter-0726",
    "library-childrens-book-club-0729",
    "library-thursday-programs",
    "longevity-stick-transmitter",
    "mccarren-makers-terrace-0724",
    "summerstarz-princess-bride-0724",
    "tend-franca-seconds-sale",
    "threes-pat-sophie-0724",
  ]);
});

test("reader-facing copy spells out Shop Small Greenpoint (no bare acronym)", () => {
  for (const c of seed.cards) {
    for (const text of [c.title, c.summary, c.whyItMatters ?? "", ...c.actions.map((a) => a.label)]) {
      assert.ok(!/\bSSG\b/.test(text), `${c.id}: "${text}"`);
    }
  }
});

test("the g_train layer is retired — no card references it (2026-07-23)", () => {
  // Batu: a campaign as a content category read as confusing. G cards live in
  // their real categories; future ingests must not resurrect the layer.
  for (const c of seed.cards) {
    assert.ok(!c.filters.includes("g_train"), `${c.id} still carries g_train`);
    assert.ok(!c.actions.some((a) => a.filterId === "g_train"), `${c.id} action opens the retired layer`);
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

// The World Cup watch-party cluster (world-cup-watch) aged out in the
// 2026-07-21 refresh (final was Jul 19) — its multi-venue coverage test
// retired with it. The `venues[]` cluster path stays exercised via schema
// validation on any future cluster card.

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
  // Live-music layer: venue ↔ its show nights. Rebuilt each refresh from the
  // show cards that point back at the venue (2026-07-21: expired nights out,
  // Jul 23–27 nights in).
  assert.deepEqual(byId("good-room").relatedCardIds, ["good-room-juan-maclean-0725", "good-room-members-lloyd-0724"]);
  assert.deepEqual(byId("good-room-juan-maclean-0725").relatedCardIds, ["good-room"]);
  assert.equal(byId("troost").relatedCardIds.length, 6, "Troost links its 6 current program nights (Radio Brass expired 7/22)");
  assert.deepEqual(byId("troost-barba-yiorgi-0723").relatedCardIds, ["troost"]);
  assert.equal(byId("eavesdrop").relatedCardIds.length, 7, "Eavesdrop links its 7 current calendar nights");
  assert.deepEqual(byId("eavesdrop-subcultures").relatedCardIds, ["eavesdrop"]);
  assert.equal(byId("greenpoint-comedy-club").relatedCardIds.length, 4);
  assert.ok(byId("film-noir-jackie-stripper-0724").relatedCardIds.includes("film-noir-cinema"), "screening joins the venue graph");
  assert.deepEqual(byId("flower-cat-subscription").relatedCardIds, ["flower-cat"]);
});

test("every card id is a URL-safe slug (deep-link contract, Phase 3.1)", () => {
  // Card ids double as public /e/<slug> paths — must stay lowercase kebab.
  for (const card of seed.cards) {
    assert.match(card.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `card id not URL-safe: ${card.id}`);
  }
});
