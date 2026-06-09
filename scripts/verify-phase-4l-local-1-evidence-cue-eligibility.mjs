#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1.json";
const evidencePath = "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json";
const reportPath = "docs/reports/phase-4l-local-1-evidence-inventory-cue-eligibility.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedCueCategories = [
  "facade_rhythm",
  "storefront_bay_rhythm",
  "color_material_family",
  "awning_canopy_sign_band_zone",
  "window_glass_rhythm",
  "corner_wrap_side_return",
  "facade_depth_setback",
  "sidewalk_street_grounding",
  "subway_entrance_cue",
];

const allowedStatuses = [
  "eligible_qa_visual_reference",
  "eligible_gap_fill",
  "insufficient_angle",
  "insufficient_resolution",
  "occluded",
  "blocked_claim_risk",
];

const requiredBlockedClaims = [
  "business_identity",
  "tenant_identity",
  "storefront_anchor",
  "exact_frontage",
  "exact_frontage_order",
  "exact_facade",
  "exact_sign_text",
  "logo_or_trade_dress",
  "exact_entrance",
  "exact_address",
  "active_status",
  "production_asset",
  "public_claim",
  "normal_mode",
];

const requiredFalsePolicyFields = [
  "newEvidenceFilesAdded",
  "newEvidenceIntake",
  "externalSourcesAccessed",
  "externalDataFetched",
  "externalDataDownloaded",
  "externalDataCached",
  "externalDataIngested",
  "externalDataConverted",
  "externalImageryAccessed",
  "mapillaryUsed",
  "kartaViewUsed",
  "googleImageryUsed",
];

const forbiddenKeyParts = [
  "businessName",
  "tenantName",
  "storefrontId",
  "storefrontName",
  "signText",
  "logoText",
  "poiId",
  "sourceUrl",
  "imageUrl",
  "downloadUrl",
  "apiUrl",
  "activeStatus",
  "normalModeEnabled",
  "productionReady",
];

async function main() {
  const failures = [];
  const fixtureText = await readFile(resolve(repoRoot, fixturePath), "utf8");
  const fixture = JSON.parse(fixtureText);
  const evidence = JSON.parse(await readFile(resolve(repoRoot, evidencePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8").catch(() => "");

  assertEqual(fixture.schemaVersion, "phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4L-Local-1", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.runtimeUsePolicy, "not_rendered_in_this_batch", "runtimeUsePolicy", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(fixture.derivedFrom?.facadeEvidencePacketPath, evidencePath, "derivedFrom.facadeEvidencePacketPath", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  assertArrayEquals(fixture.allowedCueCategories, allowedCueCategories, "allowedCueCategories", failures);
  assertArrayEquals(fixture.allowedEligibilityStatuses, allowedStatuses, "allowedEligibilityStatuses", failures);
  assertArrayEquals(fixture.blockedClaimCategories, requiredBlockedClaims, "blockedClaimCategories", failures);

  const evidenceById = new Map((evidence.records ?? []).map((record) => [record.evidenceId, record]));
  const fixtureIds = new Set();
  const statusCounts = Object.fromEntries(allowedStatuses.map((status) => [status, 0]));
  const scopeCounts = { manhattan_greenpoint: 0, franklin_greenpoint: 0 };

  for (const record of fixture.records ?? []) {
    if (fixtureIds.has(record.eligibilityRecordId)) failures.push(`Duplicate eligibilityRecordId ${record.eligibilityRecordId}`);
    fixtureIds.add(record.eligibilityRecordId);

    const source = evidenceById.get(record.evidenceId);
    if (!source) {
      failures.push(`${record.eligibilityRecordId} references unknown evidenceId ${record.evidenceId}`);
      continue;
    }
    assertEqual(record.filePath, source.filePath, `${record.eligibilityRecordId}.filePath`, failures);
    assertEqual(record.cornerScope, source.cornerScope?.scopeId, `${record.eligibilityRecordId}.cornerScope`, failures);
    if (!fixture.allowedEvidenceRoots.some((root) => record.filePath.startsWith(root))) {
      failures.push(`${record.eligibilityRecordId} filePath is outside allowed repo-local evidence roots`);
    }
    await access(resolve(repoRoot, record.filePath)).catch(() => failures.push(`${record.eligibilityRecordId} filePath does not exist: ${record.filePath}`));

    if (!allowedStatuses.includes(record.eligibilityStatus)) failures.push(`${record.eligibilityRecordId} has disallowed status ${record.eligibilityStatus}`);
    statusCounts[record.eligibilityStatus] = (statusCounts[record.eligibilityStatus] ?? 0) + 1;
    scopeCounts[record.cornerScope] = (scopeCounts[record.cornerScope] ?? 0) + 1;

    if (!Array.isArray(record.qaCueCategories) || record.qaCueCategories.length === 0) {
      failures.push(`${record.eligibilityRecordId} must map to at least one QA cue category`);
    }
    for (const category of record.qaCueCategories ?? []) {
      if (!allowedCueCategories.includes(category)) failures.push(`${record.eligibilityRecordId} has disallowed cue category ${category}`);
    }
    if (record.eligibilityStatus.startsWith("eligible") && (record.qaCueCategories ?? []).length === 0) {
      failures.push(`${record.eligibilityRecordId} is eligible but has no cue categories`);
    }
    assertEqual(record.nonPromotionFlag, true, `${record.eligibilityRecordId}.nonPromotionFlag`, failures);
    assertArrayEquals(record.blockedClaimCategories, requiredBlockedClaims, `${record.eligibilityRecordId}.blockedClaimCategories`, failures);
  }

  assertEqual(fixture.records?.length, evidence.records?.length, "records.length", failures);
  assertEqual(fixture.summary?.recordCount, fixture.records?.length, "summary.recordCount", failures);
  assertEqual(fixture.summary?.manhattanGreenpointRecordCount, scopeCounts.manhattan_greenpoint, "summary.manhattanGreenpointRecordCount", failures);
  assertEqual(fixture.summary?.franklinGreenpointRecordCount, scopeCounts.franklin_greenpoint, "summary.franklinGreenpointRecordCount", failures);
  assertEqual(fixture.summary?.eligibleQaVisualReferenceCount, statusCounts.eligible_qa_visual_reference, "summary.eligibleQaVisualReferenceCount", failures);
  assertEqual(fixture.summary?.eligibleGapFillCount, statusCounts.eligible_gap_fill, "summary.eligibleGapFillCount", failures);
  assertEqual(fixture.summary?.recordsWithCueCategories, fixture.records.filter((record) => record.qaCueCategories?.length > 0).length, "summary.recordsWithCueCategories", failures);
  for (const key of ["newEvidenceFileCount", "externalSourceAccessCount", "claimPromotionCount", "normalModeRecordCount", "mapillaryRecordCount", "kartaViewRecordCount"]) {
    assertEqual(fixture.summary?.[key], 0, `summary.${key}`, failures);
  }

  verifyForbiddenKeys(fixture, "fixture", failures);
  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4L-Local-1 evidence cue eligibility verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${fixture.summary.recordCount} existing repo-local evidence records mapped to QA cue eligibility without intake, source access, promotion, or normal-mode exposure`);
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4L-Local-1 local evidence inventory + cue eligibility complete",
    "Evidence records inventoried: 22 existing repo-local Batu-supplied records.",
    "Manhattan/Greenpoint records: 11.",
    "Franklin/Greenpoint records: 11.",
    "New evidence files added: 0.",
    "External sources accessed: 0.",
    "Normal-mode records: 0.",
    "Ready for 4L-Local-2 evidence-backed QA cue enrichment only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing snippet: ${snippet}`);
  }
  for (const category of allowedCueCategories) {
    if (!report.includes(`\`${category}\``)) failures.push(`Report missing cue category ${category}`);
  }
}

function verifyBrief(brief, failures) {
  const handoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-2 Open",
    "4L-Local-1 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment`.",
    "Pre-authorized queue: `Batch 4L-Local-3: QA Runtime Evidence Overlay`; `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const laterGateSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4L-Local-1 is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const laterHandoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-3 Open",
    "4L-Local-1 is complete and verified.",
    "4L-Local-2 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-3: QA Runtime Evidence Overlay`.",
    "Pre-authorized queue: `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const finalHandoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-4 Open",
    "4L-Local-1 is complete and verified.",
    "4L-Local-2 is complete and verified.",
    "4L-Local-3 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const handoffValid = handoffSnippets.every((snippet) => brief.includes(snippet));
  const laterGateValid = laterGateSnippets.every((snippet) => brief.includes(snippet));
  const laterHandoffValid = laterHandoffSnippets.every((snippet) => brief.includes(snippet));
  const finalHandoffValid = finalHandoffSnippets.every((snippet) => brief.includes(snippet));
  if (!handoffValid && !laterGateValid && !laterHandoffValid && !finalHandoffValid) {
    failures.push("Current brief must preserve the 4L-Local-1 -> 4L-Local-2 handoff or final 4L-Local gate");
  }
}

function verifyForbiddenKeys(value, path, failures) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyForbiddenKeys(item, `${path}[${index}]`, failures));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nestedValue] of Object.entries(value)) {
    if (forbiddenKeyParts.includes(key)) failures.push(`Forbidden key ${path}.${key}`);
    verifyForbiddenKeys(nestedValue, `${path}.${key}`, failures);
  }
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

function assertArrayEquals(actual, expected, label, failures) {
  if (!Array.isArray(actual)) {
    failures.push(`${label}: expected array`);
    return;
  }
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) failures.push(`${label}: expected ${expectedJson}, received ${actualJson}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
