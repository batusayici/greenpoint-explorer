// scripts/verify-b1-intersection-ground.mjs
// Live geometry verifier for the b1 intersection ground system.
// Run: node scripts/verify-b1-intersection-ground.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";
import { buildGroundLayer, SIDEWALK_WIDTH_M, CROSSWALK_STRIPE_COUNT } from "../src/groundLayer.js";

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

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const span = (poly, perp) => {
  const offs = poly.map((p) => p.x * perp.x + p.z * perp.z);
  return Math.max(...offs) - Math.min(...offs);
};

assert(ground.streets.length === 2, "Expected 2 streets (Greenpoint, Franklin).");
assert(ground.streets.some((s) => s.id === "greenpoint-ave" && s.derived === false), "Greenpoint must be source-backed.");
assert(ground.streets.some((s) => s.id === "franklin-st" && s.derived === true), "Franklin must be flagged derived.");

const gpRoad = ground.roadbeds.find((r) => r.streetId === "greenpoint-ave");
const gpWidth = projection.metersToUnits(50 * 0.3048);
assert(Math.abs(span(gpRoad.polygon, franklinAxis) - gpWidth) < 0.3, "Greenpoint roadbed ≈ recorded 50ft.");

const frRoad = ground.roadbeds.find((r) => r.streetId === "franklin-st");
const frWidth = projection.metersToUnits(40 * 0.3048);
assert(Math.abs(span(frRoad.polygon, greenpointAxis) - frWidth) < 0.3, "Franklin roadbed ≈ recorded 40ft.");

for (const s of ground.streets) {
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  assert(curbs.length === 2, `${s.id} must have exactly 2 curbs.`);
  const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
  const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
  assert(walks.length === 2, `${s.id} must have 2 sidewalk bands.`);
  for (const w of walks) {
    for (const seg of w.segments) {
      assert(Math.abs(span(seg, perp) - projection.metersToUnits(SIDEWALK_WIDTH_M)) < 0.05, `${s.id} sidewalk width ≈ ${SIDEWALK_WIDTH_M}m.`);
    }
  }
  const cw = ground.crosswalks.find((c) => c.streetId === s.id);
  assert(cw && cw.stripes.length === CROSSWALK_STRIPE_COUNT, `${s.id} crosswalk must have ${CROSSWALK_STRIPE_COUNT} stripes.`);
}

// Curbs must sit off the centerline by a real margin (the roadbed has width and
// the sidewalk band hangs outside it).
for (const s of ground.streets) {
  const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  for (const c of curbs) {
    const off = Math.abs(c.segments[0][0].x * perp.x + c.segments[0][0].z * perp.z);
    assert(off > 0.2, `${s.id} curb must be off-center (got ${off.toFixed(3)}).`);
  }
}

if (failures.length) {
  console.error("FAIL b1 ground verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS b1 ground verifier: roadbeds, curbs, sidewalks, crosswalks consistent.");
