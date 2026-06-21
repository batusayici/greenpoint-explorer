// src/stoopGeometry.test.mjs
// Run: node --test src/stoopGeometry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStoopGeometry } from "./stoopGeometry.js";

const base = { frontM: 8, doorCenterM: 4 };

test("emits steps, cheeks, and a platform", () => {
  const s = buildStoopGeometry({ ...base, stepCount: 7 });
  const roles = s.quads.map((q) => q.role);
  assert.equal(roles.filter((r) => r === "tread").length, 7);
  assert.equal(roles.filter((r) => r === "riser").length, 7);
  assert.ok(roles.includes("cheek"));
  assert.equal(roles.filter((r) => r === "platform").length, 1);
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
