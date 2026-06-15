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

  // Sidewalks and curbs run the length of their street EXCEPT across the cross
  // street's roadbed — otherwise the concrete (drawn above the asphalt) would
  // paint over the crossing roadway at each corner. Split each into the two
  // segments outside the other street's roadbed half-width.
  const otherHalf = (s) => streets.find((o) => o.id !== s.id).halfWidth;

  const curbs = streets.flatMap((s) =>
    [s.halfWidth, -s.halfWidth].map((off) => ({
      streetId: s.id,
      derived: s.derived,
      segments: axisSegments(s.halfLen, otherHalf(s)).map(([t0, t1]) => edgeLine(s, off, t0, t1)),
    })),
  );

  const sidewalks = streets.flatMap((s) => {
    const gap = otherHalf(s);
    const bands = [
      { side: "pos", a: s.halfWidth, b: s.halfWidth + swUnits },
      { side: "neg", a: -(s.halfWidth + swUnits), b: -s.halfWidth },
    ];
    return bands.map(({ side, a, b }) => ({
      streetId: s.id,
      derived: s.derived,
      side,
      segments: axisSegments(s.halfLen, gap).map(([t0, t1]) => bandPolygon(s, a, b, t0, t1)),
    }));
  });

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

// The along-axis spans that remain after removing the cross street's roadbed
// (|t| < gap) from a full-length [-halfLen, halfLen] run. Returns up to two
// [t0, t1] segments; empty if the gap swallows the whole run.
function axisSegments(halfLen, gap) {
  if (gap >= halfLen) return [];
  return [[-halfLen, -gap], [gap, halfLen]];
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
