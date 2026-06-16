// scripts/verify-oriel3-bay.mjs
// Verifier for the 3-facet oriel bay plan + mesh builder.
// Run: node scripts/verify-oriel3-bay.mjs
import { oriel3Plan, oriel3Meshes } from "../src/facadeAssembly.js";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

// --- oriel3Plan: trapezoid inset math (Premier bay, centerFraction 0.36) ---
const bay = { x0: 0.322, x1: 0.479, y0: 0.266, y1: 0.895, centerFraction: 0.36 };
const plan = oriel3Plan(bay);
const width = bay.x1 - bay.x0;           // 0.157
const side = (1 - 0.36) / 2;             // 0.32
assert(near(plan.xc0, bay.x0 + side * width), `xc0 expected ${bay.x0 + side * width}, got ${plan.xc0}`);
assert(near(plan.xc1, bay.x1 - side * width), `xc1 expected ${bay.x1 - side * width}, got ${plan.xc1}`);
assert(near(plan.xc1 - plan.xc0, 0.36 * width), "center facet width must equal centerFraction * opening");

// symmetry: insets equal on both sides
assert(near(plan.xc0 - bay.x0, bay.x1 - plan.xc1), "side insets must be symmetric");

// three textured facets, seams continuous (returns meet center at xc0 / xc1)
assert(plan.facets.length === 3, `expected 3 facets, got ${plan.facets.length}`);
const [left, center, right] = plan.facets;
assert(near(left.quad[1][0], plan.xc0) && near(center.quad[0][0], plan.xc0), "left return must meet center at xc0");
assert(near(center.quad[1][0], plan.xc1) && near(right.quad[0][0], plan.xc1), "right return must meet center at xc1");
// returns start at the wall plane (depth 0), front edges at depth 1
assert(left.quad[0][1] === 0 && left.quad[1][1] === 1, "left return: wall edge depth 0, front edge depth 1");
assert(center.quad[0][1] === 1 && center.quad[1][1] === 1, "center facet: both edges at front (depth 1)");
assert(right.quad[0][1] === 1 && right.quad[1][1] === 0, "right return: front edge depth 1, wall edge depth 0");

// --- clamping: centerFraction outside [0.1, 0.9] must not invert the trapezoid ---
const tooBig = oriel3Plan({ x0: 0, x1: 1, centerFraction: 1.5 });
assert(tooBig.xc1 > tooBig.xc0, "centerFraction>1 must clamp, not invert");
const tooSmall = oriel3Plan({ x0: 0, x1: 1, centerFraction: -1 });
assert(tooSmall.xc0 < tooSmall.xc1 && tooSmall.xc0 > 0, "centerFraction<0 must clamp to a positive inset");

// default centerFraction when unset
const dflt = oriel3Plan({ x0: 0, x1: 1 });
assert(near(dflt.xc1 - dflt.xc0, 0.36), "default centerFraction must be 0.36");

// --- oriel3Meshes: smoke test with a minimal fake frame, no texture ---
const frame = { left: { x: 0, z: 0 }, right: { x: 10, z: 0 }, normal: { x: 0, z: 1 }, height: 20, u0: 0.478, u1: 1 };
const meshes = oriel3Meshes(frame, bay, 0.6, null);
assert(meshes.length === 5, `expected 5 meshes (3 facets + 2 caps), got ${meshes.length}`);
assert(meshes.every((m) => m.isMesh), "every returned object must be a THREE.Mesh");
assert(meshes.every((m) => m.geometry.getAttribute("position").count === 4), "every facet/cap quad has 4 vertices");

if (failures.length) {
  console.error("FAIL oriel3 bay verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS oriel3 bay verifier: plan math, seams, clamping, mesh count.");
