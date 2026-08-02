import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { COMMUNITY_ALERT, activeCommunityAlert } from "./communityAlert.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/cards.json", import.meta.url)), "utf8"),
);
const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));

const A = {
  cardId: "film-noir-support",
  sourcedAt: "2026-07-26T00:00:00-04:00",
  expiresAt: "2026-08-24T00:00:00-04:00",
};

test("before expiry, with the card in the deck → the alert shows", () => {
  assert.equal(activeCommunityAlert(new Date("2026-07-26T12:00:00-04:00"), CARDS_BY_ID, A), A);
});

test("at and after expiresAt → null (alert hides itself, gtrainBanner lesson)", () => {
  assert.equal(activeCommunityAlert(new Date("2026-08-24T00:00:00-04:00"), CARDS_BY_ID, A), null);
  assert.equal(activeCommunityAlert(new Date("2026-09-01T09:00:00-04:00"), CARDS_BY_ID, A), null);
});

// Banner charter (2026-08-02): 21-day slot tenure. sourcedAt Jul 26 → the
// slot frees at Aug 16 even though the re-verify deadline runs to Aug 24;
// only a NEW sourced development (fresh sourcedAt) restarts the clock.
test("past sourcedAt + 21 days → null (tenure cap beats an unexpired re-verify)", () => {
  assert.equal(activeCommunityAlert(new Date("2026-08-15T12:00:00-04:00"), CARDS_BY_ID, A), A);
  assert.equal(activeCommunityAlert(new Date("2026-08-16T00:00:00-04:00"), CARDS_BY_ID, A), null);
  assert.equal(activeCommunityAlert(new Date("2026-08-20T12:00:00-04:00"), CARDS_BY_ID, A), null);
});

test("card gone from the deck → null (banner must never point nowhere)", () => {
  const without = new Map(CARDS_BY_ID);
  without.delete("film-noir-support");
  assert.equal(activeCommunityAlert(new Date("2026-07-26T12:00:00-04:00"), without, A), null);
});

test("shipped alert targets a real card and is frozen", () => {
  assert.ok(CARDS_BY_ID.has(COMMUNITY_ALERT.cardId));
  assert.ok(Object.isFrozen(COMMUNITY_ALERT));
  assert.ok(Date.parse(COMMUNITY_ALERT.expiresAt) > Date.parse(COMMUNITY_ALERT.sourcedAt));
});
