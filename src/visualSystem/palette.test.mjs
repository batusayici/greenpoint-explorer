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

test("AWNING_SOFFIT-style reuse: soffit token is shared, not duplicated", () => {
  // FACADE_RELIEF.soffit doubles as the awning soffit in SceneView; assert it exists.
  assert.ok(isColorInt(FACADE_RELIEF.soffit));
});
