// Pure coordinate math for the facade recess editor.
//
// Two coordinate spaces:
//   - FACE: normalized spec coords. x 0..1 left->right along the elevation,
//     y 0..1 ground->roofline (y up).
//   - PANEL: pixel coords inside the editor's texture preview. x 0..width
//     left->right, y 0..height TOP->bottom (y down, screen convention).
//
// `skewX` is the spec's linear lean: a rect at mid-height yMid shifts
// horizontally by skewX*yMid so authored geometry lands on a drawn 3/4 lean
// (see facadeAssembly.js `lean`). The editor draws boxes at the LEANED
// position (so they sit on the painted opening) but stores the UNLEANED base
// coords. With skewX:0 (all current specs) every transform below is identity.

export function leanShift(rect, skewX = 0) {
  return skewX * ((rect.y0 + rect.y1) / 2);
}

// FACE rect -> PANEL box {left, top, width, height} for drawing.
export function faceRectToPanel(rect, view) {
  const { width, height, skewX = 0 } = view;
  const shift = leanShift(rect, skewX);
  const left = (rect.x0 + shift) * width;
  const right = (rect.x1 + shift) * width;
  const top = (1 - rect.y1) * height; // y1 (higher) -> smaller screen y
  const bottom = (1 - rect.y0) * height;
  return { left, top, width: right - left, height: bottom - top };
}

// A pointer delta in panel pixels -> a delta in FACE coords. Pure translation,
// so the lean shift (same before and after) cancels.
export function panelDeltaToFace(dpx, dpy, view) {
  return { dx: dpx / view.width, dy: -dpy / view.height };
}

// An absolute panel point -> a FACE point, un-leaning with `refRect`'s shift
// (the rect being edited). Used when dragging a single edge to a cursor.
export function panelPointToFace(px, py, view, refRect) {
  const { width, height, skewX = 0 } = view;
  const shift = leanShift(refRect, skewX);
  return { x: px / width - shift, y: 1 - py / height };
}

const MIN_SIZE = 0.004; // smallest rect span in face units

// Move every edge by (dx, dy), then clamp inside 0..1.
export function moveRect(rect, dx, dy) {
  let { x0, x1, y0, y1 } = rect;
  x0 += dx; x1 += dx; y0 += dy; y1 += dy;
  const w = x1 - x0;
  const h = y1 - y0;
  if (x0 < 0) { x0 = 0; x1 = w; }
  if (x1 > 1) { x1 = 1; x0 = 1 - w; }
  if (y0 < 0) { y0 = 0; y1 = h; }
  if (y1 > 1) { y1 = 1; y0 = 1 - h; }
  return { ...rect, x0, x1, y0, y1 };
}

// Set one or two edges to the given face point (corner/edge resize), keeping
// each axis ordered with a minimum span and clamped to 0..1.
// `handle` is one of: n s e w ne nw se sw.
export function resizeRect(rect, handle, point) {
  let { x0, x1, y0, y1 } = rect;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  if (handle.includes("w")) x0 = clamp(point.x);
  if (handle.includes("e")) x1 = clamp(point.x);
  if (handle.includes("n")) y1 = clamp(point.y); // north = top = higher y
  if (handle.includes("s")) y0 = clamp(point.y);
  if (x1 - x0 < MIN_SIZE) {
    if (handle.includes("w")) x0 = x1 - MIN_SIZE; else x1 = x0 + MIN_SIZE;
  }
  if (y1 - y0 < MIN_SIZE) {
    if (handle.includes("s")) y0 = y1 - MIN_SIZE; else y1 = y0 + MIN_SIZE;
  }
  return { ...rect, x0, x1, y0, y1 };
}
