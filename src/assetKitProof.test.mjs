// Run: node --test src/assetKitProof.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetKitComponentFiles } from "./assetKitProof.js";

test("clapboard yields its valid wall-layer components, ground excluded", () => {
  const files = assetKitComponentFiles("clapboard");
  assert.deepEqual(files, [
    "clapboard-cornice.v1.png",
    "clapboard-door-stoop.v1.png",
    "clapboard-wall.v1.png",
    "clapboard-weathering.v1.png",
    "clapboard-window.v1.png",
  ]);
});

test("brick excludes the ground band from the wall-layer list", () => {
  const files = assetKitComponentFiles("brick");
  assert.ok(!files.includes("brick-ground.v1.png"), "ground is a band, not a wall layer");
  assert.ok(files.includes("brick-wall.v1.png"));
});

test("throws on unknown family", () => {
  assert.throws(() => assetKitComponentFiles("nope"), /unknown family/i);
});
