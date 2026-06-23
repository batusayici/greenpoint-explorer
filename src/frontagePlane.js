// Pure geometry for the full-block-hero frontage plane — no THREE, so it
// unit-tests in isolation. Design:
// docs/superpowers/specs/2026-06-23-astral-frontage-plane-design.md
//
// A long segmented street frontage (Astral: ~65m across a 59-vertex polygon)
// is too complex for `buildHeroBuilding`'s "longest edge per role" texturing.
// Instead we project the street-facing edges onto the street axis to get one
// straight CHORD — the flat plane the texture lives on — then:
//   - map high-res texture SEGMENTS onto sub-ranges of that chord, and
//   - detect projecting ORIEL bays as facet runs that deviate outward from the
//     chord beyond a threshold (each becomes an `oriel3` fold at wiring time).
//
// All math is in the scene-frame's (x, z) units. Meter-denominated inputs
// (segment ranges, oriel threshold) are converted via `unitsPerMeter`
// (== projection.scale, 0.075 in the live frame).

const dot = (p, axis) => p.x * axis.x + p.z * axis.z;
const perp = (axis) => ({ x: -axis.z, z: axis.x });

// Project the street-facing edges of a hero footprint onto `axis` to get the
// straight chord the frontage texture lives on: its along-axis extent
// [alongMin, alongMax] at the (length-weighted) average cross-axis offset.
// `outwardSign` records which cross direction faces the street (from the edge
// normals), so oriel detection knows which way the bays project.
export function frontageChord(edges, axis, { role = "franklin" } = {}) {
  const cross = perp(axis);
  // Caller usually pre-classifies; fall back to all edges if none carry the
  // role (e.g. a caller that already filtered to the frontage).
  const frontage = edges.some((e) => e.role === role)
    ? edges.filter((e) => e.role === role)
    : edges;

  let alongMin = Infinity;
  let alongMax = -Infinity;
  let crossSum = 0;
  let lengthSum = 0;
  let normalCrossSum = 0;
  for (const edge of frontage) {
    for (const point of [edge.start, edge.end]) {
      const a = dot(point, axis);
      if (a < alongMin) alongMin = a;
      if (a > alongMax) alongMax = a;
    }
    const len = edge.length ?? Math.hypot(edge.end.x - edge.start.x, edge.end.z - edge.start.z);
    const midCross = (dot(edge.start, cross) + dot(edge.end, cross)) / 2;
    crossSum += midCross * len;
    lengthSum += len;
    if (edge.normal) normalCrossSum += dot(edge.normal, cross) * len;
  }
  const crossOffset = lengthSum > 0 ? crossSum / lengthSum : 0;
  const outwardSign = normalCrossSum >= 0 ? 1 : -1;
  const lengthUnits = alongMax - alongMin;

  const at = (along) => ({
    x: axis.x * along + cross.x * crossOffset,
    z: axis.z * along + cross.z * crossOffset,
  });

  return {
    axis,
    cross,
    alongMin,
    alongMax,
    lengthUnits,
    crossOffset,
    outwardSign,
    start: at(alongMin),
    end: at(alongMax),
  };
}

// Map a texture segment's meter sub-range onto the chord. `fromM/toM` are
// measured from the chord's start end by default, or from its far end when
// `fromEnd: "end"`. Returns the normalized chord range [u0, u1] (clamped to
// [0,1]) plus the world endpoints of the segment along the chord.
export function segmentURange(chord, { fromM, toM }, { unitsPerMeter, fromEnd = "start" } = {}) {
  const { alongMin, alongMax, lengthUnits, axis, cross, crossOffset } = chord;
  const a = fromM * unitsPerMeter;
  const b = toM * unitsPerMeter;
  let lo;
  let hi;
  if (fromEnd === "end") {
    lo = lengthUnits - b;
    hi = lengthUnits - a;
  } else {
    lo = a;
    hi = b;
  }
  const clampLo = Math.max(0, Math.min(lengthUnits, lo));
  const clampHi = Math.max(0, Math.min(lengthUnits, hi));
  const at = (offset) => ({
    x: axis.x * (alongMin + offset) + cross.x * crossOffset,
    z: axis.z * (alongMin + offset) + cross.z * crossOffset,
  });
  return {
    u0: lengthUnits > 0 ? clampLo / lengthUnits : 0,
    u1: lengthUnits > 0 ? clampHi / lengthUnits : 0,
    start: at(clampLo),
    end: at(clampHi),
    lengthUnits: clampHi - clampLo,
  };
}

// Detect projecting oriel bays: runs of consecutive polygon vertices whose
// outward deviation from the chord (toward the street) exceeds `thresholdM`.
// Each run becomes one placement located by its along-axis span; the exact
// `oriel3` fold geometry is built at wiring time from these placements.
export function orielPlacementsFromPolygon(polygon, chord, { unitsPerMeter, thresholdM }) {
  const { axis, cross, alongMin, lengthUnits, crossOffset, outwardSign } = chord;
  const thresholdUnits = thresholdM * unitsPerMeter;

  // Per-vertex outward deviation from the chord plane (positive = toward street).
  const verts = polygon.map((p) => ({
    along: dot(p, axis),
    deviation: (dot(p, cross) - crossOffset) * outwardSign,
  }));

  // Walk the closed ring, grouping consecutive over-threshold vertices into
  // runs (handling a run that wraps across the start/end of the list).
  const n = verts.length;
  const isBay = verts.map((v) => v.deviation > thresholdUnits);
  if (isBay.every((b) => !b)) return [];

  // Rotate the start so we never split a wrapping run.
  let startIdx = 0;
  while (startIdx < n && isBay[startIdx]) startIdx += 1;
  if (startIdx === n) startIdx = 0; // entire ring projects (degenerate)

  const placements = [];
  let run = null;
  for (let step = 0; step < n; step += 1) {
    const i = (startIdx + step) % n;
    if (isBay[i]) {
      if (!run) run = [];
      run.push(verts[i]);
    } else if (run) {
      placements.push(runToPlacement(run));
      run = null;
    }
  }
  if (run) placements.push(runToPlacement(run));

  return placements;

  function runToPlacement(runVerts) {
    let aMin = Infinity;
    let aMax = -Infinity;
    let peak = 0;
    for (const v of runVerts) {
      if (v.along < aMin) aMin = v.along;
      if (v.along > aMax) aMax = v.along;
      if (v.deviation > peak) peak = v.deviation;
    }
    return {
      u0: lengthUnits > 0 ? (aMin - alongMin) / lengthUnits : 0,
      u1: lengthUnits > 0 ? (aMax - alongMin) / lengthUnits : 0,
      centerU: lengthUnits > 0 ? ((aMin + aMax) / 2 - alongMin) / lengthUnits : 0,
      widthUnits: aMax - aMin,
      projectionM: peak / unitsPerMeter,
      facetCount: runVerts.length,
    };
  }
}
