import { test } from "node:test";
import assert from "node:assert/strict";
import {
  selectTreatment,
  TREATMENTS,
  paletteKeyForMaterial,
  paletteHexForMaterial,
} from "./treatmentMap.js";
import { TYPOLOGY_PALETTE } from "./palette.js";

const RADIUS = 3.6;

// Mirror of the original inline tree in buildBuildings, to assert parity.
function legacyTree({ building, dist, inkedParams }) {
  if (building.isHero && building.edges) return "hero";
  if (inkedParams) return "inkedKit";
  if (building.fromBlockExtract || dist <= RADIUS) return "typological";
  return "graybox";
}

const cases = [
  { building: { isHero: true, edges: [1] }, dist: 99, inkedParams: null },
  { building: { isHero: true, edges: null }, dist: 1, inkedParams: { tint: 1 } }, // hero w/o edges → falls through
  { building: {}, dist: 99, inkedParams: { tint: 1 } },
  { building: { fromBlockExtract: true }, dist: 99, inkedParams: null },
  { building: {}, dist: 1, inkedParams: null },
  { building: {}, dist: 99, inkedParams: null },
];

test("selectTreatment matches the legacy decision tree", () => {
  for (const c of cases) {
    assert.equal(
      selectTreatment({ ...c, contextRadius: RADIUS }),
      legacyTree(c),
      JSON.stringify(c),
    );
  }
});

test("every treatment names a builder slot (or null) and component list", () => {
  for (const [kind, t] of Object.entries(TREATMENTS)) {
    assert.ok("builder" in t, `${kind}.builder`);
    assert.ok(Array.isArray(t.components), `${kind}.components`);
  }
  assert.equal(TREATMENTS.graybox.builder, null);
});

test("material family maps to a real typological palette token", () => {
  for (const fam of ["brick-prewar", "painted-masonry", "commercial-storefront", "warehouse"]) {
    const key = paletteKeyForMaterial(fam);
    assert.ok(key in TYPOLOGY_PALETTE, key);
    assert.equal(paletteHexForMaterial(fam), TYPOLOGY_PALETTE[key]);
  }
  // unknown family falls back to brick
  assert.equal(paletteKeyForMaterial("???"), "typological.brick");
});
