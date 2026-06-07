import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import geometryValidationReport from "../src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json" with { type: "json" };
import manifest from "../src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json" with { type: "json" };

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = resolve(
  repoRoot,
  "src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json",
);

const fixtureRepoPath = "src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json";
const geometryValidationReportPath =
  "src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json";
const claimContractPath = "docs/phase-4d-claim-ladder-matching-contract.md";

const allowedClaimStates = new Set([
  "candidate_only",
  "manual_review_required",
  "blocked_insufficient_evidence",
  "blocked_address_ambiguity",
  "blocked_multi_tenant_ambiguity",
  "blocked_frontage_ambiguity",
]);

const allowedConfidence = new Set([
  "low_synthetic_placeholder",
  "manual_review_required",
  "blocked_geometry",
]);

const requiredBlockedReasons = [
  "not-a-storefront-assignment",
  "no-tenant-frontage-evidence",
  "no-entrance-evidence",
  "no-facade-or-signage-evidence",
  "no-active-status-evidence",
  "synthetic-placeholder-source-only",
];

const forbiddenStrings = [
  "foursquare",
  "google",
  "street view",
  "3d tiles",
  "liveapi",
  "scrape",
  "tenant_frontage_verified",
  "storefront_anchor",
  "active_business_verified",
  "production_card",
];

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const expected = buildCandidateFixture();
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`;

  if (shouldWrite) {
    await writeFile(fixturePath, expectedText, "utf8");
    console.log(`Wrote Phase 4D candidate POI fixture: ${fixturePath}`);
    return;
  }

  const actualText = await readFile(fixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Candidate POI fixture does not match deterministic output from the 4D geometry validation report.");
  }

  validateFixture(actual, failures);

  if (failures.length) {
    throw new Error(`Phase 4D candidate POI fixture failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D candidate POI fixture verified (${actual.candidates.length} synthetic candidate-only records; normal mode hidden).`,
  );
}

function buildCandidateFixture() {
  const selectedRecords = selectGeometryRecords();
  const candidates = selectedRecords.map((record, index) => buildCandidate(record, index));

  return {
    schemaVersion: "phase-4d-candidate-pois.v0.1",
    fixtureId: "p4d-candidate-pois-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-3",
    reviewOnly: true,
    status: "generated-review-only-synthetic-candidate-poi-fixture",
    generatedFrom: {
      geometryValidationReportPath,
      claimContractPath,
      sourcePolicy: "synthetic-manual-placeholder-candidates-only-no-external-source",
    },
    sourceBoundary: {
      sourceType: "synthetic_manual_placeholder",
      sourceAccessMethod: "manual-authored-synthetic-stub-no-external-source",
      sourceProvenance: "No real POI source was accessed; records are deterministic placeholders for QA workflow review.",
      cachePermissionStatus: "local-review-placeholder-only",
      displayPermissionStatus: "qa-only-placeholder-labels",
      liveApiCalled: false,
      scrapingAttempted: false,
      restrictedSourceUsed: false,
      googleStreetViewOr3dTilesUsed: false,
      termsUncertainMaterialUsed: false,
      realBusinessTruthClaimed: false,
      activeStatusClaimed: false,
    },
    renderPolicy: {
      normalModeUse: "not-rendered",
      qaModeUse: "candidate-only-review-markers-and-inspector-text",
      runtimeClaimLimit: "Not a storefront assignment.",
      canAffectNormalRuntime: false,
      canCreateProductionCards: false,
      canCreateStorefrontAnchors: false,
    },
    claimPolicy: {
      maxClaimLevel: "poi-candidate",
      allowedClaimStates: Array.from(allowedClaimStates).sort(),
      forbiddenPromotions: [
        "tenant-at-address",
        "storefront-frontage",
        "entrance",
        "facade-signage",
        "active-status-finality",
        "production-card",
      ],
      requiredBlockedReasons,
    },
    summary: {
      candidateCount: candidates.length,
      sourceTypes: ["synthetic_manual_placeholder"],
      claimStateCounts: countBy(candidates, (candidate) => candidate.claimState),
      normalModeCandidateCount: 0,
      qaOnlyCandidateCount: candidates.length,
    },
    manualReviewNotes: [
      "These records are placeholders for evaluating candidate POI QA workflow only.",
      "They are not real businesses, tenants, storefronts, entrances, signs, facades, active-status claims, or production cards.",
      "Future real-source candidate work requires separate source access, cache/display permission, fixture, and QA approval.",
    ],
    candidates,
  };
}

function selectGeometryRecords() {
  const buildings = geometryValidationReport.buildingRecords;
  const groups = [
    buildings.filter((record) => record.geometryConfidence.label === "safe"),
    buildings.filter((record) => record.geometryConfidence.label === "uncertain"),
    buildings.filter((record) => record.geometryConfidence.label === "blocked"),
  ].map((records) => records.slice().sort((a, b) => a.renderedObjectId.localeCompare(b.renderedObjectId)));

  return [
    groups[0][0],
    groups[0][Math.floor(groups[0].length / 2)],
    groups[0].at(-1),
    groups[1][0],
    groups[1].at(-1),
    groups[2][0],
  ].filter(Boolean);
}

function buildCandidate(record, index) {
  const sequence = String(index + 1).padStart(2, "0");
  const geometryLabel = record.geometryConfidence.label;
  const isBlocked = geometryLabel === "blocked";
  const isUncertain = geometryLabel === "uncertain";
  const claimState = isBlocked
    ? "blocked_insufficient_evidence"
    : isUncertain
      ? "manual_review_required"
      : "candidate_only";
  const confidence = isBlocked
    ? "blocked_geometry"
    : isUncertain
      ? "manual_review_required"
      : "low_synthetic_placeholder";
  const blockedReasons = [
    ...requiredBlockedReasons,
    ...(isUncertain ? ["geometry-or-address-review-required"] : []),
    ...(isBlocked ? ["geometry-container-blocked"] : []),
  ].sort();

  return {
    id: `p4d-candidate-poi-synthetic-${sequence}`,
    displayLabel: `Synthetic candidate ${sequence}`,
    sourceType: "synthetic_manual_placeholder",
    sourceProvenance: {
      sourceLabel: "Synthetic manual placeholder",
      sourceRecordId: `synthetic-placeholder-${sequence}`,
      sourceAccessMethod: "manual-authored-synthetic-stub-no-external-source",
      cachePermissionStatus: "local-review-placeholder-only",
      displayPermissionStatus: "qa-only-placeholder-labels",
      url: null,
      restrictedSourceUsed: false,
    },
    addressString: `Unverified address candidate ${sequence}`,
    sourceCoordinate: null,
    category: getCategory(index),
    candidateConfidence: confidence,
    claimLevel: "poi-candidate",
    claimState,
    blockedReasons,
    lastVerified: null,
    verificationStatus: "unknown_not_verified_synthetic_placeholder",
    notes: [
      "Not a storefront assignment.",
      "Synthetic candidate for QA workflow review only; no real business identity or active-status claim.",
      `Placed near ${record.renderedObjectId} for candidate-review ergonomics only.`,
    ],
    reviewPlacement: {
      placementMethod: "near-existing-rendered-geometry-for-qa-only",
      targetRenderedObjectId: record.renderedObjectId,
      targetSourceFootprintId: record.sourceFootprintId,
      targetGeometryConfidence: record.geometryConfidence.label,
      offset: {
        x: getOffset(index).x,
        z: getOffset(index).z,
      },
      notClaims: [
        "source-coordinate",
        "business-location",
        "storefront-frontage",
        "entrance-location",
        "facade-or-signage-location",
      ],
    },
  };
}

function validateFixture(fixture, failures) {
  if (fixture.schemaVersion !== "phase-4d-candidate-pois.v0.1") failures.push("Unexpected schemaVersion.");
  if (fixture.phase !== "4D-3") failures.push("Fixture phase must be 4D-3.");
  if (fixture.reviewOnly !== true) failures.push("Fixture must be review-only.");
  if (fixture.sourceBoundary?.sourceType !== "synthetic_manual_placeholder") failures.push("Fixture source type must be synthetic placeholder only.");
  if (fixture.sourceBoundary?.liveApiCalled !== false) failures.push("Live API calls must remain false.");
  if (fixture.sourceBoundary?.scrapingAttempted !== false) failures.push("Scraping must remain false.");
  if (fixture.sourceBoundary?.restrictedSourceUsed !== false) failures.push("Restricted source usage must remain false.");
  if (fixture.sourceBoundary?.googleStreetViewOr3dTilesUsed !== false) failures.push("Google/Street View/3D Tiles usage must remain false.");
  if (fixture.sourceBoundary?.realBusinessTruthClaimed !== false) failures.push("Real business truth claims must remain false.");
  if (fixture.sourceBoundary?.activeStatusClaimed !== false) failures.push("Active status claims must remain false.");
  if (fixture.renderPolicy?.normalModeUse !== "not-rendered") failures.push("Candidate POIs must not render in normal mode.");
  if (fixture.renderPolicy?.canAffectNormalRuntime !== false) failures.push("Candidate POIs must not affect normal runtime.");
  if (fixture.renderPolicy?.runtimeClaimLimit !== "Not a storefront assignment.") failures.push("Runtime claim limit must say Not a storefront assignment.");
  if (fixture.claimPolicy?.maxClaimLevel !== "poi-candidate") failures.push("Max claim level must remain poi-candidate.");

  const runtimeIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const seenIds = new Set();
  for (const candidate of fixture.candidates ?? []) {
    const candidateText = [
      candidate.displayLabel,
      candidate.sourceType,
      candidate.sourceProvenance?.sourceLabel,
      candidate.sourceProvenance?.sourceRecordId,
      candidate.sourceProvenance?.sourceAccessMethod,
      candidate.addressString,
      candidate.category,
      candidate.claimLevel,
      candidate.claimState,
      ...(candidate.blockedReasons ?? []),
      ...(candidate.notes ?? []),
    ].join(" ").toLowerCase();
    for (const forbidden of forbiddenStrings) {
      if (candidateText.includes(forbidden)) failures.push(`${candidate.id} contains forbidden source/promotion text: ${forbidden}`);
    }
    if (seenIds.has(candidate.id)) failures.push(`Duplicate candidate id ${candidate.id}.`);
    seenIds.add(candidate.id);
    if (!/^p4d-candidate-poi-synthetic-\d{2}$/.test(candidate.id)) failures.push(`${candidate.id} is not a stable synthetic candidate id.`);
    if (candidate.sourceType !== "synthetic_manual_placeholder") failures.push(`${candidate.id} must use synthetic placeholder source type.`);
    if (!candidate.claimState) failures.push(`${candidate.id} is missing claimState.`);
    if (!allowedClaimStates.has(candidate.claimState)) failures.push(`${candidate.id} has unsupported claimState ${candidate.claimState}.`);
    if (candidate.claimLevel !== "poi-candidate") failures.push(`${candidate.id} must not promote beyond poi-candidate.`);
    if (!allowedConfidence.has(candidate.candidateConfidence)) failures.push(`${candidate.id} has unsupported confidence ${candidate.candidateConfidence}.`);
    if (candidate.sourceCoordinate !== null) failures.push(`${candidate.id} must not include source coordinates in synthetic 4D-3.`);
    if (candidate.lastVerified !== null) failures.push(`${candidate.id} must not include a real lastVerified date for synthetic placeholders.`);
    if (candidate.verificationStatus !== "unknown_not_verified_synthetic_placeholder") {
      failures.push(`${candidate.id} must keep unknown synthetic verification status.`);
    }
    for (const reason of requiredBlockedReasons) {
      if (!candidate.blockedReasons?.includes(reason)) failures.push(`${candidate.id} is missing blocked reason ${reason}.`);
    }
    if (!candidate.notes?.some((note) => note === "Not a storefront assignment.")) {
      failures.push(`${candidate.id} must explicitly say Not a storefront assignment.`);
    }
    if (!runtimeIds.has(candidate.reviewPlacement?.targetRenderedObjectId)) {
      failures.push(`${candidate.id} targets missing rendered object ${candidate.reviewPlacement?.targetRenderedObjectId}.`);
    }
    for (const blockedClaim of [
      "source-coordinate",
      "business-location",
      "storefront-frontage",
      "entrance-location",
      "facade-or-signage-location",
    ]) {
      if (!candidate.reviewPlacement?.notClaims?.includes(blockedClaim)) {
        failures.push(`${candidate.id} reviewPlacement is missing notClaim ${blockedClaim}.`);
      }
    }
  }

  if (fixture.summary?.candidateCount !== fixture.candidates?.length) failures.push("Summary candidateCount mismatch.");
  if (fixture.summary?.normalModeCandidateCount !== 0) failures.push("Normal-mode candidate count must be zero.");
}

function getCategory(index) {
  return [
    "food-and-drink-placeholder",
    "retail-placeholder",
    "service-placeholder",
    "civic-or-community-placeholder",
    "unknown-category-placeholder",
    "blocked-geometry-placeholder",
  ][index] ?? "unknown-category-placeholder";
}

function getOffset(index) {
  return [
    { x: -0.26, z: 0.32 },
    { x: 0.22, z: -0.32 },
    { x: 0.28, z: 0.34 },
    { x: -0.3, z: -0.36 },
    { x: 0.34, z: 0.28 },
    { x: -0.34, z: -0.28 },
  ][index] ?? { x: 0, z: 0.3 };
}

function countBy(items, getKey) {
  return items.reduce((result, item) => {
    const key = getKey(item);
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
}
