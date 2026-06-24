import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveStorefrontUnit } from "./storefrontUnitResolve.js";

const bay = { category: "retail" };
const food = { category: "restaurant" }; // isFoodTrade true

test("defaults: alternating door, awning follows food trade", () => {
  const u0 = resolveStorefrontUnit({ bay: food, index: 0, params: {}, count: 2 });
  assert.equal(u0.door, "left");
  assert.equal(u0.awning.has, true);
  const u1 = resolveStorefrontUnit({ bay, index: 1, params: {}, count: 2 });
  assert.equal(u1.door, "right");
  assert.equal(u1.awning.has, false);
});

test("storefrontAwning false suppresses a food awning", () => {
  const u = resolveStorefrontUnit({ bay: food, index: 0, params: { storefrontAwning: false }, count: 1 });
  assert.equal(u.awning.has, false);
});

test("storefrontAwning color sets has+color", () => {
  const u = resolveStorefrontUnit({ bay, index: 0, params: { storefrontAwning: 0x27314d }, count: 1 });
  assert.equal(u.awning.has, true);
  assert.equal(u.awning.color, 0x27314d);
});

test("doorAlign overrides left/right", () => {
  assert.equal(resolveStorefrontUnit({ bay, index: 1, params: { doorAlign: "left" }, count: 2 }).door, "left");
});

test("doorAlign center passes through", () => {
  assert.equal(resolveStorefrontUnit({ bay, index: 0, params: { doorAlign: "center" }, count: 1 }).door, "center");
});

// --- R2 signature layer: a present signature wins over category/param defaults ---

const eg = {
  category: "bar",
  signature: {
    awning: { profile: "scalloped", tintToken: "slateBlueDark", wrapCorner: true },
    frame: { tintToken: "inkBlack" },
    transom: { text: "COCKTAILS · COLD BEER", tintToken: "signalAmber" },
    blade: { shape: "oval", tintToken: "signalAmber" },
  },
};

test("signature forces the awning on (even for a non-food bar) with its navy tint", () => {
  const u = resolveStorefrontUnit({ bay, index: 1, params: {}, count: 1, signature: eg.signature });
  assert.equal(u.awning.has, true);
  assert.equal(u.awning.color, 0x2a313a); // slateBlueDark
  assert.equal(u.awning.profile, "scalloped");
  assert.equal(u.awning.wrapCorner, true);
});

test("signature sets black frame + dark sign board + gold lettering + transom label", () => {
  const u = resolveStorefrontUnit({ bay, index: 0, params: {}, count: 1, signature: eg.signature });
  assert.equal(u.frameTint, 0x1d1a16); // inkBlack
  assert.equal(u.signColor, 0x1d1a16);
  assert.equal(u.textHex, 0xcc9a3b); // signalAmber gold
  assert.equal(u.label, "COCKTAILS · COLD BEER");
});

test("signature awning wins over a param storefrontAwning=false", () => {
  const u = resolveStorefrontUnit({ bay, index: 0, params: { storefrontAwning: false }, count: 1, signature: eg.signature });
  assert.equal(u.awning.has, true);
});

test("absent signature is byte-stable (no signature fields leak in)", () => {
  const u = resolveStorefrontUnit({ bay: food, index: 0, params: {}, count: 1 });
  assert.equal(u.frameTint, undefined);
  assert.equal(u.signColor, undefined);
  assert.equal(u.textHex, undefined);
  assert.equal(u.label, undefined);
  assert.equal(u.awning.profile, undefined);
});
