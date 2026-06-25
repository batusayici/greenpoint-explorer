// Run: node --test src/storefrontSeating.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { planStorefrontSeating } from "./storefrontSeating.js";

test("lays out evenly spaced tables along a real frontage", () => {
  const { tables, offsetM } = planStorefrontSeating({ edgeLengthM: 18 });
  // usable = 18 - 3 = 15; floor(15/2.6)+1 = 6
  assert.equal(tables.length, 6);
  assert.equal(offsetM, 1.25);
  // all u strictly inside (0,1) and monotonic increasing
  let prev = -1;
  for (const t of tables) {
    assert.ok(t.u > 0 && t.u < 1, `u ${t.u} in range`);
    assert.ok(t.u > prev, "u monotonic");
    prev = t.u;
    assert.equal(t.offsetM, 1.25);
  }
});

test("a single table centers on a short-but-usable frontage", () => {
  const { tables } = planStorefrontSeating({ edgeLengthM: 4 });
  assert.equal(tables.length, 1);
  assert.equal(tables[0].u, 0.5);
});

test("too-short / invalid frontage yields no tables", () => {
  assert.deepEqual(planStorefrontSeating({ edgeLengthM: 3 }).tables, []);
  assert.deepEqual(planStorefrontSeating({ edgeLengthM: 0 }).tables, []);
  assert.deepEqual(planStorefrontSeating({}).tables, []);
});

test("respects custom spacing/margin", () => {
  const { tables } = planStorefrontSeating({ edgeLengthM: 20, spacingM: 5, marginM: 2 });
  // usable 16; floor(16/5)+1 = 4
  assert.equal(tables.length, 4);
});
