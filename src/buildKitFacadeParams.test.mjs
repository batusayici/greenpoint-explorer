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

test("commercialGround flag follows classifyBuilding ground-floor use (storefronts ≠ stoops)", () => {
  const residential = buildKitFacadeParams({ bin: "1", sourceProperties: { numFloors: 3 } }, "brick");
  assert.equal(residential.commercialGround, false); // gets a stoop
  const commercial = buildKitFacadeParams({ bin: "2", sourceProperties: { numFloors: 3, comArea: 1200 } }, "brick");
  assert.equal(commercial.commercialGround, true);    // must NOT get a stoop
});

test("groundFamily/groundTint default to the wall family (single-material)", () => {
  const p = buildKitFacadeParams(rec, "brick");
  assert.equal(p.groundFamily, "brick");
  assert.equal(p.groundTint, p.tint); // same as wall when not dual-material
});

test("dual-material: groundFamily override sets a distinct ground material + its own tint", () => {
  // 168 Franklin: brownstone ground floor, light brick above.
  const p = buildKitFacadeParams(rec, "brick", { groundFamily: "brownstone" });
  assert.equal(p.family, "brick");                              // upper wall stays brick
  assert.equal(p.groundFamily, "brownstone");                  // ground floor is brownstone
  assert.equal(p.groundTint, MATERIAL_WALL_TONES.brownstone[0]); // default ground tint = brownstone tone
  assert.notEqual(p.groundTint, p.tint);                       // distinct from the brick wall tint
});

test("explicit groundTint snaps into the ground family palette", () => {
  const p = buildKitFacadeParams(rec, "brick", { groundFamily: "brownstone", groundTint: "0x000000" });
  assert.ok(MATERIAL_WALL_TONES.brownstone.includes(p.groundTint)); // snapped, not 0x000000
});

import { nearestTrimToken } from "./visualSystem/colorBinding.js";

test("trim tints are absent without an override (byte-stable default)", () => {
  const p = buildKitFacadeParams({ bin: "1", sourceProperties: { yearBuilt: 1890 } }, "brick");
  assert.equal(p.windowTint, undefined);
  assert.equal(p.doorTint, undefined);
});

test("trim tints snap to TRIM_TONES when overridden", () => {
  const p = buildKitFacadeParams(
    { bin: "1", sourceProperties: { yearBuilt: 1890 } },
    "brick",
    { windowTint: "0x000000", doorTint: "0x6b2f28" },
  );
  assert.equal(p.windowTint, nearestTrimToken(0x000000));
  assert.equal(p.doorTint, nearestTrimToken(0x6b2f28));
});

test("corniceColor is absent without an override (byte-stable default)", () => {
  const p = buildKitFacadeParams({ bin: "1", sourceProperties: { yearBuilt: 1890 } }, "brick");
  assert.equal(p.corniceColor, undefined);
});

test("corniceColor snaps to TRIM_TONES when overridden", () => {
  const p = buildKitFacadeParams(
    { bin: "1", sourceProperties: { yearBuilt: 1890 } },
    "brick",
    { corniceTint: "0xe2dcc9" },
  );
  assert.equal(p.corniceColor, nearestTrimToken(0xe2dcc9));
});
