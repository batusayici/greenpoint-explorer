// scripts/verify-b2-corner-signals.mjs
// Live verifier for the b2 corner signals.
// Run: node scripts/verify-b2-corner-signals.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";
import { buildGroundLayer } from "../src/groundLayer.js";
import { buildStreetFurniture } from "../src/streetFurniture.js";

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
const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

assert(furniture.signals.length === 4, "Expected 4 corner signals.");
assert(furniture.signals.every((s) => s.typological === true), "All signals must be typological.");

const corners = new Set();
for (const sig of furniture.signals) {
  const g = sig.position.x * greenpointAxis.x + sig.position.z * greenpointAxis.z;
  const f = sig.position.x * franklinAxis.x + sig.position.z * franklinAxis.z;
  assert(Math.abs(g) > fr.halfWidth, "Signal must clear the Franklin roadbed.");
  assert(Math.abs(f) > gp.halfWidth, "Signal must clear the Greenpoint roadbed.");
  assert(Math.abs(g) < fr.halfWidth + 0.3, "Signal must stay within the Franklin sidewalk band.");
  assert(Math.abs(f) < gp.halfWidth + 0.3, "Signal must stay within the Greenpoint sidewalk band.");
  const dot = sig.position.x * sig.mastArmDir.x + sig.position.z * sig.mastArmDir.z;
  assert(dot < 0, "Mast arm must reach inward over the roadway.");
  corners.add(`${Math.sign(g)},${Math.sign(f)}`);
}
assert(corners.size === 4, "Signals must occupy four distinct corners.");

if (failures.length) {
  console.error("FAIL b2 corner-signals verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS b2 corner-signals verifier: four typological signals, on-sidewalk, arms inward.");
