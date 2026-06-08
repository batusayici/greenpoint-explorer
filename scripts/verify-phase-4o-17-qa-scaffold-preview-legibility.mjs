#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const adapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const reportPath = "docs/reports/phase-4o-17-qa-scaffold-preview-legibility-report.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredRuntimeSnippets = [
  "4O-17 QA scaffold preview legibility",
  "4O-15 QA scaffold preview",
  "4O families",
  "inspectedQAScaffoldPreviewRecords",
  "qaScaffoldPreviewOutline",
  "qaScaffoldPreviewLabel",
  "addQAScaffoldPreviewLabel",
  "child.visible = qaEnabled;",
  "QA mode required for 4O scaffold preview records.",
];

const requiredReportSnippets = [
  "QA scaffold preview legibility pass complete",
  "Browser inspection completed in QA mode and normal mode.",
  "Normal mode remains protected",
  "No external data fetch, download, cache, ingestion, conversion, or render use occurred.",
  "No business, tenant, storefront, frontage, facade, sign, entrance, exact address, exact height, exact roof, production, or public claims were added.",
  "Stop here for Batu review.",
];

const requiredLegibilityFields = new Set([
  "familyChip",
  "labelVisibility",
  "outlineVisibility",
  "hoverReadout",
]);

const requiredBlockedClaims = new Set([
  "no_business_claim",
  "no_tenant_claim",
  "no_storefront_claim",
  "no_frontage_promotion",
  "no_exact_facade_claim",
  "no_entrance_claim",
  "no_signage_claim",
  "no_active_status_claim",
  "no_exact_address_claim",
  "no_exact_height_claim",
  "no_exact_roof_claim",
  "no_production_claim",
  "no_public_claim",
]);

const forbiddenRuntimeSnippets = [
  "normalModeExposure: \"enabled\"",
  "normalModeUse: \"rendered\"",
  "canAffectNormalRuntime: true",
  "canConnectBusinessIdentity: true",
  "canCreateAuthoritativeStorefrontAnchors: true",
  "canClaimExactFrontage: true",
  "canCreateProductionAssets: true",
  "businessName",
  "tenantName",
  "storefrontName",
  "signText",
  "exactAddress",
  "exactEntrance",
  "publicRoute",
];

async function main() {
  const failures = [];
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const adapterText = await readFile(resolve(repoRoot, adapterPath), "utf8");
  const adapter = JSON.parse(adapterText);
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4O-17 legibility snippet: ${snippet}`);
  }

  for (const snippet of requiredReportSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing 4O-17 snippet: ${snippet}`);
  }

  for (const snippet of [
    "Batch 4O-17: QA scaffold preview legibility pass",
    "4O-17 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ]) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-17 snippet: ${snippet}`);
  }

  for (const snippet of forbiddenRuntimeSnippets) {
    if (runtime.includes(snippet) || report.includes(snippet)) failures.push(`Forbidden runtime/report snippet appears: ${snippet}`);
  }

  if (adapter.qaOnly !== true || adapter.reviewOnly !== true) failures.push("Adapter must remain QA-only and review-only");
  if (adapter.normalModeExposure !== "blocked") failures.push("Adapter normalModeExposure must remain blocked");
  if (adapter.summary.normalModeRecordCount !== 0) failures.push("Adapter must keep zero normal-mode records");
  if (adapter.summary.publicInterfaceCount !== 0) failures.push("Adapter must keep zero public-interface records");
  if (adapter.summary.moduleBoundaryChangeCount !== 0) failures.push("Adapter must keep zero module-boundary changes");

  const candidateIds = new Set(candidates.candidateRecordOrder ?? []);
  const adapterCandidateIds = new Set();
  const displayLabels = new Set();
  const familyChips = new Set();

  for (const record of adapter.renderRecords ?? []) {
    adapterCandidateIds.add(record.derivedFromCandidateId);
    displayLabels.add(record.displayLabel);
    familyChips.add(record.legibility?.familyChip);
    if (!candidateIds.has(record.derivedFromCandidateId)) failures.push(`${record.recordId} traces to unknown candidate`);
    if (record.renderStatus !== "rendered_qa_only_candidate_placeholder") failures.push(`${record.recordId} must remain QA-only placeholder`);
    if (record.normalModeExposure !== "blocked") failures.push(`${record.recordId} must block normal mode`);
    if (!record.displayLabel?.startsWith("4O ")) failures.push(`${record.recordId} missing 4O display label`);
    for (const field of requiredLegibilityFields) {
      if (!record.legibility?.[field]) failures.push(`${record.recordId} missing legibility.${field}`);
    }
    if (record.legibility?.labelVisibility !== "qa_only_visible") failures.push(`${record.recordId} label must be QA-only visible`);
    if (record.legibility?.outlineVisibility !== "qa_only_visible") failures.push(`${record.recordId} outline must be QA-only visible`);
    assertSetIncludes(new Set(record.blockedClaims ?? []), requiredBlockedClaims, `${record.recordId}.blockedClaims`, failures);
  }

  for (const candidateId of candidateIds) {
    if (!adapterCandidateIds.has(candidateId)) failures.push(`Adapter missing candidate trace: ${candidateId}`);
  }

  for (const label of ["4O container", "4O ground", "4O height"]) {
    if (!displayLabels.has(label)) failures.push(`Adapter missing display label: ${label}`);
    if (!runtime.includes(label)) failures.push(`Runtime missing display label text: ${label}`);
  }

  for (const chip of ["container", "grounding", "height"]) {
    if (!familyChips.has(chip)) failures.push(`Adapter missing family chip: ${chip}`);
  }

  verifyStableFormatting(adapterText, failures);

  if (failures.length > 0) {
    console.error("4O-17 QA scaffold preview legibility verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4O-17 QA scaffold preview legibility stays QA-only with ${adapter.renderRecords.length} traced records`);
}

function verifyStableFormatting(text, failures) {
  const formatted = `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  if (text !== formatted) failures.push("Adapter JSON is not byte-stable under JSON.stringify(..., null, 2)");
}

function assertSetIncludes(actual, expected, label, failures) {
  for (const value of expected) {
    if (!actual.has(value)) failures.push(`${label} missing ${value}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
