// src/groundLayer.js
// Pure geometry for the intersection ground surface — roadbeds, curbs,
// sidewalks, and crosswalks. No Three.js; runnable in Node, same discipline as
// sceneFrame.js.
//
// Geometry truth: recorded street widths (Greenpoint 50ft, Franklin 40ft — both
// source-backed) drive symmetric roadbeds about each centerline. The Greenpoint
// centerline is the real record; Franklin has no centerline record (known R10E
// gap) so its street carries derived: true, though its width is real. The
// sidewalkLineRecords are NOT curb edges (they trace the centerline); they are
// used only to source Franklin's recorded width. Origin (0,0) is the intersection.

const FEET_TO_METERS = 0.3048;
export const SIDEWALK_WIDTH_M = 4.0; // NYC-typical; curb-to-frontage band width
export const CROSSWALK_STRIPE_COUNT = 6;
const CROSSWALK_DEPTH_M = 3.5; // along-street depth of the crossing band
const DEFAULT_STREET_WIDTH_FT = 40; // fallback if a width record is missing
const ROADBED_HALF_LENGTH_M = 150; // how far each roadbed/sidewalk run is drawn (covers the Franklin→Milton block ~124m and the east-Greenpoint block)

// Merge a street's (possibly multi-segment) sidewalk centerline records into a
// single projected polyline, then reduce to the two furthest-apart endpoints.
function projectStreetEndpoints(records, projection) {
  const pts = records.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  let best = [pts[0], pts[1]];
  let bestD = -1;
  for (let i = 0; i < pts.length; i += 1)
    for (let j = i + 1; j < pts.length; j += 1) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z);
      if (d > bestD) { bestD = d; best = [pts[i], pts[j]]; }
    }
  return best;
}

// Intersection of line P (point p0, dir dp) with line Q (point q0, dir dq).
// Returns the point, or null if near-parallel.
function lineIntersect(p0, dp, q0, dq) {
  const denom = dp.x * dq.z - dp.z * dq.x;
  if (Math.abs(denom) < 1e-6) return null;
  const t = ((q0.x - p0.x) * dq.z - (q0.z - p0.z) * dq.x) / denom;
  return { x: p0.x + dp.x * t, z: p0.z + dp.z * t };
}

const slug = (name) => "cross-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Source-backed cross-streets off Greenpoint, within the context radius, each
// positioned at its real intersection with the Greenpoint centerline and
// reach-clamped to the context circle.
// The sidewalk centerline records for cross-streets run parallel to Greenpoint
// (they are sidewalk strips on Greenpoint Ave near each intersection). We
// locate each cross-street by projecting its sidewalk endpoints onto the
// Greenpoint axis to find their along-Greenpoint position (t), then place the
// cross-street center at (t * greenpointAxis). The cross-street itself runs
// perpendicular to Greenpoint (along franklinAxis).
function buildCrossStreets({ geometrySource, projection, greenpointAxis, contextRadiusUnits }) {
  const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };
  const records = geometrySource.sidewalkLineRecords ?? [];
  const byName = new Map();
  for (const r of records) {
    const n = r.fullStreetName;
    if (n === "GREENPOINT AVE" || n === "FRANKLIN ST") continue; // spine handled separately
    if (!byName.has(n)) byName.set(n, []);
    byName.get(n).push(r);
  }
  const out = [];
  for (const [name, recs] of byName) {
    const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
    // Project all pts onto the Greenpoint axis; take the midpoint along it
    const ts = pts.map((p) => p.x * greenpointAxis.x + p.z * greenpointAxis.z);
    const tMid = (Math.min(...ts) + Math.max(...ts)) / 2;
    const center = { x: greenpointAxis.x * tMid, z: greenpointAxis.z * tMid };
    const d = Math.abs(tMid); // distance from origin along Greenpoint
    if (d >= contextRadiusUnits) continue; // outside the build boundary
    const widthFt = Number.parseFloat(recs[0].streetWidth ?? String(DEFAULT_STREET_WIDTH_FT));
    out.push({
      id: slug(name),
      name,
      derived: false,
      center,
      axis: franklinAxis,
      perp: greenpointAxis,
      halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
      halfLen: Math.sqrt(contextRadiusUnits * contextRadiusUnits - d * d),
    });
  }
  return out.sort((s1, s2) => s1.id.localeCompare(s2.id));
}

export function buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource, contextRadiusMeters = 130 }) {
  const swUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  const halfLen = projection.metersToUnits(ROADBED_HALF_LENGTH_M);
  const contextRadiusUnits = projection.metersToUnits(contextRadiusMeters);

  const spine = [
    makeStreet({ id: "greenpoint-ave", axis: greenpointAxis, perp: franklinAxis,
      widthFt: streetWidthFt(geometrySource, "GREENPOINT AVE", 50), derived: false, projection, halfLen }),
    makeStreet({ id: "franklin-st", axis: franklinAxis, perp: greenpointAxis,
      widthFt: streetWidthFt(geometrySource, "FRANKLIN ST", DEFAULT_STREET_WIDTH_FT), derived: true, projection, halfLen }),
  ];
  const crosses = buildCrossStreets({ geometrySource, projection, greenpointAxis, contextRadiusUnits });
  const streets = [...spine, ...crosses];

  const roadbeds = spine.map((s) => ({
    streetId: s.id,
    derived: s.derived,
    polygon: bandPolygon(s, -s.halfWidth, s.halfWidth),
  }));

  // Sidewalks and curbs run the length of their street EXCEPT across the cross
  // street's roadbed — otherwise the concrete (drawn above the asphalt) would
  // paint over the crossing roadway at each corner. Split each into the two
  // segments outside the other street's roadbed half-width.
  const otherHalf = (s) => spine.find((o) => o.id !== s.id).halfWidth;

  const curbs = spine.flatMap((s) => {
    const gap = otherHalf(s);
    return [s.halfWidth, -s.halfWidth].map((off) => ({
      streetId: s.id,
      derived: s.derived,
      segments: axisSegments(s.halfLen, [{ t0: -gap, t1: gap }]).map(([t0, t1]) => edgeLine(s, off, t0, t1)),
    }));
  });

  const sidewalks = spine.flatMap((s) => {
    const gap = otherHalf(s);
    const bands = [
      { side: "pos", a: s.halfWidth, b: s.halfWidth + swUnits },
      { side: "neg", a: -(s.halfWidth + swUnits), b: -s.halfWidth },
    ];
    return bands.map(({ side, a, b }) => ({
      streetId: s.id,
      derived: s.derived,
      side,
      segments: axisSegments(s.halfLen, [{ t0: -gap, t1: gap }]).map(([t0, t1]) => bandPolygon(s, a, b, t0, t1)),
    }));
  });

  const depth = projection.metersToUnits(CROSSWALK_DEPTH_M);
  const crosswalks = spine.map((s) => {
    const other = spine.find((o) => o.id !== s.id);
    return { streetId: s.id, derived: s.derived, stripes: crosswalkStripes(s, other.halfWidth, depth) };
  });

  return { streets, roadbeds, curbs, sidewalks, crosswalks };
}

// Real recorded width (feet) for a street, from the centerline record or, if
// absent, the sidewalkLineRecords (which carry streetWidth too); else fallback.
function streetWidthFt(geometrySource, name, fallback) {
  const fromCenterline = (geometrySource.streetCenterlineRecords ?? []).find((r) => r.fullStreetName === name);
  if (fromCenterline?.streetWidth) return Number.parseFloat(fromCenterline.streetWidth);
  const fromSidewalk = (geometrySource.sidewalkLineRecords ?? []).find((r) => r.fullStreetName === name);
  if (fromSidewalk?.streetWidth) return Number.parseFloat(fromSidewalk.streetWidth);
  return fallback;
}

function makeStreet({ id, axis, perp, widthFt, derived, projection, halfLen }) {
  return {
    id,
    axis,
    perp,
    center: { x: 0, z: 0 },
    halfLen,
    halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
    derived,
  };
}

// The along-axis spans remaining after removing each crossing interval from a
// full [-halfLen, halfLen] run. `gaps` is an array of { t0, t1 } (unordered ok).
// Returns ordered [t0, t1] spans; empty spans are dropped.
export function axisSegments(halfLen, gaps) {
  const merged = [...gaps]
    .map((g) => ({ t0: Math.max(-halfLen, Math.min(g.t0, g.t1)), t1: Math.min(halfLen, Math.max(g.t0, g.t1)) }))
    .filter((g) => g.t1 > g.t0)
    .sort((a, b) => a.t0 - b.t0);
  const spans = [];
  let cursor = -halfLen;
  for (const g of merged) {
    if (g.t0 > cursor) spans.push([cursor, g.t0]);
    cursor = Math.max(cursor, g.t1);
  }
  if (cursor < halfLen) spans.push([cursor, halfLen]);
  return spans;
}

// A polygon between two perpendicular offsets offA..offB, spanning along-axis
// t from tMin to tMax (defaults to the full street length).
function bandPolygon(street, offA, offB, tMin = -street.halfLen, tMax = street.halfLen) {
  const { axis, perp, center } = street;
  const at = (t, off) => ({
    x: center.x + axis.x * t + perp.x * off,
    z: center.z + axis.z * t + perp.z * off,
  });
  return [at(tMin, offA), at(tMax, offA), at(tMax, offB), at(tMin, offB)];
}

function edgeLine(street, off, tMin = -street.halfLen, tMax = street.halfLen) {
  const { axis, perp, center } = street;
  const at = (t) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  return [at(tMin), at(tMax)];
}

// Continental crossing: bars spanning the street's roadbed width (perp),
// arrayed along the axis within a depth band set just past the other street's
// curb (the intersection-mouth side the camera sees).
function crosswalkStripes(street, setback, depth) {
  const { axis, perp, center } = street;
  const t0 = setback;
  const t1 = setback + depth;
  const wPos = street.halfWidth;
  const wNeg = -street.halfWidth;
  const slot = (t1 - t0) / (CROSSWALK_STRIPE_COUNT * 2 - 1);
  const at = (t, off) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  const stripes = [];
  for (let i = 0; i < CROSSWALK_STRIPE_COUNT; i += 1) {
    const a = t0 + slot * (i * 2);
    const b = a + slot;
    stripes.push([at(a, wNeg), at(b, wNeg), at(b, wPos), at(a, wPos)]);
  }
  return stripes;
}
