import test from "node:test";
import assert from "node:assert/strict";
import { II_PALETTE, MAP_PALETTE } from "./palette.js";

test("MAP_PALETTE exists with all required map tokens", () => {
  const required = [
    "land", "water", "park", "roadMinor", "roadMajor", "roadCasing",
    "building", "buildingLine", "label", "labelHalo", "gLine", "pinInk", "pinPaper",
  ];
  for (const key of required) {
    assert.equal(typeof MAP_PALETTE[key], "number", `missing token: ${key}`);
    assert.ok(MAP_PALETTE[key] >= 0 && MAP_PALETTE[key] <= 0xffffff, `${key} not 24-bit`);
  }
});

test("map tokens reuse II-C anchors (no new hues)", () => {
  assert.equal(MAP_PALETTE.land, II_PALETTE.paper);
  assert.equal(MAP_PALETTE.roadMinor, II_PALETTE.crosswalkPaint);
  assert.equal(MAP_PALETTE.roadMajor, II_PALETTE.street);
  assert.equal(MAP_PALETTE.roadCasing, II_PALETTE.scoreLine);
  assert.equal(MAP_PALETTE.building, II_PALETTE.context[0]);
  assert.equal(MAP_PALETTE.label, II_PALETTE.ink);
  assert.equal(MAP_PALETTE.gLine, II_PALETTE.signalGreen);
  assert.equal(MAP_PALETTE.pinInk, II_PALETTE.ink);
});

test("water and park are paper-lifted (lighter than their anchors)", () => {
  const lum = (h) => (((h >> 16) & 255) + ((h >> 8) & 255) + (h & 255)) / 3;
  assert.ok(lum(MAP_PALETTE.water) > lum(0x52647a), "water lifted toward paper");
  assert.ok(lum(MAP_PALETTE.park) > lum(II_PALETTE.signalGreen), "park lifted toward paper");
  assert.ok(lum(MAP_PALETTE.water) < lum(II_PALETTE.paper), "water still reads against land");
});
