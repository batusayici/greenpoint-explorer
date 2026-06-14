// Pure-logic tests for the facade recess editor.
// Run: node --test src/dev/facadeEditor.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { faceRectToPanel, panelDeltaToFace, panelPointToFace, moveRect, resizeRect, leanShift } from "./facadeCoords.js";
import { listEditableRecesses, patchRecess } from "./facadeSpecPatch.js";

const view = { width: 400, height: 500, skewX: 0 };
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test("faceRectToPanel maps a rect with y inverted", () => {
  const box = faceRectToPanel({ x0: 0.25, x1: 0.5, y0: 0.2, y1: 0.6 }, view);
  close(box.left, 100);
  close(box.width, 100);
  close(box.top, (1 - 0.6) * 500); // 200 — y1 is the higher edge -> smaller screen y
  close(box.height, (0.6 - 0.2) * 500); // 200
});

test("faceRectToPanel applies the lean shift when skewX is set", () => {
  const rect = { x0: 0.2, x1: 0.3, y0: 0.4, y1: 0.6 };
  const skewed = { ...view, skewX: 0.1 };
  const box = faceRectToPanel(rect, skewed);
  const shift = leanShift(rect, 0.1); // 0.1 * 0.5 = 0.05
  close(box.left, (0.2 + shift) * 400);
});

test("panel delta and point map back into face space", () => {
  const d = panelDeltaToFace(40, -50, view);
  close(d.dx, 0.1);
  close(d.dy, 0.1); // up on screen (negative py) is +y in face
  const p = panelPointToFace(100, 100, view, { x0: 0, x1: 1, y0: 0, y1: 1 });
  close(p.x, 0.25);
  close(p.y, 0.8);
});

test("moveRect clamps to the unit square keeping size", () => {
  const moved = moveRect({ x0: 0.9, x1: 1.0, y0: 0.1, y1: 0.2 }, 0.3, -0.3);
  close(moved.x1, 1.0);
  close(moved.x0, 0.9); // width 0.1 preserved at the right wall
  close(moved.y0, 0.0);
  close(moved.y1, 0.1);
});

test("resizeRect moves only the dragged edge and keeps order", () => {
  const r = { x0: 0.2, x1: 0.6, y0: 0.3, y1: 0.7 };
  const e = resizeRect(r, "e", { x: 0.8, y: 0.5 });
  close(e.x0, 0.2);
  close(e.x1, 0.8);
  // dragging the west edge past the east edge keeps a min span, not inversion
  const crossed = resizeRect(r, "w", { x: 0.9, y: 0.5 });
  assert.ok(crossed.x0 < crossed.x1);
});

const sonnyLike = {
  cornice: { y0: 0.895, y1: 1, projectionM: 0.2 },
  windows: { recessM: 0.06, rects: [{ x0: 0.042, x1: 0.087, y0: 0.067, y1: 0.223 }] },
  storefronts: [{ x0: 0.5, x1: 1, y0: 0, y1: 0.205, recessM: 0.22, revealRight: false }],
  doors: [{ x0: 0.149, x1: 0.204, y0: 0, y1: 0.214, recessM: 0.12 }],
  skewX: 0,
};

test("listEditableRecesses surfaces windows, storefronts, doors, cornice", () => {
  const items = listEditableRecesses(sonnyLike);
  assert.deepEqual(items.map((i) => i.kind), ["window", "storefront", "door", "cornice"]);
  assert.equal(items.find((i) => i.kind === "cornice").lockX, true);
});

test("patchRecess preserves non-coordinate keys and is immutable", () => {
  const next = patchRecess(sonnyLike, ["storefronts", 0], { x0: 0.48, x1: 0.99, y0: 0.01, y1: 0.21 });
  assert.equal(next.storefronts[0].recessM, 0.22); // preserved
  assert.equal(next.storefronts[0].revealRight, false); // preserved
  assert.equal(next.storefronts[0].x0, 0.48);
  assert.equal(sonnyLike.storefronts[0].x0, 0.5); // original untouched
});

test("patchRecess on cornice writes only y0/y1, no x keys", () => {
  const next = patchRecess(sonnyLike, ["cornice"], { x0: 0, x1: 1, y0: 0.88, y1: 1 });
  assert.equal(next.cornice.y0, 0.88);
  assert.equal(next.cornice.projectionM, 0.2);
  assert.ok(!("x0" in next.cornice));
});

test("patchRecess rounds to 3 decimals", () => {
  const next = patchRecess(sonnyLike, ["windows", "rects", 0], { x0: 0.0421234, x1: 0.087, y0: 0.067, y1: 0.223 });
  assert.equal(next.windows.rects[0].x0, 0.042);
});
