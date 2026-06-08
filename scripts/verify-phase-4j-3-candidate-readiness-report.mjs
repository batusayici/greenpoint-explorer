#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4j-3-candidate-gap-readiness-report.md";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedGapCategories = [
  "missing_facade_photo_evidence",
  "missing_frontage_segmentation_evidence",
  "missing_entrance_evidence",
  "missing_sign_band_evidence",
  "missing_corner_wrap_evidence",
  "missing_depth_or_setback_evidence",
  "missing_business_source_linkage",
  "insufficient_spatial_confidence",
];

const requiredReportSnippets = [
  "4J-3 candidate gap + readiness report complete",
  "Candidate records: 22 QA-only records.",
  "Existing 4O building anchors covered: 10 of 10.",
  "Normal-mode records: 0.",
  "All records remain `not_verified`, QA-only, review-only, and non-promoted.",
  "Runtime readout remains `4J candidates: 22 visible / 22 QA / 0 normal` in QA mode and `QA off` in normal mode.",
  "This is only a proposal. 4J-3 does not start evidence linkage, source access, business/source linkage, facade evidence intake, normal-mode promotion, or claim promotion.",
  "Stop here for Batu review.",
];

const forbiddenPromotionSnippets = [
  "ready to promote",
  "normal mode enabled",
  "normal-mode rendering is approved",
  "evidence linkage started",
  "business/source linkage started",
  "source access approved",
  "production-ready",
  "public-ready",
];

async function main() {
  const failures = [];
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const fixture = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`4J-3 report missing snippet: ${snippet}`);
  }

  for (const category of allowedGapCategories) {
    const appearances = countOccurrences(report, `\`${category}\``);
    if (appearances !== 1) failures.push(`Gap category ${category} must appear exactly once in the report table`);
  }

  const backtickGapCategories = [...report.matchAll(/`(missing_[a-z_]+|insufficient_spatial_confidence)`/g)].map((match) => match[1]);
  for (const category of backtickGapCategories) {
    if (!allowedGapCategories.includes(category)) failures.push(`Unexpected gap category ${category}`);
  }

  if (fixture.summary.candidateRecordCount !== 22) failures.push("4J fixture must keep 22 candidate records");
  if (fixture.summary.unique4OScaffoldAnchorCount !== 10) failures.push("4J fixture must keep 10 linked 4O anchors");
  if (fixture.summary.normalModeRecordCount !== 0) failures.push("4J fixture must keep zero normal-mode records");
  if (fixture.summary.nonPromotedRecordCount !== 22) failures.push("4J fixture must keep all records non-promoted");
  if (fixture.summary.businessLinkCount !== 0) failures.push("4J fixture must keep zero business links");
  if (fixture.summary.exactClaimRecordCount !== 0) failures.push("4J fixture must keep zero exact claim records");
  if (fixture.summary.publicClaimRecordCount !== 0) failures.push("4J fixture must keep zero public claim records");
  if (fixture.summary.productionClaimRecordCount !== 0) failures.push("4J fixture must keep zero production claim records");

  if (!runtime.includes("QA mode required for 4J frontage candidate records.")) failures.push("Runtime must keep 4J records behind QA copy");
  if (!runtime.includes("frontageCandidateNormalMode")) failures.push("Runtime must continue reporting 4J normal-mode count");
  if (!runtime.includes("inspectedQAFrontageCandidateRecords={qaEnabled ? inspectedQAFrontageCandidateRecords : []}")) {
    failures.push("Inspector 4J records must remain gated by QA mode");
  }

  for (const snippet of forbiddenPromotionSnippets) {
    if (report.toLowerCase().includes(snippet)) failures.push(`Report includes forbidden promotion/source snippet: ${snippet}`);
  }

  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4J-3 candidate readiness report verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: 4J-3 is report-only, gap-bounded, and stopped at the Batu review gate`);
}

function verifyBrief(brief, failures) {
  const originalGateSnippets = [
    "Phase 4J Complete At Review Gate",
    "4J-3 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const laterPhaseSnippets = [
    "Current Execution Brief - Phase 4K Complete At Review Gate",
    "4J-3 is complete and verified.",
    "4K-3 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];

  const originalGateValid = originalGateSnippets.every((snippet) => brief.includes(snippet));
  const laterPhaseValid = laterPhaseSnippets.every((snippet) => brief.includes(snippet));
  if (!originalGateValid && !laterPhaseValid) {
    failures.push("Current brief must either preserve the 4J-3 gate or record later-phase completion without 4J promotion");
  }
}

function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
