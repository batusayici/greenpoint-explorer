// src/fireEscapeGeometry.test.mjs
// Run: node --test src/fireEscapeGeometry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFireEscapeGeometry } from "./fireEscapeGeometry.js";

const base = { frontM: 8, heightM: 14, storeys: 4 };

test("one balcony per upper storey, none on the ground floor or roof", () => {
  const fe = buildFireEscapeGeometry(base);
  assert.equal(fe.balconies.length, 3); // storeys 1,2,3 floor lines
  assert.ok(fe.balconies.every((v) => v > 0 && v < base.heightM));
  assert.equal(fe.quads.filter((q) => q.role === "deck").length, 3);
});

test("decks project out from the wall by the requested depth", () => {
  const fe = buildFireEscapeGeometry({ ...base, projectionM: 0.9 });
  const deck = fe.quads.find((q) => q.role === "deck");
  const maxW = Math.max(...deck.corners.map((c) => c[2]));
  assert.ok(Math.abs(maxW - 0.9) < 1e-9);
});

test("each flight is an OPEN stair: two stringers + stepped treads + a handrail", () => {
  const fe = buildFireEscapeGeometry(base);
  const flights = fe.balconies.length - 1;
  assert.equal(fe.quads.filter((q) => q.role === "stringer").length, flights * 2);
  assert.equal(fe.quads.filter((q) => q.role === "handrail").length, flights);
  assert.ok(fe.quads.filter((q) => q.role === "tread").length >= flights * 2, "treads march down");
});

test("a stringer is diagonal: it spans two floor lines and slants horizontally", () => {
  const fe = buildFireEscapeGeometry(base);
  const s = fe.quads.find((q) => q.role === "stringer");
  const ys = s.corners.map((c) => c[1]);
  const xs = s.corners.map((c) => c[0]);
  assert.ok(Math.max(...ys) - Math.min(...ys) > 1e-6, "spans a storey in height");
  const top = s.corners.filter((c) => c[1] === Math.max(...ys)).map((c) => c[0]);
  const bot = s.corners.filter((c) => c[1] === Math.min(...ys)).map((c) => c[0]);
  assert.ok(Math.abs(Math.min(...top) - Math.min(...bot)) > 1e-6, "ends offset horizontally");
  assert.ok(Math.max(...xs) <= base.frontM, "stays within the front");
});

test("a rungs drop-ladder hangs off the lowest balcony", () => {
  const fe = buildFireEscapeGeometry(base);
  const rails = fe.quads.filter((q) => q.role === "ladderRail");
  const rungs = fe.quads.filter((q) => q.role === "rung");
  assert.equal(rails.length, 2, "two side rails");
  assert.ok(rungs.length >= 2, "has rungs");
  const lowest = Math.min(...fe.balconies);
  const ladderBottom = Math.min(...rails.flatMap((r) => r.corners.map((c) => c[1])));
  assert.ok(ladderBottom < lowest, "descends below the lowest balcony");
});

test("relief variant has no balusters; lattice variant adds them", () => {
  const relief = buildFireEscapeGeometry({ ...base, variant: "relief" });
  const lattice = buildFireEscapeGeometry({ ...base, variant: "lattice" });
  assert.equal(relief.quads.filter((q) => q.role === "baluster").length, 0);
  assert.ok(lattice.quads.filter((q) => q.role === "baluster").length > 0);
});
