#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const planPath = "docs/phase-4i-1-corridor-facade-cue-expansion-plan.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredPlanSnippets = [
  "4I expands the existing endpoint-only QA facade cue proof toward corridor coverage",
  "4I-1 changes no public interfaces and no module boundaries.",
  "endpoint_evidence_backed",
  "mid_corridor_insufficient_evidence",
  "blocked_no_evidence_gap",
  "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json",
  "scripts/verify-phase-4i-corridor-facade-cues.mjs",
  "Normal mode visually and behaviorally unchanged.",
  "Batu retains all decisions about source promotion",
];

const requiredBriefSnippets = [
  "Current executable batch: none. Pending Batu visual/review gate",
  "`4I-1`, `4I-2`, and `4I-3` are complete and verified",
  "Hard Batu gate: stop.",
  "No external source access, download, cache, ingestion",
];

const forbiddenPhrases = [
  "source approved",
  "normal mode facade",
  "production asset created",
  "business linked",
  "authoritative storefront approved",
  "exact frontage claim",
  "exact entrance claim",
  "mapillary imagery ingested",
  "kartaview imagery ingested",
  "nyc 3d ingested",
  "google street view used",
  "google 3d tiles used",
];

async function main() {
  const failures = [];
  const plan = await readFile(resolve(repoRoot, planPath), "utf8");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredPlanSnippets) {
    if (!plan.includes(snippet)) failures.push(`Plan missing required snippet: ${snippet}`);
  }

  for (const snippet of requiredBriefSnippets) {
    if (!brief.includes(snippet)) failures.push(`Brief missing required snippet: ${snippet}`);
  }

  const combinedLower = `${plan}\n${brief}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4I-1 corridor facade cue expansion plan verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${planPath}: 4I-1 plan opens a bounded QA-only corridor facade cue packet`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
