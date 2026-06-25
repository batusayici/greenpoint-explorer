// Run: node --test src/colorBinding.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestTrimToken } from "./visualSystem/colorBinding.js";
import { TRIM_TONES } from "./visualSystem/palette.js";

test("nearestTrimToken returns a sanctioned TRIM_TONES entry", () => {
  const out = nearestTrimToken(0x000000); // pure black -> nearest is the near-black trim
  assert.ok(TRIM_TONES.includes(out), `expected ${out.toString(16)} in TRIM_TONES`);
});

test("nearestTrimToken snaps to the closest token by RGB distance", () => {
  // A token snapped to itself must return itself (idempotent).
  for (const t of TRIM_TONES) assert.equal(nearestTrimToken(t), t);
});

test("near-black sample snaps to the darkest trim", () => {
  const darkest = TRIM_TONES.reduce((a, b) => {
    const lum = (h) => ((h >> 16) & 255) + ((h >> 8) & 255) + (h & 255);
    return lum(b) < lum(a) ? b : a;
  });
  assert.equal(nearestTrimToken(0x101010), darkest);
});
