#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const normalizationPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json";
const sourceFixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json";
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const collectionMap = [
  ["buildingContainerSourceRows", "normalizedBuildingContainerInputs", "building_container", "normalized_building_container_input"],
  ["groundingSourceRows", "normalizedGroundingInputs", "street_sidewalk_curb_grounding", "normalized_grounding_input"],
  ["heightMassingSourceRows", "normalizedHeightMassingInputs", "height_massing", "normalized_height_massing_input"],
];

const requiredLabels = new Set([
  "review_only",
  "qa_only",
  "offline_fixture_test_only",
  "not_verified",
  "not_source_accessed",
  "no_claim_promotion",
]);

const requiredBlockedClaims = new Set([
  "no_business_claim",
  "no_tenant_claim",
  "no_storefront_claim",
  "no_frontage_promotion",
  "no_exact_facade_claim",
  "no_entrance_claim",
  "no_signage_claim",
  "no_active_status_claim",
  "no_exact_address_claim",
  "no_exact_height_claim",
  "no_exact_roof_claim",
  "no_production_claim",
  "no_public_claim",
]);

const requiredPolicyFalseFields = [
  "externalDataFetched",
  "externalDataDownloaded",
  "externalDataCached",
  "externalDataIngested",
  "externalDataConverted",
  "externalDataRendered",
  "externalImageryAccessed",
  "liveNetworkAccess",
  "runtimeRenderingChanged",
  "proceduralScaffoldRendering",
  "packageOrToolingChanged",
  "publicInterfacesChanged",
  "moduleBoundariesChanged",
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
  "runtimeComponent",
  "publicRoute",
  "uiComponent",
  "productionAsset",
]);

async function main() {
  const failures = [];
  const text = await readFile(resolve(repoRoot, normalizationPath), "utf8");
  const normalized = JSON.parse(text);
  const source = JSON.parse(await readFile(resolve(repoRoot, sourceFixturePath), "utf8"));
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(normalized.schemaVersion, "phase-4o-7-offline-adapter-normalization.v0.1", "schemaVersion", failures);
  assertEqual(normalized.phase, "4O-7", "phase", failures);
  assertEqual(normalized.status, "offline_adapter_normalization_test_only_no_source_access", "status", failures);
  assertEqual(normalized.derivedFromFixtureId, source.fixtureId, "derivedFromFixtureId", failures);
  assertEqual(normalized.derivedFromFixturePath, sourceFixturePath, "derivedFromFixturePath", failures);
  assertEqual(normalized.separateFromPlaceholderScaffoldManifestPath, manifestPath, "separateFromPlaceholderScaffoldManifestPath", failures);
  assertEqual(normalized.adapterOutputPolicy, "offline_fixture_test_only_not_scaffold_manifest", "adapterOutputPolicy", failures);
  assertEqual(normalized.deterministic, true, "deterministic", failures);
  assertEqual(manifest.schemaVersion, "phase-4o-4-placeholder-scaffold-manifest.v0.1", "4O-4 manifest schemaVersion", failures);

  for (const [field, expected] of [
    ["reviewOnly", true],
    ["qaOnly", true],
    ["offlineFixtureOnly", true],
    ["normalModeExposure", "blocked"],
    ["runtimeUsePolicy", "blocked_no_runtime_consumer"],
    ["productionUsePolicy", "blocked"],
    ["publicInterfacePolicy", "blocked_no_public_interface"],
    ["moduleBoundaryPolicy", "blocked_no_module_boundary_change"],
  ]) {
    assertEqual(normalized[field], expected, field, failures);
  }

  for (const field of requiredPolicyFalseFields) {
    assertEqual(normalized.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const snippet of [
    "4O-7 is complete and verified.",
    "Batch 4O-8: Deterministic Scaffold Input Fixture",
    "Batch 4O-9: QA-Only Scaffold Input Inspector",
  ]) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-7 packet snippet: ${snippet}`);
  }

  assertArrayEquals(normalized.truthFirstOrder, source.truthFirstOrder, "truthFirstOrder", failures);
  assertArrayEquals(normalized.sourceLaneOrder, source.sourceLaneOrder, "sourceLaneOrder", failures);
  assertSetIncludes(new Set(normalized.blockedClaimsRequired ?? []), requiredBlockedClaims, "blockedClaimsRequired", failures);

  const sourceRecords = new Map();
  for (const [sourceCollection] of collectionMap) {
    for (const record of source[sourceCollection] ?? []) sourceRecords.set(record.recordId, record);
  }

  const seenIds = new Set();
  const flattened = [];

  for (const [sourceCollection, normalizedCollection, expectedLane, expectedFamily] of collectionMap) {
    const sourceRows = source[sourceCollection] ?? [];
    const records = normalized[normalizedCollection] ?? [];
    assertEqual(records.length, sourceRows.length, `${normalizedCollection}.length`, failures);

    for (const [index, record] of records.entries()) {
      flattened.push(record);
      verifyRecord(record, sourceRows[index], sourceRecords, expectedLane, expectedFamily, seenIds, failures);
    }
  }

  assertArrayEquals(flattened.map((record) => record.recordId), normalized.normalizedRecordOrder, "normalizedRecordOrder", failures);
  verifySummary(normalized, flattened.length, failures);
  verifyNoForbiddenFields(normalized, "normalization", failures);
  verifyStableFormatting(text, failures);

  if (failures.length > 0) {
    console.error("4O-7 offline adapter normalization verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${normalizationPath}: ${flattened.length} normalized offline scaffold-input candidates`);
}

function verifyRecord(record, expectedSource, sourceRecords, expectedLane, expectedFamily, seenIds, failures) {
  if (!record.recordId?.startsWith("p4o7-normalized-")) failures.push(`${record.recordId ?? "unknown"} must use p4o7-normalized- prefix`);
  if (seenIds.has(record.recordId)) failures.push(`Duplicate normalized recordId: ${record.recordId}`);
  seenIds.add(record.recordId);

  assertEqual(record.recordType, "offline_normalized_scaffold_input_candidate", `${record.recordId}.recordType`, failures);
  assertEqual(record.derivedFromAdapterRecordId, expectedSource?.recordId, `${record.recordId}.derivedFromAdapterRecordId`, failures);
  assertEqual(sourceRecords.has(record.derivedFromAdapterRecordId), true, `${record.recordId}.sourceRecordExists`, failures);
  assertEqual(record.sourceLane, expectedLane, `${record.recordId}.sourceLane`, failures);
  assertEqual(record.normalizedFamily, expectedFamily, `${record.recordId}.normalizedFamily`, failures);
  assertEqual(record.normalizationStatus, "normalized_from_offline_fixture_row", `${record.recordId}.normalizationStatus`, failures);
  assertEqual(record.adapterOutputStatus, "offline_fixture_test_only_not_manifest_output", `${record.recordId}.adapterOutputStatus`, failures);
  assertEqual(record.scaffoldInputReadiness, "shape_ready_test_only_not_source_verified", `${record.recordId}.scaffoldInputReadiness`, failures);

  for (const [field, expected] of [
    ["reviewOnly", true],
    ["qaOnly", true],
    ["offlineFixtureOnly", true],
    ["normalModeExposure", "blocked"],
    ["runtimeUsePolicy", "blocked_no_runtime_consumer"],
    ["productionUsePolicy", "blocked"],
    ["publicInterfacePolicy", "blocked_no_public_interface"],
    ["moduleBoundaryPolicy", "blocked_no_module_boundary_change"],
  ]) {
    assertEqual(record[field], expected, `${record.recordId}.${field}`, failures);
  }

  assertSetIncludes(new Set(record.claimStatusLabels ?? []), requiredLabels, `${record.recordId}.claimStatusLabels`, failures);
  assertSetIncludes(new Set(record.blockedClaims ?? []), requiredBlockedClaims, `${record.recordId}.blockedClaims`, failures);

  if (record.normalizedShape?.geometryStatus && record.normalizedShape.geometryStatus !== "symbolic_no_coordinates") {
    failures.push(`${record.recordId}.normalizedShape.geometryStatus must remain symbolic_no_coordinates`);
  }
  if (record.normalizedShape?.coordinatesIncluded !== undefined) {
    assertEqual(record.normalizedShape.coordinatesIncluded, false, `${record.recordId}.normalizedShape.coordinatesIncluded`, failures);
  }
  if (record.normalizedShape?.heightValue !== undefined) {
    assertEqual(record.normalizedShape.heightValue, null, `${record.recordId}.normalizedShape.heightValue`, failures);
  }
  if (record.normalizedShape?.floorCountFallback !== undefined) {
    assertEqual(record.normalizedShape.floorCountFallback, null, `${record.recordId}.normalizedShape.floorCountFallback`, failures);
  }
}

function verifySummary(normalized, total, failures) {
  const expected = {
    normalizedBuildingContainerInputCount: normalized.normalizedBuildingContainerInputs?.length ?? 0,
    normalizedGroundingInputCount: normalized.normalizedGroundingInputs?.length ?? 0,
    normalizedHeightMassingInputCount: normalized.normalizedHeightMassingInputs?.length ?? 0,
    totalNormalizedInputCount: total,
    runtimeConsumerCount: 0,
    publicInterfaceCount: 0,
    moduleBoundaryChangeCount: 0,
    sourceFetchCount: 0,
    sourceIngestionCount: 0,
    businessLinkCount: 0,
    signLinkCount: 0,
    entranceLinkCount: 0,
    exactFacadeClaimCount: 0,
    tenantFrontageClaimCount: 0,
    claimPromotionCount: 0,
    scaffoldManifestOutputCount: 0,
  };

  for (const [key, value] of Object.entries(expected)) {
    assertEqual(normalized.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const parsed = JSON.parse(text);
  const formatted = `${JSON.stringify(parsed, null, 2)}\n`;
  if (text !== formatted) failures.push("Normalization JSON is not byte-stable under JSON.stringify(..., null, 2)");
}

function verifyNoForbiddenFields(value, label, failures) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) verifyNoForbiddenFields(item, `${label}[${index}]`, failures);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenFields.has(key)) failures.push(`${label} contains forbidden field: ${key}`);
    verifyNoForbiddenFields(nested, `${label}.${key}`, failures);
  }
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function assertArrayEquals(actual, expected, label, failures) {
  if (!Array.isArray(actual)) {
    failures.push(`${label} must be an array`);
    return;
  }
  if (actual.length !== expected.length) {
    failures.push(`${label} expected length ${expected.length}, got ${actual.length}`);
    return;
  }
  for (const [index, expectedValue] of expected.entries()) {
    if (actual[index] !== expectedValue) {
      failures.push(`${label}[${index}] expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actual[index])}`);
    }
  }
}

function assertSetIncludes(actual, expected, label, failures) {
  for (const value of expected) {
    if (!actual.has(value)) failures.push(`${label} missing ${value}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
