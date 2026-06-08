#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const notePath = "docs/phase-4o-1-truth-first-corridor-data-contract.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredNoteSnippets = [
  "4O-1 changes no public interfaces and no module boundaries.",
  "not implemented public contracts, runtime schemas, source fixtures, generated manifests, or production interfaces",
  "Building footprint record:",
  "Street / sidewalk / curb grounding record:",
  "Height / massing fallback record:",
  "Frontage / corner classification record:",
  "Manual override slot:",
  "Blender/GLB remains an optional override hook only",
  "No build is required because 4O-1 does not touch runtime/source app files.",
  "Batu retains all decisions about 4O-2 opening",
];

const requiredBriefSnippets = [
  "Batch 4O-1: Truth-First Corridor Data Contract",
  "4O-1 accepted by Batu on 2026-06-08.",
  "Current executable batch: none.",
  "Batch 4O-2: Truth-First Corridor Fixture Stub",
  "No external data download, cache, ingestion, conversion, render use, source access, source promotion, runtime rendering, procedural scaffold generation, Blender/GLB asset work, or Mapillary automation occurred.",
];

const requiredRecordFields = [
  "buildingId",
  "sourceGeometryId",
  "generationMode",
  "heightSource",
  "massingConfidence",
  "frontageRole",
  "facadeEvidenceStatus",
  "overrideAssetId",
  "detailLevel",
  "claimBoundary",
];

const requiredRecordTypes = [
  "building_footprint",
  "corridor_grounding",
  "height_massing_fallback",
  "frontage_corner_classification",
  "manual_override_slot",
];

const requiredClaimBoundaries = [
  "no_storefront_claim",
  "no_tenant_claim",
  "no_exact_facade_claim",
  "no_entrance_claim",
  "no_signage_claim",
  "no_active_status_claim",
  "no_exact_address_claim",
  "no_production_claim",
];

const forbiddenPhrases = [
  "source approved",
  "data downloaded",
  "ingestion implemented",
  "runtime rendering added",
  "blender asset added",
  "glb asset added",
  "mapillary automation added",
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
  while ((match = pattern.exec(markdown)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

async function main() {
  const failures = [];
  const note = await readFile(resolve(repoRoot, notePath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredNoteSnippets) {
    if (!note.includes(snippet)) failures.push(`Note missing required snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Brief missing required snippet: ${snippet}`);
  }

  const jsonBlocks = extractJsonBlocks(note);
  if (jsonBlocks.length !== requiredRecordTypes.length) {
    failures.push(`Expected ${requiredRecordTypes.length} JSON examples, found ${jsonBlocks.length}`);
  }

  const records = [];
  for (const [index, block] of jsonBlocks.entries()) {
    try {
      records.push(JSON.parse(block));
    } catch (error) {
      failures.push(`JSON example ${index + 1} does not parse: ${error.message}`);
    }
  }

  for (const recordType of requiredRecordTypes) {
    if (!records.some((record) => record.recordType === recordType)) {
      failures.push(`Missing JSON recordType: ${recordType}`);
    }
  }

  for (const record of records) {
    for (const field of requiredRecordFields) {
      if (!(field in record)) failures.push(`${record.recordType ?? "unknown record"} missing field: ${field}`);
    }

    if (!Array.isArray(record.claimBoundary) || record.claimBoundary.length === 0) {
      failures.push(`${record.recordType ?? "unknown record"} must have a non-empty claimBoundary array`);
    }
  }

  const combined = `${note}\n${brief}`;
  for (const boundary of requiredClaimBoundaries) {
    if (!combined.includes(boundary)) failures.push(`Missing required claim boundary: ${boundary}`);
  }

  const combinedLower = combined.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4O-1 truth-first corridor data contract verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${notePath}: 4O-1 data contract, JSON examples, and claim boundaries are present`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
