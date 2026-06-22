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

// ── pickStreetFrontages ───────────────────────────────────────────────────────
import { pickStreetFrontages } from "./streetFaceSelect.js";

// A unit square footprint centered at origin, edges with outward normals.
// edge 0: south side (normal -z), edge 1: east (normal +x),
// edge 2: north (normal +z), edge 3: west (normal -x).
const SQUARE = [
  { tangent: { x: 1, z: 0 }, normal: { x: 0, z: -1 }, midpoint: { x: 0, z: -1 }, length: 2 },
  { tangent: { x: 0, z: 1 }, normal: { x: 1, z: 0 }, midpoint: { x: 1, z: 0 }, length: 2 },
  { tangent: { x: 1, z: 0 }, normal: { x: 0, z: 1 }, midpoint: { x: 0, z: 1 }, length: 2 },
  { tangent: { x: 0, z: 1 }, normal: { x: -1, z: 0 }, midpoint: { x: -1, z: 0 }, length: 2 },
];

test("corner lot: two perpendicular frontages, primary is the wider street", () => {
  // A street parallel to the south edge (runs along x) below it, width 50;
  // a street parallel to the east edge (runs along z) to its right, width 30.
  const streets = [
    { a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 50 }, // south frontage (edge 0)
    { a: { x: 3, z: -5 }, b: { x: 3, z: 5 }, width: 30 },   // east frontage (edge 1)
  ];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0, 1], "both perpendicular street faces are frontages");
  assert.equal(r.primary, 0, "primary = the wider (50ft) street face");
});

test("mid-block lot: one frontage", () => {
  const streets = [{ a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 40 }];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0]);
  assert.equal(r.primary, 0);
});

test("a blocked (non-exposed) frontage is not selected", () => {
  const streets = [{ a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 40 }];
  const r = pickStreetFrontages(SQUARE, [false, true, true, true], streets);
  assert.deepEqual(r.indices, [], "south face fronts the street but is party-walled");
  assert.equal(r.primary, -1);
});

test("no parallel street: empty result", () => {
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], []);
  assert.deepEqual(r.indices, []);
  assert.equal(r.primary, -1);
  assert.equal(r.nearest, -1);
});

test("nearest frontage = the street the building actually fronts, not the wider avenue a block away", () => {
  // South edge fronts a NARROW street just below it (dist 0.5). The North edge's
  // rear faces a WIDE avenue one block away (dist 9) — over-detected as a frontage
  // because it runs parallel. `primary` (widest street) lands on the rear avenue;
  // `nearest` must pick the near front so the DOOR doesn't end up on the backyard.
  const streets = [
    { a: { x: -5, z: -1.5 }, b: { x: 5, z: -1.5 }, width: 30 }, // near front  -> edge 0, dist 0.5
    { a: { x: -5, z: 10 },   b: { x: 5, z: 10 },   width: 60 }, // far rear ave -> edge 2, dist 9
  ];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0, 2], "both the near front and the far rear get detected as frontages");
  assert.equal(r.primary, 2, "primary = the wider avenue (the mis-pick the door fix routes around)");
  assert.equal(r.nearest, 0, "nearest = the near street the building actually fronts");
});

test("dists/widths run parallel to indices so callers can gate truly-addressed faces", () => {
  // South edge fronts a near street (dist 0.5); the north rear faces a parallel
  // street a block away (dist 9). Both detected, but an absolute distance gate
  // keeps only the near front.
  const streets = [
    { a: { x: -5, z: -1.5 }, b: { x: 5, z: -1.5 }, width: 30 }, // edge 0, dist 0.5
    { a: { x: -5, z: 10 },   b: { x: 5, z: 10 },   width: 60 }, // edge 2, dist 9
  ];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0, 2]);
  assert.ok(Math.abs(r.dists[0] - 0.5) < 1e-9, "near front dist");
  assert.ok(Math.abs(r.dists[1] - 9) < 1e-9, "far rear dist");
  assert.deepEqual(r.widths, [30, 60]);
  const addressed = r.indices.filter((_, k) => r.dists[k] <= 1.5);
  assert.deepEqual(addressed, [0], "only the near front is within an absolute gate");
});

test("nearest tie breaks to the longer edge (matches primary's tie rule)", () => {
  // Equidistant perpendicular frontages: south (edge 0) and east (edge 1), both dist 2.
  const streets = [
    { a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 30 },
    { a: { x: 3, z: -5 }, b: { x: 3, z: 5 }, width: 30 },
  ];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.equal(r.nearest, 0, "tie on distance -> longer edge -> lower index = edge 0");
});
