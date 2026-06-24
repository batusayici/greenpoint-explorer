// Run: node --test src/parapetInsets.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { planParapetInsets } from "./parapetInsets.js";

test("evenly spaces diamonds along a real frontage, clear of corners", () => {
  const { insets } = planParapetInsets({ edgeLengthM: 18 });
  // usable 16; floor(16/2.4)+1 = 7
  assert.equal(insets.length, 7);
  let prev = -1;
  for (const d of insets) {
    assert.ok(d.u > 0 && d.u < 1, `u ${d.u} inside`);
    assert.ok(d.u > prev, "monotonic");
    prev = d.u;
  }
  // symmetric about 0.5
  assert.ok(Math.abs(insets[0].u + insets[insets.length - 1].u - 1) < 1e-9);
});

test("single inset centers on a short-but-usable frontage", () => {
  const { insets } = planParapetInsets({ edgeLengthM: 3 });
  assert.equal(insets.length, 1);
  assert.equal(insets[0].u, 0.5);
});

test("too-short / invalid frontage yields none", () => {
  assert.deepEqual(planParapetInsets({ edgeLengthM: 2 }).insets, []);
  assert.deepEqual(planParapetInsets({ edgeLengthM: 0 }).insets, []);
  assert.deepEqual(planParapetInsets({}).insets, []);
});
