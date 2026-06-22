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

test("ground row: one door bay + a window in every other bay", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.doorBay, 1, "3 bays -> middle bay is the door bay");
  assert.equal(f.groundWindows.length, 2, "remaining bays get a ground window");
  assert.ok(f.door, "a door rect is emitted");
});

test("ground row: door bay nearest center, ties to lower index", () => {
  const f = composeInkedFacade({ storeys: 3, bays: 4 });
  assert.equal(f.doorBay, 1, "4 bays -> bays 1 and 2 tie; lower index wins");
});

test("ground openings sit inside the ground-storey band", () => {
  const storeys = 5;
  const f = composeInkedFacade({ storeys, bays: 4 });
  const groundFrac = 1 / storeys;
  for (const w of f.groundWindows) {
    assert.ok(w.y0 >= 0 && w.y1 <= groundFrac + 1e-9, "ground window within [0, groundFrac]");
  }
  assert.equal(f.door.y0, 0, "door meets the sidewalk");
  assert.ok(f.door.y1 <= groundFrac + 1e-9, "door stays within the ground storey");
});

test("upper window grid is unchanged by the ground row", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.windows.length, (4 - 1) * 3, "upper windows = (storeys-1) * bays");
});

test("single-bay building: the only bay is the door bay, no ground windows", () => {
  const f = composeInkedFacade({ storeys: 3, bays: 1 });
  assert.equal(f.doorBay, 0);
  assert.equal(f.groundWindows.length, 0);
  assert.ok(f.door);
});
