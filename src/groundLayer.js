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
const ROADBED_HALF_LENGTH_M = 110; // how far each roadbed/sidewalk run is drawn

export function buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource }) {
  const swUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  const halfLen = projection.metersToUnits(ROADBED_HALF_LENGTH_M);

  const streets = [
    makeStreet({
      id: "greenpoint-ave",
      axis: greenpointAxis,
      perp: franklinAxis,
      widthFt: streetWidthFt(geometrySource, "GREENPOINT AVE", 50),
      derived: false,
      projection,
      halfLen,
    }),
    makeStreet({
      id: "franklin-st",
      axis: franklinAxis,
      perp: greenpointAxis,
      widthFt: streetWidthFt(geometrySource, "FRANKLIN ST", DEFAULT_STREET_WIDTH_FT),
      derived: true,
      projection,
      halfLen,
    }),
  ];

  const roadbeds = streets.map((s) => ({
    streetId: s.id,
    derived: s.derived,
    polygon: bandPolygon(s, -s.halfWidth, s.halfWidth),
  }));

  const curbs = streets.flatMap((s) => [
    { streetId: s.id, derived: s.derived, line: edgeLine(s, s.halfWidth) },
    { streetId: s.id, derived: s.derived, line: edgeLine(s, -s.halfWidth) },
  ]);

  const sidewalks = streets.flatMap((s) => [
    { streetId: s.id, derived: s.derived, side: "pos", polygon: bandPolygon(s, s.halfWidth, s.halfWidth + swUnits) },
    { streetId: s.id, derived: s.derived, side: "neg", polygon: bandPolygon(s, -(s.halfWidth + swUnits), -s.halfWidth) },
  ]);

  const depth = projection.metersToUnits(CROSSWALK_DEPTH_M);
  const crosswalks = streets.map((s) => {
    const other = streets.find((o) => o.id !== s.id);
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

// A polygon spanning the street's drawn length (along axis) between two
// perpendicular offsets offA..offB.
function bandPolygon(street, offA, offB) {
  const { axis, perp, center, halfLen } = street;
  const at = (t, off) => ({
    x: center.x + axis.x * t + perp.x * off,
    z: center.z + axis.z * t + perp.z * off,
  });
  return [at(-halfLen, offA), at(halfLen, offA), at(halfLen, offB), at(-halfLen, offB)];
}

function edgeLine(street, off) {
  const { axis, perp, center, halfLen } = street;
  const at = (t) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  return [at(-halfLen), at(halfLen)];
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
