#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CONTRACT = {
  schemaVersion: "phase-3-foursquare-poi-adapter-contract.v0.1",
  status: "review-only-contract-no-live-retrieval",
  target: {
    id: "brouwerij-lane",
    label: "Brouwerij Lane",
    candidateId: "brouwerij-lane-source-retrieval-candidate",
    sliceId: "greenpoint-ave-manhattan-to-franklin",
  },
  paths: {
    rawFixturePath: "src/data/source-evidence/raw/foursquare/brouwerij-lane.phase-3.foursquare.raw.json",
    normalizedEvidenceOutputPath: "src/data/source-evidence/phase-3/brouwerij-lane.foursquare.poi-evidence.v0.1.json",
  },
  source: {
    provider: "Foursquare Places API",
    docsUrl: "https://docs.foursquare.com/data-products/docs/places-api",
    productUrl: "https://foursquare.com/products/places-api/",
    endpointFamily: "Search & Data",
    queryText: "Brouwerij Lane",
    locationBias: "Greenpoint, Brooklyn, NY",
  },
  allowedFields: [
    "fsq_id or fsq_place_id",
    "name",
    "categories.id",
    "categories.name",
    "location.formatted_address",
    "location.address",
    "location.locality",
    "location.region",
    "location.postcode",
    "location.country",
    "geocodes.main.latitude",
    "geocodes.main.longitude",
    "date_refreshed or provider freshness field",
    "date_closed or provider closed/status field",
    "link or provider place URL",
  ],
  blockedFields: [
    "photos",
    "tips",
    "reviews",
    "ratings",
    "hours/open-now claims",
    "popularity",
    "facade",
    "frontage",
    "entrance",
    "raster-readiness",
  ],
  requiredEnvironment: [
    {
      name: "FOURSQUARE_API_KEY",
      aliases: ["FSQ_API_KEY"],
      purpose: "Credential for the approved Foursquare Places request.",
    },
    {
      name: "FOURSQUARE_TERMS_APPROVED_AT",
      purpose: "ISO date recording when Batu approved Foursquare terms/cache/display use for this bounded review fixture.",
    },
    {
      name: "FOURSQUARE_TERMS_APPROVED_BY",
      purpose: "Reviewer/owner who approved the bounded Foursquare terms use.",
    },
    {
      name: "FOURSQUARE_FIXTURE_STORAGE_APPROVED",
      requiredValue: "true",
      purpose: "Explicit approval that a bounded raw response fixture or hash may be stored for review-only use.",
    },
    {
      name: "FOURSQUARE_REVIEW_ONLY_ACK",
      requiredValue: "review-only",
      purpose: "Explicit acknowledgement that the adapter must not produce production/public claims.",
    },
  ],
  cacheAndHashPolicy: {
    rawFixtureRequiredBeforeNormalization: true,
    hashAlgorithm: "sha256",
    normalizedOutputMustIncludeRawHash: true,
    noLiveRequestInThisContractBatch: true,
  },
};

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--print-contract")) {
    process.stdout.write(`${JSON.stringify(CONTRACT, null, 2)}\n`);
    return;
  }

  if (args.includes("--check-readiness")) {
    checkReadiness();
    return;
  }

  if (args.includes("--hash-raw-fixture")) {
    const fixturePath = optionValue(args, "--raw-fixture") ?? CONTRACT.paths.rawFixturePath;
    await hashRawFixture(fixturePath);
    return;
  }

  printUsage();
  process.exitCode = 1;
}

function checkReadiness() {
  const failures = [];

  for (const requirement of CONTRACT.requiredEnvironment) {
    const value = readEnv(requirement.name, requirement.aliases ?? []);
    if (!value) {
      const aliasNote = requirement.aliases?.length ? ` or ${requirement.aliases.join(" or ")}` : "";
      failures.push(`missing ${requirement.name}${aliasNote}: ${requirement.purpose}`);
      continue;
    }

    if (requirement.requiredValue && value !== requirement.requiredValue) {
      failures.push(`${requirement.name} must be "${requirement.requiredValue}" for this review-only contract.`);
    }

    if (requirement.name.endsWith("_APPROVED_AT") && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      failures.push(`${requirement.name} must be an ISO date in YYYY-MM-DD format.`);
    }
  }

  if (failures.length) {
    console.error(`FAIL Foursquare Brouwerij adapter readiness: ${failures.length} missing/invalid gate(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    console.error("No live request was made. This script is a deterministic review-only contract stub.");
    process.exitCode = 1;
    return;
  }

  console.log("PASS Foursquare Brouwerij adapter readiness gates.");
  console.log(`Raw fixture path: ${CONTRACT.paths.rawFixturePath}`);
  console.log(`Normalized evidence output path: ${CONTRACT.paths.normalizedEvidenceOutputPath}`);
  console.log("No live request was made. A later approved batch must perform retrieval/normalization.");
}

async function hashRawFixture(fixturePath) {
  const absolutePath = resolve(repoRoot, fixturePath);
  const rawFixture = await readFile(absolutePath);
  const hash = createHash("sha256").update(rawFixture).digest("hex");
  console.log(`sha256:${hash}`);
  console.log(`Raw fixture path: ${fixturePath}`);
}

function readEnv(primaryName, aliases) {
  for (const name of [primaryName, ...aliases]) {
    const value = process.env[name];
    if (value) return value;
  }
  return "";
}

function optionValue(args, optionName) {
  const index = args.indexOf(optionName);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

function printUsage() {
  console.error([
    "Usage:",
    "  node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --print-contract",
    "  node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --check-readiness",
    "  node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --hash-raw-fixture [--raw-fixture path]",
  ].join("\n"));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
