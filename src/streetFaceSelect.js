// Pure helpers to choose a building's street-facing edge when the primary
// (Franklin-axis) front edge is blocked by a neighbour. No Three.js; Node-runnable.
//
// Why: `inkedFrontEdgeIndex` orients every kit building toward the Franklin
// centreline. A mid-block rowhouse that fronts a CROSS street has party walls on
// its Franklin-facing long sides (blocked → not exposed) and is open only at its
// two short ends — and BOTH ends can be open, so "longest exposed edge" / "most
// open" both pick the backyard end (clapboard pilot 3064605 faced its door at the
// back). The reliable signal is orientation: a frontage faces the street that runs
// PARALLEL to it. `pickStreetFrontEdge` uses that; the clearance helpers are a
// last-resort fallback when no parallel street is found.

// Closest point on the infinite line through segment `seg` (a→b) to point `p`.
function nearestOnLine(p, seg) {
  const dx = seg.b.x - seg.a.x;
  const dz = seg.b.z - seg.a.z;
  const len2 = dx * dx + dz * dz || 1;
  const t = ((p.x - seg.a.x) * dx + (p.z - seg.a.z) * dz) / len2;
  return { x: seg.a.x + t * dx, z: seg.a.z + t * dz };
}

// Among EXPOSED edges, the one that fronts a street running PARALLEL to it. Scores
// each candidate by (parallelism × how directly its outward normal points at the
// street × proximity). Returns -1 if no exposed edge faces a parallel street.
// `edges` need { tangent:{x,z}, normal:{x,z}, midpoint:{x,z} } (unit tangent/normal).
// `streets` is an array of { a:{x,z}, b:{x,z} } centreline segments.
export function pickStreetFrontEdge(edges, exposed, streets, minParallel = 0.6) {
  let best = -1;
  let bestScore = 0;
  for (let i = 0; i < edges.length; i += 1) {
    if (!exposed[i]) continue;
    const e = edges[i];
    let score = 0;
    for (const st of streets) {
      let sdx = st.b.x - st.a.x;
      let sdz = st.b.z - st.a.z;
      const sl = Math.hypot(sdx, sdz) || 1;
      sdx /= sl; sdz /= sl;
      const parallel = Math.abs(e.tangent.x * sdx + e.tangent.z * sdz);
      if (parallel < minParallel) continue; // street isn't parallel to this frontage
      const np = nearestOnLine(e.midpoint, st);
      let tx = np.x - e.midpoint.x;
      let tz = np.z - e.midpoint.z;
      const dist = Math.hypot(tx, tz) || 1e-6;
      const facing = (e.normal.x * tx + e.normal.z * tz) / dist;
      if (facing <= 0.2) continue; // edge must point TOWARD the street, not away
      const s = (parallel * facing) / dist; // parallel + facing + nearer wins
      if (s > score) score = s;
    }
    if (score > bestScore) { bestScore = score; best = i; }
  }
  return best;
}

// Clearance in an edge's outward-normal direction: distance to the nearest
// neighbour point sitting IN FRONT of the edge (within a perpendicular cone).
// Infinity when nothing blocks it. Last-resort fallback ranking.
export function edgeClearance(edge, neighborPoints, conePerp = 0.5) {
  let best = Infinity;
  for (const p of neighborPoints) {
    const vx = p.x - edge.midpoint.x;
    const vz = p.z - edge.midpoint.z;
    const along = vx * edge.normal.x + vz * edge.normal.z; // + = in front of the edge
    if (along <= 0.05) continue;                           // behind or beside the edge
    const perp = Math.abs(vx * -edge.normal.z + vz * edge.normal.x);
    if (perp > conePerp) continue;                         // outside the frontal cone
    if (along < best) best = along;
  }
  return best;
}

// Among EXPOSED edges, every one that fronts a parallel street (the multi-
// frontage generalization of pickStreetFrontEdge: a corner lot returns two
// perpendicular frontages). Each frontage records the width of the street it
// faces (for primary ranking) and its perpendicular distance to that street's
// centreline (for nearest ranking). Returns { indices, primary, nearest } where
//   primary = the frontage on the widest street (tie -> longer edge -> lower idx),
//   nearest = the frontage CLOSEST to its street (tie -> longer edge -> lower idx),
// or -1 each when nothing fronts a street. `nearest` is the frontage the building
// physically fronts: a mid-block lot's rear wall is over-detected as a frontage
// (it runs parallel to the street one block over) and can even be the *widest*
// street, so `primary` lands on the backyard; `nearest` stays on the true front.
export function pickStreetFrontages(edges, exposed, streets, minParallel = 0.6) {
  const found = []; // { i, width, dist }
  for (let i = 0; i < edges.length; i += 1) {
    if (!exposed[i]) continue;
    const e = edges[i];
    let score = 0;
    let width = 0;
    let bestDist = Infinity;
    for (const st of streets) {
      let sdx = st.b.x - st.a.x;
      let sdz = st.b.z - st.a.z;
      const sl = Math.hypot(sdx, sdz) || 1;
      sdx /= sl; sdz /= sl;
      const parallel = Math.abs(e.tangent.x * sdx + e.tangent.z * sdz);
      if (parallel < minParallel) continue;
      const np = nearestOnLine(e.midpoint, st);
      const tx = np.x - e.midpoint.x;
      const tz = np.z - e.midpoint.z;
      const dist = Math.hypot(tx, tz) || 1e-6;
      const facing = (e.normal.x * tx + e.normal.z * tz) / dist;
      if (facing <= 0.2) continue; // edge must point toward the street
      const s = (parallel * facing) / dist;
      if (s > score) { score = s; width = st.width ?? 0; bestDist = dist; }
    }
    if (score > 0) found.push({ i, width, dist: bestDist });
  }
  const indices = found.map((f) => f.i);
  // Pick the single best frontage under a comparator, breaking ties by longer edge
  // then lower index (the array is already in ascending-index order).
  const pickBest = (better) => {
    let best = found[0];
    for (const f of found) {
      if (better(f, best)) best = f;
      else if (!better(best, f) && edges[f.i].length > edges[best.i].length + 1e-9) best = f;
    }
    return best.i;
  };
  let primary = -1;
  let nearest = -1;
  if (found.length) {
    primary = pickBest((a, b) => a.width > b.width + 1e-9);
    nearest = pickBest((a, b) => a.dist < b.dist - 1e-9);
  }
  // dists/widths run parallel to `indices`: the perpendicular distance to the
  // fronted street's centreline and that street's recorded width. A real frontage
  // sits ~half-a-street-width out; an over-detected rear (parallel street a block
  // away) sits a full block out — so the caller can keep only truly-addressed
  // faces with an absolute distance gate.
  const dists = found.map((f) => f.dist);
  const widths = found.map((f) => f.width);
  return { indices, primary, nearest, dists, widths };
}

// Among EXPOSED edges, the one facing the most open direction (max clearance).
// Ties break to the longer edge. Returns -1 if no edge is exposed.
export function mostOpenExposedEdge(edges, exposed, clearance) {
  let best = -1;
  let bestClear = -Infinity;
  let bestLen = -Infinity;
  for (let i = 0; i < edges.length; i += 1) {
    if (!exposed[i]) continue;
    const c = clearance[i];
    const tieOnClear = Math.abs(c - bestClear) <= 1e-9;
    if (c > bestClear + 1e-9 || (tieOnClear && edges[i].length > bestLen)) {
      bestClear = c;
      bestLen = edges[i].length;
      best = i;
    }
  }
  return best;
}
