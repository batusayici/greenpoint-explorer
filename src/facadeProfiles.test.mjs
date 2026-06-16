// Pure-geometry tests for opening profiles.
// Run: node --test src/facadeProfiles.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { openingProfile, springYOf } from "./facadeProfiles.js";

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const has = (pts, x, y, eps = 1e-9) =>
  assert.ok(pts.some((p) => Math.abs(p.x - x) < eps && Math.abs(p.y - y) < eps), `expected point (${x},${y})`);

test("rect (default) returns four corners and no fillers", () => {
  const { outline, fillers } = openingProfile({ x0: 0.2, x1: 0.4, y0: 0.1, y1: 0.5 });
  assert.equal(outline.length, 4);
  assert.equal(fillers.length, 0);
  has(outline, 0.2, 0.1); has(outline, 0.4, 0.1); has(outline, 0.4, 0.5); has(outline, 0.2, 0.5);
});

test("springYOf defaults to the box midpoint", () => {
  close(springYOf({ y0: 0.1, y1: 0.5 }), 0.3);
  close(springYOf({ y0: 0.1, y1: 0.5, springY: 0.42 }), 0.42);
});

test("arch silhouette: straight jambs to springY, crown at y1 center", () => {
  const rect = { x0: 0.2, x1: 0.4, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 };
  const { outline, fillers } = openingProfile(rect, 8);
  has(outline, 0.2, 0.0); has(outline, 0.4, 0.0);
  has(outline, 0.4, 0.4); has(outline, 0.2, 0.4);
  has(outline, 0.3, 0.6);
  assert.equal(fillers.length, 2);
  close(fillers[0][0].y, 0.6);
  close(fillers[1][0].y, 0.6);
});

test("arch arc points stay within the bounding box", () => {
  const rect = { x0: 0.2, x1: 0.4, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 };
  const { outline } = openingProfile(rect, 16);
  for (const p of outline) {
    assert.ok(p.x >= 0.2 - 1e-9 && p.x <= 0.4 + 1e-9, `x in box: ${p.x}`);
    assert.ok(p.y >= 0.0 - 1e-9 && p.y <= 0.6 + 1e-9, `y in box: ${p.y}`);
  }
});

test("circle silhouette is symmetric and bbox-inscribed with four fillers", () => {
  const rect = { x0: 0.0, x1: 0.4, y0: 0.0, y1: 0.4, shape: "circle" };
  const { outline, fillers } = openingProfile(rect, 16);
  has(outline, 0.4, 0.2); has(outline, 0.0, 0.2);
  has(outline, 0.2, 0.4); has(outline, 0.2, 0.0);
  assert.equal(fillers.length, 4);
  const corners = [[0,0],[0.4,0],[0.4,0.4],[0,0.4]];
  for (const f of fillers) {
    assert.ok(corners.some((c) => Math.abs(c[0]-f[0].x) < 1e-9 && Math.abs(c[1]-f[0].y) < 1e-9), "apex is a bbox corner");
  }
});

test("rect has no revealCurve", () => {
  const { revealCurve } = openingProfile({ x0: 0.2, x1: 0.4, y0: 0.1, y1: 0.5 });
  assert.equal(revealCurve, null);
});

test("arch revealCurve is the open head arc (spring → crown → spring)", () => {
  const rect = { x0: 0.2, x1: 0.4, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 };
  const { revealCurve } = openingProfile(rect, 8);
  assert.equal(revealCurve.closed, false);
  assert.equal(revealCurve.points.length, 9); // segments + 1
  // endpoints at the jamb tops, crown at center-top
  has(revealCurve.points, 0.4, 0.4); has(revealCurve.points, 0.2, 0.4);
  has(revealCurve.points, 0.3, 0.6);
});

test("circle revealCurve is the closed ring (== outline)", () => {
  const rect = { x0: 0.0, x1: 0.4, y0: 0.0, y1: 0.4, shape: "circle" };
  const { outline, revealCurve } = openingProfile(rect, 16);
  assert.equal(revealCurve.closed, true);
  assert.equal(revealCurve.points.length, outline.length);
});
