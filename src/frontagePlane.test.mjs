// Pure-geometry tests for the full-block-hero frontage plane.
// Run: node --test src/frontagePlane.test.mjs
//
// A long segmented street frontage (Astral: ~65m, 59-vertex polygon) is
// rendered on one flat plane along its chord; texture segments map onto
// sub-ranges of that chord, and projecting oriel bays are detected as facet
// runs that deviate outward beyond a threshold. These helpers are unit-tested
// before any render/wiring, per the build phasing in
// docs/superpowers/specs/2026-06-23-astral-frontage-plane-design.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import { frontageChord, segmentURange, orielPlacementsFromPolygon } from "./frontagePlane.js";

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const closePt = (p, x, z, eps = 1e-6) => {
  close(p.x, x, eps);
  close(p.z, z, eps);
};

// A clean axis-aligned franklin frontage: street runs along +x, the street is
// on the +z side, building interior toward -z. Two collinear edges span 0..65
// at cross offset z=5, with outward normals pointing to the street (+z).
const franklinAxis = { x: 1, z: 0 };
const flatFrontageEdges = [
  { start: { x: 0, z: 5 }, end: { x: 30, z: 5 }, length: 30, role: "franklin", normal: { x: 0, z: 1 } },
  { start: { x: 30, z: 5 }, end: { x: 65, z: 5 }, length: 35, role: "franklin", normal: { x: 0, z: 1 } },
];

test("frontageChord projects franklin edges to a straight chord + extent", () => {
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  close(chord.alongMin, 0);
  close(chord.alongMax, 65);
  close(chord.lengthUnits, 65);
  close(chord.crossOffset, 5);
  closePt(chord.start, 0, 5);
  closePt(chord.end, 65, 5);
  assert.equal(chord.outwardSign, 1);
});

test("frontageChord ignores non-franklin edges (oriel facets, cross-street ends)", () => {
  const edges = [
    ...flatFrontageEdges,
    // an oriel facet poking out to z=7 — tagged "other", must not widen the chord
    { start: { x: 20, z: 7 }, end: { x: 28, z: 7 }, length: 8, role: "other", normal: { x: 0, z: 1 } },
    // a cross-street end edge running off in +z — also "other"
    { start: { x: 65, z: 5 }, end: { x: 65, z: -40 }, length: 45, role: "other", normal: { x: 1, z: 0 } },
  ];
  const chord = frontageChord(edges, franklinAxis);
  close(chord.crossOffset, 5);
  close(chord.lengthUnits, 65);
});

test("frontageChord uses the street-most edges, ignoring interior court walls", () => {
  // Astral has light-court walls that also face the street axis but sit ~5-18m
  // back from the frontage. The chord must lock onto the street-most band
  // (z=5 here), not average the court (z=0) in and slide the plane backward.
  const edges = [
    ...flatFrontageEdges, // street frontage at z=5
    { start: { x: 18, z: 0 }, end: { x: 30, z: 0 }, length: 12, role: "franklin", normal: { x: 0, z: 1 } }, // court wall, 5m back
    { start: { x: 40, z: 1 }, end: { x: 52, z: 1 }, length: 12, role: "franklin", normal: { x: 0, z: 1 } }, // court wall, 4m back
  ];
  const chord = frontageChord(edges, franklinAxis, { unitsPerMeter: 1, frontageBandM: 3 });
  close(chord.crossOffset, 5);
  closePt(chord.start, 0, 5);
  closePt(chord.end, 65, 5);
  close(chord.lengthUnits, 65);
});

test("frontageChord works off a rotated axis", () => {
  // Same frontage rotated 90°: street along +z, interior toward -x.
  const axis = { x: 0, z: 1 };
  const edges = [
    { start: { x: 5, z: 0 }, end: { x: 5, z: 65 }, length: 65, role: "franklin", normal: { x: 1, z: 0 } },
  ];
  const chord = frontageChord(edges, axis);
  close(chord.lengthUnits, 65);
  // crossOffset is a signed projection onto the perpendicular, so its sign
  // depends on axis handedness — the orientation-independent invariant is the
  // reconstructed chord endpoints sitting on the frontage line (x=5).
  closePt(chord.start, 5, 0);
  closePt(chord.end, 5, 65);
});

test("segmentURange maps a meter sub-range onto the chord from the start end", () => {
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  const seg = segmentURange(chord, { fromM: 24, toM: 42 }, { unitsPerMeter: 1 });
  close(seg.u0, 24 / 65);
  close(seg.u1, 42 / 65);
  closePt(seg.start, 24, 5);
  closePt(seg.end, 42, 5);
});

test("segmentURange honours the unitsPerMeter scale", () => {
  // Chord in scene units: 65m at 0.075 u/m. Edges already in those units.
  const upm = 0.075;
  const edges = [
    { start: { x: 0, z: 5 * upm }, end: { x: 65 * upm, z: 5 * upm }, length: 65 * upm, role: "franklin", normal: { x: 0, z: 1 } },
  ];
  const chord = frontageChord(edges, franklinAxis);
  const seg = segmentURange(chord, { fromM: 24, toM: 42 }, { unitsPerMeter: upm });
  close(seg.u0, 24 / 65);
  close(seg.u1, 42 / 65);
});

test("segmentURange clamps an overshooting range to the chord", () => {
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  const seg = segmentURange(chord, { fromM: -5, toM: 80 }, { unitsPerMeter: 1 });
  close(seg.u0, 0);
  close(seg.u1, 1);
  closePt(seg.start, 0, 5);
  closePt(seg.end, 65, 5);
});

test("segmentURange can measure from the far end of the chord", () => {
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  const seg = segmentURange(chord, { fromM: 0, toM: 18 }, { unitsPerMeter: 1, fromEnd: "end" });
  close(seg.u0, 47 / 65);
  close(seg.u1, 1);
  closePt(seg.start, 47, 5);
  closePt(seg.end, 65, 5);
});

// One oriel bay between x=20..28 projects out to z=6.5 (1.5 beyond the z=5 wall).
const orielPolygon = [
  { x: 0, z: 0 },
  { x: 65, z: 0 },
  { x: 65, z: 5 },
  { x: 28, z: 5 },
  { x: 28, z: 6.5 },
  { x: 20, z: 6.5 },
  { x: 20, z: 5 },
  { x: 0, z: 5 },
];

test("orielPlacementsFromPolygon detects a projecting facet run", () => {
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  const placements = orielPlacementsFromPolygon(orielPolygon, chord, { unitsPerMeter: 1, thresholdM: 0.5 });
  assert.equal(placements.length, 1);
  const bay = placements[0];
  close(bay.centerU, 24 / 65);
  close(bay.widthUnits, 8);
  close(bay.projectionM, 1.5);
  close(bay.u0, 20 / 65);
  close(bay.u1, 28 / 65);
  assert.equal(bay.facetCount, 2);
});

test("orielPlacementsFromPolygon returns none for a flat frontage", () => {
  const flatPolygon = [
    { x: 0, z: 0 },
    { x: 65, z: 0 },
    { x: 65, z: 5 },
    { x: 0, z: 5 },
  ];
  const chord = frontageChord(flatFrontageEdges, franklinAxis);
  const placements = orielPlacementsFromPolygon(flatPolygon, chord, { unitsPerMeter: 1, thresholdM: 0.5 });
  assert.deepEqual(placements, []);
});
