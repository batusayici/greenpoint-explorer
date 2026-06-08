#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json";
const scaffoldAnchorPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";
const reportPath = "docs/reports/phase-4j-1-frontage-candidate-contract-fixture.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedCandidateTypes = new Set([
  "frontage_band_candidate",
  "bay_rhythm_candidate",
  "corner_wrap_candidate",
  "setback_depth_candidate",
]);

const allowedRecordKeys = [
  "candidateId",
  "linked4OScaffoldAnchorId",
  "corridorSection",
  "corridorSide",
  "candidateType",
  "qaOnlyStatus",
  "blockedClaimCategories",
  "nonPromotionFlag",
];

const requiredBlockedCategories = [
  "business",
  "tenant",
  "storefront",
  "facade",
  "sign",
  "entrance",
  "exact_address",
  "exact_frontage",
  "exact_height",
  "roof",
  "production",
  "public",
];

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

const forbiddenKeys = new Set([
  "businessName",
  "tenantName",
  "storefrontName",
  "storefrontId",
  "facadeId",
  "frontageLength",
  "frontageGeometry",
  "entranceLocation",
  "entranceId",
  "signText",
  "logo",
  "exactAddress",
  "heightFeet",
  "roofForm",
  "imageUrl",
  "downloadUrl",
  "apiUrl",
  "publicRoute",
  "productionAsset",
]);

async function main() {
  const failures = [];
  const candidateText = await readFile(resolve(repoRoot, candidatePath), "utf8");
  const fixture = JSON.parse(candidateText);
  const anchors = JSON.parse(await readFile(resolve(repoRoot, scaffoldAnchorPath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(fixture.schemaVersion, "phase-4j-1-qa-frontage-candidates.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4J-1", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.offlineFixtureOnly, true, "offlineFixtureOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(fixture.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(fixture.moduleBoundaryPolicy, "blocked_no_new_public_module_boundary", "moduleBoundaryPolicy", failures);
  assertEqual(fixture.derivedFrom4OFixtureId, anchors.fixtureId, "derivedFrom4OFixtureId", failures);
  assertEqual(fixture.derivedFrom4OFixturePath, scaffoldAnchorPath, "derivedFrom4OFixturePath", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const [claim, status] of Object.entries(fixture.claimProtection ?? {})) {
    if (status !== "blocked") failures.push(`claimProtection.${claim} must be blocked`);
  }

  const anchorById = new Map((anchors.buildingAnchors ?? []).map((anchor) => [anchor.anchorId, anchor]));
  const candidateIds = new Set();
  const linkedAnchorIds = new Set();
  const countsByType = Object.fromEntries([...allowedCandidateTypes].map((type) => [type, 0]));

  assertArrayEquals(
    (fixture.candidateRecords ?? []).map((record) => record.candidateId),
    fixture.candidateRecordOrder,
    "candidateRecordOrder",
    failures,
  );

  for (const record of fixture.candidateRecords ?? []) {
    const keys = Object.keys(record).sort();
    const allowedKeys = [...allowedRecordKeys].sort();
    if (JSON.stringify(keys) !== JSON.stringify(allowedKeys)) {
      failures.push(`${record.candidateId ?? "unknown record"} may include only the approved 4J-1 candidate record fields`);
    }

    if (candidateIds.has(record.candidateId)) failures.push(`Duplicate candidateId ${record.candidateId}`);
    candidateIds.add(record.candidateId);

    const anchor = anchorById.get(record.linked4OScaffoldAnchorId);
    if (!anchor) {
      failures.push(`${record.candidateId} links to unknown 4O scaffold anchor ${record.linked4OScaffoldAnchorId}`);
    } else {
      linkedAnchorIds.add(record.linked4OScaffoldAnchorId);
      assertEqual(record.corridorSection, anchor.corridorSection, `${record.candidateId}.corridorSection`, failures);
      assertEqual(record.corridorSide, anchor.corridorSide, `${record.candidateId}.corridorSide`, failures);
    }

    if (!allowedCandidateTypes.has(record.candidateType)) failures.push(`${record.candidateId} has disallowed candidateType ${record.candidateType}`);
    countsByType[record.candidateType] = (countsByType[record.candidateType] ?? 0) + 1;
    assertEqual(record.qaOnlyStatus, "not_verified", `${record.candidateId}.qaOnlyStatus`, failures);
    assertEqual(record.nonPromotionFlag, true, `${record.candidateId}.nonPromotionFlag`, failures);
    assertArrayEquals(record.blockedClaimCategories, requiredBlockedCategories, `${record.candidateId}.blockedClaimCategories`, failures);
  }

  verifySummary(fixture, linkedAnchorIds, countsByType, failures);
  verifyNoForbiddenKeys(fixture, "fixture", failures);
  verifyStableFormatting(candidateText, failures);
  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4J-1 QA frontage candidate verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${candidatePath}: ${fixture.summary.candidateRecordCount} QA-only frontage/bay candidates mapped to ${fixture.summary.unique4OScaffoldAnchorCount} existing 4O anchors`);
}

function verifySummary(fixture, linkedAnchorIds, countsByType, failures) {
  const expected = {
    candidateRecordCount: fixture.candidateRecords.length,
    unique4OScaffoldAnchorCount: linkedAnchorIds.size,
    frontageBandCandidateCount: countsByType.frontage_band_candidate,
    bayRhythmCandidateCount: countsByType.bay_rhythm_candidate,
    cornerWrapCandidateCount: countsByType.corner_wrap_candidate,
    setbackDepthCandidateCount: countsByType.setback_depth_candidate,
    normalModeRecordCount: 0,
    nonPromotedRecordCount: fixture.candidateRecords.filter((record) => record.nonPromotionFlag === true).length,
    sourceAccessCount: 0,
    businessLinkCount: 0,
    exactClaimRecordCount: 0,
    publicClaimRecordCount: 0,
    productionClaimRecordCount: 0,
  };
  for (const [key, value] of Object.entries(expected)) {
    assertEqual(fixture.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyNoForbiddenKeys(value, label, failures) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) verifyNoForbiddenKeys(item, `${label}[${index}]`, failures);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) failures.push(`Forbidden factual/source field ${label}.${key}`);
    verifyNoForbiddenKeys(nested, `${label}.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  const formatted = `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  if (text !== formatted) failures.push("4J-1 candidate JSON is not byte-stable under JSON.stringify(..., null, 2)");
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4J-1 frontage candidate contract + fixture complete",
    "22 QA-only candidate records",
    "10 existing 4O building anchors",
    "Normal-mode records: 0.",
    "No business, tenant, storefront, facade, sign, entrance, exact address, exact frontage, exact height, roof, production, public, or product claim was added.",
    "No external source access, download, cache, ingestion, conversion, imagery access, or render use occurred.",
    "Ready for 4J-2 QA runtime overlay only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`4J-1 report missing snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const requiredSnippets = [
    "Batch 4J-1: Frontage Candidate Contract + Fixture",
    "4J-1 is complete and verified.",
    "Batch 4J-2: QA Runtime Frontage Candidate Overlay",
    "Hard Batu gate: stop.",
  ];
  for (const snippet of requiredSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4J-1 snippet: ${snippet}`);
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
