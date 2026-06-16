// src/storefrontRoster.test.mjs
// Run: node --test src/storefrontRoster.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { dedupeByProximity } from "./storefrontRoster.js";

test("collapses the same business surfaced twice across overlapping bboxes", () => {
  const out = dedupeByProximity(
    [
      { name: "Land of Barbers", category: "hairdresser", scenePoint: { x: 10, z: 5 } },
      { name: "The Land of Barbers", category: "hairdresser", scenePoint: { x: 10.1, z: 5.05 } },
    ],
    1,
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].name, "Land of Barbers"); // first survivor's slot preserved
});

test("keeps distinct businesses even when close", () => {
  const out = dedupeByProximity(
    [
      { name: "Maman", category: "cafe", scenePoint: { x: 0, z: 0 } },
      { name: "Big Night", category: "deli", scenePoint: { x: 0.2, z: 0.1 } },
    ],
    1,
  );
  assert.equal(out.length, 2);
});

test("does not merge similar names that are far apart", () => {
  const out = dedupeByProximity(
    [
      { name: "Land of Barbers", scenePoint: { x: 0, z: 0 } },
      { name: "The Land of Barbers", scenePoint: { x: 50, z: 50 } },
    ],
    1,
  );
  assert.equal(out.length, 2);
});

test("the higher-ranked duplicate's fields win the merge", () => {
  const out = dedupeByProximity(
    [
      { name: "Cafe X", scenePoint: { x: 1, z: 1 }, activeStatus: "unverified", confidence: "overflow" },
      { name: "Cafe X", scenePoint: { x: 1.05, z: 1 }, activeStatus: "verified", confidence: "high", sourceId: "osm-2" },
    ],
    1,
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].activeStatus, "verified");
  assert.equal(out[0].sourceId, "osm-2");
});

test("short generic tokens do not swallow distinct shops", () => {
  // "Deli" (4 chars) must not match "Joe's Deli" by containment.
  const out = dedupeByProximity(
    [
      { name: "Deli", scenePoint: { x: 0, z: 0 } },
      { name: "Joe's Deli", scenePoint: { x: 0.1, z: 0 } },
    ],
    1,
  );
  assert.equal(out.length, 2);
});

test("records without a scenePoint pass through untouched", () => {
  const out = dedupeByProximity(
    [
      { name: "A", scenePoint: null },
      { name: "A", scenePoint: null },
    ],
    1,
  );
  assert.equal(out.length, 2);
});

test("empty input yields empty output", () => {
  assert.deepEqual(dedupeByProximity([], 1), []);
});
