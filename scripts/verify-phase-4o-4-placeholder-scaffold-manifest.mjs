#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json";
const contractPath = "docs/phase-4o-3-deterministic-scaffold-generation-contract.md";

const requiredManifestCollections = [
  ["buildingMassRecords", "scaffold_building_mass", "buildingFootprintRecords"],
  ["groundingSurfaceRecords", "scaffold_grounding_surface", "groundingRecords"],
  ["heightMassingOutputRecords", "scaffold_height_massing_output", "heightMassingFallbackRecords"],
  ["frontageClassificationOutputRecords", "scaffold_frontage_classification_output", "frontageCornerClassificationRecords"],
  ["overrideSlotReferenceRecords", "scaffold_override_slot_reference", "manualOverrideSlots"],
];

const requiredClaimBoundaries = new Set([
  "no_storefront_claim",
  "no_tenant_claim",
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
  "externalDataDownloaded",
  "externalDataCached",
  "externalDataIngested",
  "externalDataConverted",
  "externalDataRendered",
  "externalImageryAccessed",
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
  "rendered scaffold",
  "storefront approved",
  "tenant linked",
  "active status verified",
  "production ready",
  "public ready",
];

async function main() {
  const failures = [];
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const contract = await readFile(resolve(repoRoot, contractPath), "utf8");

  assertEqual(manifest.schemaVersion, "phase-4o-4-placeholder-scaffold-manifest.v0.1", "schemaVersion", failures);
  assertEqual(manifest.phase, "4O-4", "phase", failures);
  assertEqual(manifest.reviewOnly, true, "reviewOnly", failures);
  assertEqual(manifest.qaOnly, true, "qaOnly", failures);
  assertEqual(manifest.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(manifest.runtimeUsePolicy, "blocked_no_runtime_consumer", "runtimeUsePolicy", failures);
  assertEqual(manifest.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(manifest.derivedFromFixtureId, fixture.fixtureId, "derivedFromFixtureId", failures);
  assertEqual(manifest.derivedFromFixturePath, fixturePath, "derivedFromFixturePath", failures);

  for (const snippet of [
    "scaffold_building_mass",
    "scaffold_grounding_surface",
    "scaffold_height_massing_output",
    "scaffold_frontage_classification_output",
    "scaffold_override_slot_reference",
  ]) {
    if (!contract.includes(snippet)) failures.push(`4O-3 contract missing expected 4O-4 family: ${snippet}`);
    if (!manifest.manifestRecordFamilies?.includes(snippet)) failures.push(`4O-4 manifest missing family: ${snippet}`);
  }

  for (const field of requiredPolicyFalseFields) {
    assertEqual(manifest.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  assertSetIncludes(new Set(manifest.blockedClaimsRequired ?? []), requiredClaimBoundaries, "blockedClaimsRequired", failures);

  const fixtureRecordsById = new Map();
  for (const [, , fixtureCollection] of requiredManifestCollections) {
    for (const record of fixture[fixtureCollection] ?? []) fixtureRecordsById.set(record.recordId, record);
  }

  const manifestRecordIds = new Set();
  let totalRecordCount = 0;

  for (const [collectionName, recordType, fixtureCollection] of requiredManifestCollections) {
    const records = manifest[collectionName];
    const fixtureRecords = fixture[fixtureCollection];
    if (!Array.isArray(records) || !Array.isArray(fixtureRecords)) {
      failures.push(`${collectionName} and ${fixtureCollection} must both exist`);
      continue;
    }
    assertEqual(records.length, fixtureRecords.length, `${collectionName}.length`, failures);
    totalRecordCount += records.length;

    for (const [index, record] of records.entries()) {
      const fixtureRecord = fixtureRecords[index];
      verifyRecord(record, recordType, fixtureRecord, manifest, manifestRecordIds, failures);
    }
  }

  verifyCrossLinks(manifest, failures);
  verifySummary(manifest, totalRecordCount, failures);

  const combinedLower = JSON.stringify(manifest).toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-4 placeholder scaffold manifest verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${manifestPath}: ${totalRecordCount} deterministic placeholder scaffold records with zero source access`);
}

function verifyRecord(record, expectedRecordType, fixtureRecord, manifest, seenIds, failures) {
  if (record.recordType !== expectedRecordType) failures.push(`${record.recordId} expected recordType ${expectedRecordType}`);
  if (!record.recordId?.startsWith("p4o4-scaffold-")) failures.push(`${record.recordId ?? "unknown"} missing p4o4 scaffold prefix`);
  if (seenIds.has(record.recordId)) failures.push(`Duplicate manifest recordId: ${record.recordId}`);
  seenIds.add(record.recordId);
  assertEqual(record.derivedFromFixtureId, manifest.derivedFromFixtureId, `${record.recordId}.derivedFromFixtureId`, failures);
  assertEqual(record.derivedFromRecordId, fixtureRecord?.recordId, `${record.recordId}.derivedFromRecordId`, failures);
  assertEqual(record.sourceRecordStatus, "placeholder_no_source_record_loaded", `${record.recordId}.sourceRecordStatus`, failures);
  assertEqual(record.scaffoldStatus, "placeholder_symbolic_not_rendered", `${record.recordId}.scaffoldStatus`, failures);
  assertEqual(record.reviewOnly, true, `${record.recordId}.reviewOnly`, failures);
  assertEqual(record.qaOnly, true, `${record.recordId}.qaOnly`, failures);
  assertEqual(record.normalModeExposure, "blocked", `${record.recordId}.normalModeExposure`, failures);
  assertEqual(record.runtimeUsePolicy, "blocked_no_runtime_consumer", `${record.recordId}.runtimeUsePolicy`, failures);
  assertEqual(record.productionUsePolicy, "blocked", `${record.recordId}.productionUsePolicy`, failures);
  verifyClaimBoundary(record, failures);
  verifyNoForbiddenFields(record, record.recordId ?? expectedRecordType, failures);

  if (record.placeholderGeometry) {
    assertEqual(record.placeholderGeometry.coordinatesIncluded, false, `${record.recordId}.placeholderGeometry.coordinatesIncluded`, failures);
  }

  if (record.recordType === "scaffold_height_massing_output") {
    assertEqual(record.heightValue, null, `${record.recordId}.heightValue`, failures);
    assertEqual(record.floorCountFallback, null, `${record.recordId}.floorCountFallback`, failures);
  }

  if (record.recordType === "scaffold_override_slot_reference") {
    assertEqual(record.overrideStatus, "empty", `${record.recordId}.overrideStatus`, failures);
    if (!record.allowedOverrideTypes?.includes("optional_blender_glb_asset_override")) {
      failures.push(`${record.recordId} must keep Blender/GLB as optional empty override hook only`);
    }
    if (!record.claimBoundary?.includes("override_does_not_promote_claims")) {
      failures.push(`${record.recordId} missing override_does_not_promote_claims`);
    }
  }
}

function verifyCrossLinks(manifest, failures) {
  const heightIds = new Set(manifest.heightMassingOutputRecords.map((record) => record.recordId));
  const classificationIds = new Set(manifest.frontageClassificationOutputRecords.map((record) => record.recordId));
  const overrideIds = new Set(manifest.overrideSlotReferenceRecords.map((record) => record.recordId));

  for (const record of manifest.buildingMassRecords) {
    if (!heightIds.has(record.linkedHeightMassingOutputId)) failures.push(`${record.recordId} has missing height/massing link`);
    if (!classificationIds.has(record.linkedFrontageClassificationOutputId)) failures.push(`${record.recordId} has missing classification link`);
    if (!overrideIds.has(record.linkedOverrideSlotReferenceId)) failures.push(`${record.recordId} has missing override-slot link`);
  }
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

function verifySummary(manifest, totalRecordCount, failures) {
  const expectedCounts = {
    buildingMassRecordCount: manifest.buildingMassRecords?.length ?? 0,
    groundingSurfaceRecordCount: manifest.groundingSurfaceRecords?.length ?? 0,
    heightMassingOutputRecordCount: manifest.heightMassingOutputRecords?.length ?? 0,
    frontageClassificationOutputRecordCount: manifest.frontageClassificationOutputRecords?.length ?? 0,
    overrideSlotReferenceRecordCount: manifest.overrideSlotReferenceRecords?.length ?? 0,
    totalScaffoldRecordCount: totalRecordCount,
  };

  for (const [key, expected] of Object.entries(expectedCounts)) {
    assertEqual(manifest.summary?.[key], expected, `summary.${key}`, failures);
  }

  for (const zeroCount of [
    "externalDataDownloadedCount",
    "sourceIngestionRecordCount",
    "runtimeConsumerCount",
    "renderedScaffoldCount",
    "blenderOrGlbAssetCount",
    "storefrontClaimCount",
    "tenantClaimCount",
    "exactFacadeClaimCount",
    "entranceClaimCount",
    "signageClaimCount",
    "activeStatusClaimCount",
    "exactAddressClaimCount",
    "exactHeightClaimCount",
    "exactRoofClaimCount",
    "productionClaimCount",
    "publicClaimCount",
  ]) {
    assertEqual(manifest.summary?.[zeroCount], 0, `summary.${zeroCount}`, failures);
  }
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
