#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
const mappingPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-13-existing-render-compatibility-mapping.v0.1.json";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";

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
  const text = await readFile(resolve(repoRoot, adapterPath), "utf8");
  const adapter = JSON.parse(text);
  const mapping = JSON.parse(await readFile(resolve(repoRoot, mappingPath), "utf8"));
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const candidateIds = new Set(candidates.candidateRecordOrder ?? []);
  const mappingIds = new Set((mapping.mappingRecords ?? []).map((record) => record.mappingId));

  assertEqual(adapter.schemaVersion, "phase-4o-14-qa-preview-scaffold-adapter.v0.1", "schemaVersion", failures);
  assertEqual(adapter.phase, "4O-14", "phase", failures);
  assertEqual(adapter.reviewOnly, true, "reviewOnly", failures);
  assertEqual(adapter.qaOnly, true, "qaOnly", failures);
  assertEqual(adapter.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(adapter.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(adapter.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(adapter.derivedFromMappingFixtureId, mapping.fixtureId, "derivedFromMappingFixtureId", failures);
  assertEqual(adapter.derivedFromMappingPath, mappingPath, "derivedFromMappingPath", failures);
  assertEqual(adapter.derivedFromCandidateFixtureId, candidates.fixtureId, "derivedFromCandidateFixtureId", failures);
  assertEqual(adapter.derivedFromCandidatePath, candidatePath, "derivedFromCandidatePath", failures);
  assertEqual(adapter.previewReadiness, "ready_for_qa_only_preview_not_normal_mode", "previewReadiness", failures);
  assertEqual(adapter.deterministic, true, "deterministic", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(adapter.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const [claim, status] of Object.entries(adapter.claimProtection ?? {})) {
    if (status !== "blocked") failures.push(`claimProtection.${claim} must be blocked`);
  }

  assertArrayEquals(adapter.renderRecords.map((record) => record.recordId), adapter.renderRecordOrder, "renderRecordOrder", failures);

  const seenCandidates = new Set();
  const seenRecords = new Set();
  for (const record of adapter.renderRecords ?? []) {
    if (!record.recordId?.startsWith("p4o14-qa-scaffold-")) failures.push(`${record.recordId ?? "unknown"} must use p4o14-qa-scaffold- prefix`);
    if (seenRecords.has(record.recordId)) failures.push(`Duplicate render record: ${record.recordId}`);
    seenRecords.add(record.recordId);
    if (!candidateIds.has(record.derivedFromCandidateId)) failures.push(`${record.recordId} traces to unknown candidate ${record.derivedFromCandidateId}`);
    if (!mappingIds.has(record.derivedFromMappingId)) failures.push(`${record.recordId} traces to unknown mapping ${record.derivedFromMappingId}`);
    if (seenCandidates.has(record.derivedFromCandidateId)) failures.push(`Duplicate candidate trace: ${record.derivedFromCandidateId}`);
    seenCandidates.add(record.derivedFromCandidateId);
    if (record.renderStatus !== "rendered_qa_only_candidate_placeholder") failures.push(`${record.recordId} must be rendered_qa_only_candidate_placeholder`);
    if (record.normalModeExposure !== "blocked") failures.push(`${record.recordId} must block normal mode`);
    assertSetIncludes(new Set(record.claimStatusLabels ?? []), requiredLabels, `${record.recordId}.claimStatusLabels`, failures);
    assertSetIncludes(new Set(record.blockedClaims ?? []), requiredBlockedClaims, `${record.recordId}.blockedClaims`, failures);
  }

  for (const candidateId of candidateIds) {
    if (!seenCandidates.has(candidateId)) failures.push(`Candidate is not represented in adapter: ${candidateId}`);
  }

  verifySummary(adapter, failures);
  verifyNoForbiddenFields(adapter, "adapter", failures);
  verifyStableFormatting(text, failures);

  if (failures.length > 0) {
    console.error("4O-14 QA preview scaffold adapter verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${adapterPath}: ${adapter.renderRecords.length} QA scaffold preview records trace to 4O-10 candidates`);
}

function verifySummary(adapter, failures) {
  const records = adapter.renderRecords ?? [];
  const expected = {
    renderRecordCount: records.length,
    renderedQaOnlyRecordCount: records.length,
    buildingContainerPreviewCount: records.filter((record) => record.candidateFamily === "scaffold_building_container_candidate").length,
    groundingPreviewCount: records.filter((record) => record.candidateFamily === "scaffold_grounding_candidate").length,
    heightMassingPreviewCount: records.filter((record) => record.candidateFamily === "scaffold_height_massing_candidate").length,
    uniqueCandidateTraceCount: new Set(records.map((record) => record.derivedFromCandidateId)).size,
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
    assertEqual(adapter.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const formatted = `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  if (text !== formatted) failures.push("Adapter JSON is not byte-stable under JSON.stringify(..., null, 2)");
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
