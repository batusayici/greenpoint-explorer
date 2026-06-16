// src/storefrontSigns.test.mjs
// Run: node --test src/storefrontSigns.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryLabel, resolveSignLabel, planStorefrontSigns, isFoodTrade } from "./storefrontSigns.js";

test("categoryLabel maps known OSM categories to title-case labels", () => {
  assert.equal(categoryLabel("hairdresser"), "Barbershop");
  assert.equal(categoryLabel("barber"), "Barbershop");
  assert.equal(categoryLabel("cafe"), "Café");
  assert.equal(categoryLabel("deli"), "Deli");
  assert.equal(categoryLabel("bar"), "Bar");
  assert.equal(categoryLabel("pub"), "Bar");
  assert.equal(categoryLabel("restaurant"), "Restaurant");
  assert.equal(categoryLabel("convenience"), "Corner Store");
  assert.equal(categoryLabel("clothes"), "Clothing");
  assert.equal(categoryLabel("interior_decoration"), "Home & Decor");
});

test("categoryLabel falls back to Shop for unknown/missing", () => {
  assert.equal(categoryLabel("unknown"), "Shop");
  assert.equal(categoryLabel(undefined), "Shop");
  assert.equal(categoryLabel(""), "Shop");
});

test("resolveSignLabel uses category label unless claimed with a brandName", () => {
  assert.equal(resolveSignLabel({ name: "Sereneco", category: "restaurant" }), "Restaurant");
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser" }), "Barbershop");
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser", claimed: true, brandName: "Joe's Cuts" }), "Joe's Cuts");
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser", claimed: true }), "Barbershop");
});

const bays = [
  { bin: "1", name: "Sereneco", category: "restaurant", slotIndex: 0 },
  { bin: "1", name: "Joe's",    category: "hairdresser", slotIndex: 1 },
];

test("every bay yields exactly one band placement with a resolved label", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const bands = out.filter((p) => p.kind === "band");
  assert.equal(bands.length, 2);
  assert.equal(bands.find((b) => b.bayName === "Sereneco").label, "Restaurant");
  assert.equal(bands.find((b) => b.bayName === "Joe's").label, "Barbershop");
});

test("band geometry params match the legacy band (per-storey, proud of wall)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const band = out.find((p) => p.kind === "band");
  const gy = 1 / 4;
  assert.equal(band.off, 0.02);
  assert.ok(Math.abs(band.y0 - gy * 0.55) < 1e-9);
  assert.ok(Math.abs(band.y1 - gy * 0.90) < 1e-9);
  assert.ok(band.cx > 0 && band.cx < 1);
  assert.ok(band.width > 0 && band.width <= 0.4);
});

test("no unclaimed band label equals its roster name", () => {
  const out = planStorefrontSigns({ bays, storeys: 3 });
  for (const p of out) {
    const bay = bays.find((b) => b.name === p.bayName);
    if (!(bay.claimed && bay.brandName)) assert.notEqual(p.label, bay.name);
  }
});

test("only band placements are produced (blades dropped — unreadable at iso angles)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  assert.equal(out.filter((p) => p.kind === "blade").length, 0);
  assert.equal(out.filter((p) => p.kind === "band").length, bays.length);
});

test("each bay yields exactly one band (no duplicates)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  for (const bay of bays) {
    assert.equal(out.filter((p) => p.kind === "band" && p.bayName === bay.name).length, 1);
  }
});

test("isFoodTrade flags awning-bearing food/drink categories", () => {
  for (const c of ["cafe", "deli", "restaurant", "convenience"]) assert.equal(isFoodTrade(c), true);
  for (const c of ["hairdresser", "clothes", "bar", undefined, ""]) assert.equal(isFoodTrade(c), false);
});

test("every bay yields exactly one awning placement", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  assert.equal(out.filter((p) => p.kind === "awning").length, bays.length);
  for (const bay of bays) {
    assert.equal(out.filter((p) => p.kind === "awning" && p.bayName === bay.name).length, 1);
  }
});

test("food-trade bays get a canopy awning whose valance carries the resolved label", () => {
  const out = planStorefrontSigns({
    bays: [{ bin: "1", name: "Sereneco", category: "restaurant", slotIndex: 0 }],
    storeys: 4,
  });
  const awning = out.find((p) => p.kind === "awning");
  assert.equal(awning.variant, "canopy");
  assert.equal(awning.label, "Restaurant");
  // valance hangs below the front lip, which sits below the wall attachment:
  // yWall > yDrop > yValance, and it projects out from the wall.
  assert.ok(awning.yWall > awning.yDrop && awning.yDrop > awning.yValance);
  assert.ok(awning.projectionM > 0);
});

test("canopy valance shows real branding only when claimed", () => {
  const out = planStorefrontSigns({
    bays: [{ bin: "1", name: "Joe's", category: "cafe", slotIndex: 0, claimed: true, brandName: "Joe's Café" }],
    storeys: 3,
  });
  assert.equal(out.find((p) => p.kind === "awning").label, "Joe's Café");
});

test("non-food bays get a flat awning strip (legacy coplanar geometry)", () => {
  const out = planStorefrontSigns({
    bays: [{ bin: "1", name: "Joe's", category: "hairdresser", slotIndex: 0 }],
    storeys: 4,
  });
  const awning = out.find((p) => p.kind === "awning");
  const gy = 1 / 4;
  assert.equal(awning.variant, "flat");
  assert.ok(Math.abs(awning.y0 - gy * 0.42) < 1e-9);
  assert.ok(Math.abs(awning.y1 - gy * 0.50) < 1e-9);
});

test("empty bays array yields no placements", () => {
  assert.deepEqual(planStorefrontSigns({ bays: [], storeys: 3 }), []);
});

test("a bay missing slotIndex still produces a finite cx (no NaN)", () => {
  const out = planStorefrontSigns({ bays: [{ bin: "1", name: "X", category: "deli" }], storeys: 3 });
  const band = out.find((p) => p.kind === "band");
  assert.ok(Number.isFinite(band.cx));
});
