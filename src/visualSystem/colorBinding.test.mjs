// Run: node --test src/visualSystem/colorBinding.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestPaletteToken } from "./colorBinding.js";
import { MATERIAL_WALL_TONES } from "./palette.js";

test("a near-black true color snaps to the darkest in-family token", () => {
  const tok = nearestPaletteToken(0x050505, "modern-flat");
  assert.equal(tok, 0x1d201e); // black-adjacent, still in palette
});

test("a red-brick true color snaps to a warm brick token", () => {
  const tok = nearestPaletteToken(0xb05030, "brick");
  assert.ok(MATERIAL_WALL_TONES.brick.includes(tok));
  assert.equal(tok, 0x9c5a3c); // RGB Euclidean: (156,90,60) is 644 units from (176,80,48); (181,102,74) is 1185 units
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
