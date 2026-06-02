#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSceneManifest, validateSourceEvidenceFixture } from "../src/sceneManifest.js";

const REPORT_SCHEMA_VERSION = "source-evidence-coverage-report.v0.1";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifestInput = requiredOption(options, "manifest");
  const evidenceInput = requiredOption(options, "evidence");
  const outputInput = options.output ?? null;
  const manifestPath = resolve(repoRoot, manifestInput);
  const evidencePath = resolve(repoRoot, evidenceInput);
  const outputPath = outputInput ? resolve(repoRoot, outputInput) : null;
  const expectedTargetsWithEvidence = optionalNumber(options["expect-targets-with-evidence"], "expect-targets-with-evidence");
  const expectedTargetsWithoutEvidence = optionalNumber(
    options["expect-targets-without-evidence"],
    "expect-targets-without-evidence",
  );

  const manifest = validateSceneManifest(await readJson(manifestPath, "scene manifest"));
  const evidenceFixture = validateSourceEvidenceFixture(
    await readJson(evidencePath, "source evidence fixture"),
    manifest,
  );
  const report = buildCoverageReport({
    manifest,
    evidenceFixture,
    manifestInput,
    evidenceInput,
  });

  const failures = collectExpectationFailures(report, {
    expectedTargetsWithEvidence,
    expectedTargetsWithoutEvidence,
  });
  if (failures.length) {
    console.error(`FAIL source evidence coverage inspection: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (outputPath) {
    await writeFile(outputPath, output, "utf8");
    console.log(`Wrote ${outputPath}`);
  } else {
    process.stdout.write(output);
  }

  console.log([
    "PASS source evidence coverage inspection:",
    `${report.summary.targetsWithGeneratedEvidence}/${report.summary.targetCount} target(s) have generated evidence;`,
    `${report.summary.targetsWithoutGeneratedEvidence} target(s) remain manifest-source-only.`,
  ].join(" "));
}

function buildCoverageReport({ manifest, evidenceFixture, manifestInput, evidenceInput }) {
  const indexes = buildIndexes(manifest, evidenceFixture);
  const targetReports = manifest.scene.objects.map((object) => buildTargetReport(object, indexes));
  const targetsWithGeneratedEvidence = targetReports.filter((target) => target.generatedEvidenceRecordIds.length).length;
  const targetsWithoutGeneratedEvidence = targetReports.length - targetsWithGeneratedEvidence;
  const evidenceRecordIds = evidenceFixture.records.map((record) => record.id);
  const linkedEvidenceIds = new Set(targetReports.flatMap((target) => target.generatedEvidenceRecordIds));
  const unlinkedEvidenceRecordIds = evidenceRecordIds.filter((id) => !linkedEvidenceIds.has(id));

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    reportId: `${manifest.sceneId}.phase-2j.source-evidence-coverage`,
    status: "review-only-source-evidence-coverage",
    manifestId: manifest.sceneId,
    manifestVersion: manifest.schemaVersion,
    fixtureId: evidenceFixture.fixtureId,
    fixtureStatus: evidenceFixture.status,
    reviewedOn: evidenceFixture.reviewedOn,
    generatedFrom: {
      manifestPath: manifestInput,
      evidencePath: evidenceInput,
    },
    summary: {
      targetCount: targetReports.length,
      evidenceRecordCount: evidenceFixture.records.length,
      targetsWithGeneratedEvidence,
      targetsWithoutGeneratedEvidence,
      unlinkedEvidenceRecordCount: unlinkedEvidenceRecordIds.length,
      unprovenancedRealWorldClaims: manifest.qa.unprovenancedRealWorldClaims,
      hiddenManualFixes: manifest.qa.hiddenManualFixes,
    },
    targets: targetReports,
    unlinkedEvidenceRecordIds,
    qaCarryForward: {
      missingData: manifest.qa.missingData,
      ambiguity: manifest.qa.ambiguity,
      blockedClaims: manifest.qa.blockedClaims,
      verdict: manifest.qa.verdict,
    },
    notes: [
      "This report is generated from the review-only scene manifest and Phase 2H runtime source-evidence fixture.",
      "Generated evidence coverage does not approve production data, exact facade/frontage/address placement, exact station geometry, or public claims.",
      "Any target without generated evidence still relies on manifest source references and remains a candidate for future raw-input expansion.",
    ],
  };
}

function buildTargetReport(object, indexes) {
  const place = indexes.placesById.get(object.placeId);
  const business = place?.businessId ? indexes.businessesById.get(place.businessId) : null;
  const addressRecords = (place?.addressIds ?? []).map((id) => indexes.addressesById.get(id)).filter(Boolean);
  const storefrontRecords = (place?.storefrontIds ?? []).map((id) => indexes.storefrontsById.get(id)).filter(Boolean);
  const anchor = indexes.anchorsById.get(object.anchorId);
  const evidenceRecords = collectTargetEvidence(object, place, indexes);
  const manifestSources = collectManifestSources({ object, place, business, addressRecords, storefrontRecords, anchor, indexes });

  return {
    targetId: object.appTarget.id,
    objectId: object.id,
    placeId: object.placeId,
    title: object.appTarget.title,
    category: object.appTarget.category,
    claimStatus: object.claimStatus,
    cardEligibility: place?.cardEligibility ?? "unknown",
    sceneAnchor: anchor ? {
      id: anchor.id,
      claimStatus: anchor.claimStatus,
      cornerId: anchor.cornerId,
      confidence: anchor.confidence,
    } : null,
    generatedEvidenceRecordIds: evidenceRecords.map((record) => record.id),
    coverageStatus: evidenceRecords.length ? "generated-evidence-linked" : "manifest-source-refs-only",
    coverageNotes: evidenceRecords.length
      ? ["Generated source-evidence records are linked to this target for review-only inspection."]
      : ["No generated source-evidence record is linked yet; this target remains a candidate for future raw-input expansion."],
    manifestSourceRefs: manifestSources.map((source) => ({
      id: source.id,
      label: source.label,
      sourceType: source.sourceType,
      usageStatus: source.usageStatus,
      reviewedOn: source.reviewedOn,
    })),
    remainingGaps: uniqueStrings(evidenceRecords.flatMap((record) => record.remainingGaps)),
  };
}

function buildIndexes(manifest, evidenceFixture) {
  const recordsByTargetId = new Map();
  const recordsByPlaceId = new Map();
  const recordsById = new Map();

  for (const record of evidenceFixture.records) {
    recordsById.set(record.id, record);
    for (const targetId of record.targetIds) appendIndexedRecord(recordsByTargetId, targetId, record);
    for (const placeId of record.placeIds) appendIndexedRecord(recordsByPlaceId, placeId, record);
  }

  return {
    sourcesById: indexById(manifest.sources),
    placesById: indexById(manifest.places),
    businessesById: indexById(manifest.businesses),
    addressesById: indexById(manifest.addresses),
    storefrontsById: indexById(manifest.storefronts),
    anchorsById: indexById(manifest.scene.anchors),
    recordsById,
    recordsByTargetId,
    recordsByPlaceId,
  };
}

function collectTargetEvidence(object, place, indexes) {
  const records = [
    ...(indexes.recordsByTargetId.get(object.appTarget.id) ?? []),
    ...(indexes.recordsByPlaceId.get(object.placeId) ?? []),
    ...((place?.sourceEvidenceIds ?? []).map((id) => indexes.recordsById.get(id)).filter(Boolean)),
  ];
  return [...new Map(records.map((record) => [record.id, record])).values()];
}

function collectManifestSources({ object, place, business, addressRecords, storefrontRecords, anchor, indexes }) {
  const sourceIds = new Set([
    ...(object.sourceIds ?? []),
    ...(place?.sourceIds ?? []),
    ...(business?.officialSourceIds ?? []),
    ...(business?.secondarySourceIds ?? []),
    ...(anchor?.sourceIds ?? []),
    ...addressRecords.flatMap((record) => record.sourceIds ?? []),
    ...storefrontRecords.flatMap((record) => record.sourceIds ?? []),
  ]);
  return [...sourceIds].map((id) => indexes.sourcesById.get(id)).filter(Boolean);
}

function collectExpectationFailures(report, expectations) {
  const failures = [];
  if (
    expectations.expectedTargetsWithEvidence !== null &&
    report.summary.targetsWithGeneratedEvidence !== expectations.expectedTargetsWithEvidence
  ) {
    failures.push([
      "targets with generated evidence mismatch",
      `actual ${report.summary.targetsWithGeneratedEvidence}`,
      `expected ${expectations.expectedTargetsWithEvidence}`,
    ].join("; "));
  }
  if (
    expectations.expectedTargetsWithoutEvidence !== null &&
    report.summary.targetsWithoutGeneratedEvidence !== expectations.expectedTargetsWithoutEvidence
  ) {
    failures.push([
      "targets without generated evidence mismatch",
      `actual ${report.summary.targetsWithoutGeneratedEvidence}`,
      `expected ${expectations.expectedTargetsWithoutEvidence}`,
    ].join("; "));
  }
  if (report.summary.unlinkedEvidenceRecordCount !== 0) {
    failures.push(`source evidence fixture has ${report.summary.unlinkedEvidenceRecordCount} unlinked record(s)`);
  }
  return failures;
}

function appendIndexedRecord(index, id, record) {
  if (!index.has(id)) index.set(id, []);
  index.get(id).push(record);
}

function indexById(records) {
  return new Map(records.map((record) => [record.id, record]));
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value))];
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

function optionalNumber(value, label) {
  if (value === undefined) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw new Error(`--${label} must be a non-negative integer.`);
  return number;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
