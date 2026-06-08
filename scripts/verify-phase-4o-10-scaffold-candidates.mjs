#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const inputPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json";
const normalizationPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json";
const adapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json";
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const collectionMap = [
  ["buildingContainerInputs", "buildingContainerCandidates", "scaffold_building_container_candidate", "scaffold_building_mass"],
  ["groundingInputs", "groundingCandidates", "scaffold_grounding_candidate", "scaffold_grounding_surface"],
  ["heightMassingInputs", "heightMassingCandidates", "scaffold_height_massing_candidate", "scaffold_height_massing_output"],
];

const requiredLabels = new Set([
  "review_only",
  "qa_only",
  "offline_fixture_test_only",
  "not_verified",
  "not_source_accessed",
  "candidate_only",
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
  const text = await readFile(resolve(repoRoot, candidatePath), "utf8");
  const candidates = JSON.parse(text);
  const input = JSON.parse(await readFile(resolve(repoRoot, inputPath), "utf8"));
  const normalization = JSON.parse(await readFile(resolve(repoRoot, normalizationPath), "utf8"));
  const adapter = JSON.parse(await readFile(resolve(repoRoot, adapterPath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(candidates.schemaVersion, "phase-4o-10-scaffold-candidates.v0.1", "schemaVersion", failures);
  assertEqual(candidates.phase, "4O-10", "phase", failures);
  assertEqual(candidates.status, "scaffold_candidate_records_test_only_no_source_access", "status", failures);
  assertEqual(candidates.derivedFromScaffoldInputFixtureId, input.fixtureId, "derivedFromScaffoldInputFixtureId", failures);
  assertEqual(candidates.derivedFromScaffoldInputPath, inputPath, "derivedFromScaffoldInputPath", failures);
  assertEqual(candidates.derivedThroughNormalizationFixtureId, normalization.fixtureId, "derivedThroughNormalizationFixtureId", failures);
  assertEqual(candidates.derivedThroughNormalizationPath, normalizationPath, "derivedThroughNormalizationPath", failures);
  assertEqual(candidates.derivedThroughAdapterFixtureId, adapter.fixtureId, "derivedThroughAdapterFixtureId", failures);
  assertEqual(candidates.derivedThroughAdapterPath, adapterPath, "derivedThroughAdapterPath", failures);
  assertEqual(candidates.separateFromPlaceholderScaffoldManifestPath, manifestPath, "separateFromPlaceholderScaffoldManifestPath", failures);
  assertEqual(candidates.fixtureOutputPolicy, "scaffold_candidate_records_test_only_not_scaffold_manifest_not_runtime_input", "fixtureOutputPolicy", failures);
  assertEqual(candidates.candidateReadiness, "ready_for_qa_gap_report_not_ready_for_render", "candidateReadiness", failures);
  assertEqual(candidates.deterministic, true, "deterministic", failures);

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
    assertEqual(candidates[field], expected, field, failures);
  }

  for (const field of requiredPolicyFalseFields) {
    assertEqual(candidates.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const snippet of [
    "4O-10 is complete and verified.",
    "Batch 4O-11: Scaffold Candidate QA Gap Report",
    "No external data fetch, download, cache, ingestion, conversion",
    "No runtime rendering",
    "No public interfaces",
  ]) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-10 packet snippet: ${snippet}`);
  }

  assertArrayEquals(candidates.truthFirstOrder, input.truthFirstOrder, "truthFirstOrder", failures);
  assertArrayEquals(candidates.sourceLaneOrder, input.sourceLaneOrder, "sourceLaneOrder", failures);
  assertArrayEquals(
    candidates.candidateFamilyOrder,
    ["scaffold_building_container_candidate", "scaffold_grounding_candidate", "scaffold_height_massing_candidate"],
    "candidateFamilyOrder",
    failures,
  );
  assertSetIncludes(new Set(candidates.blockedClaimsRequired ?? []), requiredBlockedClaims, "blockedClaimsRequired", failures);

  const inputRecords = new Map();
  for (const [inputCollection] of collectionMap) {
    for (const record of input[inputCollection] ?? []) inputRecords.set(record.recordId, record);
  }

  const seenIds = new Set();
  const flattened = [];

  for (const [inputCollection, candidateCollection, candidateFamily, targetScaffoldFamily] of collectionMap) {
    const inputRows = input[inputCollection] ?? [];
    const records = candidates[candidateCollection] ?? [];
    assertEqual(records.length, inputRows.length, `${candidateCollection}.length`, failures);

    for (const [index, record] of records.entries()) {
      flattened.push(record);
      verifyRecord(record, inputRows[index], inputRecords, candidateFamily, targetScaffoldFamily, seenIds, failures);
    }
  }

  assertArrayEquals(flattened.map((record) => record.recordId), candidates.candidateRecordOrder, "candidateRecordOrder", failures);
  verifySummary(candidates, flattened.length, failures);
  verifyNoForbiddenFields(candidates, "candidates", failures);
  verifyStableFormatting(text, failures);

  if (failures.length > 0) {
    console.error("4O-10 scaffold candidate verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${candidatePath}: ${flattened.length} deterministic scaffold-candidate records`);
}

function verifyRecord(record, expectedInput, inputRecords, candidateFamily, targetScaffoldFamily, seenIds, failures) {
  if (!record.recordId?.startsWith("p4o10-candidate-")) failures.push(`${record.recordId ?? "unknown"} must use p4o10-candidate- prefix`);
  if (seenIds.has(record.recordId)) failures.push(`Duplicate candidate recordId: ${record.recordId}`);
  seenIds.add(record.recordId);

  assertEqual(record.recordType, "scaffold_candidate_record", `${record.recordId}.recordType`, failures);
  assertEqual(record.candidateFamily, candidateFamily, `${record.recordId}.candidateFamily`, failures);
  assertEqual(record.candidateStatus, "candidate_only_review_ready_not_render_ready", `${record.recordId}.candidateStatus`, failures);
  assertEqual(record.derivedFromScaffoldInputRecordId, expectedInput?.recordId, `${record.recordId}.derivedFromScaffoldInputRecordId`, failures);
  assertEqual(inputRecords.has(record.derivedFromScaffoldInputRecordId), true, `${record.recordId}.inputRecordExists`, failures);
  assertEqual(record.derivedFromNormalizedRecordId, expectedInput?.derivedFromNormalizedRecordId, `${record.recordId}.derivedFromNormalizedRecordId`, failures);
  assertEqual(record.derivedFromAdapterRecordId, expectedInput?.derivedFromAdapterRecordId, `${record.recordId}.derivedFromAdapterRecordId`, failures);
  assertEqual(record.sourceLane, expectedInput?.sourceLane, `${record.recordId}.sourceLane`, failures);
  assertEqual(record.targetScaffoldFamily, targetScaffoldFamily, `${record.recordId}.targetScaffoldFamily`, failures);
  assertEqual(record.sourceRecordStatus, "offline_fixture_placeholder_no_source_record_loaded", `${record.recordId}.sourceRecordStatus`, failures);

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
  assertEqual(record.candidateShape?.renderIntegrationStatus, "blocked_no_runtime_consumer", `${record.recordId}.candidateShape.renderIntegrationStatus`, failures);

  if (record.candidateShape?.candidateGeometryStatus && record.candidateShape.candidateGeometryStatus !== "symbolic_no_coordinates") {
    failures.push(`${record.recordId}.candidateShape.candidateGeometryStatus must remain symbolic_no_coordinates`);
  }
  if (record.candidateShape?.coordinatesIncluded !== undefined) {
    assertEqual(record.candidateShape.coordinatesIncluded, false, `${record.recordId}.candidateShape.coordinatesIncluded`, failures);
  }
  if (record.candidateShape?.heightValue !== undefined) {
    assertEqual(record.candidateShape.heightValue, null, `${record.recordId}.candidateShape.heightValue`, failures);
  }
  if (record.candidateShape?.floorCountFallback !== undefined) {
    assertEqual(record.candidateShape.floorCountFallback, null, `${record.recordId}.candidateShape.floorCountFallback`, failures);
  }
}

function verifySummary(candidates, total, failures) {
  const expected = {
    buildingContainerCandidateCount: candidates.buildingContainerCandidates?.length ?? 0,
    groundingCandidateCount: candidates.groundingCandidates?.length ?? 0,
    heightMassingCandidateCount: candidates.heightMassingCandidates?.length ?? 0,
    totalCandidateCount: total,
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
    renderIntegrationCount: 0,
  };

  for (const [key, value] of Object.entries(expected)) {
    assertEqual(candidates.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const parsed = JSON.parse(text);
  const formatted = `${JSON.stringify(parsed, null, 2)}\n`;
  if (text !== formatted) failures.push("Scaffold candidate JSON is not byte-stable under JSON.stringify(..., null, 2)");
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
    failures.push(`${label} expected array, got ${typeof actual}`);
    return;
  }
  if (actual.length !== expected.length) {
    failures.push(`${label} expected length ${expected.length}, got ${actual.length}`);
    return;
  }
  for (const [index, value] of actual.entries()) {
    if (value !== expected[index]) failures.push(`${label}[${index}] expected ${JSON.stringify(expected[index])}, got ${JSON.stringify(value)}`);
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
