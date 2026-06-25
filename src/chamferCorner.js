// src/chamferCorner.js
// Pure footprint surgery: replace the polygon vertex nearest a target point with
// two vertices inset along its adjacent edges, cutting a straight chamfer across
// the corner. Used to give a square-cornered footprint (e.g. Elder Greene) its
// real 45° corner so the chamfer becomes a wall edge the massing + inked-wall +
// storefront systems pick up automatically. Points are scene {x, z}. No Three.js.

function lerpToward(from, to, distUnits) {
  const dx = to.x - from.x, dz = to.z - from.z;
  const len = Math.hypot(dx, dz) || 1;
  const t = Math.min(distUnits / len, 0.49); // never cross the edge midpoint
  return { x: from.x + dx * t, z: from.z + dz * t };
}

export function chamferCorner(polygon, corner, insetUnits) {
  if (!Array.isArray(polygon) || polygon.length < 3 || !(insetUnits > 0)) return polygon;
  // Work on the open ring (drop a duplicate closing vertex if present).
  const closed = polygon.length > 1 &&
    polygon[0].x === polygon[polygon.length - 1].x &&
    polygon[0].z === polygon[polygon.length - 1].z;
  const ring = closed ? polygon.slice(0, -1) : polygon.slice();
  const n = ring.length;
  if (n < 3) return polygon;

  let bi = 0, bd = Infinity;
  for (let i = 0; i < n; i += 1) {
    const d = (ring[i].x - corner.x) ** 2 + (ring[i].z - corner.z) ** 2;
    if (d < bd) { bd = d; bi = i; }
  }
  const prev = ring[(bi - 1 + n) % n], cur = ring[bi], next = ring[(bi + 1) % n];
  const A = lerpToward(cur, prev, insetUnits);
  const B = lerpToward(cur, next, insetUnits);

  const out = [];
  for (let i = 0; i < n; i += 1) {
    if (i === bi) { out.push(A, B); } else out.push({ x: ring[i].x, z: ring[i].z });
  }
  if (closed) out.push({ x: out[0].x, z: out[0].z });
  return out;
}
