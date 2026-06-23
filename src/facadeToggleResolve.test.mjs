import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHasCornice, resolveFireEscape } from "./facadeToggleResolve.js";

test("hasCornice wins when set", () => {
  assert.equal(resolveHasCornice({ hasCornice: false }), false);
  assert.equal(resolveHasCornice({ hasCornice: true }), true);
});

test("falls back to components.cornice when hasCornice absent", () => {
  assert.equal(resolveHasCornice({ components: { cornice: false } }), false);
  assert.equal(resolveHasCornice({ components: {} }), true);
  assert.equal(resolveHasCornice({}), true);
});

test("fireEscape false suppresses even when heuristic wants it", () => {
  assert.deepEqual(resolveFireEscape({ fireEscape: false }, true), { on: false, variant: "relief" });
});

test("fireEscape absent defers to heuristic", () => {
  assert.equal(resolveFireEscape({}, true).on, true);
  assert.equal(resolveFireEscape({}, false).on, false);
});

test("fireEscape string forces on + selects variant", () => {
  assert.deepEqual(resolveFireEscape({ fireEscape: "lattice" }, false), { on: true, variant: "lattice" });
  assert.deepEqual(resolveFireEscape({ fireEscape: "standard" }, false), { on: true, variant: "relief" });
});
