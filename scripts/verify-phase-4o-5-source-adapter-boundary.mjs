#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const notePath = "docs/phase-4o-5-source-adapter-fixture-ingestion-boundary.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";
const manifestPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json";

const requiredNoteSnippets = [
  "4O-5 changes no public interfaces and no module boundaries.",
  "Spatial scaffold first.",
  "Facade recognizability second.",
  "Art direction third.",
  "NYC Building Footprints",
  "PLUTO / MapPLUTO-style",
  "CSCL",
  "Sidewalk, curb, and planimetric datasets",
  "NYC 3-D Building Model / CityGML-style massing",
  "Batu-supplied or project-owned facade evidence records",
  "Building mass/container truth is not tenant truth.",
  "Frontage/classification is provisional unless evidence-backed",
  "Facade detail remains blocked until image/evidence records or manual override records exist",
  "Grounding can be approximate only if every affected field is explicitly labeled",
  "No build is required because 4O-5 does not touch runtime/source app files.",
];

const requiredBriefSnippets = [
  "4O-5 is complete and verified.",
  "Current executable batch:",
  "No external data fetch, download, cache, ingestion, conversion",
  "No package/tooling changes",
  "No business linkage",
];

const requiredBlockedClaims = [
  "tenant_truth",
  "storefront_frontage",
  "exact_facade_detail",
  "entrance_location",
  "signage",
  "active_status",
  "exact_address_placement",
  "production_public_exactness",
];

const forbiddenPhrases = [
  "source approved",
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "runtime rendering added",
  "dependency added",
  "storefront approved",
  "tenant linked",
  "active status verified",
  "production ready",
  "public ready",
];

function extractJsonBlocks(markdown) {
  const blocks = [];
  const pattern = /```json\s*([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(markdown)) !== null) blocks.push(match[1]);
  return blocks;
}

async function main() {
  const failures = [];
  const note = await readFile(resolve(repoRoot, notePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");
  const manifest = JSON.parse(await readFile(resolve(repoRoot, manifestPath), "utf8"));

  if (manifest.schemaVersion !== "phase-4o-4-placeholder-scaffold-manifest.v0.1") {
    failures.push("4O-5 boundary must build on the verified 4O-4 placeholder scaffold manifest");
  }

  if (manifest.runtimeUsePolicy !== "blocked_no_runtime_consumer" || manifest.summary?.runtimeConsumerCount !== 0) {
    failures.push("4O-4 manifest must remain non-runtime before 4O-5 source-adapter planning");
  }

  for (const snippet of requiredNoteSnippets) {
    if (!note.includes(snippet)) failures.push(`4O-5 note missing required snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing required snippet: ${snippet}`);
  }

  const jsonBlocks = extractJsonBlocks(note);
  if (jsonBlocks.length !== 1) failures.push(`Expected 1 JSON adapter example in 4O-5 note, found ${jsonBlocks.length}`);

  let adapterExample = null;
  for (const [index, block] of jsonBlocks.entries()) {
    try {
      const parsed = JSON.parse(block);
      if (parsed.adapterRecordId) adapterExample = parsed;
    } catch (error) {
      failures.push(`4O-5 JSON block ${index + 1} does not parse: ${error.message}`);
    }
  }

  if (!adapterExample) {
    failures.push("Missing adapter record JSON example");
  } else {
    if (adapterExample.sourceAccessStatus !== "blocked_not_accessed") failures.push("Adapter example must remain blocked_not_accessed");
    if (adapterExample.retrievalStatus !== "not_started") failures.push("Adapter example must keep retrievalStatus not_started");
    for (const claim of requiredBlockedClaims) {
      if (!adapterExample.blockedClaims?.includes(claim)) failures.push(`Adapter example missing blocked claim: ${claim}`);
    }
  }

  const combinedLower = `${note}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-5 source-adapter boundary verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${notePath}: 4O-5 source-adapter boundary protects real-source fixture ingestion`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
