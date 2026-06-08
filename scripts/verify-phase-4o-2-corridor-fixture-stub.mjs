#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json";

const requiredSourceReferenceIds = new Set([
  "p4o2-source-ref-nyc-building-footprints",
  "p4o2-source-ref-cscl",
  "p4o2-source-ref-sidewalk-curb-planimetrics",
  "p4o2-source-ref-nyc-3d-or-citygml",
  "p4o2-source-ref-pluto-mappluto",
]);

const requiredRecordCollections = [
  ["buildingFootprintRecords", "building_footprint"],
  ["groundingRecords", "corridor_grounding"],
  ["heightMassingFallbackRecords", "height_massing_fallback"],
  ["frontageCornerClassificationRecords", "frontage_corner_classification"],
  ["manualOverrideSlots", "manual_override_slot"],
];

const requiredClaimBoundaries = new Set([
  "no_storefront_claim",
  "no_tenant_claim",
  "no_exact_facade_claim",
  "no_entrance_claim",
  "no_signage_claim",
  "no_active_status_claim",
  "no_exact_address_claim",
  "no_production_claim",
  "no_public_claim",
]);

const requiredPolicyFalseFields = [
  "externalDataDownloaded",
  "externalDataCached",
  "externalDataIngested",
  "externalDataConverted",
  "externalDataRendered",
  "externalImageryAccessed",
  "mapillaryAutomation",
  "blenderOrGlbAssetWork",
  "runtimeRenderingChanged",
  "proceduralScaffoldGeneration",
  "packageOrToolingChanged",
  "publicInterfacesChanged",
  "moduleBoundariesChanged",
];

const forbiddenFields = new Set([
  "businessName",
  "tenantName",
  "storefrontName",
  "activeStatus",
  "exactAddress",
  "exactFacade",
  "exactEntrance",
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
  "productionAsset",
]);

const forbiddenPhrases = [
  "source approved",
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "runtime rendering added",
  "procedural scaffold generated",
  "storefront approved",
  "tenant linked",
  "exact facade",
  "exact address",
  "active status verified",
  "production ready",
  "public ready",
];

async function main() {
  const failures = [];
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));

  assertEqual(fixture.schemaVersion, "phase-4o-2-truth-first-corridor-fixture-stub.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4O-2", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.fixtureReadyOnly, true, "fixtureReadyOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.runtimeUsePolicy, "blocked_no_runtime_consumer", "runtimeUsePolicy", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);

  for (const field of requiredPolicyFalseFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  const sourceReferenceIds = new Set((fixture.candidateSourceReferences ?? []).map((source) => source.sourceReferenceId));
  assertSetIncludes(sourceReferenceIds, requiredSourceReferenceIds, "candidateSourceReferences", failures);

  for (const source of fixture.candidateSourceReferences ?? []) {
    assertEqual(source.sourceAccessStatus, "not_accessed_placeholder_reference_only", `${source.sourceReferenceId}.sourceAccessStatus`, failures);
    for (const blockedUse of ["source_download", "source_cache", "source_ingestion", "runtime_render_use", "production_use"]) {
      if (!source.blockedUses?.includes(blockedUse)) failures.push(`${source.sourceReferenceId} missing blocked use: ${blockedUse}`);
    }
  }

  assertSetIncludes(new Set(fixture.blockedClaimsRequired ?? []), requiredClaimBoundaries, "blockedClaimsRequired", failures);

  const buildingIds = new Set();
  const recordIds = new Set();
  let allRecords = [];

  for (const [collectionName, recordType] of requiredRecordCollections) {
    const records = fixture[collectionName];
    if (!Array.isArray(records) || records.length < 3) {
      failures.push(`${collectionName} must contain at least three representative records`);
      continue;
    }

    for (const record of records) {
      allRecords.push(record);
      if (record.recordType !== recordType) failures.push(`${collectionName} contains recordType ${record.recordType}; expected ${recordType}`);
      if (!record.recordId?.startsWith("p4o2-")) failures.push(`${recordType} missing deterministic p4o2 recordId`);
      if (recordIds.has(record.recordId)) failures.push(`Duplicate recordId: ${record.recordId}`);
      recordIds.add(record.recordId);
      verifyNoForbiddenFields(record, record.recordId ?? recordType, failures);
      verifyClaimBoundary(record, failures);
      verifyNoSourceLoaded(record, failures);
      if (record.buildingId && record.recordType === "building_footprint") buildingIds.add(record.buildingId);
      if (record.recordType !== "corridor_grounding" && record.buildingId && !String(record.buildingId).startsWith("p4o2-placeholder-building-")) {
        failures.push(`${record.recordId} buildingId must remain a p4o2 placeholder`);
      }
    }
  }

  if (buildingIds.size < 3) failures.push("Expected at least three representative placeholder buildings");

  for (const record of [
    ...(fixture.heightMassingFallbackRecords ?? []),
    ...(fixture.frontageCornerClassificationRecords ?? []),
    ...(fixture.manualOverrideSlots ?? []),
  ]) {
    if (!buildingIds.has(record.buildingId)) failures.push(`${record.recordId} references an unknown placeholder buildingId`);
  }

  for (const record of fixture.buildingFootprintRecords ?? []) {
    assertEqual(record.geometryStub?.coordinatesIncluded, false, `${record.recordId}.geometryStub.coordinatesIncluded`, failures);
  }

  for (const record of fixture.groundingRecords ?? []) {
    assertEqual(record.geometryStub?.coordinatesIncluded, false, `${record.recordId}.geometryStub.coordinatesIncluded`, failures);
    if (!Array.isArray(record.sourceReferenceIds) || record.sourceReferenceIds.length < 2) failures.push(`${record.recordId} must reference street and sidewalk/curb candidate lanes`);
  }

  for (const record of fixture.heightMassingFallbackRecords ?? []) {
    assertEqual(record.heightValue, null, `${record.recordId}.heightValue`, failures);
    assertEqual(record.floorCountFallback, null, `${record.recordId}.floorCountFallback`, failures);
  }

  for (const record of fixture.manualOverrideSlots ?? []) {
    assertEqual(record.overrideStatus, "empty", `${record.recordId}.overrideStatus`, failures);
    if (!record.allowedOverrideTypes?.includes("optional_blender_glb_asset_override")) {
      failures.push(`${record.recordId} must preserve Blender/GLB as optional override hook only`);
    }
    if (!record.claimBoundary?.includes("override_does_not_promote_claims")) {
      failures.push(`${record.recordId} missing override_does_not_promote_claims boundary`);
    }
  }

  verifySummary(fixture, failures);

  const combinedLower = JSON.stringify(fixture).toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-2 corridor fixture stub verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${allRecords.length} planning-safe fixture records across ${requiredRecordCollections.length} scaffold families`);
}

function verifyClaimBoundary(record, failures) {
  if (!Array.isArray(record.claimBoundary)) {
    failures.push(`${record.recordId} missing claimBoundary array`);
    return;
  }

  for (const boundary of requiredClaimBoundaries) {
    if (!record.claimBoundary.includes(boundary)) failures.push(`${record.recordId} missing claim boundary: ${boundary}`);
  }
}

function verifyNoSourceLoaded(record, failures) {
  if (record.sourceRecordStatus !== "placeholder_no_source_record_loaded") {
    failures.push(`${record.recordId} must remain placeholder_no_source_record_loaded`);
  }

  const ids = [
    record.sourceReferenceId,
    ...(record.sourceReferenceIds ?? []),
  ].filter(Boolean);

  for (const id of ids) {
    if (!requiredSourceReferenceIds.has(id)) failures.push(`${record.recordId} references unknown sourceReferenceId: ${id}`);
  }
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

function verifySummary(fixture, failures) {
  const expectedCounts = {
    buildingFootprintRecordCount: fixture.buildingFootprintRecords?.length ?? 0,
    groundingRecordCount: fixture.groundingRecords?.length ?? 0,
    heightMassingFallbackRecordCount: fixture.heightMassingFallbackRecords?.length ?? 0,
    frontageCornerClassificationRecordCount: fixture.frontageCornerClassificationRecords?.length ?? 0,
    manualOverrideSlotCount: fixture.manualOverrideSlots?.length ?? 0,
  };

  for (const [key, expected] of Object.entries(expectedCounts)) {
    assertEqual(fixture.summary?.[key], expected, `summary.${key}`, failures);
  }

  for (const zeroCount of [
    "externalDataDownloadedCount",
    "sourceIngestionRecordCount",
    "runtimeConsumerCount",
    "proceduralGeneratedScaffoldCount",
    "blenderOrGlbAssetCount",
    "storefrontClaimCount",
    "tenantClaimCount",
    "exactFacadeClaimCount",
    "entranceClaimCount",
    "signageClaimCount",
    "activeStatusClaimCount",
    "exactAddressClaimCount",
    "productionClaimCount",
    "publicClaimCount",
  ]) {
    assertEqual(fixture.summary?.[zeroCount], 0, `summary.${zeroCount}`, failures);
  }

  assertEqual(fixture.nextBatchCandidate?.batch, "4O-3", "nextBatchCandidate.batch", failures);
  assertEqual(fixture.nextBatchCandidate?.status, "proposed_only_not_pre_authorized_by_this_fixture", "nextBatchCandidate.status", failures);
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
}

function assertSetIncludes(actualSet, expectedSet, label, failures) {
  for (const expected of expectedSet) {
    if (!actualSet.has(expected)) failures.push(`${label} missing ${expected}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
