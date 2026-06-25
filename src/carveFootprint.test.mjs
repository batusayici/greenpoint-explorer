import { test } from "node:test";
import assert from "node:assert/strict";
import { splitFootprintAtX, carveEastFraction } from "./carveFootprint.js";

// A 10-wide square footprint (x 0..10, z 0..4).
const square = [
  { x: 0, z: 0 },
  { x: 10, z: 0 },
  { x: 10, z: 4 },
  { x: 0, z: 4 },
];

test("splitFootprintAtX cuts a square into east + west halves at the line", () => {
  const { east, west } = splitFootprintAtX(square, 6);
  // east half: x in [6,10]
  assert.ok(east.length >= 4);
  assert.ok(east.every((p) => p.x >= 6 - 1e-9));
  assert.ok(east.some((p) => p.x === 10));
  assert.ok(east.some((p) => p.x === 6)); // inserted cut vertices
  // west half: x in [0,6]
  assert.ok(west.every((p) => p.x <= 6 + 1e-9));
  assert.ok(west.some((p) => p.x === 0));
  assert.ok(west.some((p) => p.x === 6));
});

test("cut vertices preserve the z extent of the crossed edges", () => {
  const { east } = splitFootprintAtX(square, 6);
  const zs = east.filter((p) => p.x === 6).map((p) => p.z).sort();
  assert.deepEqual(zs, [0, 4]); // the cut spans the full height
});

test("carveEastFraction keeps the easternmost frac of the x-extent", () => {
  const { keep, rest, xCut } = carveEastFraction(square, 0.4); // keep east 40%
  assert.equal(xCut, 6); // 10 - 0.4*10
  assert.ok(keep.every((p) => p.x >= 6 - 1e-9));
  assert.ok(rest.every((p) => p.x <= 6 + 1e-9));
});

test("a closing duplicate vertex is tolerated", () => {
  const closed = [...square, { x: 0, z: 0 }];
  const { east } = splitFootprintAtX(closed, 5);
  assert.ok(east.length >= 4);
  assert.ok(east.every((p) => p.x >= 5 - 1e-9));
});

test("degenerate input returns empty", () => {
  assert.deepEqual(splitFootprintAtX([{ x: 0, z: 0 }], 1).east, []);
});
