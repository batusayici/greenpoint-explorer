// src/groundLayer.test.mjs
// Run: node --test src/groundLayer.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProjection } from "./sceneFrame.js";
import { buildGroundLayer, axisSegments, SIDEWALK_WIDTH_M, CROSSWALK_STRIPE_COUNT } from "./groundLayer.js";

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

const polyWidth = (poly, perp) => {
  const offs = poly.map((p) => p.x * perp.x + p.z * perp.z);
  return Math.max(...offs) - Math.min(...offs);
};

test("produces one Greenpoint and one Franklin street", () => {
  const names = ground.streets.map((s) => s.id);
  assert.ok(names.includes("greenpoint-ave"), "has greenpoint-ave");
  assert.ok(names.includes("franklin-st"), "has franklin-st");
});

test("Greenpoint roadbed matches the recorded 50ft width (real, not derived)", () => {
  const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
  assert.equal(gp.derived, false);
  const road = ground.roadbeds.find((r) => r.streetId === "greenpoint-ave");
  const widthUnits = projection.metersToUnits(50 * 0.3048);
  assert.ok(Math.abs(polyWidth(road.polygon, franklinAxis) - widthUnits) < 0.05, "roadbed ≈ 50ft");
});

test("Franklin street is flagged derived (no source centerline) but uses real 40ft width", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  assert.equal(fr.derived, true);
  const road = ground.roadbeds.find((r) => r.streetId === "franklin-st");
  const widthUnits = projection.metersToUnits(40 * 0.3048);
  assert.ok(Math.abs(polyWidth(road.polygon, greenpointAxis) - widthUnits) < 0.05, "roadbed ≈ 40ft");
});

test("every street yields exactly two curb lines, both off-center on opposite sides", () => {
  for (const s of ground.streets) {
    const curbs = ground.curbs.filter((c) => c.streetId === s.id);
    assert.equal(curbs.length, 2, `${s.id} has 2 curbs`);
    const sides = curbs.map((c) => Math.sign((c.segments[0]?.[0].x - s.center.x) * s.perp.x + (c.segments[0]?.[0].z - s.center.z) * s.perp.z));
    assert.notEqual(sides[0], sides[1], `${s.id} curbs on opposite sides`);
  }
});

test("each curb carries a sidewalk band ~SIDEWALK_WIDTH_M wide", () => {
  const wantUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  for (const s of ground.streets) {
    const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
    assert.equal(walks.length, 2, `${s.id} has 2 sidewalk bands`);
    for (const w of walks)
      for (const seg of w.segments)
        assert.ok(Math.abs(polyWidth(seg, s.perp) - wantUnits) < 0.05, "band width ≈ SIDEWALK_WIDTH_M");
  }
});

test("Franklin sidewalk is split into a segment per crossing gap", () => {
  // The cross-streets (Kent, Milton) cross FRANKLIN, not Greenpoint. So Franklin
  // gets a gap at Greenpoint AND at each cross-street; Greenpoint keeps just the
  // single Franklin gap.
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-"));
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  const walk = ground.sidewalks.find((w) => w.streetId === "franklin-st");
  // one gap at Greenpoint (origin) + one per cross-street ⇒ at least crossers+2 segments
  assert.ok(walk.segments.length >= crossers.length + 2, "franklin sidewalk split at each crossing");
  // every segment stays clear of each crossing street's roadbed half-width along Franklin
  const greenpoint = ground.streets.find((s) => s.id === "greenpoint-ave");
  for (const seg of walk.segments) {
    for (const p of seg) {
      const t = (p.x - fr.center.x) * fr.axis.x + (p.z - fr.center.z) * fr.axis.z;
      for (const c of [...crossers, greenpoint]) {
        const tc = (c.center.x - fr.center.x) * fr.axis.x + (c.center.z - fr.center.z) * fr.axis.z;
        assert.ok(Math.abs(t - tc) >= c.halfWidth - 1e-6, "franklin sidewalk clear of crossing");
      }
    }
  }
});

test("processed geometry source carries Kent/Java/Milton sidewalk centerlines", () => {
  const names = new Set(geometrySource.sidewalkLineRecords.map((r) => r.fullStreetName));
  for (const n of ["KENT ST", "JAVA ST", "MILTON ST"]) assert.ok(names.has(n), `${n} present`);
  for (const r of geometrySource.sidewalkLineRecords) {
    if (["KENT ST", "JAVA ST", "MILTON ST"].includes(r.fullStreetName)) {
      assert.ok(Array.isArray(r.wgs84Line) && r.wgs84Line.length >= 2, `${r.fullStreetName} has wgs84Line`);
      assert.ok(typeof r.wgs84Line[0].lon === "number", "wgs84 point has lon");
    }
  }
});

test("a crosswalk band sits at every real street crossing, inside the roadbed", () => {
  // Each crosser crosses Greenpoint and Greenpoint crosses each crosser+Franklin,
  // so there are at least 2 * (#crossers + 1) bands.
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-")).length;
  assert.ok(ground.crosswalks.length >= 2 * (crossers + 1) - 1, "a band per crossing approach");
  for (const cw of ground.crosswalks) {
    const s = ground.streets.find((x) => x.id === cw.streetId);
    assert.equal(cw.stripes.length, CROSSWALK_STRIPE_COUNT);
    const half = s.halfWidth + 0.01;
    for (const stripe of cw.stripes)
      for (const p of stripe) {
        const off = (p.x - s.center.x) * s.perp.x + (p.z - s.center.z) * s.perp.z;
        assert.ok(Math.abs(off) <= half, "stripe within roadbed width");
      }
  }
});

test("axisSegments subtracts multiple gaps and returns ordered spans", () => {
  const segs = axisSegments(-10, 10, [{ t0: -6, t1: -4 }, { t0: 1, t1: 3 }]);
  assert.deepEqual(segs, [[-10, -6], [-4, 1], [3, 10]]);
});

test("axisSegments with no gaps returns the full span", () => {
  assert.deepEqual(axisSegments(-10, 10, []), [[-10, 10]]);
});

// Java is no longer excluded — there is no radius. All three crossers appear.
test("street list includes every source-backed crosser (no radius exclusion)", () => {
  const ids = ground.streets.map((s) => s.id);
  assert.ok(ids.includes("greenpoint-ave") && ids.includes("franklin-st"), "spine present");
  for (const id of ["cross-kent-st", "cross-milton-st", "cross-java-st"])
    assert.ok(ids.includes(id), `${id} present (no radius gate)`);
});

test("cross-streets are derived:false and centered on the Franklin line", () => {
  for (const id of ["cross-kent-st", "cross-milton-st", "cross-java-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    assert.equal(s.derived, false, `${id} is source-backed`);
    const offFromFranklin = s.center.x * greenpointAxis.x + s.center.z * greenpointAxis.z;
    assert.ok(Math.abs(offFromFranklin) < 0.5, `${id} center on Franklin line`);
    assert.ok(Math.abs(s.axis.x * greenpointAxis.x + s.axis.z * greenpointAxis.z) > 0.9, `${id} parallel to Greenpoint`);
  }
});

test("each street carries a tMin/tMax span and no halfLen", () => {
  for (const s of ground.streets) {
    assert.ok(typeof s.tMin === "number" && typeof s.tMax === "number", `${s.id} has tMin/tMax`);
    assert.ok(s.tMax > s.tMin, `${s.id} span is non-empty`);
    assert.equal(s.halfLen, undefined, `${s.id} no legacy halfLen`);
  }
});

// A cross-street's paved extent equals the projected span of its real centerline
// endpoints about its Franklin crossing (not a circle chord).
test("cross-street extent matches its real centerline endpoint span", () => {
  const recs = geometrySource.streetCenterlineRecords.filter((r) => r.fullStreetName === "KENT ST");
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const s = ground.streets.find((x) => x.id === "cross-kent-st");
  const ts = pts.map((p) => (p.x - s.center.x) * s.axis.x + (p.z - s.center.z) * s.axis.z);
  assert.ok(Math.abs(s.tMin - Math.min(...ts)) < 0.5, "tMin ≈ nearest real endpoint");
  assert.ok(Math.abs(s.tMax - Math.max(...ts)) < 0.5, "tMax ≈ farthest real endpoint");
});

test("axisSegments clamps gaps to the run and drops empty spans", () => {
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -9, t1: -5 }, { t0: 5, t1: 9 }]), [[-5, 5]]);
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -1, t1: 1 }]), [[-5, -1], [1, 5]]);
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -6, t1: 6 }]), []);
});

test("Greenpoint extent matches its real centerline endpoint span", () => {
  const recs = geometrySource.streetCenterlineRecords.filter((r) => r.fullStreetName === "GREENPOINT AVE");
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
  const ts = pts.map((p) => (p.x - gp.center.x) * gp.axis.x + (p.z - gp.center.z) * gp.axis.z);
  assert.ok(Math.abs(gp.tMin - Math.min(...ts)) < 0.5, "tMin ≈ nearest real endpoint");
  assert.ok(Math.abs(gp.tMax - Math.max(...ts)) < 0.5, "tMax ≈ farthest real endpoint");
});

test("Franklin extent spans all of its crossings plus a margin", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-"));
  // t of each crosser's center projected onto Franklin's axis (Franklin center is origin)
  const crossTs = crossers.map((c) => c.center.x * fr.axis.x + c.center.z * fr.axis.z);
  const margin = projection.metersToUnits(25);
  assert.ok(fr.tMin <= Math.min(...crossTs) - margin + 1e-6, "covers southernmost crossing + margin");
  assert.ok(fr.tMax >= Math.max(...crossTs) + margin - 1e-6, "covers northernmost crossing + margin");
});

test("Franklin is still flagged derived (no source centerline in this packet)", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  assert.equal(fr.derived, true);
});
