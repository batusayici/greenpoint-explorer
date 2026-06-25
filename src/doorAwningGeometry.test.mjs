import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDoorAwningGeometry } from "./doorAwningGeometry.js";

test("builds a canopy centered over the door, projecting outward", () => {
  const g = buildDoorAwningGeometry({ frontM: 8, heightM: 12, doorCenterM: 4, doorTopM: 2.2, widthM: 1.6, projectionM: 0.8 });
  assert.ok(g.quads.length >= 3, "top + valance + sides");
  const top = g.quads.find((q) => q.role === "top");
  // centered: u spans doorCenter ± width/2
  const us = top.corners.map((c) => c[0]);
  assert.ok(Math.min(...us) >= 3.19 && Math.max(...us) <= 4.81);
  // projects: some w > 0
  assert.ok(top.corners.some((c) => c[2] > 0));
});
