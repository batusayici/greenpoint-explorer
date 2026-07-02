import test from "node:test";
import assert from "node:assert/strict";
import { MAP_PALETTE } from "../visualSystem/palette.js";
import { cssHex, buildIIMapStyle, GREENPOINT_CENTER } from "./iiMapStyle.js";

test("cssHex formats 24-bit tokens as #rrggbb", () => {
  assert.equal(cssHex(0x2a241c), "#2a241c");
  assert.equal(cssHex(0x000f0f), "#000f0f");
});

test("style has the required skeleton", () => {
  const style = buildIIMapStyle();
  assert.equal(style.version, 8);
  assert.ok(style.glyphs.includes("openfreemap.org/fonts"));
  assert.equal(style.sources.openfreemap.type, "vector");
  const ids = style.layers.map((l) => l.id);
  for (const id of ["background", "water", "park", "road-casing", "road", "building", "road-label", "place-label"]) {
    assert.ok(ids.includes(id), `missing layer: ${id}`);
  }
});

test("every style color resolves from MAP_PALETTE (no-miss)", () => {
  const allowed = new Set(Object.values(MAP_PALETTE).map(cssHex));
  const style = buildIIMapStyle();
  const colors = [];
  const walk = (v, path) => {
    if (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) colors.push([path, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
  };
  walk(style, "style");
  assert.ok(colors.length >= 8, "style should declare colors");
  for (const [path, hex] of colors) {
    assert.ok(allowed.has(hex.toLowerCase()), `out-of-palette color ${hex} at ${path}`);
  }
});

test("center is inside Greenpoint", () => {
  const [lng, lat] = GREENPOINT_CENTER;
  assert.ok(lat > 40.71 && lat < 40.745 && lng > -73.98 && lng < -73.93);
});
