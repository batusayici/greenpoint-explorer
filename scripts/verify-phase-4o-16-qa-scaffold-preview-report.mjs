#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4o-16-qa-scaffold-preview-report.md";
const adapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
const mappingPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-13-existing-render-compatibility-mapping.v0.1.json";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";

const requiredSnippets = [
  "QA scaffold preview reconnection report complete",
  "ready for Batu QA-only preview review",
  "not ready for normal mode, public UI, production, source promotion, or claim promotion",
  "Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.",
  "without creating a parallel disconnected scaffold universe",
  "Runtime visibility is gated by `qaEnabled`; normal mode keeps the layer invisible.",
  "Stop here for Batu review.",
  "No external data fetch, download, cache, ingestion, conversion, or render use occurred.",
  "No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, public UI, normal-mode exposure, or new public module boundaries were added.",
];

const requiredBlockedClaims = [
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
];

const forbiddenPhrases = [
  "source approved",
  "data fetched",
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "storefront approved",
  "tenant linked",
  "business linked",
  "sign linked",
  "entrance linked",
  "active status verified",
  "production ready",
  "public ready",
];

async function main() {
  const failures = [];
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const adapter = JSON.parse(await readFile(resolve(repoRoot, adapterPath), "utf8"));
  const mapping = JSON.parse(await readFile(resolve(repoRoot, mappingPath), "utf8"));
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");

  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing required snippet: ${snippet}`);
  }

  for (const claim of requiredBlockedClaims) {
    if (!report.includes(`\`${claim}\``)) failures.push(`Report missing blocked claim: ${claim}`);
  }

  for (const [label, value] of Object.entries({
    "4O-10 scaffold candidates": candidates.summary.totalCandidateCount,
    "4O-13 mapped candidates": mapping.summary.mappedCandidateCount,
    "4O-14 QA preview records": adapter.summary.renderRecordCount,
    "4O-15 QA-rendered placeholders": adapter.summary.renderedQaOnlyRecordCount,
    "Normal-mode records": 0,
    "Public interfaces": 0,
    "Module boundary changes": 0,
    "Source fetches": 0,
    "Source ingestions": 0,
    "Business links": 0,
    "Exact-claim records": 0,
    "Claim promotions": 0,
  })) {
    const row = `| ${label} | ${value} |`;
    if (!report.includes(row)) failures.push(`Report missing count row: ${row}`);
  }

  const families = [
    ["scaffold_building_container_candidate", adapter.summary.buildingContainerPreviewCount],
    ["scaffold_grounding_candidate", adapter.summary.groundingPreviewCount],
    ["scaffold_height_massing_candidate", adapter.summary.heightMassingPreviewCount],
  ];
  for (const [family, count] of families) {
    const row = `| \`${family}\` | ${count} | ${count} | ${count} |`;
    if (!report.includes(row)) failures.push(`Report missing family row: ${row}`);
  }

  for (const record of adapter.renderRecords ?? []) {
    if (!report.includes(`\`${record.derivedFromCandidateId}\``)) failures.push(`Report missing candidate trace: ${record.derivedFromCandidateId}`);
    if (!report.includes(`\`${record.derivedFromMappingId}\``)) failures.push(`Report missing mapping trace: ${record.derivedFromMappingId}`);
    if (!report.includes(`\`${record.recordId}\``)) failures.push(`Report missing preview record: ${record.recordId}`);
    if (!report.includes(`\`${record.targetRenderedObjectId}\``)) failures.push(`Report missing runtime anchor: ${record.targetRenderedObjectId}`);
  }

  if (!runtime.includes("qaScaffoldPreviewAdapter")) failures.push("Runtime must import/use qaScaffoldPreviewAdapter");
  if (!runtime.includes("qaScaffoldPreview")) failures.push("Runtime must use qaScaffoldPreview state role");
  if (adapter.summary.normalModeRecordCount !== 0) failures.push("Adapter must keep zero normal-mode records");

  const reportLower = report.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (reportLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-16 QA scaffold preview report verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: QA scaffold preview report is ready for Batu review`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
