// Run: node --test src/storefrontCompose.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeStorefront } from "./storefrontCompose.js";

test("returns all sub-element rects", () => {
  const s = composeStorefront({ door: "left", awning: { has: true } });
  assert.ok(s.bulkhead, "bulkhead");
  assert.ok(Array.isArray(s.glazing) && s.glazing.length === 2, "two glazing panels");
  assert.ok(s.mullion, "mullion");
  assert.ok(s.transom, "transom");
  assert.ok(s.door, "door");
  assert.ok(s.sign, "sign");
  assert.ok(Array.isArray(s.frame) && s.frame.length === 4, "four frame borders");
});

test("structural bands tile the band [0,1] vertically with no gap or overlap", () => {
  const s = composeStorefront({ door: "left" });
  assert.equal(s.bulkhead.y0, 0, "bulkhead starts at 0");
  assert.equal(s.bulkhead.y1, s.glazing[0].y0, "bulkhead → glazing");
  assert.equal(s.glazing[0].y1, s.transom.y0, "glazing → transom");
  assert.equal(s.transom.y1, s.sign.y0, "transom → sign");
  assert.equal(s.sign.y1, 1, "sign ends at 1");
});

test("door column sits on the chosen side and glazing does not overlap it", () => {
  const left = composeStorefront({ door: "left" });
  assert.equal(left.door.x0, 0, "left door at x0=0");
  assert.ok(left.glazing[0].x0 >= left.door.x1 - 1e-9, "glazing right of left door");

  const right = composeStorefront({ door: "right" });
  assert.equal(right.door.x1, 1, "right door at x1=1");
  assert.ok(right.glazing[1].x1 <= right.door.x0 + 1e-9, "glazing left of right door");
});

test("all rects are within 0..1 and non-degenerate", () => {
  const s = composeStorefront({ door: "right", awning: { has: true } });
  const rects = [s.bulkhead, ...s.glazing, s.mullion, s.transom, s.door, s.sign, ...s.frame, s.awning];
  for (const r of rects) {
    assert.ok(r.x0 >= 0 && r.x1 <= 1, "x in range");
    assert.ok(r.y0 >= 0 && r.y1 <= 1, "y in range");
    assert.ok(r.x1 > r.x0 && r.y1 > r.y0, "non-degenerate");
  }
});

test("awning is null without one and proud (above glazing) with one", () => {
  assert.equal(composeStorefront({ awning: { has: false } }).awning, null, "no awning");
  const s = composeStorefront({ awning: { has: true } });
  assert.ok(s.awning.y0 >= s.glazing[0].y1 - 1e-9, "awning sits at/above glazing top");
});
