#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSceneManifest } from "../src/sceneManifest.js";

const RAW_SCHEMA_VERSION = "local-source-evidence-raw.v0.1";
const OUTPUT_SCHEMA_VERSION = "source-evidence-fixture.v0.1";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = resolve(repoRoot, requiredOption(options, "input"));
  const manifestPath = resolve(repoRoot, requiredOption(options, "manifest"));
  const outputPath = options.output ? resolve(repoRoot, options.output) : null;
  const comparePath = options["compare-to"] ? resolve(repoRoot, options["compare-to"]) : null;

  const rawFixture = await readJson(inputPath, "raw evidence input");
  const manifest = validateSceneManifest(await readJson(manifestPath, "scene manifest"));
  const fixture = convertRawFixture(rawFixture);

  validateConvertedFixture(fixture, manifest);
  if (comparePath) {
    const expectedFixture = await readJson(comparePath, "comparison source evidence fixture");
    if (!compareFixtureParity(fixture, expectedFixture)) return;
  }

  const output = `${JSON.stringify(fixture, null, 2)}\n`;
  if (outputPath) {
    await writeFile(outputPath, output, "utf8");
    console.log(`Wrote ${outputPath}`);
  } else {
    process.stdout.write(output);
  }
}

function compareFixtureParity(generatedFixture, expectedFixture) {
  assertObject(expectedFixture, "comparison fixture");
  assertArray(expectedFixture.records, "comparison fixture.records");

  const expectedRecords = new Map(expectedFixture.records.map((record) => [record.id, record]));
  const failures = [];

  for (const generatedRecord of generatedFixture.records) {
    const expectedRecord = expectedRecords.get(generatedRecord.id);
    if (!expectedRecord) {
      failures.push(`missing expected record for generated id "${generatedRecord.id}"`);
      continue;
    }

    compareField(failures, generatedRecord, expectedRecord, "id", "id");
    compareField(failures, generatedRecord, expectedRecord, "targetIds", "target id");
    compareField(failures, generatedRecord, expectedRecord, "placeIds", "placeId");
    compareField(failures, generatedRecord, expectedRecord, "sourceLabel", "source title/name");
    compareField(failures, generatedRecord, expectedRecord, "sourceUrl", "source url");
    compareField(failures, generatedRecord, expectedRecord, "sourceType", "evidence kind/category");
    compareField(failures, generatedRecord, expectedRecord, "usageStatus", "usage status");
    compareField(failures, generatedRecord, expectedRecord, "claimMappings", "supported claims/copy fields");
    compareField(failures, generatedRecord, expectedRecord, "remainingGaps", "preserved uncertainty/gap fields");
    compareField(failures, generatedRecord, expectedRecord, "qaNotes", "review QA notes");
  }

  if (failures.length) {
    console.error(`FAIL source evidence parity check: ${failures.length} mismatch(es).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return false;
  }

  console.log(`PASS source evidence parity check: ${generatedFixture.records.length} generated record(s) matched.`);
  return true;
}

function compareField(failures, generatedRecord, expectedRecord, key, label) {
  const generatedValue = stableComparable(generatedRecord[key]);
  const expectedValue = stableComparable(expectedRecord[key]);
  if (generatedValue !== expectedValue) {
    failures.push([
      `${generatedRecord.id} ${label} mismatch`,
      `generated ${key}: ${generatedValue}`,
      `expected ${key}: ${expectedValue}`,
    ].join("; "));
  }
}

function stableComparable(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (value && typeof value === "object") return JSON.stringify(sortObject(value));
  return JSON.stringify(value);
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortObject(value[key])]),
  );
}

function convertRawFixture(rawFixture) {
  assertObject(rawFixture, "raw fixture");
  assertEqual(rawFixture.schemaVersion, RAW_SCHEMA_VERSION, "raw fixture.schemaVersion");
  assertString(rawFixture.fixtureId, "raw fixture.fixtureId");
  assertString(rawFixture.status, "raw fixture.status");
  assertString(rawFixture.reviewedOn, "raw fixture.reviewedOn");
  assertArray(rawFixture.records, "raw fixture.records");

  return {
    schemaVersion: OUTPUT_SCHEMA_VERSION,
    fixtureId: rawFixture.fixtureId,
    status: rawFixture.status,
    reviewedOn: rawFixture.reviewedOn,
    notes: optionalString(rawFixture.notes),
    records: rawFixture.records.map(convertRawRecord),
  };
}

function validateConvertedFixture(fixture, manifest) {
  assertEqual(fixture.schemaVersion, OUTPUT_SCHEMA_VERSION, "converted fixture.schemaVersion");
  const targetIds = new Set(manifest.scene.objects.map((object) => object.appTarget.id));
  const placeIds = new Set(manifest.places.map((place) => place.id));
  const sourceIds = new Set(manifest.sources.map((source) => source.id));

  for (const record of fixture.records) {
    assertReferences(record.targetIds, targetIds, `converted record ${record.id}.targetIds`);
    assertReferences(record.placeIds, placeIds, `converted record ${record.id}.placeIds`);
    assertReferences(record.sourceRecordIds, sourceIds, `converted record ${record.id}.sourceRecordIds`);
  }
}

function convertRawRecord(record, index) {
  const label = `raw fixture.records[${index}]`;
  assertObject(record, label);
  assertString(record.id, `${label}.id`);
  assertString(record.targetId, `${label}.targetId`);
  assertString(record.placeId, `${label}.placeId`);
  assertString(record.sourceRecordId, `${label}.sourceRecordId`);
  assertObject(record.source, `${label}.source`);
  assertString(record.source.type, `${label}.source.type`);
  assertString(record.source.label, `${label}.source.label`);
  assertString(record.source.url, `${label}.source.url`);
  assertString(record.capturedOn, `${label}.capturedOn`);
  assertString(record.reviewedOn, `${label}.reviewedOn`);
  assertString(record.usageStatus, `${label}.usageStatus`);
  assertObject(record.confidence, `${label}.confidence`);
  assertString(record.confidence.value, `${label}.confidence.value`);
  assertString(record.confidence.rationale, `${label}.confidence.rationale`);
  assertArray(record.claims, `${label}.claims`);
  assertArray(record.qaNotes, `${label}.qaNotes`);
  assertArray(record.remainingGaps, `${label}.remainingGaps`);

  return {
    id: record.id,
    targetIds: [record.targetId],
    placeIds: [record.placeId],
    sourceRecordIds: [record.sourceRecordId],
    sourceType: record.source.type,
    sourceLabel: record.source.label,
    sourceUrl: record.source.url,
    capturedOn: record.capturedOn,
    reviewedOn: record.reviewedOn,
    usageStatus: record.usageStatus,
    confidence: {
      value: record.confidence.value,
      rationale: record.confidence.rationale,
    },
    claimMappings: record.claims.map((claim, claimIndex) => convertRawClaim(claim, `${label}.claims[${claimIndex}]`)),
    qaNotes: record.qaNotes,
    remainingGaps: record.remainingGaps,
  };
}

function convertRawClaim(claim, label) {
  assertObject(claim, label);
  assertString(claim.id, `${label}.id`);
  assertString(claim.manifestPath, `${label}.manifestPath`);
  assertString(claim.type, `${label}.type`);
  assertString(claim.value, `${label}.value`);
  assertString(claim.supportLevel, `${label}.supportLevel`);
  assertString(claim.confidence, `${label}.confidence`);
  assertString(claim.notes, `${label}.notes`);

  return {
    claimId: claim.id,
    manifestPath: claim.manifestPath,
    claimType: claim.type,
    claimValue: claim.value,
    supportLevel: claim.supportLevel,
    confidence: claim.confidence,
    notes: claim.notes,
  };
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${label} at ${path}: ${error.message}`);
  }
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument "${arg}".`);
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}.`);
    options[key] = value;
    index += 1;
  }
  return options;
}

function requiredOption(options, key) {
  if (!options[key]) throw new Error(`Missing required option --${key}.`);
  return options[key];
}

function optionalString(value) {
  return typeof value === "string" ? value : "";
}

function assertEqual(value, expected, label) {
  if (value !== expected) throw new Error(`${label} must be "${expected}".`);
}

function assertReferences(values, knownIds, label) {
  assertArray(values, label);
  for (const value of values) {
    assertString(value, label);
    if (!knownIds.has(value)) throw new Error(`${label} references missing id "${value}".`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`${label} must be a string.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
