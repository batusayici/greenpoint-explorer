#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expansionPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";
const seedAdapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const manifestPath = "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";

const requiredFalsePolicyFields = [
  "externalDataFetched",
  "externalDataDownloaded",
  "externalDataCached",
  "externalDataIngested",
  "externalDataConverted",
  "externalDataRendered",
  "externalImageryAccessed",
  "liveNetworkAccess",
  "mapillaryAutomation",
  "blenderOrGlbAssetWork",
  "packageOrToolingChanged",
  "publicInterfacesChanged",
  "moduleBoundariesChanged",
  "normalModeExposureChanged",
];

const forbiddenFields = new Set([
  "businessName",
  "tenantName",
  "storefrontName",
  "tenantFrontage",
  "frontageClaim",
  "activeStatus",
  "exactAddress",
  "exactFacade",
  "exactEntrance",
  "entranceLocation",
  "signText",
  "logo",
  "imageUrl",
  "downloadUrl",
  "apiUrl",
  "publicRoute",
  "productionAsset",
]);

async function main() {
  const failures = [];
  const expansionText = await readFile(resolve(repoRoot, expansionPath), "utf8");
  const expansion = JSON.parse(expansionText);
  const seedAdapter = JSON.parse(await readFile(resolve(repoRoot, seedAdapterPath), "utf8"));
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));

  assertEqual(expansion.schemaVersion, "phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1", "schemaVersion", failures);
  assertEqual(expansion.phase, "4O-18", "phase", failures);
  assertEqual(expansion.reviewOnly, true, "reviewOnly", failures);
  assertEqual(expansion.qaOnly, true, "qaOnly", failures);
  assertEqual(expansion.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(expansion.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(expansion.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(expansion.moduleBoundaryPolicy, "blocked_no_new_public_module_boundary", "moduleBoundaryPolicy", failures);
  assertEqual(expansion.derivedFromSeedAdapterFixtureId, seedAdapter.fixtureId, "derivedFromSeedAdapterFixtureId", failures);
  assertEqual(expansion.derivedFromSeedAdapterPath, seedAdapterPath, "derivedFromSeedAdapterPath", failures);
  assertEqual(expansion.derivedFromCandidateFixtureId, candidates.fixtureId, "derivedFromCandidateFixtureId", failures);
  assertEqual(expansion.derivedFromCandidatePath, candidatePath, "derivedFromCandidatePath", failures);
  assertEqual(expansion.existingSceneManifestPath, manifestPath, "existingSceneManifestPath", failures);
  assertEqual(expansion.deterministic, true, "deterministic", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(expansion.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const [claim, status] of Object.entries(expansion.claimProtection ?? {})) {
    if (status !== "blocked") failures.push(`claimProtection.${claim} must be blocked`);
  }

  assertArrayEquals(
    (expansion.buildingAnchors ?? []).map((record) => record.anchorId),
    expansion.buildingAnchorOrder,
    "buildingAnchorOrder",
    failures,
  );
  assertArrayEquals(
    (expansion.groundingGuides ?? []).map((record) => record.guideId),
    expansion.groundingGuideOrder,
    "groundingGuideOrder",
    failures,
  );

  const seedIds = new Set((seedAdapter.renderRecords ?? []).map((record) => record.recordId));
  const manifestIds = new Set((manifest.semanticObjects ?? []).map((record) => record.id));
  const candidateIds = new Set(candidates.candidateRecordOrder ?? []);
  const uniqueAnchors = new Set();

  for (const anchor of expansion.buildingAnchors ?? []) {
    uniqueAnchors.add(anchor.targetRenderedObjectId);
    if (!anchor.anchorId.startsWith("p4o18-anchor-")) failures.push(`${anchor.anchorId} must use p4o18-anchor- prefix`);
    if (!manifestIds.has(anchor.targetRenderedObjectId)) failures.push(`${anchor.anchorId} targets unknown runtime object`);
    if (!seedIds.has(anchor.containerSeedRecordId)) failures.push(`${anchor.anchorId} has unknown container seed`);
    if (!seedIds.has(anchor.heightSeedRecordId)) failures.push(`${anchor.anchorId} has unknown height seed`);
    if (!["left", "right"].includes(anchor.corridorSide)) failures.push(`${anchor.anchorId} must include corridorSide`);
  }

  for (const guide of expansion.groundingGuides ?? []) {
    uniqueAnchors.add(guide.targetRenderedObjectId);
    if (!guide.guideId.startsWith("p4o18-ground-")) failures.push(`${guide.guideId} must use p4o18-ground- prefix`);
    if (!manifestIds.has(guide.targetRenderedObjectId)) failures.push(`${guide.guideId} targets unknown runtime guide object`);
    if (!seedIds.has(guide.seedRecordId)) failures.push(`${guide.guideId} has unknown grounding seed`);
  }

  const seedCandidateIds = new Set((seedAdapter.renderRecords ?? []).map((record) => record.derivedFromCandidateId));
  for (const candidateId of candidateIds) {
    if (!seedCandidateIds.has(candidateId)) failures.push(`Seed adapter no longer covers 4O-10 candidate ${candidateId}`);
  }

  verifySummary(expansion, uniqueAnchors, failures);
  verifyNoForbiddenFields(expansion, "expansion", failures);
  verifyStableFormatting(expansionText, failures);

  if (failures.length > 0) {
    console.error("4O-18 corridor-wide QA scaffold preview expansion verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${expansionPath}: ${expansion.summary.renderRecordCount} QA-only scaffold expansion records from ${expansion.buildingAnchors.length} building anchors and ${expansion.groundingGuides.length} guides`);
}

function verifySummary(expansion, uniqueAnchors, failures) {
  const expected = {
    expandedBuildingAnchorCount: expansion.buildingAnchors.length,
    expandedGroundingGuideCount: expansion.groundingGuides.length,
    renderRecordCount: expansion.buildingAnchors.length * 2 + expansion.groundingGuides.length,
    renderedQaOnlyRecordCount: expansion.buildingAnchors.length * 2 + expansion.groundingGuides.length,
    buildingContainerPreviewCount: expansion.buildingAnchors.length,
    groundingPreviewCount: expansion.groundingGuides.length,
    heightMassingPreviewCount: expansion.buildingAnchors.length,
    uniqueSeedCandidateTraceCount: 6,
    uniqueExistingRuntimeAnchorCount: uniqueAnchors.size,
    normalModeRecordCount: 0,
    publicInterfaceCount: 0,
    moduleBoundaryChangeCount: 0,
    sourceFetchCount: 0,
    sourceIngestionCount: 0,
    businessLinkCount: 0,
    exactClaimRecordCount: 0,
    claimPromotionCount: 0,
  };
  for (const [key, value] of Object.entries(expected)) {
    assertEqual(expansion.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyNoForbiddenFields(value, label, failures) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) verifyNoForbiddenFields(item, `${label}[${index}]`, failures);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenFields.has(key)) failures.push(`Forbidden field ${label}.${key}`);
    verifyNoForbiddenFields(nested, `${label}.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const formatted = `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  if (text !== formatted) failures.push("Expansion JSON is not byte-stable under JSON.stringify(..., null, 2)");
}

function assertArrayEquals(actual, expected, label, failures) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    failures.push(`${label} expected arrays`);
    return;
  }
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    failures.push(`${label} ordering mismatch`);
  }
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
