#!/usr/bin/env node
// derive-facade-spec.mjs — measure a rendered facade elevation and emit
// detected opening rects in face-local spec coordinates, plus an overlay
// PNG proving where each rect sits on the texture.
//
// This inverts the workflow that burned the Premier iterations: the render
// is the registration truth, the spec is *derived* from it — never authored
// from a contract. See docs/DECISION_LOG.md (2026-06-12) and
// docs/reference/art/GENERATION_KIT.md "Registration Playbook".
//
// Usage:
//   node scripts/derive-facade-spec.mjs <texture.png> \
//     --face "3322609:franklin=0:0.27963" \
//     --face "3322608:franklin=0.27963:0.478" \
//     --face "3322608:greenpoint=0.478:1" \
//     [--wall-threshold 70] [--out docs/visual-artifacts/facade-derivation]
//
// --wall R,G,B overrides auto wall-color estimation — needed when the wall
// is not the majority surface of a face (e.g. Sonny's dense dark joinery).
// Face u ranges are slices of the TRIMMED texture (same numbers as
// FACADE_COMPOSITES in src/SceneView.jsx). Output rects are face-local:
// x from the face's left edge, y from the GROUND UP — exactly the
// coordinate system facade-spec JSON and facadeAssembly.js use.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
import { basename, dirname, join } from "node:path";

// ---------------------------------------------------------------- PNG codec

function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let offset = 8;
  let ihdr = null;
  let palette = null;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const body = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      ihdr = {
        width: body.readUInt32BE(0),
        height: body.readUInt32BE(4),
        bitDepth: body[8],
        colorType: body[9],
        interlace: body[12],
      };
    } else if (type === "PLTE") palette = body;
    else if (type === "IDAT") idat.push(body);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  if (!ihdr) throw new Error("missing IHDR");
  if (ihdr.bitDepth !== 8 || ihdr.interlace !== 0)
    throw new Error(`unsupported PNG (bitDepth=${ihdr.bitDepth}, interlace=${ihdr.interlace})`);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw new Error(`unsupported color type ${ihdr.colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr;
  const stride = width * channels;
  const line = new Uint8Array(stride);
  const prev = new Uint8Array(stride);
  const rgba = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const rawByte = row[x];
      const a = x >= channels ? line[x - channels] : 0; // left
      const b = prev[x]; // up
      const c = x >= channels ? prev[x - channels] : 0; // up-left
      let value;
      switch (filter) {
        case 0: value = rawByte; break;
        case 1: value = rawByte + a; break;
        case 2: value = rawByte + b; break;
        case 3: value = rawByte + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          value = rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`bad filter ${filter}`);
      }
      line[x] = value & 0xff;
    }
    for (let x = 0; x < width; x += 1) {
      const at = (y * width + x) * 4;
      const src = x * channels;
      if (ihdr.colorType === 2) {
        rgba[at] = line[src]; rgba[at + 1] = line[src + 1]; rgba[at + 2] = line[src + 2]; rgba[at + 3] = 255;
      } else if (ihdr.colorType === 6) {
        rgba[at] = line[src]; rgba[at + 1] = line[src + 1]; rgba[at + 2] = line[src + 2]; rgba[at + 3] = line[src + 3];
      } else if (ihdr.colorType === 0) {
        rgba[at] = rgba[at + 1] = rgba[at + 2] = line[src]; rgba[at + 3] = 255;
      } else if (ihdr.colorType === 4) {
        rgba[at] = rgba[at + 1] = rgba[at + 2] = line[src]; rgba[at + 3] = line[src + 1];
      } else if (ihdr.colorType === 3) {
        const p = line[src] * 3;
        rgba[at] = palette[p]; rgba[at + 1] = palette[p + 1]; rgba[at + 2] = palette[p + 2]; rgba[at + 3] = 255;
      }
    }
    prev.set(line);
  }
  return { width, height, data: rgba };
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const chunk = (type, body) => {
    const out = Buffer.alloc(12 + body.length);
    out.writeUInt32BE(body.length, 0);
    out.write(type, 4, "ascii");
    body.copy(out, 8);
    out.writeUInt32BE(crc32(out.subarray(4, 8 + body.length)), 8 + body.length);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 6 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ------------------------------------------------- runtime-identical trim

// Must mirror loadTrimmedTexture in src/SceneView.jsx exactly: the rects we
// emit are only valid against the image the runtime actually maps.
function trimBounds({ width, height, data }) {
  const border = [data[0], data[1], data[2]];
  const differs = (x, y) => {
    const at = (y * width + x) * 4;
    return (
      Math.abs(data[at] - border[0]) + Math.abs(data[at + 1] - border[1]) + Math.abs(data[at + 2] - border[2]) > 80
    );
  };
  const densityThreshold = 0.085;
  const columnDensity = new Array(width).fill(0);
  const rowDensity = new Array(height).fill(0);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!differs(x, y)) continue;
      columnDensity[x] += 1;
      rowDensity[y] += 1;
    }
  }
  const columnLimit = height * densityThreshold;
  const rowLimit = width * densityThreshold;
  let minX = 0, maxX = width - 1, minY = 0, maxY = height - 1;
  while (minX < maxX && columnDensity[minX] <= columnLimit) minX += 1;
  while (maxX > minX && columnDensity[maxX] <= columnLimit) maxX -= 1;
  while (minY < maxY && rowDensity[minY] <= rowLimit) minY += 1;
  while (maxY > minY && rowDensity[maxY] <= rowLimit) maxY -= 1;
  if (maxX - minX < width * 0.3 || maxY - minY < height * 0.3) {
    minX = 0; minY = 0; maxX = width - 1; maxY = height - 1;
  }
  return { minX, minY, maxX, maxY };
}

function cropImage(img, { minX, minY, maxX, maxY }) {
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const src = ((y + minY) * img.width + minX) * 4;
    data.set(img.data.subarray(src, src + width * 4), y * width * 4);
  }
  return { width, height, data };
}

// ----------------------------------------------------- opening detection

// Wall color per face: per-channel median over the whole face (minus a
// sliver at top/bottom for residual paper edge). Wall is the majority
// surface on every facade we render, and a median is robust both to grainy
// wall texture (which fragments modal-bucket sampling — Sonny's mauve lost
// to its flat dark joinery) and to large storefronts (which dominated
// band-based sampling on low buildings like Sereneco).
function estimateWallColor(img, x0, x1) {
  const { width, data } = img;
  const yStart = Math.floor(img.height * 0.02);
  const yEnd = Math.floor(img.height * 0.98);
  const histograms = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  let total = 0;
  for (let y = yStart; y < yEnd; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const at = (y * width + x) * 4;
      histograms[0][data[at]] += 1;
      histograms[1][data[at + 1]] += 1;
      histograms[2][data[at + 2]] += 1;
      total += 1;
    }
  }
  return histograms.map((histogram) => {
    let seen = 0;
    for (let value = 0; value < 256; value += 1) {
      seen += histogram[value];
      if (seen >= total / 2) return value;
    }
    return 128;
  });
}

function detectFace(img, face, wallThreshold, erodeOverride, wallOverride) {
  const { width, height, data } = img;
  const x0 = Math.round(face.u0 * width);
  const x1 = Math.round(face.u1 * width);
  const faceW = x1 - x0;
  const wall = wallOverride ?? estimateWallColor(img, x0, x1);

  // Not-wall mask. Linework and hatching also differ from wall, so the raw
  // mask is laced with 1-3px bridges connecting every feature into one blob.
  const mask = new Uint8Array(faceW * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < faceW; x += 1) {
      const at = (y * width + x0 + x) * 4;
      const d =
        Math.abs(data[at] - wall[0]) + Math.abs(data[at + 1] - wall[1]) + Math.abs(data[at + 2] - wall[2]);
      mask[y * faceW + x] = d > wallThreshold ? 1 : 0;
    }
  }

  // Erosion cuts the linework bridges: only solid not-wall areas (glass,
  // painted bands, dark bases) survive; ink lines and hatching vanish.
  const erodeRadius = erodeOverride ?? Math.max(2, Math.round(width * 0.002));
  const eroded = erode(mask, faceW, height, erodeRadius);

  // Connected components over the eroded cores.
  const labels = new Int32Array(faceW * height).fill(-1);
  const components = [];
  const stack = [];
  for (let start = 0; start < eroded.length; start += 1) {
    if (!eroded[start] || labels[start] !== -1) continue;
    const label = components.length;
    const comp = { minX: faceW, maxX: -1, minY: height, maxY: -1, count: 0 };
    components.push(comp);
    stack.push(start);
    labels[start] = label;
    while (stack.length) {
      const at = stack.pop();
      const cy = Math.floor(at / faceW);
      const cx = at - cy * faceW;
      if (cx < comp.minX) comp.minX = cx;
      if (cx > comp.maxX) comp.maxX = cx;
      if (cy < comp.minY) comp.minY = cy;
      if (cy > comp.maxY) comp.maxY = cy;
      comp.count += 1;
      if (cx > 0 && eroded[at - 1] && labels[at - 1] === -1) { labels[at - 1] = label; stack.push(at - 1); }
      if (cx < faceW - 1 && eroded[at + 1] && labels[at + 1] === -1) { labels[at + 1] = label; stack.push(at + 1); }
      if (cy > 0 && eroded[at - faceW] && labels[at - faceW] === -1) { labels[at - faceW] = label; stack.push(at - faceW); }
      if (cy < height - 1 && eroded[at + faceW] && labels[at + faceW] === -1) { labels[at + faceW] = label; stack.push(at + faceW); }
    }
  }

  // Undo the erosion shrink, then merge fragments: window panes split by
  // mullions/frames re-join here (gaps between real openings are far wider
  // than any frame).
  let boxes = components
    .filter((c) => c.maxX >= 0 && c.count > 30)
    .map((c) => ({
      minX: Math.max(0, c.minX - erodeRadius),
      maxX: Math.min(faceW - 1, c.maxX + erodeRadius),
      minY: Math.max(0, c.minY - erodeRadius),
      maxY: Math.min(height - 1, c.maxY + erodeRadius),
    }));
  const mergeGap = Math.round(width * 0.005);
  boxes = mergeBoxes(boxes, mergeGap);

  const rects = [];
  for (const box of boxes) {
    const w = box.maxX - box.minX + 1;
    const h = box.maxY - box.minY + 1;
    if (w < faceW * 0.03 || h < height * 0.03) continue; // residual noise
    // Face-local spec coords: x from face left, y from the ground up.
    const rect = {
      x0: round3(box.minX / faceW),
      x1: round3((box.maxX + 1) / faceW),
      y0: round3(1 - (box.maxY + 1) / height),
      y1: round3(1 - box.minY / height),
      px: { x: x0 + box.minX, y: box.minY, w, h },
    };
    rect.type = classify(rect);
    rects.push(rect);
  }
  rects.sort((a, b) => (a.type < b.type ? -1 : a.type > b.type ? 1 : a.y0 !== b.y0 ? b.y0 - a.y0 : a.x0 - b.x0));
  return { wallColor: wall, rects };
}

// Separable box erosion: a pixel survives only if its full (2r+1) box is set.
function erode(mask, width, height, radius) {
  const horizontal = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    let run = 0;
    for (let x = 0; x < width; x += 1) {
      run = mask[y * width + x] ? run + 1 : 0;
      const target = x - radius;
      if (target >= 0 && run >= radius * 2 + 1) horizontal[y * width + target] = 1;
    }
  }
  const out = new Uint8Array(mask.length);
  for (let x = 0; x < width; x += 1) {
    let run = 0;
    for (let y = 0; y < height; y += 1) {
      run = horizontal[y * width + x] ? run + 1 : 0;
      const target = y - radius;
      if (target >= 0 && run >= radius * 2 + 1) out[target * width + x] = 1;
    }
  }
  return out;
}

// Merge boxes that overlap or sit within `gap` px of each other, to fixpoint.
function mergeBoxes(boxes, gap) {
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < boxes.length && !merged; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.minX > b.maxX + gap || b.minX > a.maxX + gap) continue;
        if (a.minY > b.maxY + gap || b.minY > a.maxY + gap) continue;
        boxes[i] = {
          minX: Math.min(a.minX, b.minX),
          maxX: Math.max(a.maxX, b.maxX),
          minY: Math.min(a.minY, b.minY),
          maxY: Math.max(a.maxY, b.maxY),
        };
        boxes.splice(j, 1);
        merged = true;
        break;
      }
    }
  }
  return boxes;
}

function classify(rect) {
  const w = rect.x1 - rect.x0;
  const h = rect.y1 - rect.y0;
  if (rect.y0 < 0.06) return w > 0.18 ? "storefront" : "door";
  if (h > 0.45) return "bay";
  if (h < 0.16 && w > 0.35) return "band";
  return "window";
}

const round3 = (v) => Math.round(v * 1000) / 1000;

// ------------------------------------------------------------- overlay

const TYPE_COLORS = {
  window: [0, 200, 255],
  door: [255, 0, 220],
  storefront: [255, 140, 0],
  bay: [255, 230, 0],
  band: [0, 220, 80],
};

function drawOverlay(img, faces, results) {
  const out = new Uint8Array(img.data);
  const { width, height } = img;
  const setPx = (x, y, [r, g, b]) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const at = (y * width + x) * 4;
    out[at] = r; out[at + 1] = g; out[at + 2] = b; out[at + 3] = 255;
  };
  const rectOutline = (px, color) => {
    for (let t = 0; t < 3; t += 1) {
      for (let x = px.x; x < px.x + px.w; x += 1) {
        setPx(x, px.y + t, color);
        setPx(x, px.y + px.h - 1 - t, color);
      }
      for (let y = px.y; y < px.y + px.h; y += 1) {
        setPx(px.x + t, y, color);
        setPx(px.x + px.w - 1 - t, y, color);
      }
    }
  };
  for (const face of faces) {
    const x = Math.round(face.u0 * width);
    if (face.u0 > 0) for (let y = 0; y < height; y += 1) for (let t = -1; t <= 1; t += 1) setPx(x + t, y, [255, 0, 0]);
  }
  for (const { rects } of results) {
    for (const rect of rects) rectOutline(rect.px, TYPE_COLORS[rect.type] ?? [255, 255, 255]);
  }
  return { width, height, data: out };
}

// ---------------------------------------------------------------- main

function parseArgs(argv) {
  const args = { faces: [], wallThreshold: 55, erode: null, wall: null, out: "docs/visual-artifacts/facade-derivation" };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--face") {
      const match = argv[++i].match(/^(.+)=([\d.]+):([\d.]+)$/);
      if (!match) throw new Error(`bad --face value (want NAME=u0:u1): ${argv[i]}`);
      args.faces.push({ name: match[1], u0: Number(match[2]), u1: Number(match[3]) });
    } else if (argv[i] === "--wall-threshold") args.wallThreshold = Number(argv[++i]);
    else if (argv[i] === "--erode") args.erode = Number(argv[++i]);
    else if (argv[i] === "--wall") {
      const parts = argv[++i].split(",").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) throw new Error(`bad --wall value (want R,G,B): ${argv[i]}`);
      args.wall = parts;
    }
    else if (argv[i] === "--out") args.out = argv[++i];
    else positional.push(argv[i]);
  }
  if (positional.length !== 1 || args.faces.length === 0) {
    console.error(
      'usage: node scripts/derive-facade-spec.mjs <texture.png> --face "BIN:role=u0:u1" [--face ...] [--wall-threshold N] [--erode PX] [--wall R,G,B] [--out DIR]',
    );
    process.exit(1);
  }
  args.texture = positional[0];
  return args;
}

const args = parseArgs(process.argv.slice(2));
const source = decodePng(readFileSync(args.texture));
const bounds = trimBounds(source);
const trimmed = cropImage(source, bounds);
console.log(
  `trim: ${source.width}x${source.height} -> ${trimmed.width}x${trimmed.height} ` +
    `(x ${bounds.minX}..${bounds.maxX}, y ${bounds.minY}..${bounds.maxY})`,
);

const results = args.faces.map((face) => {
  const result = detectFace(trimmed, face, args.wallThreshold, args.erode, args.wall);
  console.log(
    `${face.name} [u ${face.u0}..${face.u1}] wall rgb(${result.wallColor.join(",")}) -> ${result.rects.length} rects`,
  );
  for (const rect of result.rects) {
    console.log(
      `  ${rect.type.padEnd(10)} x ${rect.x0.toFixed(3)}..${rect.x1.toFixed(3)}  y ${rect.y0.toFixed(3)}..${rect.y1.toFixed(3)}`,
    );
  }
  return result;
});

mkdirSync(args.out, { recursive: true });
const base = basename(args.texture).replace(/\.png$/i, "");
const specOut = {
  source: args.texture,
  derivedBy: "scripts/derive-facade-spec.mjs",
  trim: bounds,
  trimmedSize: { width: trimmed.width, height: trimmed.height },
  wallThreshold: args.wallThreshold,
  note: "Rects are face-local (x from face left edge, y from ground up) against the runtime-trimmed texture. Classification is heuristic — review on the overlay before promoting into a facade-spec JSON.",
  faces: Object.fromEntries(
    args.faces.map((face, i) => [
      face.name,
      {
        u0: face.u0,
        u1: face.u1,
        wallColor: results[i].wallColor,
        rects: results[i].rects.map(({ px, ...rect }) => rect),
      },
    ]),
  ),
};
const jsonPath = join(args.out, `${base}.derived-spec.json`);
const overlayPath = join(args.out, `${base}.overlay.png`);
writeFileSync(jsonPath, JSON.stringify(specOut, null, 2));
const overlay = drawOverlay(trimmed, args.faces, results);
writeFileSync(overlayPath, encodePng(overlay.width, overlay.height, overlay.data));
console.log(`\nwrote ${jsonPath}`);
console.log(`wrote ${overlayPath}  (cyan=window magenta=door orange=storefront yellow=bay green=band red=face boundary)`);
