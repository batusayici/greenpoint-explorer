import test from "node:test";
import assert from "node:assert/strict";
import { bannerSlot } from "./bannerSlot.js";

const ALERT = { cardId: "film-noir-support" };

// One banner at a time (Batu, 2026-07-26): the slot shows only the most
// consequential message. Imminent/live disruption > community alert >
// distant-closure FYI chip > nothing.
test("an imminent or live G closure outranks a community alert", () => {
  assert.deepEqual(bannerSlot("near", ALERT), { kind: "gtrain", phase: "near" });
  assert.deepEqual(bannerSlot("active", ALERT), { kind: "gtrain", phase: "active" });
});

test("a community alert outranks the distant-closure chip", () => {
  assert.deepEqual(bannerSlot("distant", ALERT), { kind: "community", alert: ALERT });
  assert.deepEqual(bannerSlot(null, ALERT), { kind: "community", alert: ALERT });
});

test("no community alert → the G phase has the slot to itself", () => {
  assert.deepEqual(bannerSlot("distant", null), { kind: "gtrain", phase: "distant" });
  assert.deepEqual(bannerSlot("near", null), { kind: "gtrain", phase: "near" });
});

test("nothing to say → empty slot (silence is the default state)", () => {
  assert.equal(bannerSlot(null, null), null);
});

// L11 (2026-07-28): staleness enters the ladder as a status line — below the
// things that change your day (closure, community alert), above the distant
// FYI chip. It appears ONLY when freshness fails; a fresh feed stays silent,
// so the charter's silence-default holds.
const STALE = { fresh: false, verifiedThrough: "2026-07-26T09:07:00-04:00" };
const FRESH = { fresh: true, verifiedThrough: "2026-07-28T09:07:00-04:00" };

test("stale data yields a freshness status when nothing more consequential holds the slot", () => {
  assert.deepEqual(bannerSlot(null, null, STALE), {
    kind: "freshness",
    verifiedThrough: "2026-07-26T09:07:00-04:00",
  });
});

test("closure and community alert both outrank the freshness status", () => {
  assert.equal(bannerSlot("active", null, STALE).kind, "gtrain");
  assert.equal(bannerSlot(null, ALERT, STALE).kind, "community");
});

test("freshness status outranks the distant-closure chip", () => {
  assert.equal(bannerSlot("distant", null, STALE).kind, "freshness");
});

test("fresh feed → the slot behaves exactly as before (silence, chip, etc.)", () => {
  assert.equal(bannerSlot(null, null, FRESH), null);
  assert.deepEqual(bannerSlot("distant", null, FRESH), { kind: "gtrain", phase: "distant" });
});
