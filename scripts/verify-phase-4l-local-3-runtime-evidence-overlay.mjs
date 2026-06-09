#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";
const reportPath = "docs/reports/phase-4l-local-3-qa-runtime-evidence-overlay.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

async function main() {
  const failures = [];
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const styles = await readFile(resolve(repoRoot, stylesPath), "utf8");
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8").catch(() => "");

  assertEqual(fixture.reviewOnly, true, "fixture.reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "fixture.qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "fixture.normalModeExposure", failures);
  assertEqual(fixture.summary.normalModeRecordCount, 0, "fixture.summary.normalModeRecordCount", failures);
  assertEqual(fixture.summary.externalSourceAccessCount, 0, "fixture.summary.externalSourceAccessCount", failures);
  assertEqual(fixture.summary.claimPromotionCount, 0, "fixture.summary.claimPromotionCount", failures);

  const requiredRuntimeSnippets = [
    "localEvidenceCueEnrichmentFixture",
    "buildLocalEvidenceCueRenderRecords",
    "buildLocalEvidenceCueRuntimeAdapter",
    "buildLocalEvidenceCueIndex",
    "createLocalEvidenceCueLayer",
    "localEvidenceCueAdapter.summary.visibleQaOnlyRecordCount",
    "localEvidenceCueAdapter.summary.normalModeRecordCount",
    "phase4b-swatch-local-evidence",
    "localEvidenceCue",
    "localEvidenceCueLabel",
    "QA mode required for 4L local evidence cues.",
  ];
  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4L-Local-3 snippet: ${snippet}`);
  }

  const requiredStyleSnippets = [
    ".phase4b-side-local-evidence",
    ".phase4b-swatch-local-evidence",
  ];
  for (const snippet of requiredStyleSnippets) {
    if (!styles.includes(snippet)) failures.push(`Styles missing 4L-Local-3 snippet: ${snippet}`);
  }

  if (!runtime.includes("child.visible = qaEnabled;")) failures.push("Runtime must preserve QA-only visibility toggles");
  if (runtime.includes("normalModeExposure: \"enabled\"")) failures.push("Runtime must not enable normal-mode exposure");
  for (const forbidden of ["mapillary", "kartaView", "googleImagery", "businessName", "tenantName", "signText", "logoText", "poiId", "activeStatus"]) {
    if (runtime.includes(forbidden)) failures.push(`Runtime contains forbidden 4L-Local-3 linkage/source token: ${forbidden}`);
  }

  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4L-Local-3 runtime evidence overlay verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4L-Local QA runtime evidence overlay is QA-only, local-evidence-backed, and normal-mode protected`);
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4L-Local-3 QA runtime evidence overlay complete",
    "QA 4L local evidence cue records: 6.",
    "Repo-local evidence IDs represented by those records: 22.",
    "Normal-mode records: 0.",
    "External sources accessed: 0.",
    "No business/source linkage was introduced.",
    "Ready for 4L-Local-4 visual review gate report only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const handoffSnippets = [
    "Current Execution Brief - Phase 4L-Local-4 Open",
    "4L-Local-3 is complete and verified.",
    "Current executable batch: `Batch 4L-Local-4: Visual Review Gate Report`.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop after 4L-Local-4.",
  ];
  const finalGateSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4L-Local-3 is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const handoffValid = handoffSnippets.every((snippet) => brief.includes(snippet));
  const finalGateValid = finalGateSnippets.every((snippet) => brief.includes(snippet));
  if (!handoffValid && !finalGateValid) failures.push("Current brief must preserve the 4L-Local-3 -> 4L-Local-4 handoff or final 4L-Local gate");
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
