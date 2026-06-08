#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = "docs/reports/phase-4o-11-scaffold-candidate-qa-gap-report.md";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const collectionMap = [
  ["buildingContainerCandidates", "scaffold_building_container_candidate"],
  ["groundingCandidates", "scaffold_grounding_candidate"],
  ["heightMassingCandidates", "scaffold_height_massing_candidate"],
];

const requiredBoundarySnippets = [
  "QA-only non-rendering gap/coverage report complete",
  "candidate set is not ready for QA-only preview or runtime rendering",
  "Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.",
  "No external data fetch, download, cache, ingestion, conversion, or render use.",
  "No runtime rendering, 3D rendering, public UI, runtime scene integration, or normal-mode exposure.",
  "No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, or module-boundary changes.",
  "No businesses, signs, entrances, exact facades, tenant frontage, exact addresses, active status, production claims, public claims, or claim promotion.",
  "not a scaffold manifest and not a runtime/public interface",
];

const requiredBriefSnippets = [
  "Batch 4O-11: Scaffold Candidate QA Gap Report",
  "4O-11 is complete and verified.",
  "Batch 4O-12: Existing QA Render Reconnection Boundary",
  "No external data fetch, download, cache, ingestion, conversion",
  "No runtime rendering",
  "No public interfaces",
];

const requiredClaimLabels = [
  "review_only",
  "qa_only",
  "offline_fixture_test_only",
  "not_verified",
  "not_source_accessed",
  "candidate_only",
  "no_claim_promotion",
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
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredBoundarySnippets) {
    if (!report.includes(snippet)) failures.push(`Report missing boundary snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-11 snippet: ${snippet}`);
  }

  const records = [
    ...(candidates.buildingContainerCandidates ?? []),
    ...(candidates.groundingCandidates ?? []),
    ...(candidates.heightMassingCandidates ?? []),
  ];

  for (const [collection, family] of collectionMap) {
    const count = candidates[collection]?.length ?? 0;
    const row = `| \`${family}\` | ${count} |`;
    if (!report.includes(row)) failures.push(`Report missing candidate-family count row: ${row}`);
  }

  for (const [label, value] of Object.entries({
    "Total scaffold candidates": candidates.summary.totalCandidateCount,
    "Runtime consumers": 0,
    "Public interfaces": 0,
    "Module boundary changes": 0,
    "Source fetches": 0,
    "Source ingestions": 0,
    "Claim promotions": 0,
    "Render integrations": 0,
  })) {
    const row = `| ${label} | ${value} |`;
    if (!report.includes(row)) failures.push(`Report missing summary row: ${row}`);
  }

  for (const label of requiredClaimLabels) {
    const covered = records.filter((record) => record.claimStatusLabels?.includes(label)).length;
    const row = `| \`${label}\` | ${covered} / ${records.length} |`;
    if (!report.includes(row)) failures.push(`Report missing claim coverage row: ${row}`);
  }

  for (const lane of candidates.sourceLaneOrder ?? []) {
    const laneRecords = records.filter((record) => record.sourceLane === lane);
    const row = `| \`${lane}\` | ${laneRecords.length} | ${laneRecords.length} / ${laneRecords.length} | ${laneRecords.length} / ${laneRecords.length} | ${laneRecords.length} / ${laneRecords.length} | 0 |`;
    if (!report.includes(row)) failures.push(`Report missing provenance row: ${row}`);
  }

  for (const claim of candidates.blockedClaimsRequired ?? []) {
    if (!report.includes(`\`${claim}\``)) failures.push(`Report missing blocked claim: ${claim}`);
  }

  for (const snippet of [
    "Readiness: not ready for QA-only preview.",
    "symbolic geometry only",
    "Grounding alignment is blocked",
    "Height/massing interpretation is blocked",
    "`not_source_accessed`, `not_verified`, `candidate_only`, and `no_claim_promotion`",
  ]) {
    if (!report.includes(snippet)) failures.push(`Report missing readiness/gap snippet: ${snippet}`);
  }

  const combinedLower = `${report}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (records.length !== candidates.summary.totalCandidateCount) {
    failures.push(`Candidate totalCandidateCount expected ${records.length}, got ${candidates.summary.totalCandidateCount}`);
  }

  if (failures.length > 0) {
    console.error("4O-11 scaffold candidate gap report verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${reportPath}: QA-only gap report covers ${records.length} scaffold candidates`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
