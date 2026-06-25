// Phase 7.4 — color-binding CONTRACT (spec-only, pure). Rule:
//   trueColor -> nearestPaletteToken(family): the building's real-life color,
//   snapped to the nearest in-palette wall tone for its material family.
// Candidate sets are constrained per family so a snap can never leave the
// material's plausible range, and every candidate is already a no-miss palette
// color. NOT wired into the renderer; per-building authoring + a dominant-color
// sampler are Phase 8.
import { MATERIAL_WALL_TONES, TRIM_TONES } from "./palette.js";

const rgb = (hex) => [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];

export function nearestPaletteToken(trueColorHex, family) {
  const candidates = MATERIAL_WALL_TONES[family];
  if (!candidates) throw new Error(`unknown family: ${family}`);
  const [tr, tg, tb] = rgb(trueColorHex);
  let best = candidates[0];
  let bestD = Infinity;
  for (const c of candidates) {
    const [r, g, b] = rgb(c);
    const d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

// Snap a sampled window/door pixel to the nearest sanctioned trim token. Same
// Euclidean-RGB rule as nearestPaletteToken, against the family-agnostic
// TRIM_TONES set (trim color is not constrained by wall material).
export function nearestTrimToken(trueColorHex) {
  const [tr, tg, tb] = rgb(trueColorHex);
  let best = TRIM_TONES[0];
  let bestD = Infinity;
  for (const c of TRIM_TONES) {
    const [r, g, b] = rgb(c);
    const d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}
