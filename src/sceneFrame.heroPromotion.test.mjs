// Block-extract hero promotion — a full-block hero (Astral, BIN 3064408) lives
// only in a block extract, beyond the 130m context radius the main loop culls
// on. Registering it in facadeGroupBins must promote it to a hero inside the
// block-extract loop (classified edges + placeId), not drop it. Real-data test
// over the same fixtures the runtime imports.
// Run: node --test src/sceneFrame.heroPromotion.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { assembleFranklinScene } from "./sceneFrame.js";
import geometrySource from "./data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json" with { type: "json" };
import sceneGeometryFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json" with { type: "json" };
import wrapFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json" with { type: "json" };
import blockFranklinNorth from "./data/geometry-source/block-franklin-north.nyc-open-geometry.v0.1.json" with { type: "json" };

const ASTRAL_BIN = "3064408";
const CONTROL_BIN = "3063897"; // a plain franklin-north block building

const assemble = (facadeGroupBins) =>
  assembleFranklinScene({
    geometrySource,
    sceneGeometryFixture,
    wrapFixture,
    facadeGroupBins,
    blockExtracts: [blockFranklinNorth],
  });

test("a facadeGroupBins-registered block-extract BIN is promoted to a hero", () => {
  const { buildings } = assemble({ [ASTRAL_BIN]: "astral-apartments" });
  const astral = buildings.find((b) => b.bin === ASTRAL_BIN);
  assert.ok(astral, "Astral must be present in the assembled scene, not culled");
  assert.equal(astral.isHero, true);
  assert.equal(astral.placeId, "astral-apartments");
  assert.ok(Array.isArray(astral.edges) && astral.edges.length > 0, "must carry classified edges");
  assert.ok(
    astral.edges.some((e) => e.role === "franklin"),
    "the full-block frontage must classify at least one franklin-facing edge",
  );
  assert.equal(astral.fromBlockExtract, true, "still a block extract (ground/context paths rely on this)");
});

test("block-extract BINs not registered stay plain typological buildings", () => {
  const { buildings } = assemble({ [ASTRAL_BIN]: "astral-apartments" });
  const control = buildings.find((b) => b.bin === CONTROL_BIN);
  assert.ok(control, "control building present");
  assert.equal(control.isHero, false);
  assert.equal(control.placeId, null);
  assert.equal(control.edges, null);
});

test("with no facadeGroupBins, Astral is a plain block building (regression guard)", () => {
  const { buildings } = assemble({});
  const astral = buildings.find((b) => b.bin === ASTRAL_BIN);
  assert.ok(astral, "still placed by the block loop");
  assert.equal(astral.isHero, false);
  assert.equal(astral.edges, null);
});
