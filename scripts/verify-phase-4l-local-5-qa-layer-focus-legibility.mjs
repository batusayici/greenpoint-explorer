#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";
const reportPath = "docs/reports/phase-4l-local-5-qa-layer-focus-legibility.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredRuntimeSnippets = [
  "QA_LAYER_FOCUS_4L_LOCAL",
  "QA_4L_LOCAL_FOCUS_VISIBLE_ROLES",
  "4L Focus",
  "QA layer focus",
  "setQALayerFocus(option.id)",
  "updateObjectStates(state, hoveredId, selectedId, qaEnabled, qaLayerFocus)",
  "isQALayerVisibleInFocus(role, qaLayerFocus)",
  "\"evidenceFacadeCue\"",
  "\"localEvidenceCue\"",
  "\"localEvidenceCueLabel\"",
];

const requiredStylesSnippets = [
  ".phase4b-qa-filter-row span",
  ".phase4b-qa-filter-row span[data-active=\"true\"]",
];

const requiredReportSnippets = [
  "Phase 4L-Local-5 QA Layer Focus + Label-Density Legibility",
  "Added an `All QA` / `4L Focus` control",
  "competing 4O scaffold, 4J frontage candidate, 4K recognizable anchor, corridor cue, synthetic grounding, and candidate POI QA overlays are suppressed",
  "Normal mode remains unchanged",
  "No evidence files were added.",
  "No external sources were accessed.",
  "No Mapillary/KartaView work was opened.",
  "No QA cue was promoted to a factual, production, public, or normal-mode claim.",
  "No normal-mode exposure was added.",
];

const finalBriefSnippets = [
  "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
  "4L-Local-5 is complete and verified.",
  "Current executable batch: none.",
  "Pre-authorized queue: none.",
  "Hard Batu gate: stop.",
  "4L-Local-5 did not add evidence files, access external sources, open Mapillary/KartaView, link businesses, expose normal mode, or promote claims.",
];

const forbiddenRuntimeSnippets = [
  "fetch(",
  "XMLHttpRequest",
  "mapillary",
  "kartaview",
  "download",
  "ingest",
  "convert",
  "tenantLink",
  "businessLink",
  "poiLink",
  "normalModeRecordCount: 1",
];

async function main() {
  const failures = [];
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const styles = await readFile(resolve(repoRoot, stylesPath), "utf8");
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4L-Local-5 snippet: ${snippet}`);
  }
  for (const snippet of requiredStylesSnippets) {
    if (!styles.includes(snippet)) failures.push(`Styles missing 4L-Local-5 snippet: ${snippet}`);
  }
  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing 4L-Local-5 snippet: ${snippet}`);
  }
  for (const snippet of finalBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4L-Local-5 gate snippet: ${snippet}`);
  }
  for (const forbidden of forbiddenRuntimeSnippets) {
    if (runtime.toLowerCase().includes(forbidden.toLowerCase())) failures.push(`Runtime contains forbidden 4L-Local-5 token: ${forbidden}`);
  }

  if (failures.length > 0) {
    console.error("4L-Local-5 QA layer focus legibility verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4L-Local-5 QA layer focus isolates local evidence cues without source access, normal-mode exposure, or claim promotion`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
