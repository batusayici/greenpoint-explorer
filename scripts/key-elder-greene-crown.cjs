// key-elder-greene-crown.cjs — pretrim (crown-preserving) + bake the sky alpha
// above Elder Greene's stepped parapet + curved pediment, so the cream paper
// above the (stepped-DOWN) Kent parapet stops showing as a white "leaning" band.
//
// Why flood-fill, not the runtime color-key: Elder Greene's parapet carries
// CREAM limestone diamond insets + coping caps — the same tone as the paper sky.
// A color key would punch holes in them. Border flood-fill from the TOP edge,
// bounded by the dark inked parapet outline, clears only the connected SKY and
// leaves interior limestone opaque (the Brouwerij gable lesson).
//
// Crop: keep the SAME horizontal content bounds the runtime trim finds
// (x 29..1469 → width 1441) so the measured folds (u0.26 seam, u0.64 corner)
// are unchanged; extend the TOP above the pediment tip so the crown is preserved
// (the runtime 8.5% density-trim clips the sparse peak). Output is PRETRIMMED
// (.trim.png) so the runtime skips its trim.
const { readFileSync, writeFileSync } = require("node:fs");
const { PNG } = require("pngjs");
const zlib = require("node:zlib");

const SRC = "assets/textures/franklin/elder-greene--corner.png";
const OUT = "assets/textures/franklin/elder-greene--corner.trim.png";
// Crop box (source px). x matches the runtime density-trim (x29..1469); y200 keeps
// the full pediment (content starts ~y216), y912 = runtime bottom.
// CY1 = the building base (storefront bottom). The render has ~9 rows of cream
// paper/sidewalk below it (v<0.013, lum~185) that read as a "white band" at the
// wall foot — crop them out at y903 (the dark storefront base) so the texture
// bottom sits on the ground line.
const CX0 = 29, CX1 = 1469, CY0 = 200, CY1 = 903;

const src = PNG.sync.read(readFileSync(SRC));
const W = CX1 - CX0 + 1, H = CY1 - CY0 + 1;
const out = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const s = ((y + CY0) * src.width + (x + CX0)) * 4, d = (y * W + x) * 4;
  out.data[d] = src.data[s]; out.data[d + 1] = src.data[s + 1];
  out.data[d + 2] = src.data[s + 2]; out.data[d + 3] = 255;
}
const d = out.data;
// cream paper test: light & desaturated (paper ~rgb212,192,165 → L0.83 S0.22).
const isCream = (i) => {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const light = mx / 255, sat = mx ? (mx - mn) / mx : 0;
  return light > 0.74 && sat < 0.36;
};
// 1) flood-fill the SKY from the top edge, 8-connected, only through cream.
const st = [];
for (let x = 0; x < W; x++) { const i = x * 4; if (isCream(i)) { d[i + 3] = 0; st.push(x, 0); } }
while (st.length) {
  const y = st.pop(), x = st.pop();
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const ni = (ny * W + nx) * 4; if (d[ni + 3] === 0) continue;
    if (isCream(ni)) { d[ni + 3] = 0; st.push(nx, ny); }
  }
}
// 2) bleed dark ink into the cleared pixels (mipmap/bilinear filtering otherwise
//    washes thin dark parapet bars to pale) — match Brouwerij/Astral.
for (let i = 0; i < W * H; i++) { if (d[i * 4 + 3] === 0) { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 24; } }
// 3) connectivity: keep only opaque reachable from the bottom row (drop islands).
const A = 128, op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > A;
const keep = new Uint8Array(W * H), s2 = [];
for (let x = 0; x < W; x++) if (op(x, H - 1)) { keep[(H - 1) * W + x] = 1; s2.push(x, H - 1); }
while (s2.length) {
  const y = s2.pop(), x = s2.pop();
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const m = ny * W + nx;
    if (keep[m]) continue; if (op(nx, ny)) { keep[m] = 1; s2.push(nx, ny); }
  }
}
let islands = 0;
for (let i = 0; i < W * H; i++) if (d[i * 4 + 3] > A && !keep[i]) { d[i * 4 + 3] = 0; d[i*4]=d[i*4+1]=d[i*4+2]=24; islands++; }
writeFileSync(OUT, PNG.sync.write(out));
// 4) measure roofV candidates: parapet-top row (first opaque at 4% inset cols)
//    and cornice row (first row where >=90% of columns are opaque = continuous wall).
const inset = Math.round(0.04 * W);
let parapetTop = 0; for (let y = 0; y < H; y++) { if (op(inset, y) || op(W - 1 - inset, y)) { parapetTop = y; break; } }
let corniceRow = 0; for (let y = 0; y < H; y++) { let n = 0; for (let x = 0; x < W; x++) if (op(x, y)) n++; if (n > W * 0.9) { corniceRow = y; break; } }
console.log(JSON.stringify({
  out: OUT, W, H, aspect: +(W / H).toFixed(3), islands,
  parapetTopV: +(1 - parapetTop / H).toFixed(3),
  corniceV: +(1 - corniceRow / H).toFixed(3),
}));
