// src/facadeFlushWindows.test.mjs
// Run: node --test src/facadeFlushWindows.test.mjs
//
// A hero "full-facade" texture paints its own windows, sills and lintels into
// the art. Carving procedural recesses + stamping geometric sills over that
// complete illustration produces the clutter bug: flat wall-toned recess panes
// (misaligned to the painted openings) and floating tan sill bars
// (FACADE_RELIEF.sillLit = 0xa6987c). `windows.flush: true` says "the openings
// are painted — leave the wall mask covering them, model nothing." See
// facadeAssembly.js and the astral-apartments hero spec.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFacadeAssembly } from "./facadeAssembly.js";
import { FACADE_RELIEF } from "./visualSystem/palette.js";

const FRAME = { left: { x: 0, z: 0 }, right: { x: 10, z: 0 }, normal: { x: 0, z: 1 }, height: 20, u0: 0, u1: 1 };

const build = (windows) =>
  buildFacadeAssembly({
    frame: FRAME,
    spec: { windows },
    texture: null,
    unitsPerMeter: 1,
    baseColor: 0x884422,
  });

const meshes = (group) => {
  const out = [];
  group.traverse((o) => { if (o.isMesh) out.push(o); });
  return out;
};
const sillMeshes = (group) =>
  meshes(group).filter((m) => m.material && m.material.color && m.material.color.getHex() === FACADE_RELIEF.sillLit);

const RECTS = [
  { x0: 0.2, x1: 0.3, y0: 0.4, y1: 0.6 },
  { x0: 0.6, x1: 0.7, y0: 0.4, y1: 0.6 },
];

test("recessed windows with sill:true stamp geometric sill bars (the artifact source)", () => {
  const group = build({ recessM: 0.18, sill: true, rects: RECTS });
  // Each window emits geometric sill meshes tinted sillLit — the floating tan bars.
  assert.ok(sillMeshes(group).length > 0, "expected sillLit-tinted sill meshes to exist");
});

test("flush windows emit NO recess panes and NO geometric sills", () => {
  const recessed = build({ recessM: 0.18, sill: true, rects: RECTS });
  const flush = build({ recessM: 0.18, sill: true, flush: true, rects: RECTS });

  // No tan sill bars at all.
  assert.equal(sillMeshes(flush).length, 0, "flush facade must not stamp geometric sills");
  // Strictly fewer meshes than the recessed build: the per-window recess pane +
  // reveals + sills are gone, replaced by the wall mask covering the openings.
  assert.ok(
    meshes(flush).length < meshes(recessed).length,
    `flush should drop window relief meshes (flush=${meshes(flush).length}, recessed=${meshes(recessed).length})`,
  );
  // The wall is still fully covered — flush keeps at least one wall-mask mesh.
  assert.ok(meshes(flush).length >= 1, "flush facade still emits the wall mask");
});
