// Run: node --test src/binAddress.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { addressForBin } from "./binAddress.js";

test("returns the street address for a known BIN", () => {
  assert.equal(addressForBin("3064541"), "168 FRANKLIN STREET");
  assert.equal(addressForBin("3064605"), "95 KENT STREET");
});

test("returns null for an unknown BIN", () => {
  assert.equal(addressForBin("0000000"), null);
});
