#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cuePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
const scaffoldPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";
const frontagePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json";
const evidenceCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const reportPath = "docs/reports/phase-4k-1-recognizable-anchor-cue-contract-fixture.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedCueCategories = new Set([
  "corner_composition_cue",
  "sidewalk_street_cue",
  "subway_or_street_furniture_cue",
  "facade_rhythm_cue",
  "material_color_family_cue",
  "massing_silhouette_cue",
  "frontage_density_cue",
]);

const allowedRecordKeys = [
  "cueId",
  "linked4OScaffoldAnchorId",
  "linked4JFrontageCandidateId",
  "existingRepoEvidenceRef",
  "cueCategory",
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
  "frontageGeometry",
  "frontageLength",
  "facadeId",
  "signText",
  "logo",
  "entranceId",
  "entranceLocation",
  "exactAddress",
  "exactFrontage",
  "exactHeight",
  "heightFeet",
  "roofForm",
  "imagePath",
  "imageUrl",
  "downloadUrl",
  "apiUrl",
  "sourceUrl",
  "productionAsset",
  "publicRoute",
]);

const forbiddenPromotionSnippets = [
  "ready to promote",
  "normal mode enabled",
  "normal-mode rendering is approved",
  "business/source linkage started",
  "evidence ingestion started",
  "source access approved",
  "production-ready",
  "public-ready",
];

async function main() {
  const failures = [];
  const cueText = await readFile(resolve(repoRoot, cuePath), "utf8");
  const fixture = JSON.parse(cueText);
  const scaffold = JSON.parse(await readFile(resolve(repoRoot, scaffoldPath), "utf8"));
  const frontage = JSON.parse(await readFile(resolve(repoRoot, frontagePath), "utf8"));
  const evidence = JSON.parse(await readFile(resolve(repoRoot, evidenceCuePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8").catch(() => "");

  assertEqual(fixture.schemaVersion, "phase-4k-1-qa-recognizable-anchor-cues.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4K-1", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.offlineFixtureOnly, true, "offlineFixtureOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.runtimeUsePolicy, "qa_mode_only", "runtimeUsePolicy", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  assertEqual(fixture.publicInterfacePolicy, "blocked_no_public_interface", "publicInterfacePolicy", failures);
  assertEqual(fixture.moduleBoundaryPolicy, "blocked_no_new_public_module_boundary", "moduleBoundaryPolicy", failures);
  assertEqual(fixture.derivedFrom4OFixtureId, scaffold.fixtureId, "derivedFrom4OFixtureId", failures);
  assertEqual(fixture.derivedFrom4OFixturePath, scaffoldPath, "derivedFrom4OFixturePath", failures);
  assertEqual(fixture.derivedFrom4JFixtureId, frontage.fixtureId, "derivedFrom4JFixtureId", failures);
  assertEqual(fixture.derivedFrom4JFixturePath, frontagePath, "derivedFrom4JFixturePath", failures);
  assertEqual(fixture.existingRepoEvidenceFixtureId, evidence.fixtureId, "existingRepoEvidenceFixtureId", failures);
  assertEqual(fixture.existingRepoEvidenceFixturePath, evidenceCuePath, "existingRepoEvidenceFixturePath", failures);

  for (const field of requiredFalsePolicyFields) {
    assertEqual(fixture.sourceAccessPolicy?.[field], false, `sourceAccessPolicy.${field}`, failures);
  }

  for (const [claim, status] of Object.entries(fixture.claimProtection ?? {})) {
    if (status !== "blocked") failures.push(`claimProtection.${claim} must be blocked`);
  }

  assertArrayEquals(fixture.cueCategoryAllowlist, [...allowedCueCategories], "cueCategoryAllowlist", failures);
  assertArrayEquals((fixture.cueRecords ?? []).map((record) => record.cueId), fixture.cueRecordOrder, "cueRecordOrder", failures);

  const anchorById = new Map((scaffold.buildingAnchors ?? []).map((anchor) => [anchor.anchorId, anchor]));
  const candidateById = new Map((frontage.candidateRecords ?? []).map((candidate) => [candidate.candidateId, candidate]));
  const evidenceCueIds = new Set((evidence.facadeCueRecords ?? []).map((record) => record.cueRecordId));
  const cueIds = new Set();
  const linkedAnchorIds = new Set();
  const linkedCandidateIds = new Set();
  const countsByCategory = Object.fromEntries([...allowedCueCategories].map((category) => [category, 0]));
  let existingRepoEvidenceReferenceCount = 0;
  let linkedCandidateReferenceCount = 0;

  for (const record of fixture.cueRecords ?? []) {
    const keys = Object.keys(record).sort();
    const allowedKeys = [...allowedRecordKeys].sort();
    if (JSON.stringify(keys) !== JSON.stringify(allowedKeys)) {
      failures.push(`${record.cueId ?? "unknown cue"} may include only the approved 4K-1 cue record fields`);
    }

    if (cueIds.has(record.cueId)) failures.push(`Duplicate cueId ${record.cueId}`);
    cueIds.add(record.cueId);

    const anchor = anchorById.get(record.linked4OScaffoldAnchorId);
    if (!anchor) failures.push(`${record.cueId} links to unknown 4O scaffold anchor ${record.linked4OScaffoldAnchorId}`);
    if (anchor) linkedAnchorIds.add(record.linked4OScaffoldAnchorId);

    const candidate = candidateById.get(record.linked4JFrontageCandidateId);
    if (!candidate) {
      failures.push(`${record.cueId} links to unknown 4J frontage candidate ${record.linked4JFrontageCandidateId}`);
    } else {
      linkedCandidateIds.add(record.linked4JFrontageCandidateId);
      linkedCandidateReferenceCount += 1;
      if (candidate.linked4OScaffoldAnchorId !== record.linked4OScaffoldAnchorId) {
        failures.push(`${record.cueId} has mismatched 4O anchor and 4J candidate lineage`);
      }
    }

    if (record.existingRepoEvidenceRef !== null) {
      existingRepoEvidenceReferenceCount += 1;
      if (!evidenceCueIds.has(record.existingRepoEvidenceRef)) {
        failures.push(`${record.cueId} links to unknown existing repo evidence cue ${record.existingRepoEvidenceRef}`);
      }
    }

    if (!allowedCueCategories.has(record.cueCategory)) failures.push(`${record.cueId} has disallowed cueCategory ${record.cueCategory}`);
    countsByCategory[record.cueCategory] = (countsByCategory[record.cueCategory] ?? 0) + 1;
    assertEqual(record.qaOnlyStatus, "not_verified", `${record.cueId}.qaOnlyStatus`, failures);
    assertEqual(record.nonPromotionFlag, true, `${record.cueId}.nonPromotionFlag`, failures);
    assertArrayEquals(record.blockedClaimCategories, requiredBlockedCategories, `${record.cueId}.blockedClaimCategories`, failures);
  }

  verifySummary(fixture, linkedAnchorIds, linkedCandidateReferenceCount, existingRepoEvidenceReferenceCount, countsByCategory, failures);
  verifyNoForbiddenKeys(fixture, "fixture", failures);
  verifyStableFormatting(cueText, failures);
  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4K-1 QA recognizable anchor cue verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${cuePath}: ${fixture.summary.cueRecordCount} QA-only recognizable anchor cues mapped to existing repo evidence or 4O/4J lineage`);
}

function verifySummary(fixture, linkedAnchorIds, linkedCandidateReferenceCount, existingRepoEvidenceReferenceCount, countsByCategory, failures) {
  const expected = {
    cueRecordCount: fixture.cueRecords.length,
    unique4OScaffoldAnchorCount: linkedAnchorIds.size,
    linked4JFrontageCandidateCount: linkedCandidateReferenceCount,
    existingRepoEvidenceReferenceCount,
    cornerCompositionCueCount: countsByCategory.corner_composition_cue,
    sidewalkStreetCueCount: countsByCategory.sidewalk_street_cue,
    subwayOrStreetFurnitureCueCount: countsByCategory.subway_or_street_furniture_cue,
    facadeRhythmCueCount: countsByCategory.facade_rhythm_cue,
    materialColorFamilyCueCount: countsByCategory.material_color_family_cue,
    massingSilhouetteCueCount: countsByCategory.massing_silhouette_cue,
    frontageDensityCueCount: countsByCategory.frontage_density_cue,
    normalModeRecordCount: 0,
    nonPromotedRecordCount: fixture.cueRecords.filter((record) => record.nonPromotionFlag === true).length,
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

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4K-1 recognizable anchor cue contract + fixture complete",
    "Cue records: 18 QA-only records.",
    "Existing 4O building anchors covered: 10 of 10.",
    "Existing 4J candidate links: 18.",
    "Existing repo evidence references: 8 existing 4E cue IDs.",
    "Normal-mode records: 0.",
    "No business, tenant, exact storefront, exact frontage, exact facade, sign, entrance, exact address, exact height, roof, production, public, or product claim was added.",
    "Ready for 4K-2 QA runtime overlay only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`4K-1 report missing snippet: ${snippet}`);
  }

  for (const category of allowedCueCategories) {
    if (!report.includes(`\`${category}\``)) failures.push(`4K-1 report missing allowed cue category ${category}`);
  }

  for (const snippet of forbiddenPromotionSnippets) {
    if (report.toLowerCase().includes(snippet)) failures.push(`Report includes forbidden promotion/source snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const originalHandoffSnippets = [
    "Current Execution Brief - Phase 4K-2 Open",
    "4K-1 is complete and verified.",
    "Current executable batch: `Batch 4K-2: QA Runtime Recognizable Anchor Overlay`.",
    "Pre-authorized queue: `Batch 4K-3: Local Recognizability Review Pack`.",
    "Hard Batu gate: stop after 4K-3.",
  ];
  const laterPhaseSnippets = [
    "Current Execution Brief - Phase 4K Complete At Review Gate",
    "4K-1 is complete and verified.",
    "4K-2 is complete and verified.",
    "4K-3 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];

  const originalHandoffValid = originalHandoffSnippets.every((snippet) => brief.includes(snippet));
  const laterPhaseValid = laterPhaseSnippets.every((snippet) => brief.includes(snippet));
  if (!originalHandoffValid && !laterPhaseValid) {
    failures.push("Current brief must either preserve the 4K-1 -> 4K-2 handoff or record later-phase completion without 4K promotion");
  }
}

function verifyNoForbiddenKeys(value, path, failures) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyNoForbiddenKeys(item, `${path}[${index}]`, failures));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) failures.push(`${path}.${key} is a forbidden factual/source field`);
    verifyNoForbiddenKeys(nested, `${path}.${key}`, failures);
  }
}

function verifyStableFormatting(text, failures) {
  if (text.includes("\r")) failures.push("Fixture must use LF line endings");
  if (!text.endsWith("\n")) failures.push("Fixture must end with a newline");
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function assertArrayEquals(actual, expected, label, failures) {
  if (!Array.isArray(actual)) {
    failures.push(`${label} must be an array`);
    return;
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
