#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const paths = {
  mapping: "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10b-spatial-mapping.v0.1.json",
  geometrySource: "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json",
  manifest: "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json",
  evidenceCues: "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json",
  localCues: "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json",
  franklinHero: "src/data/facade-cues/franklin-hero-records.v0.1.json",
  runtime: "src/Phase4BRuntimePreview.jsx",
};

const expected = {
  "premier-franklin-organic": {
    franklinSide: "west_across_franklin",
    greenpointSide: "south",
    cornerRole: "southwest_across_franklin_corner",
    primaryBin: "3322608",
  },
  sereneco: {
    franklinSide: "west_across_franklin",
    greenpointSide: "north",
    cornerRole: "northwest_across_franklin_corner",
    primaryBin: "3337033",
  },
  "sonnys-corner": {
    franklinSide: "east_corridor_side",
    greenpointSide: "south",
    cornerRole: "southeast_corridor_side_corner",
    primaryBin: "3064811",
  },
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const mapping = await readJson(paths.mapping);
  const geometrySource = await readJson(paths.geometrySource);
  const manifest = await readJson(paths.manifest);
  const evidenceCues = await readJson(paths.evidenceCues);
  const localCues = await readJson(paths.localCues);
  const franklinHero = await readJson(paths.franklinHero);
  const runtime = await readText(paths.runtime);
  const failures = [];

  const footprintByBin = new Map(geometrySource.footprintRecords.map((record) => [record.sourceProperties?.bin, record]));
  const manifestIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const evidenceCueTargets = new Map(evidenceCues.facadeCueRecords.map((record) => [record.cueRecordId, record]));
  const localCueTargets = new Map(localCues.enrichedCueRecords.map((record) => [record.enrichedCueId, record]));

  assert(mapping.phase === "4M-R10B", "Mapping fixture must be scoped to 4M-R10B.", failures);
  assert(mapping.qaOnly === true, "Mapping fixture must be QA-only.", failures);
  assert(mapping.normalModeExposure === "blocked", "Mapping fixture must block normal mode.", failures);
  assert(mapping.intersectionModel?.artificialOffsetsUsedForCorrection === false, "Artificial offsets must not be the correction mechanism.", failures);
  assert(mapping.intersectionModel?.franklinSeparatorStatus === "derived_review_separator_missing_franklin_centerline_in_phase_3b_packet", "Fixture must record the Franklin separator limitation.", failures);

  const placeById = new Map(mapping.placeMappings.map((place) => [place.placeId, place]));
  for (const [placeId, expectation] of Object.entries(expected)) {
    const place = placeById.get(placeId);
    assert(place, `Missing mapping for ${placeId}.`, failures);
    if (!place) continue;

    assert(place.sourceBackedFootprintBin === expectation.primaryBin, `${placeId} primary BIN expected ${expectation.primaryBin}, received ${place.sourceBackedFootprintBin}.`, failures);
    assert(place.sourceBackedObjectId === `p4b-object-nyc-footprint-bin-${expectation.primaryBin}`, `${placeId} object id mismatch.`, failures);
    assert(place.sideOfFranklinAve === expectation.franklinSide, `${placeId} sideOfFranklinAve must be ${expectation.franklinSide}.`, failures);
    assert(place.sideOfGreenpointAve === expectation.greenpointSide, `${placeId} sideOfGreenpointAve must be ${expectation.greenpointSide}.`, failures);
    assert(place.cornerIntersectionRole === expectation.cornerRole, `${placeId} corner role must be ${expectation.cornerRole}.`, failures);
    assert(Array.isArray(place.evidenceScreenshotReferences) && place.evidenceScreenshotReferences.length >= 1, `${placeId} must reference supplied evidence screenshots.`, failures);

    for (const evidencePath of place.evidenceScreenshotReferences ?? []) {
      assert(existsSync(resolve(repoRoot, evidencePath)), `${placeId} evidence screenshot path is missing: ${evidencePath}`, failures);
    }

    const primaryFootprint = footprintByBin.get(place.sourceBackedFootprintBin);
    assert(primaryFootprint, `${placeId} missing source footprint ${place.sourceBackedFootprintBin}.`, failures);
    assert(manifestIds.has(place.sourceBackedObjectId), `${placeId} primary object is not renderable: ${place.sourceBackedObjectId}.`, failures);
    if (primaryFootprint) {
      const centroid = getWgs84Centroid(primaryFootprint.wgs84Polygon);
      assert(classifyFranklinSide(centroid, mapping) === place.sideOfFranklinAve, `${placeId} WGS centroid contradicts sideOfFranklinAve.`, failures);
      assert(classifyGreenpointSide(centroid, mapping) === place.sideOfGreenpointAve, `${placeId} WGS centroid contradicts sideOfGreenpointAve.`, failures);
    }

    for (const bin of place.sameBblSourceComponentBins ?? []) {
      const component = footprintByBin.get(bin);
      assert(component, `${placeId} same-BBL source component missing: ${bin}.`, failures);
      if (component && primaryFootprint) {
        assert(component.sourceProperties?.baseBbl === primaryFootprint.sourceProperties?.baseBbl, `${placeId} component ${bin} must share BBL with primary ${place.sourceBackedFootprintBin}.`, failures);
      }
    }

    for (const objectId of place.renderedComponentObjectIds ?? []) {
      assert(manifestIds.has(objectId), `${placeId} rendered component missing from manifest: ${objectId}.`, failures);
    }
  }

  const westAcross = mapping.requiredSpatialRelationship?.westAcrossFranklinPlaceIds ?? [];
  const eastSide = mapping.requiredSpatialRelationship?.eastCorridorSidePlaceIds ?? [];
  assert(westAcross.includes("premier-franklin-organic") && westAcross.includes("sereneco"), "Premier/Sereneco must be required west/across Franklin.", failures);
  assert(eastSide.includes("sonnys-corner"), "Sonny's must be required east/corridor side.", failures);
  assert(placeById.get("sonnys-corner")?.sideOfFranklinAve !== placeById.get("premier-franklin-organic")?.sideOfFranklinAve, "Sonny's must not share Franklin side with Premier.", failures);
  assert(placeById.get("sonnys-corner")?.sideOfFranklinAve !== placeById.get("sereneco")?.sideOfFranklinAve, "Sonny's must not share Franklin side with Sereneco.", failures);

  assert(evidenceCueTargets.get("p4e1-franklin-red-brick-cornice-corner")?.qaComposition?.lateralOffsetUnits === 0, "Premier/SW cue must not use lateral offset correction.", failures);
  assert(evidenceCueTargets.get("p4e1-franklin-weathered-brick-glass-base")?.qaComposition?.lateralOffsetUnits === 0, "Sereneco/NW cue must not use lateral offset correction.", failures);
  assert(evidenceCueTargets.get("p4e1-franklin-dark-brick-awned-base")?.qaComposition?.lateralOffsetUnits === 0, "Sonny/SE cue must not use lateral offset correction.", failures);
  assert(localCueTargets.get("p4l-local-2-franklin-sw-red-brick-cornice-corner")?.targetSemanticId === "p4b-object-nyc-footprint-bin-3322608", "Local SW cue must target Premier primary BIN 3322608.", failures);
  assert(localCueTargets.get("p4l-local-2-franklin-nw-weathered-brick-glass-base")?.targetSemanticId === "p4b-object-nyc-footprint-bin-3337033", "Local NW cue must target Sereneco BIN 3337033.", failures);
  assert(localCueTargets.get("p4l-local-2-franklin-se-dark-brick-awned-base")?.targetSemanticId === "p4b-object-nyc-footprint-bin-3064811", "Local SE cue must target Sonny BIN 3064811.", failures);

  assert(franklinHero.targetSemanticId === "p4b-object-nyc-footprint-bin-3322608", "Franklin hero record must remain bound to Premier/SW primary footprint for later GLB review.", failures);
  assert(franklinHero.detailModules?.heroAssetBindings?.bindings?.[0]?.assetPath === "assets/windows/Bay_Window_10K_texture.glb", "R10 GLB path must be preserved.", failures);

  for (const snippet of [
    "franklinIntersectionMappingFixture",
    "QA_LAYER_FOCUS_FRANKLIN_SPATIAL",
    "addFranklinIntersectionMappingOverlay",
    "franklinIntersectionSeparator",
    "franklinIntersectionMappingLabel",
  ]) {
    assert(runtime.includes(snippet), `Runtime missing R10B spatial overlay snippet: ${snippet}`, failures);
  }

  if (failures.length) {
    throw new Error(`4M-R10B Franklin spatial reconciliation verification failed:\n- ${failures.join("\n- ")}`);
  }

  console.log("Verified 4M-R10B Franklin spatial reconciliation: Premier/Sereneco west of Franklin, Sonny east/corridor-side, separator overlay present, no offset-based correction.");
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

async function readText(path) {
  return readFile(resolve(repoRoot, path), "utf8");
}

function getWgs84Centroid(points) {
  const clean = removeClosingPoint(points);
  return {
    lon: clean.reduce((sum, point) => sum + point.lon, 0) / clean.length,
    lat: clean.reduce((sum, point) => sum + point.lat, 0) / clean.length,
  };
}

function removeClosingPoint(points) {
  const first = points[0];
  const last = points[points.length - 1];
  if (first?.lon === last?.lon && first?.lat === last?.lat) return points.slice(0, -1);
  return points;
}

function classifyFranklinSide(point, mapping) {
  const intersection = mapping.intersectionModel.sharedGreenpointEndpointWgs84;
  return point.lon < intersection.lon ? "west_across_franklin" : "east_corridor_side";
}

function classifyGreenpointSide(point, mapping) {
  const west = mapping.intersectionModel.greenpointSideRule.westPointWgs84;
  const east = mapping.intersectionModel.greenpointSideRule.eastPointWgs84;
  const axis = [east.lon - west.lon, east.lat - west.lat];
  const vector = [point.lon - west.lon, point.lat - west.lat];
  return cross(axis, vector) >= 0 ? "north" : "south";
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}
