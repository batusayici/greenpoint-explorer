#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4o-20-qa-scaffold-spatial-usefulness-review.md";
const expansionPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredReportSnippets = [
  "QA scaffold spatial usefulness review pack complete",
  "ready for Batu spatial-usefulness review in QA mode only",
  "not ready for source-backed ingestion, normal-mode rendering, public UI, production use, exact claims, facade recognizability, storefront/frontage candidates, business linkage, or art-direction translation",
  "Total QA-only scaffold preview records: 26.",
  "Building/container placeholders: 10.",
  "Grounding/street/sidewalk/curb guide placeholders: 6.",
  "Height/massing cap placeholders: 10.",
  "Normal-mode records: 0.",
  "Browser inspection completed in QA mode and normal mode",
  "4O scaffold: 26 visible / 26 QA placeholders / 0 normal",
  "4O scaffold: 16 visible / 26 QA placeholders / 0 normal",
  "4O scaffold preview: QA off",
  "No business, tenant, storefront, frontage, facade, sign, entrance, exact address, exact height, exact roof, active status, production, public, or product claim was added.",
  "No external data fetch, download, cache, ingestion, conversion, source access, imagery access, render use",
  "Stop here for Batu review.",
];

const requiredRuntimeSnippets = [
  "scaffoldPreviewVisible",
  "visibleQaOnlyRecordCount",
  "normalModeExposure: \"blocked\"",
  "child.visible = qaEnabled;",
];

const historicalRuntimeSnippets = [
  "4O-18-20 spatial review",
  "4O-20 review-readiness reporting",
];

const laterRuntimeSnippets = [
  "4O scaffold previews with 4O-19 family controls",
  "4K recognizable anchor cues",
];

const originalBriefSnippets = [
  "Batch 4O-18: Corridor-Wide QA Scaffold Preview Expansion",
  "Batch 4O-19: QA Scaffold Preview Family Controls",
  "Batch 4O-20: Spatial Usefulness Review Pack",
  "4O-18 is complete and verified.",
  "4O-19 is complete and verified.",
  "4O-20 is complete and verified.",
  "Current executable batch: none.",
  "Pre-authorized queue: none.",
  "Hard Batu gate: stop.",
];

const laterBriefSnippets = [
  "Current Execution Brief - Phase 4K Complete At Review Gate",
  "4K-3 is complete and verified.",
  "4K uses existing repo assets/data/evidence only.",
  "Current executable batch: none.",
  "Pre-authorized queue: none.",
  "Hard Batu gate: stop.",
];

const finalPrepBriefSnippets = [
  "Current Execution Brief - Phase 4L-Prep Complete At Review Gate",
  "4K-3 is complete and verified.",
  "4L-Prep is complete and verified.",
  "Current executable batch: none.",
  "Pre-authorized queue: none.",
  "Hard Batu gate: stop.",
];

async function main() {
  const failures = [];
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");
  const expansion = JSON.parse(await readFile(resolve(repoRoot, expansionPath), "utf8"));

  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing 4O-20 snippet: ${snippet}`);
  }

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4O-20 snippet: ${snippet}`);
  }

  const historicalRuntimeValid = historicalRuntimeSnippets.every((snippet) => runtime.includes(snippet));
  const laterRuntimeValid = laterRuntimeSnippets.every((snippet) => runtime.includes(snippet));
  if (!historicalRuntimeValid && !laterRuntimeValid) {
    failures.push("Runtime must preserve either the 4O-20 review header or a later-phase header that still names 4O scaffold controls");
  }

  const originalBriefValid = originalBriefSnippets.every((snippet) => brief.includes(snippet));
  const laterBriefValid = laterBriefSnippets.every((snippet) => brief.includes(snippet));
  const finalPrepBriefValid = finalPrepBriefSnippets.every((snippet) => brief.includes(snippet));
  if (!originalBriefValid && !laterBriefValid && !finalPrepBriefValid) {
    failures.push("Current brief must either preserve the 4O-20 gate or record later-phase completion without 4O promotion");
  }

  if (expansion.summary.renderedQaOnlyRecordCount !== 26) failures.push("Expansion must keep 26 QA-only records");
  if (expansion.summary.normalModeRecordCount !== 0) failures.push("Expansion must keep zero normal-mode records");
  if (expansion.summary.publicInterfaceCount !== 0) failures.push("Expansion must keep zero public-interface records");
  if (expansion.summary.moduleBoundaryChangeCount !== 0) failures.push("Expansion must keep zero module-boundary changes");
  if (expansion.summary.businessLinkCount !== 0) failures.push("Expansion must keep zero business links");
  if (expansion.summary.exactClaimRecordCount !== 0) failures.push("Expansion must keep zero exact claim records");
  if (expansion.summary.claimPromotionCount !== 0) failures.push("Expansion must keep zero claim promotions");

  if (failures.length > 0) {
    console.error("4O-20 spatial usefulness review pack verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: 4O-20 spatial-usefulness review pack is ready for Batu review`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
