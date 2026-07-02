import test from "node:test";
import assert from "node:assert/strict";
import { validateCard, inGreenpoint, FILTER_IDS } from "./cardSchema.js";

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
  audience: ["resident"],
  actions: [{ label: "Visit", type: "visit" }],
  sourceLinks: [{ title: "SSG July 2026", publisher: "Shop Small Greenpoint", date: "2026-07-01" }],
  evidenceStrength: "medium_high",
  monetizationRelevance: "direct",
  partnerRelevance: "high",
  createdAt: "2026-07-02",
  updatedAt: "2026-07-02",
};

test("a complete card validates", () => {
  const r = validateCard(good);
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
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

test("FILTER_IDS matches the spec's filter bar (incl. Clubs & Signups)", () => {
  assert.deepEqual(FILTER_IDS, [
    "new", "food_drink", "shopping", "services",
    "arts_culture", "family_kids", "events", "clubs_signups", "g_train",
  ]);
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
