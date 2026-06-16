// Pure opening-profile geometry — no THREE, so it unit-tests in isolation.
//
// Every opening has a bounding rect {x0,x1,y0,y1} in face-coords. `shape`
// reinterprets what is rendered inside it:
//   "rect"   (default) — the four corners, no fillers.
//   "arch"   — rectangular body y0..springY + an elliptical cap to crown y1.
//   "circle" — an oculus inscribed in the bbox.
// `outline` is the recessed-pane silhouette (closed, convex → fan from [0]).
// `fillers` are the flush corner/spandrel regions the curve leaves uncovered;
// each is a fan whose apex (the bbox corner it sweeps from) is element [0].
// `revealCurve` is the curved edge that needs a textured reveal bridging the
// wall plane to the recessed pane (arch head / oculus ring) so the curve reads
// as cut brick, not a grey seam — `{ points, closed }`, or null for a rect
// (whose straight reveals are handled by addReveals).
// Tessellation is done in face-coords so the silhouette registers to the
// painted arc regardless of world aspect — the drawing defines the curve.

export const ARC_SEGMENTS = 20;

export function springYOf(rect) {
  return rect.springY ?? (rect.y0 + rect.y1) / 2;
}

export function openingProfile(rect, segments = ARC_SEGMENTS) {
  const shape = rect.shape ?? "rect";
  if (shape === "arch") return archProfile(rect, segments);
  if (shape === "circle") return circleProfile(rect, segments);
  return {
    outline: [
      { x: rect.x0, y: rect.y0 },
      { x: rect.x1, y: rect.y0 },
      { x: rect.x1, y: rect.y1 },
      { x: rect.x0, y: rect.y1 },
    ],
    fillers: [],
    revealCurve: null,
  };
}

function archProfile(rect, segments) {
  const { x0, x1, y0, y1 } = rect;
  const springY = springYOf(rect);
  const xc = (x0 + x1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = y1 - springY;

  // Arc from the right jamb top (t=0) over the crown (t=π/2) to the left jamb
  // top (t=π). Endpoints land exactly on (x1,springY) and (x0,springY).
  const arc = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (Math.PI * i) / segments;
    arc.push({ x: xc + rx * Math.cos(t), y: springY + ry * Math.sin(t) });
  }

  const outline = [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    ...arc, // (x1,springY) … crown … (x0,springY)
  ];

  // Left spandrel: fan from the top-left corner across the left half of the
  // arc (crown → left jamb top). Right spandrel: from the top-right corner
  // across the right half (right jamb top → crown). Apex first so a fan from
  // element [0] triangulates the star-shaped region.
  const mid = Math.floor(segments / 2);
  const right = [{ x: x1, y: y1 }, ...arc.slice(0, mid + 1)];
  const left = [{ x: x0, y: y1 }, ...arc.slice(mid)];
  // The head arc gets a textured reveal (open — the straight jambs/sill below
  // are revealed separately by addReveals).
  return { outline, fillers: [left, right], revealCurve: { points: arc, closed: false } };
}

function circleProfile(rect, segments) {
  const { x0, x1, y0, y1 } = rect;
  const xc = (x0 + x1) / 2;
  const yc = (y0 + y1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = (y1 - y0) / 2;
  const n = segments * 2; // full revolution

  const outline = [];
  for (let i = 0; i < n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    outline.push({ x: xc + rx * Math.cos(t), y: yc + ry * Math.sin(t) });
  }

  // Four corner fillers. Each fans from a bbox corner across the quarter arc
  // between the two adjacent axis points. Quarter k covers angles
  // [k·π/2, (k+1)·π/2]; its apex is the corner that quarter bulges toward.
  const corners = [
    { x: x1, y: y1 }, // quarter 0: +x→+y
    { x: x0, y: y1 }, // quarter 1: +y→-x
    { x: x0, y: y0 }, // quarter 2: -x→-y
    { x: x1, y: y0 }, // quarter 3: -y→+x
  ];
  const fillers = [];
  for (let k = 0; k < 4; k += 1) {
    const fan = [corners[k]];
    for (let i = 0; i <= segments; i += 1) {
      const t = (Math.PI / 2) * (k + i / segments);
      fan.push({ x: xc + rx * Math.cos(t), y: yc + ry * Math.sin(t) });
    }
    fillers.push(fan);
  }
  // The whole ring gets a textured reveal (closed loop).
  return { outline, fillers, revealCurve: { points: outline, closed: true } };
}
