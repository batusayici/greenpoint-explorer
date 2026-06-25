// src/stoopGeometry.test.mjs
// Run: node --test src/stoopGeometry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStoopGeometry } from "./stoopGeometry.js";

const base = { frontM: 8, doorCenterM: 4 };

test("emits steps, raked side walls with newels, and a platform", () => {
  const s = buildStoopGeometry({ ...base, stepCount: 7 });
  const roles = s.quads.map((q) => q.role);
  assert.equal(roles.filter((r) => r === "tread").length, 7);
  assert.equal(roles.filter((r) => r === "riser").length, 7);
  assert.ok(roles.includes("cheek"));   // raked outer side-wall face, one per side
  assert.ok(roles.includes("coping"));  // sloped wall top
  assert.equal(roles.filter((r) => r === "cheek").length, 2);
  assert.equal(roles.filter((r) => r === "newel").length, 8); // 4 faces × 2 posts
  assert.equal(roles.filter((r) => r === "platform").length, 1);
});

test("side walls are RAKED: lower at the sidewalk than at the house (not a box)", () => {
  const s = buildStoopGeometry({ ...base, parlorHeightM: 1.3, cheekFrontHeightM: 0.55 });
  const cheek = s.quads.find((q) => q.role === "cheek");
  // every corner's height (v) must stay at/below the parlor top, and the wall must
  // actually slope: the tallest corner (back, at the house) exceeds the lowest.
  const vs = cheek.corners.map((c) => c[1]);
  const maxV = Math.max(...vs), minV = Math.min(...vs);
  assert.ok(maxV > minV + 0.3);                 // a real rake, not a flat-top box
  assert.ok(Math.abs(maxV - 1.3) < 1e-9);       // full height at the house
  // the corner sitting farthest out (front) is one of the LOW corners
  const frontCorner = cheek.corners.reduce((a, b) => (b[2] > a[2] ? b : a));
  assert.ok(frontCorner[1] <= 0.56);
});

test("newel posts stand at the stoop's sidewalk corners", () => {
  const s = buildStoopGeometry({ ...base, projectionM: 1.4, newelHeightM: 0.72 });
  const newels = s.quads.filter((q) => q.role === "newel");
  // posts reach the front (w≈projection) and rise above the steps' first tread
  assert.ok(newels.some((q) => q.corners.some((c) => Math.abs(c[2] - 1.4) < 1e-9)));
  assert.ok(newels.some((q) => q.corners.some((c) => c[1] >= 0.7)));
});

test("treads climb monotonically to the parlor floor", () => {
  const s = buildStoopGeometry({ ...base, parlorHeightM: 1.4, stepCount: 7 });
  const treadV = s.quads.filter((q) => q.role === "tread").map((q) => q.corners[0][1]);
  for (let i = 1; i < treadV.length; i++) assert.ok(treadV[i] > treadV[i - 1]);
  assert.ok(Math.abs(s.topV - 1.4) < 1e-9);
});

test("steps project out from the wall and recede toward it", () => {
  const s = buildStoopGeometry({ ...base, projectionM: 1.4, stepCount: 7 });
  const treads = s.quads.filter((q) => q.role === "tread");
  // bottom tread sits farthest out (w≈projection), top tread nearest the wall
  assert.ok(treads[0].corners[0][2] > treads[treads.length - 1].corners[0][2]);
});

test("door stays centered within the stoop width", () => {
  const s = buildStoopGeometry({ ...base, widthM: 1.3 });
  assert.ok(Math.abs((s.uL + s.uR) / 2 - 4) < 1e-9);
  assert.ok(Math.abs(s.uR - s.uL - 1.3) < 1e-9);
});

test("groundReliefM raises the parlor floor (8.5 basement hook)", () => {
  const s = buildStoopGeometry({ ...base, parlorHeightM: 1.3, groundReliefM: 0.6 });
  assert.ok(Math.abs(s.topV - 1.9) < 1e-9);
});
