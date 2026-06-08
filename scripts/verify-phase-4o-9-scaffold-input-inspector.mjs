#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4o-9-qa-only-scaffold-input-inspector.md";
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredBoundarySnippets = [
  "QA-only non-rendering review artifact complete",
  "Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.",
  "No external data fetch, download, cache, ingestion, conversion, or render use.",
  "No runtime rendering, 3D rendering, public UI, runtime scene integration, or normal-mode exposure.",
  "No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, or module-boundary changes.",
  "No businesses, signs, entrances, exact facades, tenant frontage, exact addresses, active status, production claims, public claims, or claim promotion.",
  "not a scaffold manifest and not a runtime/public interface",
];

const requiredBriefSnippets = [
  "Batch 4O-9: QA-Only Scaffold Input Inspector",
  "4O-9 is complete and verified.",
  "Current executable batch: none.",
  "No external data download, cache, ingestion, conversion, render use, source access",
  "No package/tooling changes",
  "No business linkage",
];

const forbiddenPhrases = [
  "source approved",
  "data fetched",
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "runtime rendering added",
  "rendered scaffold",
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
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredBoundarySnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing boundary snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-9 review-gate snippet: ${snippet}`);
  }

  for (const [label, value] of Object.entries({
    "Building/container inputs": fixture.summary.buildingContainerInputCount,
    "Grounding inputs": fixture.summary.groundingInputCount,
    "Height/massing inputs": fixture.summary.heightMassingInputCount,
    "Total scaffold inputs": fixture.summary.totalScaffoldInputCount,
    "Runtime consumers": 0,
    "Public interfaces": 0,
    "Module boundary changes": 0,
    "Source fetches": 0,
    "Source ingestions": 0,
    "Claim promotions": 0,
  })) {
    const row = `| ${label} | ${value} |`;
    if (!report.includes(row)) failures.push(`Report missing summary row: ${row}`);
  }

  const records = [
    ...(fixture.buildingContainerInputs ?? []),
    ...(fixture.groundingInputs ?? []),
    ...(fixture.heightMassingInputs ?? []),
  ];

  for (const record of records) {
    if (!report.includes(`\`${record.recordId}\``)) failures.push(`Report missing record ID: ${record.recordId}`);
    if (!report.includes(`\`${record.sourceLane}\``)) failures.push(`Report missing source lane for ${record.recordId}`);
    if (!report.includes(`\`${record.scaffoldInputFamily}\``)) failures.push(`Report missing input family for ${record.recordId}`);
    if (!report.includes(`\`${record.targetScaffoldFamily}\``)) failures.push(`Report missing target scaffold family for ${record.recordId}`);
  }

  for (const claim of fixture.blockedClaimsRequired ?? []) {
    if (!report.includes(`\`${claim}\``)) failures.push(`Report missing blocked claim: ${claim}`);
  }

  if (records.length !== fixture.summary.totalScaffoldInputCount) {
    failures.push(`Fixture totalScaffoldInputCount expected ${records.length}, got ${fixture.summary.totalScaffoldInputCount}`);
  }

  const combinedLower = `${report}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-9 scaffold-input inspector verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: QA-only non-rendering inspector covers ${records.length} scaffold-input records`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
