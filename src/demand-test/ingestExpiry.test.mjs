import test from "node:test";
import assert from "node:assert/strict";
import { expireCards, nyDateOf } from "./ingestExpiry.js";

const TODAY = "2026-07-25";

const card = (over) => ({
  id: "x", category: "event", endsAt: "2026-07-26T22:00:00-04:00", ...over,
});

test("nyDateOf maps a late-night UTC instant to its New York calendar day", () => {
  // 03:00Z on the 26th is still 23:00 on the 25th in New York.
  assert.equal(nyDateOf("2026-07-26T03:00:00Z"), "2026-07-25");
  assert.equal(nyDateOf("2026-07-25T19:00:00-04:00"), "2026-07-25");
});

test("events ending before today are deleted; today's and future events stay", () => {
  const { kept, deleted } = expireCards(
    [
      card({ id: "past", endsAt: "2026-07-24T21:00:00-04:00" }),
      card({ id: "today", endsAt: "2026-07-25T09:00:00-04:00" }),
      card({ id: "future" }),
      card({ id: "undated", endsAt: undefined }),
    ],
    TODAY,
  );
  assert.deepEqual(kept.map((c) => c.id), ["today", "future", "undated"]);
  assert.deepEqual(deleted.map((d) => d.id), ["past"]);
});

test("dated deals past endsAt are deleted; recurring deals are kept but flagged", () => {
  const { kept, deleted, flagged } = expireCards(
    [
      card({ id: "dated-deal", category: "discount", endsAt: "2026-07-20T23:59:00-04:00" }),
      card({ id: "standing-deal", category: "discount", recurring: true, endsAt: "2026-07-22T23:59:00-04:00" }),
      card({ id: "live-deal", category: "discount", recurring: true, endsAt: "2026-07-28T23:59:00-04:00" }),
    ],
    TODAY,
  );
  assert.deepEqual(kept.map((c) => c.id), ["standing-deal", "live-deal"]);
  assert.deepEqual(deleted.map((d) => d.id), ["dated-deal"]);
  assert.deepEqual(flagged, [{ id: "standing-deal", endsAt: "2026-07-22T23:59:00-04:00" }]);
});

test("non-event, non-deal categories never expire regardless of endsAt", () => {
  const { kept, deleted } = expireCards(
    [card({ id: "old-news", category: "news", endsAt: "2026-07-01T00:00:00-04:00" })],
    TODAY,
  );
  assert.equal(kept.length, 1);
  assert.equal(deleted.length, 0);
});

test("relatedCardIds pointing at deleted cards are pruned; empty arrays drop the key", () => {
  const { kept, pruned } = expireCards(
    [
      card({ id: "gone", endsAt: "2026-07-20T21:00:00-04:00" }),
      card({ id: "venue", endsAt: undefined, relatedCardIds: ["gone", "other-night"] }),
      card({ id: "other-night", relatedCardIds: ["venue"] }),
      card({ id: "orphaned", endsAt: undefined, relatedCardIds: ["gone"] }),
    ],
    TODAY,
  );
  const byId = (id) => kept.find((c) => c.id === id);
  assert.deepEqual(byId("venue").relatedCardIds, ["other-night"]);
  assert.ok(!("relatedCardIds" in byId("orphaned")), "emptied array drops the key (schema rejects [])");
  assert.deepEqual(pruned, [
    { id: "venue", removed: ["gone"] },
    { id: "orphaned", removed: ["gone"] },
  ]);
});

test("input cards are not mutated", () => {
  const venue = card({ id: "venue", endsAt: undefined, relatedCardIds: ["gone"] });
  expireCards([card({ id: "gone", endsAt: "2026-07-20T21:00:00-04:00" }), venue], TODAY);
  assert.deepEqual(venue.relatedCardIds, ["gone"]);
});
