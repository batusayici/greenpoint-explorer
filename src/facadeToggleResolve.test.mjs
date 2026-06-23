import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHasCornice } from "./facadeToggleResolve.js";

test("hasCornice wins when set", () => {
  assert.equal(resolveHasCornice({ hasCornice: false }), false);
  assert.equal(resolveHasCornice({ hasCornice: true }), true);
});

test("falls back to components.cornice when hasCornice absent", () => {
  assert.equal(resolveHasCornice({ components: { cornice: false } }), false);
  assert.equal(resolveHasCornice({ components: {} }), true);
  assert.equal(resolveHasCornice({}), true);
});
