// Run: node --test src/kitCoverage.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { kitHas, familyHasKit, kitFile } from "./kitCoverage.js";

test("kitHas reflects the manifest per cell", () => {
  assert.equal(kitHas("brick", "wall"), true);
  assert.equal(kitHas("clapboard", "ground"), false); // clapboard wall runs to grade
  assert.equal(kitHas("modern-flat", "cornice"), false); // flat roof, no cornice
});

test("familyHasKit is true only for asset-backed families", () => {
  assert.equal(familyHasKit("brick"), true);
  assert.equal(familyHasKit("clapboard"), true);
  assert.equal(familyHasKit("brownstone"), true);
  assert.equal(familyHasKit("modern-flat"), true);
  assert.equal(familyHasKit("painted-masonry"), false);
  assert.equal(familyHasKit("warehouse"), false);
});

test("kitFile returns the PNG name or null", () => {
  assert.equal(kitFile("clapboard", "window"), "clapboard-window.v1.png");
  assert.equal(kitFile("modern-flat", "cornice"), null);
});
