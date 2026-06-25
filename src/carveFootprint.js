// src/carveFootprint.js
// Pure footprint surgery: clip a polygon against a vertical line x = xCut,
// keeping the half on one side. Used to split a single NYC-Open-Data footprint
// that merges several real buildings (e.g. BIN 3064387 = the tall Verge corner
// building + two 1-story structures extending west along India St) into the
// distinct masses they really are, so each gets its own height + facade.
// Points are scene {x, z}. No Three.js. Sutherland–Hodgman half-plane clip.

function clipByVerticalLine(polygon, xCut, keep) {
  if (!Array.isArray(polygon) || polygon.length < 3) return [];
  // Open ring (drop a duplicate closing vertex if present).
  const closed =
    polygon.length > 1 &&
    polygon[0].x === polygon[polygon.length - 1].x &&
    polygon[0].z === polygon[polygon.length - 1].z;
  const ring = closed ? polygon.slice(0, -1) : polygon.slice();
  const inside = (p) => (keep === "east" ? p.x >= xCut : p.x <= xCut);
  const intersect = (a, b) => {
    const t = (xCut - a.x) / (b.x - a.x); // b.x !== a.x guaranteed (one in, one out)
    return { x: xCut, z: a.z + t * (b.z - a.z) };
  };
  const out = [];
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const aIn = inside(a);
    const bIn = inside(b);
    if (aIn) out.push(a);
    if (aIn !== bIn) out.push(intersect(a, b));
  }
  return out;
}

// Split a footprint at x = xCut into { east, west } sub-polygons (open rings).
export function splitFootprintAtX(polygon, xCut) {
  return {
    east: clipByVerticalLine(polygon, xCut, "east"),
    west: clipByVerticalLine(polygon, xCut, "west"),
  };
}

// Convenience: keep the easternmost `frac` of a footprint's x-extent (the
// Franklin-frontage corner building), returning { keep, rest, xCut }.
export function carveEastFraction(polygon, frac) {
  let minX = Infinity;
  let maxX = -Infinity;
  for (const p of polygon) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }
  const xCut = maxX - frac * (maxX - minX);
  const { east, west } = splitFootprintAtX(polygon, xCut);
  return { keep: east, rest: west, xCut };
}
