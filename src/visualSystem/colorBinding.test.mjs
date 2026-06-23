// Run: node --test src/visualSystem/colorBinding.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestPaletteToken } from "./colorBinding.js";
import { MATERIAL_WALL_TONES } from "./palette.js";

test("a near-black true color snaps to the darkest in-family token", () => {
  const tok = nearestPaletteToken(0x050505, "modern-flat");
  // Robust to gamut changes: a near-black sample must resolve to the family's
  // lowest-luminance member (the darkest ramp stop), not a hard-coded literal.
  const lumSum = (h) => ((h >> 16) & 255) + ((h >> 8) & 255) + (h & 255);
  const darkest = MATERIAL_WALL_TONES["modern-flat"].reduce((a, b) => (lumSum(b) < lumSum(a) ? b : a));
  assert.equal(tok, darkest);
});

test("a red-brick true color snaps to a warm brick token", () => {
  const tok = nearestPaletteToken(0xb05030, "brick");
  assert.ok(MATERIAL_WALL_TONES.brick.includes(tok));
  // RGB Euclidean from true (176,80,48): 0xa85a3c (168,90,60) is 308 units — the
  // nearest after the gamut expansion added the 144-franklin terracotta token;
  // the original 0x9c5a3c (156,90,60) is 644 units, now the runner-up.
  assert.equal(tok, 0xa85a3c);
});

test("result is always a member of the family candidate set", () => {
  for (const fam of Object.keys(MATERIAL_WALL_TONES)) {
    const tok = nearestPaletteToken(0x808080, fam);
    assert.ok(MATERIAL_WALL_TONES[fam].includes(tok), `${fam} stays in palette`);
  }
});

test("throws on an unknown family", () => {
  assert.throws(() => nearestPaletteToken(0x000000, "nope"), /unknown family/i);
});
