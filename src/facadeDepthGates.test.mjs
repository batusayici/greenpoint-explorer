// src/facadeDepthGates.test.mjs
// Run: node --test src/facadeDepthGates.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { wantsStoop, wantsFireEscape } from "./facadeDepthGates.js";

test("residential rowhouse families get a stoop, modern + storefront do not", () => {
  assert.equal(wantsStoop("brick"), true);
  assert.equal(wantsStoop("clapboard"), true);
  assert.equal(wantsStoop("brownstone"), true);
  assert.equal(wantsStoop("modern-flat"), false);
  assert.equal(wantsStoop("warehouse"), false);
});

test("fire escapes only on prewar masonry at >=4 storeys", () => {
  assert.equal(wantsFireEscape("brownstone", 4), true); // pilot 3064541
  assert.equal(wantsFireEscape("brick", 4), true);
  assert.equal(wantsFireEscape("brick", 3), false);     // pilot 3064677 (low-rise)
  assert.equal(wantsFireEscape("clapboard", 5), false); // wood frame, rear escapes
  assert.equal(wantsFireEscape("modern-flat", 6), false);
});
