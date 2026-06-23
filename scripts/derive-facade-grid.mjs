#!/usr/bin/env node
// derive-facade-grid.mjs — projection-profile auto-grid deriver.
//
// The connected-component deriver (derive-facade-spec.mjs) fails on dense,
// richly-inked facades like the Astral: the continuous brownstone base and the
// vertical fire escapes bridge every opening into one blob, and the inked brick
// texture trips a "different-from-wall" mask. This tool sidesteps per-opening
// segmentation entirely. It exploits the one thing those facades DO have — a
// strict regular window grid — by integrating a "glass is lighter than brick"
// mask into ROW and COLUMN light-profiles, finding the floor lines and window
// axes as profile peaks, and emitting a uniform rect at each grid intersection
// that actually carries glass (a per-cell density gate drops solid piers and
// the center-pavilion gaps).
//
// It is deliberately approximate: it nails the regular punched-window field;
// the center entrance pavilion, oriel bays, and arched heads are refined after
// in ?facadeedit=1. Output is a spec JSON + an overlay PNG to gate visually.
//
// Usage:
//   node scripts/derive-facade-grid.mjs <texture.png> --face "3064408:frontage" \
//     [--light 0.72] [--rows 5] [--row-min 0.12] [--row-max 0.9] \
//     [--win-h 0.6] [--win-w 0.55] [--cell 0.18] [--arch-top] \
//     [--out docs/visual-artifacts/astral-full-derivation] \
//     [--write src/data/facade-specs/astral-apartments.v0.1.json]
//
// Face coords are face-local: x from the texture's left edge, y from the GROUND
// up — the same system facade-spec JSON + facadeAssembly.js use.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { PNG } from "pngjs";

// ----------------------------------------------------------------- args
const argv = process.argv.slice(2);
const opts = {
  light: 0.72,
  rows: 0, // 0 = auto-detect
  rowMin: 0.12, // ignore profile above this frac (sky/parapet band) ...
  rowMax: 0.92, //   ... and below this frac (ground/base) when finding floors
  winH: 0.52, // window height as a fraction of floor pitch
  winW: 0.55, // window width as a fraction of column pitch
  colThresh: 0.18, // window-axis peak floor, as a fraction of the peak column density
  cell: 0.05, // min light fraction inside a cell to keep it (drops piers)
  archTop: false,
  out: "docs/visual-artifacts/astral-full-derivation",
  write: null,
  face: null,
  noTrim: false, // map coords to the FULL image (for textures already baked to a tight crop)
};
let texturePath = null;
for (let i = 0; i < argv.length; i += 1) {
  const a = argv[i];
  if (a === "--face") opts.face = argv[++i];
  else if (a === "--light") opts.light = Number(argv[++i]);
  else if (a === "--rows") opts.rows = Number(argv[++i]);
  else if (a === "--row-min") opts.rowMin = Number(argv[++i]);
  else if (a === "--row-max") opts.rowMax = Number(argv[++i]);
  else if (a === "--win-h") opts.winH = Number(argv[++i]);
  else if (a === "--win-w") opts.winW = Number(argv[++i]);
  else if (a === "--col-thresh") opts.colThresh = Number(argv[++i]);
  else if (a === "--cell") opts.cell = Number(argv[++i]);
  else if (a === "--arch-top") opts.archTop = true;
  else if (a === "--no-trim") opts.noTrim = true;
  else if (a === "--out") opts.out = argv[++i];
  else if (a === "--write") opts.write = argv[++i];
  else if (!a.startsWith("--")) texturePath = a;
}
if (!texturePath || !opts.face) {
  console.error('usage: node scripts/derive-facade-grid.mjs <texture.png> --face "BIN:role" [options]');
  process.exit(1);
}

// ----------------------------------------------------------------- helpers
const png = PNG.sync.read(readFileSync(texturePath));
const { width, height, data } = png;
const lightAt = (x, y) => {
  const i = (width * y + x) * 4;
  return Math.max(data[i], data[i + 1], data[i + 2]) / 255;
};
const isPaper = (x, y) => {
  const i = (width * y + x) * 4;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const L = mx / 255, S = mx ? (mx - mn) / mx : 0;
  return L > 0.82 && S < 0.46; // warm cream border / sky
};

// Trim the paper border: walk each edge inward while the line is mostly paper.
function trim() {
  const paperFrac = (along, fixed, horizontal) => {
    let p = 0, n = 0;
    for (let k = 0; k < along; k += 1) {
      const x = horizontal ? k : fixed;
      const y = horizontal ? fixed : k;
      p += isPaper(x, y) ? 1 : 0;
      n += 1;
    }
    return p / n;
  };
  let top = 0, bot = height - 1, left = 0, right = width - 1;
  while (top < bot && paperFrac(width, top, true) > 0.85) top += 1;
  while (bot > top && paperFrac(width, bot, true) > 0.85) bot -= 1;
  while (left < right && paperFrac(height, left, false) > 0.85) left += 1;
  while (right > left && paperFrac(height, right, false) > 0.85) right -= 1;
  return { x0: left, x1: right + 1, y0: top, y1: bot + 1 };
}

function smooth(arr, radius) {
  if (radius < 1) return arr.slice();
  const out = new Array(arr.length).fill(0);
  for (let i = 0; i < arr.length; i += 1) {
    let s = 0, n = 0;
    for (let k = -radius; k <= radius; k += 1) {
      const j = i + k;
      if (j >= 0 && j < arr.length) { s += arr[j]; n += 1; }
    }
    out[i] = s / n;
  }
  return out;
}

// Peaks = local maxima at least `minSep` apart, taken strongest-first, kept only
// if above `floor`. Returns sorted-ascending peak indices.
function peaks(profile, minSep, floor) {
  const cand = [];
  for (let i = 1; i < profile.length - 1; i += 1) {
    if (profile[i] >= profile[i - 1] && profile[i] > profile[i + 1] && profile[i] > floor) {
      cand.push(i);
    }
  }
  cand.sort((a, b) => profile[b] - profile[a]);
  const chosen = [];
  for (const c of cand) {
    if (chosen.every((p) => Math.abs(p - c) >= minSep)) chosen.push(c);
  }
  return chosen.sort((a, b) => a - b);
}

function median(xs) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

// ----------------------------------------------------------------- detect
const box = opts.noTrim ? { x0: 0, x1: width, y0: 0, y1: height } : trim();
const W = box.x1 - box.x0;
const H = box.y1 - box.y0;
console.log(`trim: ${width}x${height} -> ${W}x${H} (x ${box.x0}..${box.x1}, y ${box.y0}..${box.y1})`);

// light mask over the trimmed region
const mask = new Uint8Array(W * H);
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    mask[y * W + x] = lightAt(x + box.x0, y + box.y0) > opts.light ? 1 : 0;
  }
}

// ROW profile -> floor bands (search within [rowMin,rowMax] of trimmed height)
const rowProf = new Array(H).fill(0);
for (let y = 0; y < H; y += 1) {
  let s = 0;
  for (let x = 0; x < W; x += 1) s += mask[y * W + x];
  rowProf[y] = s / W;
}
const rowS = smooth(rowProf, Math.max(1, Math.round(H * 0.012)));
const yLo = Math.floor(opts.rowMin * H), yHi = Math.floor(opts.rowMax * H);
const rowWindow = rowS.map((v, y) => (y >= yLo && y <= yHi ? v : 0));
const rowFloor = 0.18 * Math.max(...rowWindow); // dim lower floors still clear this
let floorPeaks = peaks(rowWindow, Math.round(H * 0.07), rowFloor);
if (opts.rows && floorPeaks.length > opts.rows) {
  floorPeaks = [...floorPeaks].sort((a, b) => rowWindow[b] - rowWindow[a]).slice(0, opts.rows).sort((a, b) => a - b);
}
const floorPitch = median(floorPeaks.slice(1).map((p, i) => p - floorPeaks[i])) || H * 0.16;
console.log(`floors: ${floorPeaks.length} at y-frac ${floorPeaks.map((p) => (p / H).toFixed(2)).join(", ")} (pitch ${(floorPitch / H).toFixed(3)})`);

// COLUMN profile over only the floor-band rows -> window axes
const bandRows = new Uint8Array(H);
const halfH = Math.round((opts.winH * floorPitch) / 2);
for (const p of floorPeaks) for (let y = p - halfH; y <= p + halfH; y += 1) if (y >= 0 && y < H) bandRows[y] = 1;
const colProf = new Array(W).fill(0);
for (let x = 0; x < W; x += 1) {
  let s = 0, n = 0;
  for (let y = 0; y < H; y += 1) if (bandRows[y]) { s += mask[y * W + x]; n += 1; }
  colProf[x] = n ? s / n : 0;
}
const colS = smooth(colProf, Math.max(1, Math.round(W * 0.004)));
// Window axes as profile peaks at a roughly-uniform pitch. The horizontal
// rhythm (oriels widen the spacing locally) does not separate cleanly under any
// global run-threshold, so we take the strongest local maxima at a min spacing
// and place a uniform-width window on each — a regular starting grid the recess
// editor then nudges per-axis. (Floors, by contrast, separate cleanly above.)
const colFloorV = opts.colThresh * Math.max(...colS);
const colPeaks = peaks(colS, Math.round(W * 0.018), colFloorV);
const colPitch = median(colPeaks.slice(1).map((p, i) => p - colPeaks[i])) || W * 0.05;
console.log(`columns: ${colPeaks.length} (pitch ${(colPitch / W).toFixed(3)})`);

// ----------------------------------------------------------------- grid cells
const halfW = Math.round((opts.winW * colPitch) / 2);
const cellHalfH = halfH;
const rects = [];
const topFloorY = Math.min(...floorPeaks); // smallest image-y = top residential floor
for (const fy of floorPeaks) {
  for (const cx of colPeaks) {
    const x0 = Math.max(0, cx - halfW), x1 = Math.min(W - 1, cx + halfW);
    const y0 = Math.max(0, fy - cellHalfH), y1 = Math.min(H - 1, fy + cellHalfH);
    // per-cell density gate: keep only cells that actually carry glass
    let lit = 0, tot = 0;
    for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) { lit += mask[y * W + x]; tot += 1; }
    if (tot === 0 || lit / tot < opts.cell) continue;
    const rect = {
      x0: +((x0) / W).toFixed(3),
      x1: +((x1 + 1) / W).toFixed(3),
      y0: +(1 - (y1 + 1) / H).toFixed(3),
      y1: +(1 - y0 / H).toFixed(3),
      _px: { x: box.x0 + x0, y: box.y0 + y0, w: x1 - x0 + 1, h: y1 - y0 + 1 },
    };
    if (opts.archTop && fy === topFloorY) {
      rect.shape = "arch";
      rect.springY = +(rect.y0 + 0.62 * (rect.y1 - rect.y0)).toFixed(3);
    }
    rects.push(rect);
  }
}
rects.sort((a, b) => (b.y0 - a.y0) || (a.x0 - b.x0));
console.log(`emitted ${rects.length} window rects (${floorPeaks.length} floors x ${colPeaks.length} cols, gated)`);

// ----------------------------------------------------------------- outputs
mkdirSync(opts.out, { recursive: true });
const stem = basename(texturePath).replace(/\.png$/i, "");

// overlay: dim the texture, draw rects in cyan
const overlay = new PNG({ width, height });
for (let i = 0; i < data.length; i += 4) {
  overlay.data[i] = data[i] * 0.6;
  overlay.data[i + 1] = data[i + 1] * 0.6;
  overlay.data[i + 2] = data[i + 2] * 0.6;
  overlay.data[i + 3] = 255;
}
const stroke = (x, y, c) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const i = (width * y + x) * 4;
  overlay.data[i] = c[0]; overlay.data[i + 1] = c[1]; overlay.data[i + 2] = c[2];
};
for (const r of rects) {
  const { x, y, w, h } = r._px;
  const c = r.shape === "arch" ? [255, 180, 60] : [40, 230, 230];
  for (let t = 0; t < w; t += 1) { stroke(x + t, y, c); stroke(x + t, y + h - 1, c); }
  for (let t = 0; t < h; t += 1) { stroke(x, y + t, c); stroke(x + w - 1, y + t, c); }
}
const overlayPath = join(opts.out, `${stem}.grid-overlay.png`);
writeFileSync(overlayPath, PNG.sync.write(overlay));
console.log(`wrote ${overlayPath}  (cyan=window, orange=arched-top)`);

// spec fragment
const cleanRects = rects.map(({ _px, ...r }) => r);
const specFragment = {
  faces: {
    [opts.face]: { windows: { recessM: 0.18, sill: true, rects: cleanRects }, doors: [] },
  },
};
const jsonPath = join(opts.out, `${stem}.grid-spec.json`);
writeFileSync(jsonPath, JSON.stringify(specFragment, null, 2) + "\n");
console.log(`wrote ${jsonPath}`);

if (opts.write) {
  const target = JSON.parse(readFileSync(opts.write, "utf8"));
  target.faces[opts.face] = target.faces[opts.face] || {};
  target.faces[opts.face].windows = { recessM: 0.18, sill: true, rects: cleanRects };
  target.faces[opts.face].doors = target.faces[opts.face].doors || [];
  writeFileSync(opts.write, JSON.stringify(target, null, 2) + "\n");
  console.log(`wrote ${rects.length} rects into ${opts.write} (face ${opts.face})`);
}
