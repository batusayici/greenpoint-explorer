#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json";
const boundaryPath = "docs/phase-4o-5-source-adapter-fixture-ingestion-boundary.md";
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const rowCollections = [
  ["buildingContainerSourceRows", "building_container", "building_container_input"],
  ["groundingSourceRows", "street_sidewalk_curb_grounding", "grounding_input"],
  ["heightMassingSourceRows", "height_massing", "height_massing_input"],
];

const requiredClaimStatusLabels = new Set([
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
  "mapillaryAutomation",
  "blenderOrGlbAssetWork",
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
  "materialTruth",
  "colorTruth",
  "imageUrl",
  "photoTexture",
  "texturePath",
  "downloadUrl",
  "apiUrl",
  "runtimeComponent",
  "publicRoute",
  "uiComponent",
  "productionAsset",
]);

const forbiddenPhrases = [
  "source approved",
  "data fetched",
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "runtime rendering added",
  "rendered scaffold",
  "public ui",
  "storefront approved",
  "tenant linked",
  "business linked",
  "sign linked",
  "entrance linked",
  "active status verified",
  "production ready",
  "public ready",
];

async function main() {
  const failures = [];
  const fixtureText = await readFile(resolve(repoRoot, fixturePath), "utf8");
  const fixture = JSON.parse(fixtureText);
  const boundary = await readFile(resolve(repoRoot, boundaryPath), "utf8");
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(fixture.schemaVersion, "phase-4o-6-offline-source-adapter-fixture.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4O-6", "phase", failures);
  assertEqual(fixture.status, "offline_fixture_adapter_skeleton_no_source_access", "status", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.offlineFixtureOnly, true, "offlineFixtureOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.runtimeUsePolicy, "blocked_no_runtime_consumer", "runtimeUsePolicy", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(fixture.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(fixture.moduleBoundaryPolicy, "blocked_no_module_boundary_change", "moduleBoundaryPolicy", failures);
  assertEqual(fixture.derivedFromBoundaryPath, boundaryPath, "derivedFromBoundaryPath", failures);
  assertEqual(fixture.separateFromPlaceholderScaffoldManifestPath, manifestPath, "separateFromPlaceholderScaffoldManifestPath", failures);
  assertEqual(fixture.adapterOutputPolicy, "offline_fixture_test_only_not_scaffold_manifest", "adapterOutputPolicy", failures);
  assertEqual(fixture.deterministic, true, "deterministic", failures);

  for (const snippet of [
    "Building mass/container truth is not tenant truth.",
    "Grounding can be approximate only if every affected field is explicitly labeled",
    "The first real fixture ingestion step should be small and lane-specific.",
  ]) {
    if (!boundary.includes(snippet)) failures.push(`4O-5 boundary missing required 4O-6 prerequisite snippet: ${snippet}`);
  }

  for (const snippet of [
    "Batch 4O-6: Offline Source Adapter Skeleton",
    "Current executable batch: none.",
    "No external data download, cache, ingestion, conversion, render use, source access",
    "No package/tooling changes",
    "No business linkage",
  ]) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing required 4O-6 snippet: ${snippet}`);
  }

  if (manifest.schemaVersion !== "phase-4o-4-placeholder-scaffold-manifest.v0.1") {
    failures.push("4O-6 verifier must compare against the 4O-4 placeholder scaffold manifest boundary");
  }

  if (fixture.separateFromPlaceholderScaffoldManifestPath !== manifestPath || fixture.summary?.scaffoldManifestOutputCount !== 0) {
    failures.push("4O-6 fixture must remain separate from the 4O-4 placeholder scaffold manifest");
  }

  for (const field of requiredPolicyFalseFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  assertArrayEquals(
    fixture.truthFirstOrder,
    ["spatial_scaffold_first", "facade_recognizability_second", "art_direction_third"],
    "truthFirstOrder",
    failures,
  );
  assertArrayEquals(
    fixture.sourceLaneOrder,
    ["building_container", "street_sidewalk_curb_grounding", "height_massing"],
    "sourceLaneOrder",
    failures,
  );

  assertSetIncludes(new Set(fixture.corridor?.claimStatusLabels ?? []), requiredClaimStatusLabels, "corridor.claimStatusLabels", failures);
  assertSetIncludes(new Set(fixture.blockedClaimsRequired ?? []), requiredBlockedClaims, "blockedClaimsRequired", failures);

  const seenIds = new Set();
  const flattenedRecords = [];
  let totalRecords = 0;

  for (const [collectionName, sourceLane, adapterOutputFamily] of rowCollections) {
    const records = fixture[collectionName];
    if (!Array.isArray(records) || records.length === 0) {
      failures.push(`${collectionName} must contain records`);
      continue;
    }
    totalRecords += records.length;
    for (const record of records) {
      flattenedRecords.push(record);
      verifyRecord(record, sourceLane, adapterOutputFamily, seenIds, failures);
    }
  }

  assertArrayEquals(
    flattenedRecords.map((record) => record.recordId),
    fixture.recordOrder,
    "recordOrder",
    failures,
  );
  verifySummary(fixture, totalRecords, failures);
  verifyStableFormatting(fixtureText, failures);
  verifyNoForbiddenFields(fixture, "fixture", failures);

  const combinedLower = `${fixtureText}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-6 offline source-adapter fixture verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${totalRecords} offline source-adapter fixture rows with deterministic ordering and no source access`);
}

function verifyRecord(record, sourceLane, adapterOutputFamily, seenIds, failures) {
  if (!record.recordId?.startsWith("p4o6-adapter-")) failures.push(`${record.recordId ?? "unknown"} must use p4o6-adapter- prefix`);
  if (seenIds.has(record.recordId)) failures.push(`Duplicate recordId: ${record.recordId}`);
  seenIds.add(record.recordId);

  assertEqual(record.recordType, "offline_source_adapter_row", `${record.recordId}.recordType`, failures);
  assertEqual(record.sourceLane, sourceLane, `${record.recordId}.sourceLane`, failures);
  assertEqual(record.sourceRecordStatus, "offline_fixture_placeholder_no_source_record_loaded", `${record.recordId}.sourceRecordStatus`, failures);
  assertEqual(record.adapterOutputFamily, adapterOutputFamily, `${record.recordId}.adapterOutputFamily`, failures);
  assertEqual(record.adapterOutputStatus, "offline_fixture_test_only_not_manifest_output", `${record.recordId}.adapterOutputStatus`, failures);
  assertEqual(record.reviewOnly, true, `${record.recordId}.reviewOnly`, failures);
  assertEqual(record.qaOnly, true, `${record.recordId}.qaOnly`, failures);
  assertEqual(record.offlineFixtureOnly, true, `${record.recordId}.offlineFixtureOnly`, failures);
  assertEqual(record.normalModeExposure, "blocked", `${record.recordId}.normalModeExposure`, failures);
  assertEqual(record.runtimeUsePolicy, "blocked_no_runtime_consumer", `${record.recordId}.runtimeUsePolicy`, failures);
  assertEqual(record.productionUsePolicy, "blocked", `${record.recordId}.productionUsePolicy`, failures);
  assertEqual(record.publicInterfacePolicy, "blocked_no_public_interface", `${record.recordId}.publicInterfacePolicy`, failures);

  assertSetIncludes(new Set(record.claimStatusLabels ?? []), requiredClaimStatusLabels, `${record.recordId}.claimStatusLabels`, failures);
  assertSetIncludes(new Set(record.blockedClaims ?? []), requiredBlockedClaims, `${record.recordId}.blockedClaims`, failures);

  if (record.sourceRowShape?.geometryStatus && record.sourceRowShape.geometryStatus !== "symbolic_no_coordinates") {
    failures.push(`${record.recordId}.sourceRowShape.geometryStatus must remain symbolic_no_coordinates`);
  }
  if (record.sourceRowShape?.heightValue !== undefined && record.sourceRowShape.heightValue !== null) {
    failures.push(`${record.recordId}.sourceRowShape.heightValue must remain null`);
  }
  if (record.sourceRowShape?.floorCountFallback !== undefined && record.sourceRowShape.floorCountFallback !== null) {
    failures.push(`${record.recordId}.sourceRowShape.floorCountFallback must remain null`);
  }
}

function verifySummary(fixture, totalRecords, failures) {
  const expected = {
    buildingContainerSourceRowCount: fixture.buildingContainerSourceRows?.length ?? 0,
    groundingSourceRowCount: fixture.groundingSourceRows?.length ?? 0,
    heightMassingSourceRowCount: fixture.heightMassingSourceRows?.length ?? 0,
    totalOfflineAdapterRowCount: totalRecords,
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
  if (text !== formatted) failures.push("Fixture JSON is not byte-stable under JSON.stringify(..., null, 2)");
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
