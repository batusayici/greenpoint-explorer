#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json";
const normalizationPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json";
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const collectionMap = [
  ["normalizedBuildingContainerInputs", "buildingContainerInputs", "scaffold_building_container_input", "scaffold_building_mass"],
  ["normalizedGroundingInputs", "groundingInputs", "scaffold_grounding_input", "scaffold_grounding_surface"],
  ["normalizedHeightMassingInputs", "heightMassingInputs", "scaffold_height_massing_input", "scaffold_height_massing_output"],
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
  const text = await readFile(resolve(repoRoot, fixturePath), "utf8");
  const fixture = JSON.parse(text);
  const normalization = JSON.parse(await readFile(resolve(repoRoot, normalizationPath), "utf8"));
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(fixture.schemaVersion, "phase-4o-8-deterministic-scaffold-input-fixture.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4O-8", "phase", failures);
  assertEqual(fixture.status, "deterministic_scaffold_input_fixture_test_only_no_source_access", "status", failures);
  assertEqual(fixture.derivedFromNormalizationFixtureId, normalization.fixtureId, "derivedFromNormalizationFixtureId", failures);
  assertEqual(fixture.derivedFromNormalizationPath, normalizationPath, "derivedFromNormalizationPath", failures);
  assertEqual(fixture.separateFromPlaceholderScaffoldManifestPath, manifestPath, "separateFromPlaceholderScaffoldManifestPath", failures);
  assertEqual(fixture.fixtureOutputPolicy, "scaffold_input_fixture_test_only_not_scaffold_manifest", "fixtureOutputPolicy", failures);
  assertEqual(fixture.deterministic, true, "deterministic", failures);
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
    assertEqual(fixture[field], expected, field, failures);
  }

  for (const field of requiredPolicyFalseFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const snippet of [
    "4O-8 is complete and verified.",
    "Batch 4O-9: QA-Only Scaffold Input Inspector",
    "Current executable batch:",
  ]) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-8 packet snippet: ${snippet}`);
  }

  assertArrayEquals(fixture.truthFirstOrder, normalization.truthFirstOrder, "truthFirstOrder", failures);
  assertArrayEquals(fixture.sourceLaneOrder, normalization.sourceLaneOrder, "sourceLaneOrder", failures);
  assertArrayEquals(
    fixture.scaffoldInputFamilyOrder,
    ["scaffold_building_container_input", "scaffold_grounding_input", "scaffold_height_massing_input"],
    "scaffoldInputFamilyOrder",
    failures,
  );
  assertSetIncludes(new Set(fixture.blockedClaimsRequired ?? []), requiredBlockedClaims, "blockedClaimsRequired", failures);

  const normalizedRecords = new Map();
  for (const [normalizationCollection] of collectionMap) {
    for (const record of normalization[normalizationCollection] ?? []) normalizedRecords.set(record.recordId, record);
  }

  const seenIds = new Set();
  const flattened = [];

  for (const [normalizationCollection, inputCollection, inputFamily, targetScaffoldFamily] of collectionMap) {
    const normalizedRows = normalization[normalizationCollection] ?? [];
    const records = fixture[inputCollection] ?? [];
    assertEqual(records.length, normalizedRows.length, `${inputCollection}.length`, failures);

    for (const [index, record] of records.entries()) {
      flattened.push(record);
      verifyRecord(record, normalizedRows[index], normalizedRecords, inputFamily, targetScaffoldFamily, seenIds, failures);
    }
  }

  assertArrayEquals(flattened.map((record) => record.recordId), fixture.scaffoldInputRecordOrder, "scaffoldInputRecordOrder", failures);
  verifySummary(fixture, flattened.length, failures);
  verifyNoForbiddenFields(fixture, "fixture", failures);
  verifyStableFormatting(text, failures);

  if (failures.length > 0) {
    console.error("4O-8 deterministic scaffold-input fixture verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${flattened.length} deterministic scaffold-input fixture records`);
}

function verifyRecord(record, expectedSource, normalizedRecords, inputFamily, targetScaffoldFamily, seenIds, failures) {
  if (!record.recordId?.startsWith("p4o8-scaffold-input-")) failures.push(`${record.recordId ?? "unknown"} must use p4o8-scaffold-input- prefix`);
  if (seenIds.has(record.recordId)) failures.push(`Duplicate scaffold input recordId: ${record.recordId}`);
  seenIds.add(record.recordId);

  assertEqual(record.recordType, "deterministic_scaffold_input_fixture_record", `${record.recordId}.recordType`, failures);
  assertEqual(record.derivedFromNormalizedRecordId, expectedSource?.recordId, `${record.recordId}.derivedFromNormalizedRecordId`, failures);
  assertEqual(normalizedRecords.has(record.derivedFromNormalizedRecordId), true, `${record.recordId}.normalizedRecordExists`, failures);
  assertEqual(record.derivedFromAdapterRecordId, expectedSource?.derivedFromAdapterRecordId, `${record.recordId}.derivedFromAdapterRecordId`, failures);
  assertEqual(record.sourceLane, expectedSource?.sourceLane, `${record.recordId}.sourceLane`, failures);
  assertEqual(record.scaffoldInputFamily, inputFamily, `${record.recordId}.scaffoldInputFamily`, failures);
  assertEqual(record.targetScaffoldFamily, targetScaffoldFamily, `${record.recordId}.targetScaffoldFamily`, failures);
  assertEqual(record.scaffoldInputStatus, "deterministic_test_only_ready_for_future_generator", `${record.recordId}.scaffoldInputStatus`, failures);
  assertEqual(record.adapterOutputStatus, "offline_fixture_test_only_not_manifest_output", `${record.recordId}.adapterOutputStatus`, failures);

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

  if (record.scaffoldInputShape?.geometryStatus && record.scaffoldInputShape.geometryStatus !== "symbolic_no_coordinates") {
    failures.push(`${record.recordId}.scaffoldInputShape.geometryStatus must remain symbolic_no_coordinates`);
  }
  if (record.scaffoldInputShape?.coordinatesIncluded !== undefined) {
    assertEqual(record.scaffoldInputShape.coordinatesIncluded, false, `${record.recordId}.scaffoldInputShape.coordinatesIncluded`, failures);
  }
  if (record.scaffoldInputShape?.heightValue !== undefined) {
    assertEqual(record.scaffoldInputShape.heightValue, null, `${record.recordId}.scaffoldInputShape.heightValue`, failures);
  }
  if (record.scaffoldInputShape?.floorCountFallback !== undefined) {
    assertEqual(record.scaffoldInputShape.floorCountFallback, null, `${record.recordId}.scaffoldInputShape.floorCountFallback`, failures);
  }
}

function verifySummary(fixture, total, failures) {
  const expected = {
    buildingContainerInputCount: fixture.buildingContainerInputs?.length ?? 0,
    groundingInputCount: fixture.groundingInputs?.length ?? 0,
    heightMassingInputCount: fixture.heightMassingInputs?.length ?? 0,
    totalScaffoldInputCount: total,
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
    assertEqual(fixture.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const parsed = JSON.parse(text);
  const formatted = `${JSON.stringify(parsed, null, 2)}\n`;
  if (text !== formatted) failures.push("Scaffold input fixture JSON is not byte-stable under JSON.stringify(..., null, 2)");
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
