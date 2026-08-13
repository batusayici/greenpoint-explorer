import test from "node:test";
import assert from "node:assert/strict";
import { safeStorage, bootSafely } from "./boot.js";
import { recordReturnVisit } from "./returnVisit.js";
import { shouldShowOrientation } from "./firstVisitOrientation.js";

// The rule under test: nothing that runs before the render may prevent the
// render (2026-08-13). Found while auditing why the map bug went uncaught —
// main.jsx read window.localStorage at module scope, which THROWS on the
// property read when a browser blocks site data, killing the module before
// createRoot() and leaving #root empty with no boundary able to help.

test("safeStorage returns the store when it is reachable", () => {
  const fake = { getItem: () => "x" };
  assert.equal(safeStorage("localStorage", { localStorage: fake }), fake);
});

test("safeStorage returns null when READING the property throws", () => {
  // The real failure shape: not getItem failing, the property access itself.
  const hostile = {
    get localStorage() {
      throw new Error("SecurityError: Access is denied for this document.");
    },
  };
  assert.equal(safeStorage("localStorage", hostile), null);
});

test("safeStorage returns null when the property is simply absent", () => {
  assert.equal(safeStorage("localStorage", {}), null);
});

test("the storage consumers fail closed on a null store rather than throwing", () => {
  // safeStorage's contract only holds if null is safe downstream — otherwise
  // the guard would just move the crash one line later.
  assert.equal(recordReturnVisit({ local: null, session: null, now: Date.now() }), null);
  assert.equal(shouldShowOrientation(null), false);
});

test("bootSafely returns the value when the step succeeds", () => {
  assert.equal(bootSafely("fine", () => 42), 42);
});

test("bootSafely swallows a throw, reports it, and returns undefined", () => {
  const logged = [];
  const result = bootSafely("analytics", () => {
    throw new Error("vendor exploded");
  }, { onError: (...args) => logged.push(args) });

  assert.equal(result, undefined);
  assert.equal(logged.length, 1);
  assert.match(logged[0][0], /analytics/);
  assert.equal(logged[0][1].message, "vendor exploded");
});

test("one failing boot step does not skip the steps after it", () => {
  // Why this is per-step instead of one try/catch around the whole sequence:
  // a dead analytics vendor must not also cost the reader their first-visit
  // orientation line.
  const ran = [];
  const noop = () => {};
  bootSafely("first", () => { throw new Error("boom"); }, { onError: noop });
  bootSafely("second", () => ran.push("second"), { onError: noop });
  assert.deepEqual(ran, ["second"]);
});
