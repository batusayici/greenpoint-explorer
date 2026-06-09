#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json";
const eligibilityPath = "src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1.json";
const evidencePath = "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json";
const evidenceCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const recognizableCuePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
const reportPath = "docs/reports/phase-4l-local-2-evidence-backed-qa-cue-enrichment.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredVisualCueFields = [
  "massingRecognizability",
  "facadeRhythm",
  "paletteFamily",
  "storefrontBayRhythm",
  "awningCanopySignBandZone",
  "windowGlassRhythm",
  "cornerWrapSideReturn",
  "setbackDepthCue",
  "sidewalkStreetGrounding",
  "subwayEntranceCue",
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
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const eligibility = JSON.parse(await readFile(resolve(repoRoot, eligibilityPath), "utf8"));
  const evidence = JSON.parse(await readFile(resolve(repoRoot, evidencePath), "utf8"));
  const evidenceCue = JSON.parse(await readFile(resolve(repoRoot, evidenceCuePath), "utf8"));
  const recognizableCue = JSON.parse(await readFile(resolve(repoRoot, recognizableCuePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8").catch(() => "");

  assertEqual(fixture.schemaVersion, "phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4L-Local-2", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.runtimeUsePolicy, "qa_mode_only_after_4l_local_3", "runtimeUsePolicy", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(fixture.derivedFrom?.eligibilityFixturePath, eligibilityPath, "derivedFrom.eligibilityFixturePath", failures);
  assertEqual(fixture.derivedFrom?.facadeEvidencePacketPath, evidencePath, "derivedFrom.facadeEvidencePacketPath", failures);
  assertEqual(fixture.derivedFrom?.evidenceInformedCuePath, evidenceCuePath, "derivedFrom.evidenceInformedCuePath", failures);
  assertEqual(fixture.derivedFrom?.recognizableAnchorCuePath, recognizableCuePath, "derivedFrom.recognizableAnchorCuePath", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }
  assertArrayEquals(fixture.allowedVisualCueFields, requiredVisualCueFields, "allowedVisualCueFields", failures);
  assertArrayEquals(fixture.blockedClaimCategories, requiredBlockedClaims, "blockedClaimCategories", failures);

  const eligibilityById = new Map((eligibility.records ?? []).map((record) => [record.eligibilityRecordId, record]));
  const evidenceIds = new Set((evidence.records ?? []).map((record) => record.evidenceId));
  const evidenceCueById = new Map((evidenceCue.facadeCueRecords ?? []).map((record) => [record.cueRecordId, record]));
  const recognizableCueIds = new Set((recognizableCue.cueRecords ?? []).map((record) => record.cueId));
  const enrichedIds = new Set();
  const usedEvidenceIds = new Set();
  let linked4KCount = 0;

  for (const record of fixture.enrichedCueRecords ?? []) {
    if (enrichedIds.has(record.enrichedCueId)) failures.push(`Duplicate enrichedCueId ${record.enrichedCueId}`);
    enrichedIds.add(record.enrichedCueId);
    assertEqual(record.qaOnlyStatus, "evidence_backed_qa_visual_reference", `${record.enrichedCueId}.qaOnlyStatus`, failures);
    assertEqual(record.nonPromotionFlag, true, `${record.enrichedCueId}.nonPromotionFlag`, failures);
    assertArrayEquals(record.blockedClaimCategories, requiredBlockedClaims, `${record.enrichedCueId}.blockedClaimCategories`, failures);

    const linked4E = evidenceCueById.get(record.linked4ECueRecordId);
    if (!linked4E) {
      failures.push(`${record.enrichedCueId} links to unknown 4E cue ${record.linked4ECueRecordId}`);
    } else {
      assertEqual(record.targetSemanticId, linked4E.targetSemanticId, `${record.enrichedCueId}.targetSemanticId`, failures);
      assertEqual(record.cornerScope, linked4E.cornerScope, `${record.enrichedCueId}.cornerScope`, failures);
    }

    for (const cueId of record.linked4KCueIds ?? []) {
      linked4KCount += 1;
      if (!recognizableCueIds.has(cueId)) failures.push(`${record.enrichedCueId} links to unknown 4K cue ${cueId}`);
    }

    if (!Array.isArray(record.evidenceIds) || record.evidenceIds.length === 0) failures.push(`${record.enrichedCueId} must cite repo-local evidence IDs`);
    if (!Array.isArray(record.eligibilityRecordIds) || record.eligibilityRecordIds.length !== record.evidenceIds.length) {
      failures.push(`${record.enrichedCueId} must have matching eligibility and evidence references`);
    }
    for (const evidenceId of record.evidenceIds ?? []) {
      usedEvidenceIds.add(evidenceId);
      if (!evidenceIds.has(evidenceId)) failures.push(`${record.enrichedCueId} cites unknown evidenceId ${evidenceId}`);
    }
    for (const eligibilityRecordId of record.eligibilityRecordIds ?? []) {
      const eligibilityRecord = eligibilityById.get(eligibilityRecordId);
      if (!eligibilityRecord) failures.push(`${record.enrichedCueId} cites unknown eligibilityRecordId ${eligibilityRecordId}`);
      if (eligibilityRecord && !record.evidenceIds.includes(eligibilityRecord.evidenceId)) {
        failures.push(`${record.enrichedCueId} eligibility ${eligibilityRecordId} does not match cited evidence IDs`);
      }
      if (eligibilityRecord && !eligibilityRecord.eligibilityStatus.startsWith("eligible")) {
        failures.push(`${record.enrichedCueId} uses non-eligible eligibility record ${eligibilityRecordId}`);
      }
    }

    for (const field of requiredVisualCueFields) {
      if (!(field in (record.visualCueProfile ?? {}))) failures.push(`${record.enrichedCueId} missing visual cue field ${field}`);
    }
  }

  assertEqual(fixture.summary?.enrichedCueRecordCount, fixture.enrichedCueRecords?.length, "summary.enrichedCueRecordCount", failures);
  assertEqual(fixture.summary?.manhattanGreenpointRecordCount, fixture.enrichedCueRecords.filter((record) => record.cornerScope === "manhattan_greenpoint").length, "summary.manhattanGreenpointRecordCount", failures);
  assertEqual(fixture.summary?.franklinGreenpointRecordCount, fixture.enrichedCueRecords.filter((record) => record.cornerScope === "franklin_greenpoint").length, "summary.franklinGreenpointRecordCount", failures);
  assertEqual(fixture.summary?.uniqueEvidenceIdCount, usedEvidenceIds.size, "summary.uniqueEvidenceIdCount", failures);
  assertEqual(fixture.summary?.linked4ECueRecordCount, new Set(fixture.enrichedCueRecords.map((record) => record.linked4ECueRecordId)).size, "summary.linked4ECueRecordCount", failures);
  assertEqual(fixture.summary?.linked4KCueReferenceCount, linked4KCount, "summary.linked4KCueReferenceCount", failures);
  for (const key of ["normalModeRecordCount", "newEvidenceFileCount", "externalSourceAccessCount", "claimPromotionCount", "businessTenantSignPoiLinkCount", "mapillaryRecordCount", "kartaViewRecordCount"]) {
    assertEqual(fixture.summary?.[key], 0, `summary.${key}`, failures);
  }
  assertEqual(fixture.summary?.nonPromotedRecordCount, fixture.enrichedCueRecords.filter((record) => record.nonPromotionFlag === true).length, "summary.nonPromotedRecordCount", failures);

  verifyForbiddenKeys(fixture, "fixture", failures);
  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4L-Local-2 QA cue enrichment verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${fixture.summary.enrichedCueRecordCount} QA-only enriched cue records cite ${fixture.summary.uniqueEvidenceIdCount} repo-local evidence records without promotion or normal-mode exposure`);
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4L-Local-2 evidence-backed QA cue enrichment complete",
    "Enriched cue records: 6 QA-only records.",
    "Repo-local evidence IDs cited: 22.",
    "Normal-mode records: 0.",
    "External sources accessed: 0.",
    "Business, tenant, sign text, logo, POI, active-status, exact frontage, production, and public claims remain blocked.",
    "Ready for 4L-Local-3 QA runtime evidence overlay only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const handoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-3 Open",
    "4L-Local-2 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-3: QA Runtime Evidence Overlay`.",
    "Pre-authorized queue: `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const laterGateSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4L-Local-2 is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const finalHandoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-4 Open",
    "4L-Local-2 is complete and verified.",
    "4L-Local-3 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const handoffValid = handoffSnippets.every((snippet) => brief.includes(snippet));
  const laterGateValid = laterGateSnippets.every((snippet) => brief.includes(snippet));
  const finalHandoffValid = finalHandoffSnippets.every((snippet) => brief.includes(snippet));
  if (!handoffValid && !laterGateValid && !finalHandoffValid) {
    failures.push("Current brief must preserve the 4L-Local-2 -> 4L-Local-3 handoff or final 4L-Local gate");
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
