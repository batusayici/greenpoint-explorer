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
  const spineStreets = ground.streets.filter((s) => s.id === "greenpoint-ave" || s.id === "franklin-st");
  for (const s of spineStreets) {
    const curbs = ground.curbs.filter((c) => c.streetId === s.id);
    assert.equal(curbs.length, 2, `${s.id} has 2 curbs`);
    const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
    const sides = curbs.map((c) => Math.sign(c.segments[0][0].x * perp.x + c.segments[0][0].z * perp.z));
    assert.notEqual(sides[0], sides[1], `${s.id} curbs on opposite sides`);
  }
});

test("each curb carries a sidewalk band ~SIDEWALK_WIDTH_M wide", () => {
  const wantUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  const spineStreets = ground.streets.filter((s) => s.id === "greenpoint-ave" || s.id === "franklin-st");
  for (const s of spineStreets) {
    const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
    const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
    assert.equal(walks.length, 2, `${s.id} has 2 sidewalk bands`);
    for (const w of walks) {
      for (const seg of w.segments) {
        assert.ok(Math.abs(polyWidth(seg, perp) - wantUnits) < 0.05, "band width ≈ SIDEWALK_WIDTH_M");
      }
    }
  }
});

test("sidewalks never intrude past the cross street's roadbed (no concrete on the crossing)", () => {
  const spineStreets = ground.streets.filter((s) => s.id === "greenpoint-ave" || s.id === "franklin-st");
  for (const s of spineStreets) {
    const other = spineStreets.find((o) => o.id !== s.id);
    const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
    for (const w of walks) {
      for (const seg of w.segments) {
        for (const p of seg) {
          const along = Math.abs(p.x * s.axis.x + p.z * s.axis.z);
          assert.ok(along >= other.halfWidth - 1e-9, `${s.id} sidewalk stays clear of the crossing`);
        }
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

test("each street has one crosswalk with the right stripe count, inside the roadbed", () => {
  assert.equal(ground.crosswalks.length, 2, "one crosswalk per spine street");
  const spineStreets = ground.streets.filter((s) => s.id === "greenpoint-ave" || s.id === "franklin-st");
  for (const s of spineStreets) {
    const cw = ground.crosswalks.find((c) => c.streetId === s.id);
    assert.ok(cw, `${s.id} crosswalk exists`);
    assert.equal(cw.stripes.length, CROSSWALK_STRIPE_COUNT);
    const perp = s.perp;
    const half = s.halfWidth + 0.01;
    for (const stripe of cw.stripes) {
      for (const p of stripe) {
        const off = p.x * perp.x + p.z * perp.z;
        assert.ok(Math.abs(off) <= half, "stripe within roadbed width");
      }
    }
  }
});

test("axisSegments subtracts multiple gaps and returns ordered spans", () => {
  const segs = axisSegments(10, [{ t0: -6, t1: -4 }, { t0: 1, t1: 3 }]);
  assert.deepEqual(segs, [[-10, -6], [-4, 1], [3, 10]]);
});

test("axisSegments with no gaps returns the full span", () => {
  assert.deepEqual(axisSegments(10, []), [[-10, 10]]);
});

test("street list includes source-backed crossers within the context radius", () => {
  const ids = ground.streets.map((s) => s.id);
  assert.ok(ids.includes("greenpoint-ave") && ids.includes("franklin-st"), "spine present");
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    assert.ok(ids.includes(id), `${id} present`);
  }
});

test("cross-streets are marked derived:false and centered on the Greenpoint line", () => {
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    assert.equal(s.derived, false, `${id} is source-backed`);
    // center lies on the Greenpoint centerline (through origin along greenpointAxis):
    const perpOff = s.center.x * franklinAxis.x + s.center.z * franklinAxis.z;
    assert.ok(Math.abs(perpOff) < 0.2, `${id} center on Greenpoint line`);
  }
});

test("cross-street reach is clamped to the context circle", () => {
  const R = projection.metersToUnits(130);
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    const d = Math.hypot(s.center.x, s.center.z);
    assert.ok(Math.abs(s.halfLen - Math.sqrt(R * R - d * d)) < 0.05, `${id} halfLen = sqrt(R^2 - d^2)`);
  }
});

test("axisSegments clamps gaps to the run and drops empty spans", () => {
  // gaps that only touch the run's ends clamp to empty and remove nothing
  assert.deepEqual(axisSegments(5, [{ t0: -9, t1: -5 }, { t0: 5, t1: 9 }]), [[-5, 5]]);
  assert.deepEqual(axisSegments(5, [{ t0: -1, t1: 1 }]), [[-5, -1], [1, 5]]);
  // a gap that fully covers the run leaves nothing
  assert.deepEqual(axisSegments(5, [{ t0: -6, t1: 6 }]), []);
});
