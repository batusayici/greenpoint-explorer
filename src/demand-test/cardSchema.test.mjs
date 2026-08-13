import test from "node:test";
import assert from "node:assert/strict";
import { validateCard, inGreenpoint, FILTER_IDS, FOLDED_FILTER_IDS, TRUST_RISKS } from "./cardSchema.js";

const good = {
  id: "test-card",
  title: "Test Card",
  category: "new_business",
  filters: ["food_drink"],
  sourceCampaign: "shop_small_greenpoint_july_2026",
  locationName: "Test Spot",
  address: "1 Test St",
  lat: 40.7295,
  lng: -73.9538,
  corridor: "manhattan-ave",
  summary: "A test.",
  kicker: "Test spot",
  audience: ["resident"],
  actions: [{ label: "Visit", type: "visit" }],
  sourceLinks: [{ title: "SSG July 2026", publisher: "Shop Small Greenpoint", date: "2026-07-01" }],
  evidenceStrength: "medium_high",
  monetizationRelevance: "direct",
  partnerRelevance: "high",
  trustRisk: "low",
  createdAt: "2026-07-02",
  updatedAt: "2026-07-02",
};

test("a complete card validates", () => {
  const r = validateCard(good);
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test("kicker is required and glance-length (tester feedback 2026-07-08: rows must scan without a tap)", () => {
  const { kicker, ...missing } = good;
  assert.equal(validateCard(missing).ok, false, "missing kicker");
  assert.equal(validateCard({ ...good, kicker: "" }).ok, false, "empty kicker");
  assert.equal(
    validateCard({ ...good, kicker: "a phrase far too long to scan in a list row at a glance" }).ok,
    false,
    "over 44 chars",
  );
});

test("free is optional but must be a boolean (truth rule: only sourced free-ness)", () => {
  assert.deepEqual(validateCard({ ...good, free: true }).errors, []);
  assert.equal(validateCard({ ...good, free: "yes" }).ok, false);
});

test("an action may target a filter view (internal action), but only a known one", () => {
  // 2026-07-03: campaign cards link INTO the map ("see who's open nearby" →
  // the G-Train layer) — an action carrying filterId instead of url.
  const internal = { ...good, actions: [{ label: "See every deal", type: "visit", filterId: "deals_memberships" }] };
  assert.deepEqual(validateCard(internal).errors, []);
  assert.equal(validateCard({ ...good, actions: [{ label: "x", type: "visit", filterId: "jobs" }] }).ok, false);
});

test("rejects unknown category, filter, action type, audience", () => {
  assert.equal(validateCard({ ...good, category: "nope" }).ok, false);
  assert.equal(validateCard({ ...good, filters: ["nope"] }).ok, false);
  assert.equal(validateCard({ ...good, actions: [{ label: "x", type: "nope" }] }).ok, false);
  assert.equal(validateCard({ ...good, audience: ["nope"] }).ok, false);
});

test("rejects coordinates outside Greenpoint", () => {
  assert.equal(validateCard({ ...good, lat: 40.5, lng: -73.9538 }).ok, false);
  assert.ok(inGreenpoint({ lat: 40.7295, lng: -73.9538 }));
  assert.ok(!inGreenpoint({ lat: 40.7295, lng: -73.8 }));
});

test("a card with no coords but geocoded venues validates", () => {
  const cluster = {
    ...good,
    id: "cluster",
    category: "event",
    filters: [],  // lens-less one-off: legal since the 2026-07-25 IA re-cut
    lat: null,
    lng: null,
    address: null,
    venues: [{ name: "Bar A", address: "2 Test St", lat: 40.731, lng: -73.955 }],
  };
  assert.equal(validateCard(cluster).ok, true);
});

test("rejects a card with neither coords nor venues", () => {
  assert.equal(validateCard({ ...good, lat: null, lng: null, venues: [] }).ok, false);
});

test("requires at least one action and a source link", () => {
  assert.equal(validateCard({ ...good, actions: [] }).ok, false);
  assert.equal(validateCard({ ...good, sourceLinks: [] }).ok, false);
});

test("FILTER_IDS is the bar's real order: thick lenses first, fold-prone ones at the back", () => {
  assert.deepEqual(FILTER_IDS, [
    "food_drink", "family_kids", "arts_culture",
    "live_music", "news", "deals_memberships",
    // `shopping` re-enters at the back (2026-08-13), which is the rule working
    // rather than an exception to it: a lens restocked by new supply earns its
    // way forward from the tail, it does not resume a July slot.
    "civic", "wellness", "shopping",
    "games",
  ]);
  // `games` trails because it is authored-folded — its position only orders it
  // inside "More". The primary bar's merchandising order is unchanged.
  assert.deepEqual(FOLDED_FILTER_IDS, ["games"]);
  for (const id of FOLDED_FILTER_IDS) {
    assert.ok(FILTER_IDS.includes(id), `${id} is folded but not a real lens`);
  }
});

// 2026-08-02: the array is not cosmetic — `partitionFilters` preserves it, so a
// lens's index decides WHERE IT LANDS when it crosses the fold threshold. Under
// the old order `wellness` sat at index 3, so stocking it to 5 cards would have
// dropped it into the peek slot ahead of live_music, news and deals — three
// established lenses displaced by a restocked thin one. Fold-prone lenses now
// trail the thick ones, so crossing the threshold enters the bar at the BACK.
test("FILTER_IDS: a fold-prone lens crossing the threshold enters at the back of the bar", async () => {
  const { FILTERS, partitionFilters } = await import("./filterCards.js");
  const THRESHOLD = 5;
  const thick = { food_drink: 14, family_kids: 14, arts_culture: 11, live_music: 10, news: 23, deals_memberships: 6 };
  for (const restocked of ["civic", "wellness"]) {
    const { shown } = partitionFilters(FILTERS, { ...thick, [restocked]: THRESHOLD }, THRESHOLD);
    const ids = shown.map((f) => f.id);
    assert.equal(ids.at(-1), restocked, `${restocked} enters last, not mid-bar`);
    assert.deepEqual(ids.slice(0, 4), ["all", "food_drink", "family_kids", "arts_culture"], "tier 1 is untouched");
  }
});

test("filters may be empty (All-only one-off) but never absent", () => {
  assert.deepEqual(validateCard({ ...good, filters: [] }).errors, []);
  const { filters, ...missing } = good;
  assert.equal(validateCard(missing).ok, false, "absent filters array");
});

test("a deal (discount) must carry an end date — offers expire", () => {
  const deal = {
    ...good,
    id: "deal",
    category: "discount",
    filters: ["deals_memberships"],
    startsAt: "2026-07-14T00:00:00-04:00",
    endsAt: "2026-07-20T23:59:00-04:00",
  };
  assert.deepEqual(validateCard(deal).errors, []);
  const { startsAt, endsAt, ...open } = deal;
  assert.equal(validateCard(open).ok, false, "deal without endsAt");
});

test("a news card must name its publisher (attribution truth rule)", () => {
  const news = {
    ...good,
    id: "news",
    category: "news",
    filters: ["news"],
    sourceLinks: [{ title: "July service notice", publisher: "MTA", url: "https://new.mta.info" }],
  };
  assert.deepEqual(validateCard(news).errors, []);
  const unattributed = { ...news, sourceLinks: [{ title: "heard around" }] };
  assert.equal(validateCard(unattributed).ok, false, "news without publisher");
});

test("subscription category and join action are accepted (addendum)", () => {
  const club = {
    ...good,
    id: "club",
    category: "subscription",
    filters: ["deals_memberships"],
    actions: [{ label: "Join", type: "join" }],
  };
  assert.deepEqual(validateCard(club).errors, []);
});

test("dated cards: valid ISO window accepted, malformed or inverted rejected", () => {
  const dated = { ...good, startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  assert.equal(validateCard(dated).ok, true);
  assert.equal(validateCard({ ...good, startsAt: "not-a-date" }).ok, false);
  assert.equal(
    validateCard({ ...good, startsAt: "2026-07-10T00:00:00-04:00", endsAt: "2026-07-02T00:00:00-04:00" }).ok,
    false,
  );
});

test("place-graph fields: trustRisk is required and enum-locked", () => {
  assert.deepEqual(TRUST_RISKS, ["low", "medium", "high"]);
  const { trustRisk, ...missing } = good;
  assert.equal(validateCard(missing).ok, false);
  assert.equal(validateCard({ ...good, trustRisk: "none" }).ok, false);
});

test("relatedCardIds: optional, but must be non-empty string ids without self-reference", () => {
  assert.deepEqual(validateCard({ ...good, relatedCardIds: ["other-card"] }).errors, []);
  assert.equal(validateCard({ ...good, relatedCardIds: [] }).ok, false);
  assert.equal(validateCard({ ...good, relatedCardIds: [42] }).ok, false);
  assert.equal(validateCard({ ...good, relatedCardIds: ["test-card"] }).ok, false, "self-reference");
});

test("timeline: optional, entries need an ISO date and a title", () => {
  const entry = { date: "2026-07-10", title: "Weekend closure begins", sourceUrl: "https://new.mta.info" };
  assert.deepEqual(validateCard({ ...good, timeline: [entry] }).errors, []);
  assert.equal(validateCard({ ...good, timeline: [] }).ok, false);
  assert.equal(validateCard({ ...good, timeline: [{ date: "not-a-date", title: "x" }] }).ok, false);
  assert.equal(validateCard({ ...good, timeline: [{ date: "2026-07-10" }] }).ok, false, "missing title");
});

// Ingest-time copy lint (2026-07-29 punch list, P1 #3): warnings, not errors —
// run on new/changed cards during the ingest ritual.
test("lintCard warns on a summary over 200 chars", async () => {
  const { lintCard } = await import("./cardSchema.js");
  const clean = { ...good, kicker: "Ceramics on the sidewalk", summary: "Seconds and one-offs from the studio kiln." };
  assert.equal(lintCard(clean).ok, true);
  const long = { ...clean, summary: "x".repeat(201) };
  assert.equal(lintCard(long).ok, false);
  assert.match(lintCard(long).warnings[0], /200/);
});

test("lintCard warns when the summary restates its kicker", async () => {
  const { lintCard } = await import("./cardSchema.js");
  const dup = {
    ...good,
    kicker: "Live jazz with your wine",
    summary: "The weekly live-jazz night at the all-day cafe and wine bar.",
  };
  assert.equal(lintCard(dup).ok, false, "≥50% of kicker words repeated");
  const distinct = {
    ...good,
    kicker: "Live jazz with your wine",
    summary: "No cover; the quartet rotates weekly and the kitchen runs late.",
  };
  assert.equal(lintCard(distinct).ok, true, "different jobs, no warning");
});
