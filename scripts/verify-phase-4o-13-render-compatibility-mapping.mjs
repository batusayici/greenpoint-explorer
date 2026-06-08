#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mappingPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-13-existing-render-compatibility-mapping.v0.1.json";
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

const requiredLabels = new Set([
  "review_only",
  "qa_only",
  "not_verified",
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
  const text = await readFile(resolve(repoRoot, mappingPath), "utf8");
  const mapping = JSON.parse(text);
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));
  const candidateRecords = [
    ...(candidates.buildingContainerCandidates ?? []),
    ...(candidates.groundingCandidates ?? []),
    ...(candidates.heightMassingCandidates ?? []),
  ];
  const candidateIds = new Set(candidateRecords.map((record) => record.recordId));
  const manifestIds = new Set((manifest.semanticObjects ?? []).map((object) => object.id));

  assertEqual(mapping.schemaVersion, "phase-4o-13-existing-render-compatibility-mapping.v0.1", "schemaVersion", failures);
  assertEqual(mapping.phase, "4O-13", "phase", failures);
  assertEqual(mapping.reviewOnly, true, "reviewOnly", failures);
  assertEqual(mapping.qaOnly, true, "qaOnly", failures);
  assertEqual(mapping.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(mapping.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(mapping.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(mapping.derivedFromCandidateFixtureId, candidates.fixtureId, "derivedFromCandidateFixtureId", failures);
  assertEqual(mapping.derivedFromCandidatePath, candidatePath, "derivedFromCandidatePath", failures);
  assertEqual(mapping.deterministic, true, "deterministic", failures);
  assertEqual(mapping.mappingPolicy, "map_4o_candidates_to_existing_qa_render_anchors_without_creating_parallel_scaffold_universe", "mappingPolicy", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(mapping.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  assertArrayEquals(mapping.candidateRecordOrder, candidates.candidateRecordOrder, "candidateRecordOrder", failures);
  assertArrayEquals(mapping.mappingRecords.map((record) => record.mappingId), mapping.mappingRecordOrder, "mappingRecordOrder", failures);

  const seenCandidates = new Set();
  const seenMappings = new Set();
  for (const record of mapping.mappingRecords ?? []) {
    if (!record.mappingId?.startsWith("p4o13-map-")) failures.push(`${record.mappingId ?? "unknown"} must use p4o13-map- prefix`);
    if (seenMappings.has(record.mappingId)) failures.push(`Duplicate mappingId: ${record.mappingId}`);
    seenMappings.add(record.mappingId);
    if (!candidateIds.has(record.candidateId)) failures.push(`${record.mappingId} maps unknown candidate ${record.candidateId}`);
    if (seenCandidates.has(record.candidateId)) failures.push(`Duplicate candidate mapping: ${record.candidateId}`);
    seenCandidates.add(record.candidateId);
    if (record.mappingStatus !== "mapped_to_existing_qa_render_anchor") failures.push(`${record.mappingId} must be mapped_to_existing_qa_render_anchor`);
    if (record.qaPreviewEligibility !== "eligible_qa_only_preview_candidate") failures.push(`${record.mappingId} must be eligible for QA-only preview`);
    if (!manifestIds.has(record.existingRenderAnchor?.targetRenderedObjectId)) {
      failures.push(`${record.mappingId} targets missing runtime object ${record.existingRenderAnchor?.targetRenderedObjectId}`);
    }
    assertSetIncludes(new Set(record.claimStatusLabels ?? []), requiredLabels, `${record.mappingId}.claimStatusLabels`, failures);
    assertSetIncludes(new Set(record.blockedClaims ?? []), requiredBlockedClaims, `${record.mappingId}.blockedClaims`, failures);
    if (record.compatibility?.normalModeIsolation !== "qa_toggle_only") failures.push(`${record.mappingId} must require QA-toggle-only isolation`);
  }

  for (const candidateId of candidateIds) {
    if (!seenCandidates.has(candidateId)) failures.push(`Candidate is not mapped: ${candidateId}`);
  }

  verifySummary(mapping, candidateIds.size, failures);
  verifyNoForbiddenFields(mapping, "mapping", failures);
  verifyStableFormatting(text, failures);

  if (failures.length > 0) {
    console.error("4O-13 render compatibility mapping verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${mappingPath}: ${mapping.mappingRecords.length} candidates mapped to existing QA render anchors`);
}

function verifySummary(mapping, candidateCount, failures) {
  const runtimeObjectAnchorCount = mapping.mappingRecords.filter((record) => record.existingRenderAnchor?.anchorType === "runtime_building_object").length;
  const runtimeGuideAnchorCount = mapping.mappingRecords.filter((record) => record.existingRenderAnchor?.anchorType === "runtime_corridor_guide").length;
  const expected = {
    candidateCount,
    mappedCandidateCount: candidateCount,
    runtimeObjectAnchorCount,
    runtimeGuideAnchorCount,
    qaPreviewEligibleCount: candidateCount,
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
    assertEqual(mapping.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const formatted = `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  if (text !== formatted) failures.push("Mapping JSON is not byte-stable under JSON.stringify(..., null, 2)");
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

function assertSetIncludes(actual, expected, label, failures) {
  for (const value of expected) {
    if (!actual.has(value)) failures.push(`${label} missing ${value}`);
  }
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
