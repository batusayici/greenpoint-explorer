#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const boundaryPath = "docs/phase-4o-12-existing-qa-render-reconnection-boundary.md";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";
const gapReportPath = "docs/reports/phase-4o-11-scaffold-candidate-qa-gap-report.md";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredBoundarySnippets = [
  "Boundary contract complete; no runtime rendering, public UI, normal-mode exposure, or claim promotion.",
  "without creating a parallel, disconnected scaffold universe",
  "Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.",
  "src/Phase4BRuntimePreview.jsx",
  "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json",
  "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json",
  candidatePath,
  gapReportPath,
  "Compare 4O candidates against the existing QA corridor render boundary.",
  "Only then may a later Batu-approved batch consider QA-only runtime integration.",
  "Coordinate/orientation compatibility",
  "Camera/preset compatibility",
  "Object ID mapping",
  "Grounding alignment",
  "Height/massing interpretation",
  "Blocked facade/business/frontage/sign/entrance claims",
  "Normal-mode isolation",
  "must stop as a blocked reconnection rather than creating a separate scaffold universe",
  "No external data fetch, download, cache, ingestion, conversion, or render use.",
  "No runtime rendering, 3D rendering, public UI, runtime scene integration, or normal-mode exposure.",
  "No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, or module-boundary changes.",
  "This contract is a QA-only reconnection boundary; it is not a scaffold manifest and not a runtime/public interface.",
];

const requiredBriefSnippets = [
  "Batch 4O-12: Existing QA Render Reconnection Boundary",
  "4O-12 is complete and verified.",
  "Current executable batch: none.",
  "Pre-authorized queue: none.",
  "Hard Batu gate: stop.",
  "No external data fetch, download, cache, ingestion, conversion",
  "runtime rendering",
  "public interfaces",
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
  const boundary = await readFile(resolve(repoRoot, boundaryPath), "utf8");
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredBoundarySnippets) {
    if (!boundary.includes(snippet)) failures.push(`Boundary doc missing required snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4O-12 snippet: ${snippet}`);
  }

  for (const claim of requiredBlockedClaims) {
    if (!boundary.includes(`\`${claim}\``)) failures.push(`Boundary doc missing blocked claim: ${claim}`);
  }

  for (const family of candidates.candidateFamilyOrder ?? []) {
    if (!boundary.includes(`\`${family}\``)) failures.push(`Boundary doc missing candidate family: ${family}`);
  }

  for (const runtimeSnippet of [
    "const [qaEnabled, setQaEnabled] = useState(false);",
    "aria-label=\"Interactive 3D graybox corridor runtime\"",
    "Camera preset Manhattan to Franklin",
    "Camera preset Franklin to Manhattan",
  ]) {
    if (!runtime.includes(runtimeSnippet)) failures.push(`Existing runtime anchor missing expected snippet: ${runtimeSnippet}`);
  }

  if (candidates.summary?.renderIntegrationCount !== 0) failures.push("4O candidates must still have zero render integrations");
  if (candidates.summary?.publicInterfaceCount !== 0) failures.push("4O candidates must still have zero public interfaces");
  if (candidates.summary?.moduleBoundaryChangeCount !== 0) failures.push("4O candidates must still have zero module-boundary changes");
  if (candidates.normalModeExposure !== "blocked") failures.push("4O candidates must keep normalModeExposure blocked");

  const combinedLower = `${boundary}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-12 reconnection boundary verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${boundaryPath}: reconnection boundary protects the existing QA render path`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
