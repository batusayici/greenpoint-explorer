// Run: node --test src/chamferCorner.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { chamferCorner } from "./chamferCorner.js";

// A 10x10 square (open ring), corner at (10,10).
const sq = [
  { x: 0, z: 0 }, { x: 10, z: 0 }, { x: 10, z: 10 }, { x: 0, z: 10 },
];

test("cuts the nearest corner into two inset vertices", () => {
  const out = chamferCorner(sq, { x: 10, z: 10 }, 2);
  assert.equal(out.length, 5); // 4 - 1 corner + 2 = 5
  // the (10,10) corner is gone, replaced by (10,8) and (8,10) in winding order
  const has = (x, z) => out.some((p) => Math.abs(p.x - x) < 1e-9 && Math.abs(p.z - z) < 1e-9);
  assert.ok(!has(10, 10), "original corner removed");
  assert.ok(has(10, 8), "inset along incoming edge");
  assert.ok(has(8, 10), "inset along outgoing edge");
});

test("chamfer edge length is sqrt(2)*inset for a 90° corner", () => {
  const out = chamferCorner(sq, { x: 10, z: 10 }, 2);
  // find the two new points adjacent in the ring
  const i = out.findIndex((p) => p.x === 10 && p.z === 8);
  const a = out[i], b = out[i + 1];
  assert.ok(Math.abs(Math.hypot(b.x - a.x, b.z - a.z) - Math.SQRT2 * 2) < 1e-9);
});

test("preserves a closed ring (duplicate first/last vertex)", () => {
  const closed = [...sq, { x: 0, z: 0 }];
  const out = chamferCorner(closed, { x: 10, z: 10 }, 2);
  assert.equal(out[0].x, out[out.length - 1].x);
  assert.equal(out[0].z, out[out.length - 1].z);
});

test("inset never crosses the edge midpoint (clamped)", () => {
  const out = chamferCorner(sq, { x: 10, z: 10 }, 999);
  const has = (x, z) => out.some((p) => Math.abs(p.x - x) < 1e-6 && Math.abs(p.z - z) < 1e-6);
  assert.ok(has(10, 5.1) || out.some((p) => p.x === 10 && Math.abs(p.z - 5.1) < 0.001), "clamped to ~0.49 of edge");
});

test("degenerate inputs pass through", () => {
  assert.equal(chamferCorner([{ x: 0, z: 0 }], { x: 0, z: 0 }, 2).length, 1);
  assert.equal(chamferCorner(sq, { x: 10, z: 10 }, 0), sq);
});
