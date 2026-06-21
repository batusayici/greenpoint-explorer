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

test("ladders connect consecutive balconies", () => {
  const fe = buildFireEscapeGeometry(base);
  assert.equal(fe.quads.filter((q) => q.role === "ladder").length, fe.balconies.length - 1);
});

test("relief variant has no balusters; lattice variant adds them", () => {
  const relief = buildFireEscapeGeometry({ ...base, variant: "relief" });
  const lattice = buildFireEscapeGeometry({ ...base, variant: "lattice" });
  assert.equal(relief.quads.filter((q) => q.role === "baluster").length, 0);
  assert.ok(lattice.quads.filter((q) => q.role === "baluster").length > 0);
});
