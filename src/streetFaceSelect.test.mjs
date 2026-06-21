// src/streetFaceSelect.test.mjs
// Run: node --test src/streetFaceSelect.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { edgeClearance, mostOpenExposedEdge, pickStreetFrontEdge } from "./streetFaceSelect.js";

// Clapboard pilot 3064605: a row running ±x with party walls on its ±x long sides
// (blocked) and both short ends (±z) open. It fronts a street parallel to its open
// ends (Greenpoint Ave runs ±x at z≈0), so the door must face +z (toward Greenpoint),
// not the open −z backyard. Both clearance heuristics tie/miss here — orientation wins.
test("pickStreetFrontEdge fronts the edge parallel to (and facing) a street, not the open backyard", () => {
  const tan = { x: 1, z: 0 };       // both short ends run ±x
  const edges = [
    { tangent: tan, normal: { x: 0, z: 1 },  midpoint: { x: 2.4, z: -7.2 } }, // +z, toward Greenpoint
    { tangent: tan, normal: { x: 0, z: -1 }, midpoint: { x: 2.4, z: -8.0 } }, // −z, backyard
  ];
  const exposed = [true, true];
  const streets = [
    { a: { x: -10, z: 0 }, b: { x: 21, z: 0 } },     // Greenpoint Ave, ±x at z=0 (+z side)
    { a: { x: 0, z: -8 },  b: { x: 0, z: 8 } },      // Franklin, ±z at x=0 (not parallel)
  ];
  assert.equal(pickStreetFrontEdge(edges, exposed, streets), 0);
});

test("pickStreetFrontEdge returns -1 when no exposed edge faces a parallel street", () => {
  const edges = [{ tangent: { x: 1, z: 0 }, normal: { x: 0, z: 1 }, midpoint: { x: 0, z: 5 } }];
  // only street runs ±x at z=0; this edge sits at z=5 and its normal points +z —
  // AWAY from the street (which is in the −z direction from the edge)
  const streets = [{ a: { x: -10, z: 0 }, b: { x: 10, z: 0 } }];
  assert.equal(pickStreetFrontEdge(edges, [true], streets), -1);
});

test("edgeClearance returns Infinity when nothing sits in front of the edge", () => {
  const edge = { midpoint: { x: 0, z: 0 }, normal: { x: 0, z: 1 } };
  // neighbour is BEHIND the edge (−z), so it does not block the +z front
  assert.equal(edgeClearance(edge, [{ x: 0, z: -3 }]), Infinity);
});

test("edgeClearance measures distance to a neighbour directly in front", () => {
  const edge = { midpoint: { x: 0, z: 0 }, normal: { x: 0, z: 1 } };
  assert.ok(Math.abs(edgeClearance(edge, [{ x: 0, z: 2.7 }]) - 2.7) < 1e-9);
});

test("edgeClearance ignores neighbours outside the frontal cone", () => {
  const edge = { midpoint: { x: 0, z: 0 }, normal: { x: 0, z: 1 } };
  // in front (+z) but far to the side (perp 2 > cone 0.5) → not blocking
  assert.equal(edgeClearance(edge, [{ x: 2, z: 0.3 }], 0.5), Infinity);
});

test("mostOpenExposedEdge picks the exposed edge with the most clearance, not the longest", () => {
  // Models the clapboard: two short open ends (+z) vs one longer blocked-ish end (−z).
  const edges = [
    { length: 0.25 }, // +z front A (open)
    { length: 0.28 }, // +z front B (open)
    { length: 0.56 }, // −x party wall (not exposed)
    { length: 0.53 }, // −z back (exposed but a neighbour 0.23 away)
  ];
  const exposed = [true, true, false, true];
  const clearance = [2.7, 2.7, Infinity, 0.23];
  // longest-exposed would wrongly pick index 3 (0.53). Open-aware picks the +z pair;
  // tie on clearance → longer of the two open edges = index 1.
  assert.equal(mostOpenExposedEdge(edges, exposed, clearance), 1);
});

test("mostOpenExposedEdge returns -1 when nothing is exposed", () => {
  assert.equal(mostOpenExposedEdge([{ length: 1 }], [false], [Infinity]), -1);
});
