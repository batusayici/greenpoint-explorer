import { test } from "node:test";
import assert from "node:assert/strict";
import {
  II_PALETTE,
  TYPOLOGY_PALETTE,
  resolveTypologyColor,
  FACADE_RELIEF,
  LIGHTING,
  TRADE_AWNING_TINT,
  MASSING,
  BRICK_TONES,
  DEBUG_PALETTE,
  ROOF_TONES,
  roofToneFor,
} from "./palette.js";

const isColorInt = (v) => Number.isInteger(v) && v >= 0 && v <= 0xffffff;

test("scene palette tokens are valid 24-bit color ints", () => {
  for (const [k, v] of Object.entries(II_PALETTE)) {
    if (k === "context") {
      assert.ok(Array.isArray(v) && v.every(isColorInt), "context array");
    } else if (k === "heroes") {
      assert.ok(Object.values(v).every(isColorInt), "heroes map");
    } else {
      assert.ok(isColorInt(v), `II_PALETTE.${k}`);
    }
  }
  for (const group of [FACADE_RELIEF, LIGHTING, TRADE_AWNING_TINT, MASSING, TYPOLOGY_PALETTE, DEBUG_PALETTE]) {
    assert.ok(Object.values(group).every(isColorInt), "token group");
  }
  assert.ok(BRICK_TONES.length > 0 && BRICK_TONES.every(isColorInt), "brick tones");
});

test("resolveTypologyColor maps known palettes and falls back to context[0]", () => {
  assert.equal(resolveTypologyColor({ palette: "typological.brick" }), TYPOLOGY_PALETTE["typological.brick"]);
  assert.equal(resolveTypologyColor({ palette: "unknown" }), II_PALETTE.context[0]);
  assert.equal(resolveTypologyColor(undefined), II_PALETTE.context[0]);
});

test("ROOF_TONES are valid dark, quiet color ints (one per family)", () => {
  const families = ["brick", "clapboard", "brownstone", "painted-masonry", "modern-flat", "warehouse"];
  for (const f of families) {
    assert.ok(isColorInt(ROOF_TONES[f]), `ROOF_TONES.${f} exists`);
    // Quiet/dark: no channel brighter than mid-grey (0x80) — never a bright slab.
    const c = ROOF_TONES[f];
    const max = Math.max((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff);
    assert.ok(max <= 0x80, `ROOF_TONES.${f} stays dark/quiet`);
  }
});

test("roofToneFor bridges typology vocab + canonical keys, safe-defaults to brick", () => {
  // canonical keys pass through
  assert.equal(roofToneFor("brick"), ROOF_TONES.brick);
  assert.equal(roofToneFor("painted-masonry"), ROOF_TONES["painted-masonry"]);
  assert.equal(roofToneFor("warehouse"), ROOF_TONES.warehouse);
  // classifyBuilding vocabulary aliases
  assert.equal(roofToneFor("brick-prewar"), ROOF_TONES.brick);
  assert.equal(roofToneFor("commercial-storefront"), ROOF_TONES.brick);
  assert.equal(roofToneFor("painted"), ROOF_TONES["painted-masonry"]);
  // unknown / missing → brick default (no bright slab)
  assert.equal(roofToneFor("nonsense"), ROOF_TONES.brick);
  assert.equal(roofToneFor(undefined), ROOF_TONES.brick);
  // stability guarantee: inked brick rowhouses keep the legacy MASSING.roofCap
  assert.equal(roofToneFor("brick"), MASSING.roofCap);
});

test("AWNING_SOFFIT-style reuse: soffit token is shared, not duplicated", () => {
  // FACADE_RELIEF.soffit doubles as the awning soffit in SceneView; assert it exists.
  assert.ok(isColorInt(FACADE_RELIEF.soffit));
});
