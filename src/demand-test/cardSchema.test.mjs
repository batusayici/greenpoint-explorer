import test from "node:test";
import assert from "node:assert/strict";
import { validateCard, inGreenpoint, FILTER_IDS, TRUST_RISKS } from "./cardSchema.js";

const good = {
  id: "test-card",
  title: "Test Card",
  category: "new_business",
  filters: ["new", "food_drink"],
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
  const internal = { ...good, actions: [{ label: "See every deal", type: "visit", filterId: "deals" }] };
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
    filters: ["events"],
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

test("FILTER_IDS matches the spec's filter bar (incl. Deals + News + Live Music, 2026-07-15)", () => {
  assert.deepEqual(FILTER_IDS, [
    "new", "food_drink", "shopping", "services",
    "arts_culture", "family_kids", "events", "live_music", "clubs_signups",
    "deals", "news",
  ]);
});

test("a deal (discount) must carry an end date — offers expire", () => {
  const deal = {
    ...good,
    id: "deal",
    category: "discount",
    filters: ["deals"],
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
    filters: ["clubs_signups"],
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
