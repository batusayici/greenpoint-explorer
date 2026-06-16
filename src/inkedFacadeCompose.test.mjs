// Run: node --test src/inkedFacadeCompose.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeInkedFacade } from "./inkedFacadeCompose.js";

test("returns wall, cornice, ground band, and a windows grid", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.ok(f.wall, "wall present");
  assert.ok(f.cornice, "cornice present");
  assert.ok(f.ground, "ground present");
  assert.ok(Array.isArray(f.windows), "windows array");
});

test("upper storeys each get `bays` windows (ground floor excluded)", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  // 3 upper storeys x 3 bays = 9 windows
  assert.equal(f.windows.length, 9);
});

test("all rects are within the 0..1 face square", () => {
  const f = composeInkedFacade({ storeys: 5, bays: 2 });
  const rects = [f.wall, f.cornice, f.ground, ...f.windows];
  for (const r of rects) {
    assert.ok(r.x0 >= 0 && r.x1 <= 1, "x in range");
    assert.ok(r.y0 >= 0 && r.y1 <= 1, "y in range");
    assert.ok(r.x1 > r.x0 && r.y1 > r.y0, "non-degenerate");
  }
});

test("ground band sits at the bottom, cornice at the top", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.ground.y0, 0);
  assert.ok(f.cornice.y1 === 1);
  assert.ok(f.ground.y1 <= f.windows[0].y0 + 1e-9, "windows above ground");
});

test("windows do not overlap the ground band", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  for (const w of f.windows) assert.ok(w.y0 >= f.ground.y1 - 1e-9);
});
