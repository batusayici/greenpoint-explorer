// Run: node --test src/materialFamilies.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { familyList, componentList, isValidCell, validCells } from "./materialFamilies.js";

test("exposes the six canonical families", () => {
  assert.deepEqual(familyList(), [
    "brick", "clapboard", "brownstone", "painted-masonry", "modern-flat", "warehouse",
  ]);
});

test("every family's cells reference only declared components", () => {
  const comps = new Set(componentList());
  for (const c of validCells()) assert.ok(comps.has(c.component), `${c.component} declared`);
});

test("known sparse cells are excluded", () => {
  assert.equal(isValidCell("clapboard", "roll-gate"), false);
  assert.equal(isValidCell("modern-flat", "cornice"), false);
  assert.equal(isValidCell("warehouse", "awning"), false);
});

test("known real cells are included", () => {
  assert.equal(isValidCell("brick", "cornice"), true);
  assert.equal(isValidCell("clapboard", "wall"), true);
  assert.equal(isValidCell("warehouse", "roll-gate"), true);
});

test("isValidCell is false for unknown family or component", () => {
  assert.equal(isValidCell("nope", "wall"), false);
  assert.equal(isValidCell("brick", "nope"), false);
});
