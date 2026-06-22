// scripts/verify-b1-intersection-ground.mjs
// Live geometry verifier for the b1 intersection ground system.
// Run: node scripts/verify-b1-intersection-ground.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";
import { buildGroundLayer, SIDEWALK_WIDTH_M, CROSSWALK_STRIPE_COUNT } from "../src/groundLayer.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometrySource = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const corridor = read("src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json");
const merged = {
  ...geometrySource,
  streetCenterlineRecords: [
    ...(geometrySource.streetCenterlineRecords ?? []),
    ...(corridor.streetCenterlineRecords ?? []),
  ],
};
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
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource: merged });

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const span = (poly, perp) => {
  const offs = poly.map((p) => p.x * perp.x + p.z * perp.z);
  return Math.max(...offs) - Math.min(...offs);
};

assert(ground.streets.length >= 6, "Expected the spine + corridor cross-streets (>=6).");
assert(ground.streets.some((s) => s.id === "cross-huron-st"), "Huron paved from corridor pull.");
assert(ground.streets.some((s) => s.id === "greenpoint-ave" && s.derived === false), "Greenpoint must be source-backed.");
// Franklin: corridor packet supplies real centerline records, so derived is false in the merged model.
assert(ground.streets.some((s) => s.id === "franklin-st"), "Franklin must be present.");
assert(ground.streets.some((s) => s.id === "franklin-st" && s.derived === false), "Franklin must be source-backed (real FRANKLIN ST centerline in merged packet).");

for (const s of ground.streets) {
  assert(typeof s.tMin === "number" && s.tMax > s.tMin, `${s.id} has a non-empty tMin/tMax span.`);
  assert(s.halfLen === undefined, `${s.id} carries no legacy halfLen.`);
}

// every cross-street's extent matches its real endpoint span (±tolerance)
for (const s of ground.streets.filter((x) => x.id.startsWith("cross-"))) {
  const recs = merged.streetCenterlineRecords.filter((r) => `cross-${r.fullStreetName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}` === s.id);
  assert(recs.length > 0, `${s.id}: no centerline records matched (slug mismatch or missing record).`);
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const ts = pts.map((p) => (p.x - s.center.x) * s.axis.x + (p.z - s.center.z) * s.axis.z);
  assert(Math.abs(s.tMin - Math.min(...ts)) < 1.0 && Math.abs(s.tMax - Math.max(...ts)) < 1.0, `${s.id} extent ≈ real endpoints.`);
}

const gpRoad = ground.roadbeds.find((r) => r.streetId === "greenpoint-ave");
const gpWidth = projection.metersToUnits(50 * 0.3048);
assert(Math.abs(span(gpRoad.polygon, franklinAxis) - gpWidth) < 0.3, "Greenpoint roadbed ≈ recorded 50ft.");

const frRoad = ground.roadbeds.find((r) => r.streetId === "franklin-st");
const frWidth = projection.metersToUnits(40 * 0.3048);
assert(Math.abs(span(frRoad.polygon, greenpointAxis) - frWidth) < 0.3, "Franklin roadbed ≈ recorded 40ft.");

for (const s of ground.streets) {
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  assert(curbs.length === 2, `${s.id} must have exactly 2 curbs.`);
  const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
  assert(walks.length === 2, `${s.id} must have 2 sidewalk bands.`);
  for (const w of walks) {
    for (const seg of w.segments) {
      assert(Math.abs(span(seg, s.perp) - projection.metersToUnits(SIDEWALK_WIDTH_M)) < 0.05, `${s.id} sidewalk width ≈ ${SIDEWALK_WIDTH_M}m.`);
    }
  }
  const cws = ground.crosswalks.filter((c) => c.streetId === s.id);
  assert(cws.length >= 1, `${s.id} must have at least 1 crosswalk.`);
  for (const cw of cws) {
    assert(cw.stripes.length === CROSSWALK_STRIPE_COUNT, `${s.id} crosswalk must have ${CROSSWALK_STRIPE_COUNT} stripes.`);
  }
}

// Curbs must sit off the centerline by a real margin (the roadbed has width and
// the sidewalk band hangs outside it).
for (const s of ground.streets) {
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  for (const c of curbs) {
    const off = Math.abs(c.segments[0][0].x * s.perp.x + c.segments[0][0].z * s.perp.z);
    assert(off > 0.2, `${s.id} curb must be off-center (got ${off.toFixed(3)}).`);
  }
}

console.log(`Streets paved (${ground.streets.length}):`);
for (const s of ground.streets) {
  console.log(`  ${s.id} (tMin=${s.tMin.toFixed(2)}, tMax=${s.tMax.toFixed(2)}, derived=${s.derived})`);
}

if (failures.length) {
  console.error("FAIL b1 ground verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS b1 ground verifier: roadbeds, curbs, sidewalks, crosswalks consistent.");
