// src/placeData.test.mjs
// Run: node --test src/placeData.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { getPlaceByPlaceId, allPlaces, PLACE_DISCLAIMER } from "./placeData.js";

const HERO_IDS = ["premier-franklin-organic", "sonnys-corner", "sereneco", "azure-gourmet"];

test("exposes the hero places", () => {
  const ids = allPlaces().map((p) => p.placeId).sort();
  assert.deepEqual(ids, [...HERO_IDS].sort());
});

test("each record has the required sourced fields", () => {
  for (const id of HERO_IDS) {
    const p = getPlaceByPlaceId(id);
    assert.ok(p, `${id} present`);
    for (const f of ["name", "category", "address", "status", "verificationStatus", "lastVerified", "approvalStatus"]) {
      assert.ok(p[f] !== undefined && p[f] !== "", `${id}.${f} set`);
    }
    assert.ok(Array.isArray(p.tags), `${id}.tags is an array`);
    assert.ok(Array.isArray(p.sources) && p.sources.length > 0, `${id} has at least one source`);
    for (const s of p.sources) assert.ok(s.label && s.url, `${id} source has label+url`);
    assert.ok(!("hours" in p), `${id} has no hours field (omitted in v0)`);
  }
});

test("unknown placeId returns null; disclaimer is non-empty", () => {
  assert.equal(getPlaceByPlaceId("nope"), null);
  assert.ok(PLACE_DISCLAIMER.length > 0);
});
