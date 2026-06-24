#!/usr/bin/env node
// seed-window-grid.mjs — one-off seed helper for the Astral side faces.
// Decodes a facade PNG, replicates the runtime content-density trim, then
// detects window panes by a BRIGHT-GLASS mask (lum > T) and bands them into
// columns × rows. Emits face-local rects (x from left, y from GROUND UP) as a
// regular grid seed for the recess editor to drag-snap. NOT a final spec —
// the inked, fire-escape-dense facades defeat the shipped blob deriver, so
// this just gives Batu a registered grid to finalize. Mirrors the trim in
// loadTrimmedTexture (SceneView.jsx) so coords land in the same space.

import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let offset = 8, ihdr = null, palette = null;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const body = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") ihdr = { width: body.readUInt32BE(0), height: body.readUInt32BE(4), bitDepth: body[8], colorType: body[9], interlace: body[12] };
    else if (type === "PLTE") palette = body;
    else if (type === "IDAT") idat.push(body);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  const raw = inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr;
  const stride = width * channels;
  const line = new Uint8Array(stride), prev = new Uint8Array(stride);
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const rb = row[x];
      const a = x >= channels ? line[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      let v;
      switch (filter) {
        case 0: v = rb; break; case 1: v = rb + a; break; case 2: v = rb + b; break;
        case 3: v = rb + ((a + b) >> 1); break;
        case 4: { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v = rb + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error(`bad filter ${filter}`);
      }
      line[x] = v & 0xff;
    }
    for (let x = 0; x < width; x += 1) {
      const at = (y * width + x) * 4, src = x * channels;
      if (ihdr.colorType === 2) { rgba[at] = line[src]; rgba[at + 1] = line[src + 1]; rgba[at + 2] = line[src + 2]; rgba[at + 3] = 255; }
      else if (ihdr.colorType === 6) { rgba[at] = line[src]; rgba[at + 1] = line[src + 1]; rgba[at + 2] = line[src + 2]; rgba[at + 3] = line[src + 3]; }
      else if (ihdr.colorType === 3) { const p = line[src] * 3; rgba[at] = palette[p]; rgba[at + 1] = palette[p + 1]; rgba[at + 2] = palette[p + 2]; rgba[at + 3] = 255; }
      else { rgba[at] = rgba[at + 1] = rgba[at + 2] = line[src]; rgba[at + 3] = 255; }
    }
    prev.set(line);
  }
  return { width, height, data: rgba };
}

// Replicate loadTrimmedTexture's content-density trim.
function trim(img) {
  const { data, width, height } = img;
  const border = [data[0], data[1], data[2]];
  const differs = (x, y) => { const at = (y * width + x) * 4; return Math.abs(data[at] - border[0]) + Math.abs(data[at + 1] - border[1]) + Math.abs(data[at + 2] - border[2]) > 80; };
  const cd = new Array(width).fill(0), rd = new Array(height).fill(0);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) if (differs(x, y)) { cd[x] += 1; rd[y] += 1; }
  const cl = height * 0.085, rl = width * 0.085;
  let minX = 0, maxX = width - 1, minY = 0, maxY = height - 1;
  while (minX < maxX && cd[minX] <= cl) minX += 1;
  while (maxX > minX && cd[maxX] <= cl) maxX -= 1;
  while (minY < maxY && rd[minY] <= rl) minY += 1;
  while (maxY > minY && rd[maxY] <= rl) maxY -= 1;
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

// Find bands (contiguous runs) where a density profile exceeds a fraction of its max.
function bands(density, frac) {
  const max = Math.max(...density);
  const thr = max * frac;
  const out = [];
  let s = -1;
  for (let i = 0; i < density.length; i += 1) {
    if (density[i] > thr) { if (s < 0) s = i; }
    else if (s >= 0) { out.push([s, i - 1]); s = -1; }
  }
  if (s >= 0) out.push([s, density.length - 1]);
  return out;
}

const file = process.argv[2];
const img = decodePng(readFileSync(file));
const t = trim(img);
const { data, width } = img;
const px = (x, y) => { const at = ((t.minY + y) * width + (t.minX + x)) * 4; return [data[at], data[at + 1], data[at + 2]]; };
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

// Window glass is GRAY (R≈G≈B); red brick is R≫B. Mask = low redness AND not a
// dark shadow/fire-escape (lum>55). Far more robust than a luminance threshold
// on these muted, muntin-split inked panes.
const bright = (x, y) => { const [r, g, b] = px(x, y); return r - b < 28 && lum(r, g, b) > 55; };
const colD = new Array(t.w).fill(0), rowD = new Array(t.h).fill(0);
for (let y = 0; y < t.h; y += 1) for (let x = 0; x < t.w; x += 1) if (bright(x, y)) { colD[x] += 1; rowD[y] += 1; }

const cols = bands(colD, 0.28).filter(([a, b]) => b - a >= t.w * 0.012);
const rows = bands(rowD, 0.30).filter(([a, b]) => b - a >= t.h * 0.012);

console.log(`trim: ${img.width}x${img.height} -> ${t.w}x${t.h} (x ${t.minX}..${t.maxX} y ${t.minY}..${t.maxY})`);
console.log(`cols (${cols.length}): ` + cols.map(([a, b]) => `${(a / t.w).toFixed(3)}-${(b / t.w).toFixed(3)}`).join(" "));
console.log(`rows (${rows.length}, ground-up): ` + rows.map(([a, b]) => `${(1 - b / t.h).toFixed(3)}-${(1 - a / t.h).toFixed(3)}`).join(" "));

// Emit rects = col×row cells that hold enough bright pixels (tight bbox per cell).
const rects = [];
for (const [cx0, cx1] of cols) for (const [ry0, ry1] of rows) {
  let bx0 = 1e9, bx1 = -1, by0 = 1e9, by1 = -1, cnt = 0;
  for (let y = ry0; y <= ry1; y += 1) for (let x = cx0; x <= cx1; x += 1) if (bright(x, y)) { cnt += 1; if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  const cell = (cx1 - cx0 + 1) * (ry1 - ry0 + 1);
  if (cnt < cell * 0.10) continue; // mostly brick / occluded → skip
  rects.push({ x0: +(bx0 / t.w).toFixed(4), x1: +((bx1 + 1) / t.w).toFixed(4), y0: +(1 - (by1 + 1) / t.h).toFixed(4), y1: +(1 - by0 / t.h).toFixed(4) });
}
// Merge vertically-stacked sash halves: same column (x-overlap >60%), small
// vertical gap → one window rect.
const xOverlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) / Math.min(a.x1 - a.x0, b.x1 - b.x0);
let merged = true;
while (merged) {
  merged = false;
  outer: for (let i = 0; i < rects.length; i += 1) for (let j = i + 1; j < rects.length; j += 1) {
    const a = rects[i], b = rects[j];
    if (xOverlap(a, b) > 0.6 && Math.max(a.y0, b.y0) - Math.min(a.y1, b.y1) < 0.02) {
      rects[i] = { x0: Math.min(a.x0, b.x0), x1: Math.max(a.x1, b.x1), y0: Math.min(a.y0, b.y0), y1: Math.max(a.y1, b.y1) };
      rects[i].x0 = +rects[i].x0.toFixed(4); rects[i].x1 = +rects[i].x1.toFixed(4); rects[i].y0 = +rects[i].y0.toFixed(4); rects[i].y1 = +rects[i].y1.toFixed(4);
      rects.splice(j, 1); merged = true; break outer;
    }
  }
}
rects.sort((a, b) => b.y0 - a.y0 || a.x0 - b.x0);
console.log(`\n${rects.length} window rects:`);
console.log(JSON.stringify(rects));

// --overlay: write a PNG with green rect outlines on the trimmed crop to verify.
if (process.argv.includes("--overlay")) {
  const { deflateSync } = await import("node:zlib");
  const { writeFileSync } = await import("node:fs");
  const W = t.w, H = t.h;
  const out = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) { const s = ((t.minY + y) * width + (t.minX + x)) * 4; const d = (y * W + x) * 4; out[d] = data[s]; out[d + 1] = data[s + 1]; out[d + 2] = data[s + 2]; out[d + 3] = 255; }
  const setpx = (x, y, r, g, b) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const d = (y * W + x) * 4; out[d] = r; out[d + 1] = g; out[d + 2] = b; };
  for (const rc of rects) { const x0 = Math.round(rc.x0 * W), x1 = Math.round(rc.x1 * W), y1 = Math.round((1 - rc.y0) * H), y0 = Math.round((1 - rc.y1) * H); for (let x = x0; x <= x1; x += 1) { setpx(x, y0, 0, 255, 60); setpx(x, y1, 0, 255, 60); } for (let y = y0; y <= y1; y += 1) { setpx(x0, y, 0, 255, 60); setpx(x1, y, 0, 255, 60); } }
  const stride = W * 4; const raw = Buffer.alloc(H * (stride + 1)); for (let y = 0; y < H; y += 1) { raw[y * (stride + 1)] = 0; raw.set(out.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1); }
  const chunk = (type, body) => { const len = Buffer.alloc(4); len.writeUInt32BE(body.length); const tb = Buffer.from(type, "ascii"); const crc = Buffer.alloc(4); let c = ~0; const d = Buffer.concat([tb, body]); for (let i = 0; i < d.length; i += 1) { c ^= d[i]; for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } crc.writeUInt32BE((~c) >>> 0); return Buffer.concat([len, tb, body, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
  writeFileSync(process.argv[process.argv.indexOf("--overlay") + 1] ?? "/tmp/seed-overlay.png", png);
  console.log("overlay written");
}
