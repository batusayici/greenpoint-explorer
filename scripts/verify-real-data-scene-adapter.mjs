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
const REAL_DATA_PATH = "src/data/real-data/manhattan-greenpoint-ave.nw-grillpoint.phase-2y.json";
const EXPECTED_ENTITY_TYPES = [
  "real-data-building-sample",
  "real-data-storefront-sample",
  "real-data-source-badge",
  "real-data-frontage-segment",
  "real-data-address-anchor",
  "real-data-blocked-entrance",
  "real-data-generated-facade",
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
  const realDataRecord = realDataFixture.records[0];
  const firstEntities = generateRealDataQaEntities(realDataRecord);
  const secondEntities = generateRealDataQaEntities(realDataRecord);

  compareJson(failures, firstEntities, secondEntities, "real-data adapter output determinism");
  requireValue(failures, realDataFixture.records.length, 1, "real-data record count");
  requireValue(failures, realDataRecord.targetId, "grillpoint-deli", "selected target id");
  requireValue(failures, realDataRecord.cornerId, "corner-nw", "selected corner id");

  const grillpoint = appScene.targets.find((target) => target.id === "grillpoint-deli");
  if (!grillpoint) {
    failures.push("app scene is missing Grillpoint target");
  } else {
    if (!grillpoint.draftScene?.realDataSlice) {
      failures.push("Grillpoint target is missing realDataSlice");
    }
    const generatedEntityTypes = new Set(grillpoint.draftScene?.generatedScene?.entities.map((entity) => entity.type));
    for (const type of EXPECTED_ENTITY_TYPES) {
      if (!generatedEntityTypes.has(type)) failures.push(`Grillpoint generated scene is missing ${type}`);
    }
    const generatedStatuses = new Set(grillpoint.draftScene?.generatedScene?.entities.map((entity) => entity.status));
    for (const status of EXPECTED_STATUSES) {
      if (!generatedStatuses.has(status)) failures.push(`Grillpoint generated scene is missing ${status} status`);
    }
  }

  for (const target of appScene.targets.filter((target) => target.id !== "grillpoint-deli")) {
    if (target.draftScene?.realDataSlice) {
      failures.push(`${target.id} should not receive the Phase 2Y Grillpoint real-data slice`);
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
    `target=${realDataRecord.targetId};`,
    `corner=${realDataRecord.cornerId};`,
    `${firstEntities.length} deterministic real-data QA entit(ies);`,
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

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
