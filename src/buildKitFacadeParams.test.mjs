// Run: node --test src/buildKitFacadeParams.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKitFacadeParams } from "./buildKitFacadeParams.js";
import { MATERIAL_WALL_TONES } from "./visualSystem/palette.js";

const rec = { bin: "1", sourceProperties: { numFloors: 3 } };

test("family defaults: tint = first family tone, storeys from classify, recessed windows + default weathering", () => {
  const p = buildKitFacadeParams(rec, "clapboard");
  assert.equal(p.family, "clapboard");
  assert.equal(p.tint, MATERIAL_WALL_TONES.clapboard[0]);
  assert.equal(p.storeys, 3);
  assert.equal(p.windowRecess, 0.12); // kit default: depth + projecting sill
  assert.equal(p.weathering, 0.35);
  assert.deepEqual(p.components, {});
  assert.equal("bays" in p, false);       // renderer derives
  assert.equal("corniceFrac" in p, false);
});

test("override wins field-by-field; tint snaps into the family palette", () => {
  const p = buildKitFacadeParams(rec, "brownstone", {
    tint: "0x000000", storeys: 5, bays: 3, weathering: 0.1,
    components: { cornice: false }, corniceFrac: 0.06, corniceProj: 0.05, windowRecess: 0.12,
  });
  assert.equal(p.storeys, 5);
  assert.equal(p.bays, 3);
  assert.equal(p.weathering, 0.1);
  assert.equal(p.windowRecess, 0.12);
  assert.equal(p.corniceFrac, 0.06);
  assert.equal(p.corniceProj, 0.05);
  assert.deepEqual(p.components, { cornice: false });
  assert.ok(MATERIAL_WALL_TONES.brownstone.includes(p.tint)); // snapped, not 0x000000
});

test("throws on unknown family", () => {
  assert.throws(() => buildKitFacadeParams(rec, "marble"), /unknown family/i);
});
