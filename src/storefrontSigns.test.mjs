// src/storefrontSigns.test.mjs
// Run: node --test src/storefrontSigns.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryLabel, resolveSignLabel, planStorefrontSigns } from "./storefrontSigns.js";

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

test("loud-trade bays get a blade in addition to a band; others do not", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const blades = out.filter((p) => p.kind === "blade");
  assert.equal(blades.length, 1);
  assert.equal(blades[0].bayName, "Joe's");
  assert.equal(blades[0].label, "Barbershop");
});

test("bar and pub are loud trades; cafe and deli are not", () => {
  const mk = (category) => planStorefrontSigns({
    bays: [{ bin: "1", name: "X", category, slotIndex: 0 }], storeys: 3,
  }).filter((p) => p.kind === "blade").length;
  assert.equal(mk("bar"), 1);
  assert.equal(mk("pub"), 1);
  assert.equal(mk("hairdresser"), 1);
  assert.equal(mk("cafe"), 0);
  assert.equal(mk("deli"), 0);
  assert.equal(mk("restaurant"), 0);
});

test("blade carries a positive projection and a mount within the ground storey", () => {
  const blade = planStorefrontSigns({
    bays: [{ bin: "1", name: "X", category: "bar", slotIndex: 0 }], storeys: 4,
  }).find((p) => p.kind === "blade");
  const gy = 1 / 4;
  assert.ok(blade.projectMeters > 0);
  assert.ok(blade.mountY > 0 && blade.mountY < gy);
  assert.ok(blade.panelHeightFrac > 0 && blade.panelHeightFrac < gy);
  assert.equal(blade.off, 0.02);
});

test("no bay yields more than one band or more than one blade (no stacking)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  for (const bay of bays) {
    assert.equal(out.filter((p) => p.kind === "band" && p.bayName === bay.name).length, 1);
    assert.ok(out.filter((p) => p.kind === "blade" && p.bayName === bay.name).length <= 1);
  }
});

test("empty bays array yields no placements", () => {
  assert.deepEqual(planStorefrontSigns({ bays: [], storeys: 3 }), []);
});

test("a bay missing slotIndex still produces a finite cx (no NaN)", () => {
  const out = planStorefrontSigns({ bays: [{ bin: "1", name: "X", category: "deli" }], storeys: 3 });
  const band = out.find((p) => p.kind === "band");
  assert.ok(Number.isFinite(band.cx));
});
