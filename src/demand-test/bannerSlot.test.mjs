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
