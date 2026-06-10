#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const paths = {
  manifest: "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json",
  geometryCues: "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json",
  evidenceCues: "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json",
  localCues: "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json",
  franklinHero: "src/data/facade-cues/franklin-hero-records.v0.1.json",
  geometrySource: "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json",
};

const expectedPlacements = [
  {
    place: "northwest-cross-franklin",
    cueRecordId: "p4e1-franklin-weathered-brick-glass-base",
    localCueId: "p4l-local-2-franklin-nw-weathered-brick-glass-base",
    bin: "3337033",
    expectedQuadrant: "north-west",
  },
  {
    place: "southeast-corridor-corner",
    cueRecordId: "p4e1-franklin-dark-brick-awned-base",
    localCueId: "p4l-local-2-franklin-se-dark-brick-awned-base",
    bin: "3064811",
    expectedQuadrant: "south-east",
  },
  {
    place: "southwest-cross-franklin",
    cueRecordId: "p4e1-franklin-red-brick-cornice-corner",
    localCueId: "p4l-local-2-franklin-sw-red-brick-cornice-corner",
    bin: "3322608",
    expectedQuadrant: "south-west",
  },
];

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const manifest = await readJson(paths.manifest);
  const geometryCues = await readJson(paths.geometryCues);
  const evidenceCues = await readJson(paths.evidenceCues);
  const localCues = await readJson(paths.localCues);
  const franklinHero = await readJson(paths.franklinHero);
  const geometrySource = await readJson(paths.geometrySource);
  const failures = [];

  const manifestIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const geometryCueIds = new Set(geometryCues.cues.map((cue) => cue.targetSemanticId));
  const footprintByBin = new Map(geometrySource.footprintRecords.map((record) => [record.sourceProperties?.bin, record]));
  const evidenceCueById = new Map(evidenceCues.facadeCueRecords.map((record) => [record.cueRecordId, record]));
  const localCueById = new Map(localCues.enrichedCueRecords.map((record) => [record.enrichedCueId, record]));

  for (const placement of expectedPlacements) {
    const semanticId = `p4b-object-nyc-footprint-bin-${placement.bin}`;
    const sourceRecordId = `p4b-record-nyc-footprint-bin-${placement.bin}`;
    const evidenceCue = evidenceCueById.get(placement.cueRecordId);
    const localCue = localCueById.get(placement.localCueId);
    const footprint = footprintByBin.get(placement.bin);

    assert(manifestIds.has(semanticId), `${placement.place} missing renderable semantic object ${semanticId}`, failures);
    assert(geometryCueIds.has(semanticId), `${placement.place} missing geometry-only facade cue ${semanticId}`, failures);
    assert(evidenceCue?.targetSemanticId === semanticId, `${placement.cueRecordId} targetSemanticId mismatch`, failures);
    assert(evidenceCue?.targetGeometryContainerId === semanticId, `${placement.cueRecordId} targetGeometryContainerId mismatch`, failures);
    assert(evidenceCue?.targetSourceRecordId === sourceRecordId, `${placement.cueRecordId} targetSourceRecordId mismatch`, failures);
    assert(evidenceCue?.qaComposition?.lateralOffsetUnits === 0, `${placement.cueRecordId} must not carry the old artificial lateral offset`, failures);
    assert(localCue?.targetSemanticId === semanticId, `${placement.localCueId} targetSemanticId mismatch`, failures);
    assert(footprint, `${placement.place} missing source footprint bin ${placement.bin}`, failures);
    if (footprint) {
      const quadrant = classifyQuadrant(getWgs84Centroid(footprint.wgs84Polygon));
      assert(quadrant === placement.expectedQuadrant, `${placement.place} expected ${placement.expectedQuadrant}, received ${quadrant}`, failures);
    }
  }

  assert(franklinHero.targetSemanticId === "p4b-object-nyc-footprint-bin-3322608", "Franklin hero target must follow southwest/Premier-side cue", failures);
  assert(franklinHero.bin === "3322608", "Franklin hero bin must be 3322608", failures);
  assert(franklinHero.detailModules?.heroAssetBindings?.bindings?.[0]?.assetPath === "assets/windows/Bay_Window_10K_texture.glb", "R10 GLB asset path must remain unchanged", failures);

  if (failures.length) {
    throw new Error(`4M-R10A Franklin placement fix verification failed:\n- ${failures.join("\n- ")}`);
  }

  console.log("Verified 4M-R10A Franklin placement fix: NW=3337033, SW=3322608, SE=3064811, with R10 GLB path unchanged");
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
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

function classifyQuadrant(point) {
  const intersection = { lon: -73.9575942283495, lat: 40.72987874478096 };
  const greenpointEast = { lon: -73.954246485005, lat: 40.730205703344 };
  const franklinNorth = { lon: -73.9577109092341, lat: 40.73058907278322 };
  const greenpointAxis = [greenpointEast.lon - intersection.lon, greenpointEast.lat - intersection.lat];
  const franklinAxis = [franklinNorth.lon - intersection.lon, franklinNorth.lat - intersection.lat];
  const vector = [point.lon - intersection.lon, point.lat - intersection.lat];
  const northSouth = cross(greenpointAxis, vector) >= 0 ? "north" : "south";
  const eastWest = cross(franklinAxis, vector) >= 0 ? "west" : "east";
  return `${northSouth}-${eastWest}`;
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}
