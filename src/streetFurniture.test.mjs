// src/streetFurniture.test.mjs
// Run: node --test src/streetFurniture.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProjection } from "./sceneFrame.js";
import { buildGroundLayer } from "./groundLayer.js";
import { buildStreetFurniture, SIGNAL_CORNER_INSET } from "./streetFurniture.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometrySource = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const fixture = read("src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json");
const basis = fixture.sceneTruthModel.projectionBasis;
const projection = createProjection(basis);
const axisOf = (a) => {
  const w = projection.project(a.westPointWgs84);
  const e = projection.project(a.eastPointWgs84);
  const v = { x: e.x - w.x, z: e.z - w.z };
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
};
const greenpointAxis = axisOf(basis.greenpointAxisWgs84);
const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource });
const furniture = buildStreetFurniture({ streets: ground.streets, greenpointAxis, franklinAxis });

const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
const fr = ground.streets.find((s) => s.id === "franklin-st");

test("places exactly four corner signals, all typological", () => {
  assert.equal(furniture.signals.length, 4);
  for (const sig of furniture.signals) assert.equal(sig.typological, true);
});

test("each signal sits at a distinct corner, outside both roadbeds, on the sidewalk", () => {
  const seen = new Set();
  for (const sig of furniture.signals) {
    const g = sig.position.x * greenpointAxis.x + sig.position.z * greenpointAxis.z;
    const f = sig.position.x * franklinAxis.x + sig.position.z * franklinAxis.z;
    assert.ok(Math.abs(g) > fr.halfWidth, "clear of Franklin roadbed");
    assert.ok(Math.abs(f) > gp.halfWidth, "clear of Greenpoint roadbed");
    assert.ok(Math.abs(g) < fr.halfWidth + 0.3 + 1e-9, "within Franklin sidewalk band");
    assert.ok(Math.abs(f) < gp.halfWidth + 0.3 + 1e-9, "within Greenpoint sidewalk band");
    seen.add(`${Math.sign(g)},${Math.sign(f)}`);
  }
  assert.equal(seen.size, 4, "four distinct corners");
});

test("mast arm reaches inward over the roadway (unit vector toward the intersection)", () => {
  for (const sig of furniture.signals) {
    const len = Math.hypot(sig.mastArmDir.x, sig.mastArmDir.z);
    assert.ok(Math.abs(len - 1) < 1e-6, "unit length");
    const dot = sig.position.x * sig.mastArmDir.x + sig.position.z * sig.mastArmDir.z;
    assert.ok(dot < 0, "arm points inward");
  }
});

test("SIGNAL_CORNER_INSET is a small positive sidewalk inset", () => {
  assert.ok(SIGNAL_CORNER_INSET > 0 && SIGNAL_CORNER_INSET < 0.3);
});
