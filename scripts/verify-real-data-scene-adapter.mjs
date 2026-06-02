#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import {
  generateRealDataQaEntities,
  loadMvpSceneFromManifest,
  validateDraftSceneFixture,
  validateGeometrySourceFixture,
  validateRealDataFixture,
  validateSceneManifest,
  validateSourceEvidenceFixture,
} from "../src/sceneManifest.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const execFileAsync = promisify(execFile);
const MANIFEST_PATH = "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
const EVIDENCE_PATH = "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
const DRAFT_SCENE_PATH = "src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json";
const REAL_DATA_PATH = "src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json";
const GEOMETRY_SOURCE_PATH = "src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json";
const SOURCE_PRECISION_GENERATOR_PATH = "scripts/generate-real-data-source-precision.mjs";
const EXPECTED_TARGETS = [
  "grillpoint-deli",
  "mcdonalds",
  "dunkin",
  "citizens-bank",
  "greenpoint-g-subway",
];
const EXPECTED_STOREFRONT_ENTITY_TYPES = [
  "real-data-building-sample",
  "real-data-storefront-sample",
  "real-data-source-badge",
  "real-data-frontage-segment",
  "real-data-address-anchor",
  "real-data-blocked-entrance",
  "real-data-generated-facade",
  "real-data-field-status-callout",
];
const EXPECTED_SYMBOLIC_ENTITY_TYPES = [
  "real-data-source-badge",
  "symbolic-cue",
  "real-data-address-anchor",
  "real-data-blocked-entrance",
  "real-data-field-status-callout",
];
const EXPECTED_STATUSES = [
  "source_backed",
  "human_prepared",
  "estimated_from_source",
  "generated_placeholder",
  "blocked",
];

async function main() {
  const manifest = validateSceneManifest(await readJson(MANIFEST_PATH));
  const evidenceFixture = validateSourceEvidenceFixture(await readJson(EVIDENCE_PATH), manifest);
  const draftFixture = validateDraftSceneFixture(await readJson(DRAFT_SCENE_PATH), manifest);
  const realDataFixture = validateRealDataFixture(await readJson(REAL_DATA_PATH), manifest, undefined, evidenceFixture);
  const geometrySourceFixture = validateGeometrySourceFixture(await readJson(GEOMETRY_SOURCE_PATH), manifest);
  const regeneratedPrecisionFixture = await generateSourcePrecisionFixture();
  const primaryAsset = manifest.scene.assets.find((asset) => asset.role === "primary-raster-plate");
  const appScene = loadMvpSceneFromManifest(
    manifest,
    { [primaryAsset.id]: "__real_data_adapter_test_raster_stub__" },
    evidenceFixture,
    draftFixture,
    realDataFixture,
    geometrySourceFixture,
  );
  const failures = [];
  compareJson(
    failures,
    realDataFixture,
    regeneratedPrecisionFixture,
    "source precision fixture determinism",
  );
  compareArray(failures, realDataFixture.records.map((record) => record.targetId), EXPECTED_TARGETS, "real-data target coverage");
  requireValue(failures, realDataFixture.records.length, EXPECTED_TARGETS.length, "real-data record count");
  requireValue(failures, geometrySourceFixture.records.length, 4, "geometry source record count");
  verifySourcePrecisionUpgrades(failures, realDataFixture);
  verifyGeometrySourceLane(failures, geometrySourceFixture, appScene);

  for (const record of realDataFixture.records) {
    const firstEntities = generateRealDataQaEntities(record);
    const secondEntities = generateRealDataQaEntities(record);
    compareJson(failures, firstEntities, secondEntities, `${record.targetId} real-data adapter output determinism`);

    const appTarget = appScene.targets.find((target) => target.id === record.targetId);
    if (!appTarget) {
      failures.push(`app scene is missing target ${record.targetId}`);
      continue;
    }
    if (!appTarget.draftScene?.realDataSlice) {
      failures.push(`${record.targetId} is missing realDataSlice`);
    }

    const expectedTypes = record.renderingKind === "symbolic_transit"
      ? EXPECTED_SYMBOLIC_ENTITY_TYPES
      : EXPECTED_STOREFRONT_ENTITY_TYPES;
    const generatedEntityTypes = new Set(appTarget.draftScene?.generatedScene?.entities.map((entity) => entity.type));
    for (const type of expectedTypes) {
      if (!generatedEntityTypes.has(type)) failures.push(`${record.targetId} generated scene is missing ${type}`);
    }

    const generatedStatuses = new Set(appTarget.draftScene?.generatedScene?.entities.map((entity) => entity.status));
    const expectedStatuses = record.renderingKind === "symbolic_transit"
      ? ["source_backed", "estimated_from_source", "blocked"]
      : EXPECTED_STATUSES;
    for (const status of expectedStatuses) {
      if (!generatedStatuses.has(status)) failures.push(`${record.targetId} generated scene is missing ${status} status`);
    }
  }

  if (failures.length) {
    console.error(`FAIL real-data scene adapter verification: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log([
    "PASS real-data scene adapter:",
    `${realDataFixture.fixtureId};`,
    `targets=${EXPECTED_TARGETS.join(",")};`,
    `records=${realDataFixture.records.length};`,
    `geometrySourceRecords=${geometrySourceFixture.records.length};`,
    `sourcePrecisionUpgrades=mcdonalds,citizens-bank;`,
    `statuses=${EXPECTED_STATUSES.join(",")}.`,
  ].join(" "));
}

function verifyGeometrySourceLane(failures, fixture, appScene) {
  for (const record of fixture.records) {
    if (record.candidateTargetIds.length !== 1) {
      failures.push(`${record.id} should remain a single-target candidate match in Phase 2AB`);
    }
    if (record.matchStatus !== "candidate_match") {
      failures.push(`${record.id} must remain candidate_match, received ${record.matchStatus}`);
    }
    if (!record.matchNotes.includes("does not prove")) {
      failures.push(`${record.id} is missing target-match guardrail language`);
    }
    for (const targetId of record.candidateTargetIds) {
      const appTarget = appScene.targets.find((target) => target.id === targetId);
      if (!appTarget) {
        failures.push(`geometry source target ${targetId} is missing from app scene`);
        continue;
      }
      const matches = appTarget.draftScene?.geometrySourceMatches ?? [];
      if (!matches.some((match) => match.id === record.id)) {
        failures.push(`${targetId} is missing geometry source match ${record.id}`);
      }
      const generatedEntity = appTarget.draftScene?.generatedScene?.entities
        .find((entity) => entity.type === "official-building-footprint-candidate" && entity.id.startsWith(record.id));
      if (!generatedEntity) {
        failures.push(`${targetId} generated scene is missing official footprint candidate for ${record.id}`);
      } else if (generatedEntity.status !== "candidate_match") {
        failures.push(`${targetId} official footprint entity must remain candidate_match`);
      } else if (!generatedEntity.polygon?.length) {
        failures.push(`${targetId} official footprint entity is missing projected polygon`);
      }
    }
  }

  if (!fixture.blockedClaims.some((claim) => claim.includes("Exact tenant frontage"))) {
    failures.push("geometry source fixture is missing exact frontage blocked claim");
  }
  const subway = appScene.targets.find((target) => target.id === "greenpoint-g-subway");
  if ((subway?.draftScene?.geometrySourceMatches ?? []).length) {
    failures.push("greenpoint-g-subway must not receive a building footprint geometry match");
  }
}

async function generateSourcePrecisionFixture() {
  const tempDir = await mkdtemp(resolve(tmpdir(), "greenpoint-real-data-source-precision-"));
  const tempOutputPath = resolve(tempDir, "phase-2aa.json");
  try {
    await execFileAsync(process.execPath, [
      SOURCE_PRECISION_GENERATOR_PATH,
      "--output",
      tempOutputPath,
    ], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024,
    });
    return JSON.parse(await readFile(tempOutputPath, "utf8"));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function verifySourcePrecisionUpgrades(failures, fixture) {
  const recordsByTarget = new Map(fixture.records.map((record) => [record.targetId, record]));
  for (const targetId of ["mcdonalds", "citizens-bank"]) {
    const record = recordsByTarget.get(targetId);
    if (!record) continue;
    requireValue(
      failures,
      record.geometry.buildingSample.status,
      "estimated_from_source",
      `${targetId} buildingSample source precision status`,
    );
    requireValue(
      failures,
      record.geometry.frontageSegment.status,
      "source_backed",
      `${targetId} frontageSegment source precision status`,
    );
    if (!record.sourcePrecision?.upgradedFields?.includes("geometry.frontageSegment.status")) {
      failures.push(`${targetId} is missing sourcePrecision frontage upgrade metadata`);
    }
  }

  for (const targetId of ["grillpoint-deli", "dunkin"]) {
    const record = recordsByTarget.get(targetId);
    if (!record) continue;
    requireValue(
      failures,
      record.geometry.buildingSample.status,
      "human_prepared",
      `${targetId} buildingSample unchanged status`,
    );
    requireValue(
      failures,
      record.geometry.frontageSegment.status,
      "estimated_from_source",
      `${targetId} frontageSegment unchanged status`,
    );
  }

  const subway = recordsByTarget.get("greenpoint-g-subway");
  if (subway) {
    requireValue(
      failures,
      subway.geometry.symbolicCue.status,
      "blocked",
      "greenpoint-g symbolic cue remains blocked",
    );
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

function compareJson(failures, actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) failures.push(`${label} mismatch`);
}

function requireValue(failures, actual, expected, label) {
  if (actual !== expected) failures.push(`${label} expected ${expected}, received ${actual}`);
}

function compareArray(failures, actual, expected, label) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(`${label} expected ${expectedSorted.join(",")}, received ${actualSorted.join(",")}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
