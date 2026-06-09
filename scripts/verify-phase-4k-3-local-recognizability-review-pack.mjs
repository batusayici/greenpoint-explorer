#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4k-3-local-recognizability-review-pack.md";
const cuePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedGapCategories = [
  "missing_mid_corridor_facade_evidence",
  "weak_corner_wrap_recognition",
  "weak_material_color_specificity",
  "weak_storefront_rhythm_specificity",
  "missing_street_furniture_evidence",
  "missing_subway_entrance_specificity",
  "missing_business_source_linkage",
  "insufficient_local_landmark_signal",
];

const requiredReportSnippets = [
  "4K-3 local recognizability review complete",
  "Partial yes, in QA mode only.",
  "18 QA-only 4K cue records",
  "10 existing 4O building anchors are covered.",
  "18 4K cue records link to existing 4J frontage/bay candidate lineage.",
  "8 cue records reference existing 4E cue IDs where available.",
  "Normal-mode records remain 0.",
  "No new screenshot system was added.",
  "Proposal only: a later Batu-approved packet could open evidence-backed facade cue intake or source-backed geometry/evidence planning if Batu finds this QA recognizability layer useful enough. 4K-3 does not start that work.",
  "Stop here for Batu review.",
];

const forbiddenPromotionSnippets = [
  "ready to promote",
  "normal mode enabled",
  "normal-mode rendering is approved",
  "source access approved",
  "evidence intake started",
  "business/source linkage started",
  "4l started",
  "4p started",
  "production-ready",
  "public-ready",
  "exact storefront confirmed",
  "exact frontage confirmed",
  "facade truth",
  "business truth",
];

async function main() {
  const failures = [];
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const fixture = JSON.parse(await readFile(resolve(repoRoot, cuePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`4K-3 report missing snippet: ${snippet}`);
  }

  for (const category of allowedGapCategories) {
    const appearances = countOccurrences(report, `\`${category}\``);
    if (appearances !== 1) failures.push(`Gap category ${category} must appear exactly once in the report table`);
  }

  const backtickGapCategories = [...report.matchAll(/`(missing_[a-z_]+|weak_[a-z_]+|insufficient_local_landmark_signal)`/g)].map((match) => match[1]);
  for (const category of backtickGapCategories) {
    if (!allowedGapCategories.includes(category)) failures.push(`Unexpected gap category ${category}`);
  }

  if (fixture.summary.cueRecordCount !== 18) failures.push("4K fixture must keep 18 cue records");
  if (fixture.summary.unique4OScaffoldAnchorCount !== 10) failures.push("4K fixture must keep 10 linked 4O anchors");
  if (fixture.summary.linked4JFrontageCandidateCount !== 18) failures.push("4K fixture must keep 18 linked 4J candidate references");
  if (fixture.summary.existingRepoEvidenceReferenceCount !== 8) failures.push("4K fixture must keep 8 existing repo evidence references");
  if (fixture.summary.normalModeRecordCount !== 0) failures.push("4K fixture must keep zero normal-mode records");
  if (fixture.summary.nonPromotedRecordCount !== 18) failures.push("4K fixture must keep all records non-promoted");
  if (fixture.summary.businessLinkCount !== 0) failures.push("4K fixture must keep zero business links");
  if (fixture.summary.exactClaimRecordCount !== 0) failures.push("4K fixture must keep zero exact claim records");
  if (fixture.summary.publicClaimRecordCount !== 0) failures.push("4K fixture must keep zero public claim records");
  if (fixture.summary.productionClaimRecordCount !== 0) failures.push("4K fixture must keep zero production claim records");

  if (!runtime.includes("QA mode required for 4K recognizable anchor cue records.")) failures.push("Runtime must keep 4K records behind QA copy");
  if (!runtime.includes("recognizableAnchorCueNormalMode")) failures.push("Runtime must continue reporting 4K normal-mode count");
  if (!runtime.includes("inspectedQARecognizableAnchorCueRecords={qaEnabled ? inspectedQARecognizableAnchorCueRecords : []}")) {
    failures.push("Inspector 4K records must remain gated by QA mode");
  }
  if (!runtime.includes("child.userData.stateRole === \"qaRecognizableAnchorCue\"")) failures.push("Runtime must keep 4K cue state role gated");

  for (const snippet of forbiddenPromotionSnippets) {
    if (report.toLowerCase().includes(snippet)) failures.push(`Report includes forbidden promotion/source snippet: ${snippet}`);
  }

  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4K-3 local recognizability review verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: 4K-3 is report-only, gap-bounded, and stopped at the Batu review gate`);
}

function verifyBrief(brief, failures) {
  const originalGateSnippets = [
    "Current Execution Brief - Phase 4K Complete At Review Gate",
    "4K-3 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const finalPrepSnippets = [
    "Current Execution Brief - Phase 4L-Prep Complete At Review Gate",
    "4K-3 is complete and verified.",
    "4L-Prep is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const finalLocalSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4K-3 is complete and verified.",
    "4L-Prep is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const originalGateValid = originalGateSnippets.every((snippet) => brief.includes(snippet));
  const finalPrepValid = finalPrepSnippets.every((snippet) => brief.includes(snippet));
  const finalLocalValid = finalLocalSnippets.every((snippet) => brief.includes(snippet));
  if (!originalGateValid && !finalPrepValid && !finalLocalValid) {
    failures.push("Current brief must either preserve the 4K-3 gate or record 4L-Prep completion without 4K promotion");
  }
}

function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
