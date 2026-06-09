#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4l-local-4-visual-review-gate-report.md";
const eligibilityPath = "src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1.json";
const enrichmentPath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

async function main() {
  const failures = [];
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const eligibility = JSON.parse(await readFile(resolve(repoRoot, eligibilityPath), "utf8"));
  const enrichment = JSON.parse(await readFile(resolve(repoRoot, enrichmentPath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(eligibility.summary.recordCount, 22, "eligibility.summary.recordCount", failures);
  assertEqual(eligibility.summary.externalSourceAccessCount, 0, "eligibility.summary.externalSourceAccessCount", failures);
  assertEqual(eligibility.summary.newEvidenceFileCount, 0, "eligibility.summary.newEvidenceFileCount", failures);
  assertEqual(enrichment.summary.enrichedCueRecordCount, 6, "enrichment.summary.enrichedCueRecordCount", failures);
  assertEqual(enrichment.summary.uniqueEvidenceIdCount, 22, "enrichment.summary.uniqueEvidenceIdCount", failures);
  assertEqual(enrichment.summary.normalModeRecordCount, 0, "enrichment.summary.normalModeRecordCount", failures);
  assertEqual(enrichment.summary.externalSourceAccessCount, 0, "enrichment.summary.externalSourceAccessCount", failures);
  assertEqual(enrichment.summary.claimPromotionCount, 0, "enrichment.summary.claimPromotionCount", failures);

  const requiredReportSnippets = [
    "4L-Local-4 visual review gate complete",
    "useful enough to justify a later Mapillary/KartaView scaling proposal, but not direct external evidence intake",
    "Recommended next packet: a Mapillary/KartaView source-use gate",
    "All 22 existing repo-local Batu-supplied evidence IDs are represented",
    "Mid-corridor remains generic",
    "No Mapillary/KartaView work was opened.",
    "No external source was accessed.",
    "No downloads, cache, ingestion, or conversion occurred.",
    "No new evidence files were added.",
    "No QA cue was promoted to a factual, production, public, or normal-mode claim.",
    "Stop here for Batu review.",
  ];
  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing snippet: ${snippet}`);
  }

  const requiredRuntimeSnippets = [
    "localEvidenceCueEnrichmentFixture",
    "createLocalEvidenceCueLayer",
    "QA mode required for 4L local evidence cues.",
  ];
  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing final 4L-Local snippet: ${snippet}`);
  }

  const briefSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4L-Local-1 is complete and verified.",
    "4L-Local-2 is complete and verified.",
    "4L-Local-3 is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
    "4L-Local did not open Mapillary/KartaView, 4L-External, 4M, 4P, external source access, downloads, cache, ingestion, conversion, new evidence intake, normal-mode exposure, business/source linkage, or claim promotion.",
  ];
  for (const snippet of briefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing final gate snippet: ${snippet}`);
  }

  if (failures.length > 0) {
    console.error("4L-Local-4 visual review gate verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: 4L-Local visual review gate is complete and stopped for Batu review`);
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
