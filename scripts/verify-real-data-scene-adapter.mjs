#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateRealDataQaEntities,
  loadMvpSceneFromManifest,
  validateDraftSceneFixture,
  validateRealDataFixture,
  validateSceneManifest,
  validateSourceEvidenceFixture,
} from "../src/sceneManifest.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
const EVIDENCE_PATH = "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
const DRAFT_SCENE_PATH = "src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json";
const REAL_DATA_PATH = "src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2z.json";
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
  const primaryAsset = manifest.scene.assets.find((asset) => asset.role === "primary-raster-plate");
  const appScene = loadMvpSceneFromManifest(
    manifest,
    { [primaryAsset.id]: "__real_data_adapter_test_raster_stub__" },
    evidenceFixture,
    draftFixture,
    realDataFixture,
  );
  const failures = [];
  compareArray(failures, realDataFixture.records.map((record) => record.targetId), EXPECTED_TARGETS, "real-data target coverage");
  requireValue(failures, realDataFixture.records.length, EXPECTED_TARGETS.length, "real-data record count");

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
    `statuses=${EXPECTED_STATUSES.join(",")}.`,
  ].join(" "));
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
