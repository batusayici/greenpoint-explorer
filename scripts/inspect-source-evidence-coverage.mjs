#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSceneManifest, validateSourceEvidenceFixture } from "../src/sceneManifest.js";

const REPORT_SCHEMA_VERSION = "source-evidence-coverage-report.v0.1";
const EVIDENCE_STRENGTH_VALUES = [
  "reviewed",
  "official_location_only",
  "manifest_context_only",
  "blocked",
];
const CLAIM_READINESS_VALUES = [
  "product_copy_ready",
  "review_only",
  "blocked",
];
const PROMOTION_CLAIM_KEYS = [
  "identityName",
  "categoryBusinessType",
  "addressLocation",
  "storefrontFacade",
  "entranceFrontageGeometry",
];
const PROMOTION_GATE_STATUS_VALUES = [
  "allowed",
  "review_only",
  "blocked",
];
const PROMOTION_GATE_DEFINITION = {
  productCopyReadyRequires: PROMOTION_CLAIM_KEYS,
  statusValues: {
    allowed: "Existing source evidence supports this claim family enough to clear the current promotion gate.",
    review_only: "Existing source evidence can support review inspection, but more or stronger source evidence is needed before product-copy use.",
    blocked: "Existing source evidence does not support this claim family; product-copy use remains blocked.",
  },
  rule: "A record cannot be product_copy_ready unless identity/name, category/business-type, address/location, storefront/facade, and entrance/frontage/geometry gates are all allowed.",
};

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
  const expectedProductCopyReadyTargets = optionalNumber(
    options["expect-product-copy-ready-targets"],
    "expect-product-copy-ready-targets",
  );
  const expectedReviewOnlyTargets = optionalNumber(
    options["expect-review-only-targets"],
    "expect-review-only-targets",
  );
  const expectedBlockedTargets = optionalNumber(
    options["expect-blocked-targets"],
    "expect-blocked-targets",
  );
  const expectedIdentityNameAllowedTargets = optionalNumber(
    options["expect-identity-name-allowed-targets"],
    "expect-identity-name-allowed-targets",
  );
  const expectedCategoryBusinessTypeAllowedTargets = optionalNumber(
    options["expect-category-business-type-allowed-targets"],
    "expect-category-business-type-allowed-targets",
  );
  const expectedAddressLocationAllowedTargets = optionalNumber(
    options["expect-address-location-allowed-targets"],
    "expect-address-location-allowed-targets",
  );
  const expectedStorefrontFacadeBlockedTargets = optionalNumber(
    options["expect-storefront-facade-blocked-targets"],
    "expect-storefront-facade-blocked-targets",
  );
  const expectedEntranceFrontageGeometryBlockedTargets = optionalNumber(
    options["expect-entrance-frontage-geometry-blocked-targets"],
    "expect-entrance-frontage-geometry-blocked-targets",
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
    expectedProductCopyReadyTargets,
    expectedReviewOnlyTargets,
    expectedBlockedTargets,
    expectedIdentityNameAllowedTargets,
    expectedCategoryBusinessTypeAllowedTargets,
    expectedAddressLocationAllowedTargets,
    expectedStorefrontFacadeBlockedTargets,
    expectedEntranceFrontageGeometryBlockedTargets,
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
    `${report.summary.targetsWithoutGeneratedEvidence} target(s) remain manifest-source-only;`,
    `${report.summary.claimReadinessByTarget.product_copy_ready} product-copy-ready target(s);`,
    `${report.summary.claimReadinessByTarget.review_only} review-only target(s);`,
    `${report.summary.claimReadinessByTarget.blocked} blocked target(s);`,
    `${report.summary.promotionGateStatusByTarget.storefrontFacade.blocked} storefront/facade blocked target(s);`,
    `${report.summary.promotionGateStatusByTarget.entranceFrontageGeometry.blocked} entrance/frontage/geometry blocked target(s).`,
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
  const evidenceStrengthByRecord = countBy(
    evidenceFixture.records.map((record) => record.evidenceStrength),
    EVIDENCE_STRENGTH_VALUES,
  );
  const claimReadinessByRecord = countBy(
    evidenceFixture.records.map((record) => record.claimReadiness),
    CLAIM_READINESS_VALUES,
  );
  const claimReadinessByTarget = countBy(
    targetReports.map((target) => target.claimReadiness),
    CLAIM_READINESS_VALUES,
  );
  const promotionGateStatusByRecord = summarizePromotionGatesByRecord(evidenceFixture.records);
  const promotionGateStatusByTarget = summarizePromotionGatesByTarget(targetReports);

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
    promotionGateDefinition: PROMOTION_GATE_DEFINITION,
    summary: {
      targetCount: targetReports.length,
      evidenceRecordCount: evidenceFixture.records.length,
      targetsWithGeneratedEvidence,
      targetsWithoutGeneratedEvidence,
      evidenceStrengthByRecord,
      claimReadinessByRecord,
      claimReadinessByTarget,
      promotionGateStatusByRecord,
      promotionGateStatusByTarget,
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
      "Claim readiness is reported separately from coverage so generated evidence cannot be mistaken for product-copy-ready source truth.",
      "Claim-level promotion gates identify which claim families are allowed, review-only, or blocked for product-copy promotion.",
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
  const evidenceStrengths = uniqueStrings(evidenceRecords.map((record) => record.evidenceStrength));
  const claimReadiness = summarizeClaimReadiness(evidenceRecords);
  const promotionGates = summarizePromotionGates(evidenceRecords);
  const promotionBlockers = collectPromotionBlockers(promotionGates);

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
    evidenceStrengths,
    claimReadiness,
    promotionGates,
    promotionBlockers,
    evidenceQualityRecords: evidenceRecords.map((record) => ({
      id: record.id,
      evidenceStrength: record.evidenceStrength,
      claimReadiness: record.claimReadiness,
      promotionGates: record.promotionGates,
      promotionBlockers: collectPromotionBlockers(record.promotionGates),
      confidence: record.confidence,
      remainingGaps: record.remainingGaps,
    })),
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
  const expectedReadiness = [
    ["product_copy_ready", expectations.expectedProductCopyReadyTargets, "product-copy-ready targets"],
    ["review_only", expectations.expectedReviewOnlyTargets, "review-only targets"],
    ["blocked", expectations.expectedBlockedTargets, "blocked targets"],
  ];
  const expectedPromotionGates = [
    ["identityName", "allowed", expectations.expectedIdentityNameAllowedTargets, "identity/name allowed targets"],
    ["categoryBusinessType", "allowed", expectations.expectedCategoryBusinessTypeAllowedTargets, "category/business-type allowed targets"],
    ["addressLocation", "allowed", expectations.expectedAddressLocationAllowedTargets, "address/location allowed targets"],
    ["storefrontFacade", "blocked", expectations.expectedStorefrontFacadeBlockedTargets, "storefront/facade blocked targets"],
    ["entranceFrontageGeometry", "blocked", expectations.expectedEntranceFrontageGeometryBlockedTargets, "entrance/frontage/geometry blocked targets"],
  ];
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
  for (const [key, expected, label] of expectedReadiness) {
    if (expected !== null && report.summary.claimReadinessByTarget[key] !== expected) {
      failures.push([
        `${label} mismatch`,
        `actual ${report.summary.claimReadinessByTarget[key]}`,
        `expected ${expected}`,
      ].join("; "));
    }
  }
  for (const [claimKey, status, expected, label] of expectedPromotionGates) {
    if (expected !== null && report.summary.promotionGateStatusByTarget[claimKey][status] !== expected) {
      failures.push([
        `${label} mismatch`,
        `actual ${report.summary.promotionGateStatusByTarget[claimKey][status]}`,
        `expected ${expected}`,
      ].join("; "));
    }
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

function summarizeClaimReadiness(records) {
  if (!records.length) return "blocked";
  const readiness = new Set(records.map((record) => record.claimReadiness));
  if (readiness.has("blocked")) return "blocked";
  if (readiness.has("review_only")) return "review_only";
  return "product_copy_ready";
}

function summarizePromotionGates(records) {
  return Object.fromEntries(
    PROMOTION_CLAIM_KEYS.map((key) => [key, {
      status: summarizePromotionGateStatus(records, key),
      rationale: summarizePromotionGateRationale(records, key),
      neededEvidence: summarizePromotionGateNeededEvidence(records, key),
    }]),
  );
}

function summarizePromotionGateStatus(records, key) {
  if (!records.length) return "blocked";
  const statuses = records.map((record) => record.promotionGates[key].status);
  if (statuses.includes("blocked")) return "blocked";
  if (statuses.includes("review_only")) return "review_only";
  return "allowed";
}

function summarizePromotionGateRationale(records, key) {
  return uniqueStrings(records.map((record) => record.promotionGates[key].rationale)).join(" ");
}

function summarizePromotionGateNeededEvidence(records, key) {
  return uniqueStrings(records.map((record) => record.promotionGates[key].neededEvidence)).join(" ");
}

function collectPromotionBlockers(gates) {
  return PROMOTION_CLAIM_KEYS
    .filter((key) => gates[key].status !== "allowed")
    .map((key) => ({
      claim: key,
      status: gates[key].status,
      neededEvidence: gates[key].neededEvidence,
    }));
}

function summarizePromotionGatesByRecord(records) {
  const counts = emptyPromotionGateCounts();
  for (const record of records) {
    for (const key of PROMOTION_CLAIM_KEYS) counts[key][record.promotionGates[key].status] += 1;
  }
  return counts;
}

function summarizePromotionGatesByTarget(targetReports) {
  const counts = emptyPromotionGateCounts();
  for (const target of targetReports) {
    for (const key of PROMOTION_CLAIM_KEYS) counts[key][target.promotionGates[key].status] += 1;
  }
  return counts;
}

function emptyPromotionGateCounts() {
  return Object.fromEntries(
    PROMOTION_CLAIM_KEYS.map((key) => [
      key,
      Object.fromEntries(PROMOTION_GATE_STATUS_VALUES.map((status) => [status, 0])),
    ]),
  );
}

function countBy(values, keys) {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const value of values) {
    if (Object.hasOwn(counts, value)) counts[value] += 1;
  }
  return counts;
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
