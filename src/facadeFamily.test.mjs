// Run: node --test src/facadeFamily.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveFacadeFamily, isValidFacadeOverride } from "./facadeFamily.js";

const brickRec = { bin: "1", sourceProperties: { yearBuilt: 1890 } };       // -> brick-prewar
const newRec = { bin: "2", sourceProperties: { yearBuilt: 2014 } };          // -> painted-masonry
const warehouseRec = { bin: "3", sourceProperties: { bldgClass: "F5" } };    // -> warehouse

test("override family wins (tier curated)", () => {
  const r = resolveFacadeFamily(brickRec, { overrides: { "1": { family: "brownstone" } } });
  assert.deepEqual(r, { family: "brownstone", evidenceTier: "curated" });
});

test("pilot map applies when no override (tier pilot-unverified)", () => {
  const r = resolveFacadeFamily(brickRec, { pilotBins: { "1": "clapboard" } });
  assert.deepEqual(r, { family: "clapboard", evidenceTier: "pilot-unverified" });
});

test("override outranks pilot", () => {
  const r = resolveFacadeFamily(brickRec, { overrides: { "1": { family: "brownstone" } }, pilotBins: { "1": "clapboard" } });
  assert.equal(r.family, "brownstone");
});

test("heuristic bridge maps the classify vocab (tier inferred-unverified)", () => {
  assert.deepEqual(resolveFacadeFamily(brickRec, {}), { family: "brick", evidenceTier: "inferred-unverified" });
  assert.equal(resolveFacadeFamily(newRec, {}).family, "painted-masonry");
  assert.equal(resolveFacadeFamily(warehouseRec, {}).family, "warehouse");
});

test("full mode (empty pilotBins) resolves a heuristic family for any block building", () => {
  // Phase 8.1a — the flip relies on this: with no override and an empty pilot map,
  // resolveFacadeFamily must NOT return null/undefined; it falls to the heuristic.
  const r = resolveFacadeFamily(brickRec, { overrides: {}, pilotBins: {} });
  assert.ok(r.family, "family resolved");
  assert.equal(r.evidenceTier, "inferred-unverified");
  // The heuristic may only emit the SAFE families — never a material lie.
  assert.ok(["brick", "painted-masonry", "warehouse"].includes(r.family));
});

test("isValidFacadeOverride accepts a full record and rejects bad fields", () => {
  assert.equal(isValidFacadeOverride({ family: "clapboard", tint: "0x6e4a36", storeys: 4, bays: 3, weathering: 0.4, components: { cornice: false }, corniceFrac: 0.06, corniceProj: 0.04, windowRecess: 0.12 }), true);
  assert.equal(isValidFacadeOverride({ family: "marble" }), false);     // not a family
  assert.equal(isValidFacadeOverride({ weathering: 1.5 }), false);      // out of 0..1
  assert.equal(isValidFacadeOverride({ storeys: 0 }), false);           // not positive int
  assert.equal(isValidFacadeOverride({ windowRecess: -1 }), false);     // negative meters
  assert.equal(isValidFacadeOverride({}), true);                        // all fields optional
  assert.equal(isValidFacadeOverride({ groundFamily: "brownstone", groundTint: "0x6f4632" }), true); // dual-material
  assert.equal(isValidFacadeOverride({ groundFamily: "marble" }), false); // not a family
  assert.equal(isValidFacadeOverride({ groundTint: "nope" }), false);     // not a 0xRRGGBB hex
});
