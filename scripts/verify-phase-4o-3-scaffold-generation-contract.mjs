#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const notePath = "docs/phase-4o-3-deterministic-scaffold-generation-contract.md";
const fixturePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredNoteSnippets = [
  "4O-3 changes no public interfaces and no module boundaries.",
  "does not implement scaffold generation, access sources, download data, cache data, ingest data, convert data, render data",
  "inputSchemaVersion",
  "phase-4o-2-truth-first-corridor-fixture-stub.v0.1",
  "scaffold_building_mass",
  "scaffold_grounding_surface",
  "scaffold_height_massing_output",
  "scaffold_frontage_classification_output",
  "scaffold_override_slot_reference",
  "derive_from_4o2_record_ids_with_p4o4_scaffold_prefix",
  "No build is required because 4O-3 does not touch runtime/source app files.",
];

const requiredBriefSnippets = [
  "4O-2 accepted by Batu on 2026-06-08.",
  "4O-3 is complete and verified.",
  "Current executable batch:",
];

const requiredFixtureCollections = [
  "buildingFootprintRecords",
  "groundingRecords",
  "heightMassingFallbackRecords",
  "frontageCornerClassificationRecords",
  "manualOverrideSlots",
];

const requiredBoundaries = [
  "no_storefront_claim",
  "no_tenant_claim",
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
  "data downloaded",
  "data cached",
  "data ingested",
  "data converted",
  "runtime rendering added",
  "scaffold generated",
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
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));

  if (fixture.schemaVersion !== "phase-4o-2-truth-first-corridor-fixture-stub.v0.1") {
    failures.push("4O-3 contract must point at the verified 4O-2 fixture stub");
  }

  if (fixture.phase !== "4O-2" || fixture.runtimeUsePolicy !== "blocked_no_runtime_consumer") {
    failures.push("4O-2 fixture must remain fixture-only with no runtime consumer");
  }

  for (const collection of requiredFixtureCollections) {
    if (!Array.isArray(fixture[collection]) || fixture[collection].length === 0) {
      failures.push(`4O-2 fixture missing input collection for 4O-3: ${collection}`);
    }
  }

  for (const snippet of requiredNoteSnippets) {
    if (!note.includes(snippet)) failures.push(`4O-3 note missing required snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing required snippet: ${snippet}`);
  }

  const jsonBlocks = extractJsonBlocks(note);
  if (jsonBlocks.length !== 2) failures.push(`Expected 2 JSON contract examples, found ${jsonBlocks.length}`);

  for (const [index, block] of jsonBlocks.entries()) {
    try {
      JSON.parse(block);
    } catch (error) {
      failures.push(`4O-3 JSON example ${index + 1} does not parse: ${error.message}`);
    }
  }

  const combined = `${note}\n${brief}`;
  for (const boundary of requiredBoundaries) {
    if (!combined.includes(boundary)) failures.push(`Missing required claim boundary: ${boundary}`);
  }

  const combinedLower = combined.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-3 scaffold generation contract verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${notePath}: 4O-3 internal scaffold-generation contract is bounded to the 4O-2 fixture stub`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
