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
