import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import anchorCandidateFixture from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json" with { type: "json" };
import facadeEvidencePacket from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json" with { type: "json" };

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureRepoPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-manual-corner-association-review.v0.1.json";
const fixturePath = resolve(repoRoot, fixtureRepoPath);
const facadeEvidencePacketPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json";
const anchorCandidateFixturePath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json";

const allowedCornerScopes = new Set(["manhattan_greenpoint", "franklin_greenpoint"]);
const requiredBlockedClaimLevels = [
  "level-5-tenant-at-address",
  "level-6-storefront-frontage",
  "level-7-entrance",
  "level-8-facade-signage-promotion",
  "level-9-special-treatment",
];
const requiredBlockedReasons = [
  "not-an-authoritative-anchor",
  "not-a-storefront-assignment",
  "not-a-tenant-frontage-assignment",
  "no-exact-frontage-order-or-width",
  "no-entrance-ownership-claim",
  "no-signage-material-color-or-active-status-claim",
  "no-production-runtime-use",
  "possible-container-set-only",
  "specific-evidence-to-geometry-container-association-unresolved",
];
const forbiddenFixtureStrings = [
  "3d tiles",
  "active_business_verified",
  "approved_association",
  "authoritative_anchor",
  "facade_claim_approved",
  "frontage_verified",
  "google",
  "liveapi",
  "production_card",
  "scrape",
  "street view",
  "storefront_anchor",
  "tenant_frontage_verified",
];

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const expected = buildFixture();
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`;

  if (process.argv.includes("--write")) {
    await writeFile(fixturePath, expectedText, "utf8");
    console.log(`Wrote Phase 4D-7 manual corner association review: ${fixturePath}`);
    return;
  }

  const actualText = await readFile(fixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Manual corner association review fixture does not match deterministic verifier output.");
  }

  validateFixture(actual, actualText, failures);

  if (failures.length) {
    throw new Error(`Phase 4D-7 manual corner association review failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D-7 manual corner association review verified (${actual.reviewRecords.length} provisional records; approved=0; linked=0).`,
  );
}

function buildFixture() {
  const eligibleEvidence = facadeEvidencePacket.records
    .filter((record) => allowedCornerScopes.has(record.cornerScope?.scopeId))
    .slice()
    .sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
  const reviewRecords = eligibleEvidence.map(buildReviewRecord);

  return {
    schemaVersion: "phase-4d-manual-corner-association-review.v0.1",
    fixtureId: "p4d-manual-corner-association-review-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-7",
    reviewOnly: true,
    qaOnly: true,
    status: "qa-only-provisional-manual-evidence-to-geometry-association-review",
    generatedFrom: {
      facadeEvidencePacketPath,
      anchorCandidateFixturePath,
      sourcePolicy: "existing-corner-scoped-batu-supplied-evidence-and-existing-deterministic-geometry-only",
    },
    scopeBoundary: {
      allowedCornerScopes: ["manhattan_greenpoint", "franklin_greenpoint"],
      blockedScope: "manhattan-to-franklin-mid-corridor",
      midCorridorFacadeEvidenceStatus: "blocked_insufficient_evidence",
      normalModeUse: "not-rendered",
      qaModeUse: "manual-review-packet-only",
      canCreateAuthoritativeAnchors: false,
      canCreateStorefrontAnchors: false,
      canAssignTenantsToFrontages: false,
      canPromoteBusinessIdentityClaims: false,
      canPromoteFacadeClaims: false,
      canPromoteEntranceClaims: false,
      canPromoteSignageClaims: false,
      canPromoteMaterialColorClaims: false,
      canPromoteActiveStatusClaims: false,
      canPromoteExactAddressClaims: false,
      canCreateProductionCards: false,
      canAffectRuntimeRendering: false,
    },
    geometryCoverage: anchorCandidateFixture.geometryCoverage,
    summary: {
      evidenceRecordsByCornerScope: {
        manhattan_greenpoint: eligibleEvidence.filter((record) => record.cornerScope?.scopeId === "manhattan_greenpoint").length,
        franklin_greenpoint: eligibleEvidence.filter((record) => record.cornerScope?.scopeId === "franklin_greenpoint").length,
        unresolved_unknown: facadeEvidencePacket.records.filter((record) => record.cornerScope?.scopeId === "unresolved_unknown").length,
      },
      possibleGeometryContainerCountByCornerScope: {
        manhattan_greenpoint: getPossibleContainers("manhattan_greenpoint").length,
        franklin_greenpoint: getPossibleContainers("franklin_greenpoint").length,
        mid_corridor: 0,
      },
      reviewRecordCount: reviewRecords.length,
      provisionalAssociationReviewCount: reviewRecords.length,
      selectedAssociationCount: 0,
      approvedAssociationCount: 0,
      linkedAssociationCount: 0,
      authoritativeAnchorCount: 0,
      storefrontAnchorCount: 0,
      tenantFrontageAssignmentCount: 0,
      promotedClaimCount: 0,
      normalModeRecordCount: 0,
      midCorridorAssociationCandidateCount: 0,
    },
    blockedClaimsPreserved: [
      "business-identity",
      "tenant-frontage",
      "storefront-anchor",
      "storefront-order",
      "frontage-width",
      "entrance-location",
      "entrance-ownership",
      "exact-address-placement",
      "exact-facade-appearance",
      "signage",
      "material",
      "color",
      "active-status",
      "production-card",
      "normal-runtime-rendering",
      "visual-facade-cue-production",
    ],
    reviewRecords,
  };
}

function buildReviewRecord(evidenceRecord) {
  const cornerScope = evidenceRecord.cornerScope.scopeId;
  const possibleContainers = getPossibleContainers(cornerScope);

  return {
    associationReviewId: `p4d-manual-association-review-${evidenceRecord.evidenceId.replace("p4d-facade-evidence-", "")}`,
    cornerScope,
    evidenceId: evidenceRecord.evidenceId,
    evidencePath: evidenceRecord.filePath,
    evidenceUsageRightsStatus: evidenceRecord.usageRightsStatus,
    possibleGeometryContainers: possibleContainers.map((container) => ({
      renderedObjectId: container.renderedObjectId,
      sourceRecordId: container.sourceRecordId,
      geometryReferenceId: container.geometryReferenceId,
      corridorSide: container.corridorSide,
      sideOrderHint: container.sideOrderHint,
      geometryConfidence: container.geometryConfidence,
      confidenceStatus: container.confidenceStatus,
      plausibilityBasis:
        "Existing deterministic corner geometry for this corner scope only; not a specific evidence-to-container match.",
    })),
    selectedGeometryContainerId: null,
    approvedGeometryContainerId: null,
    associationStatus: "provisional_unresolved_review_only",
    associationConfidence: "corner_scope_possible_container_set_only",
    supportedClaimLevel: "level-8-facade-signage-evidence-review-only",
    blockedClaimLevels: requiredBlockedClaimLevels,
    blockedReasons: requiredBlockedReasons,
    reviewOnly: true,
    qaOnly: true,
    normalModeUse: "not-rendered",
    authoritativeAnchorCreated: false,
    storefrontAnchorCreated: false,
    tenantFrontageAssignmentCreated: false,
    promotedClaimsCreated: false,
    manualReviewNotes: [
      "Possible container set only. Not an approved evidence-to-geometry association.",
      "Manual Batu review is required before selecting or approving any specific geometry container.",
      "Do not infer business identity, active status, signage, entrance ownership, frontage width, storefront order, material, color, exact address placement, exact facade truth, production-card readiness, or runtime rendering.",
    ],
  };
}

function getPossibleContainers(cornerScope) {
  return anchorCandidateFixture.geometryCoverage?.[cornerScope]?.candidateGeometryContainers ?? [];
}

function validateFixture(fixture, fixtureText, failures) {
  if (fixture.schemaVersion !== "phase-4d-manual-corner-association-review.v0.1") failures.push("Unexpected schemaVersion.");
  if (fixture.phase !== "4D-7") failures.push("Fixture phase must be 4D-7.");
  if (fixture.reviewOnly !== true || fixture.qaOnly !== true) failures.push("Fixture must be review-only and QA-only.");
  if (fixture.status !== "qa-only-provisional-manual-evidence-to-geometry-association-review") {
    failures.push("Fixture status must remain provisional manual review.");
  }

  validateScopeBoundary(fixture.scopeBoundary, failures);
  validateSummary(fixture.summary, failures);
  validateGeometryCoverage(fixture.geometryCoverage, failures);
  validateReviewRecords(fixture.reviewRecords ?? [], failures);
  validateForbiddenStrings(fixtureText, failures);
}

function validateScopeBoundary(boundary, failures) {
  if (boundary?.normalModeUse !== "not-rendered") failures.push("Normal mode must remain not-rendered.");
  if (boundary?.midCorridorFacadeEvidenceStatus !== "blocked_insufficient_evidence") {
    failures.push("Mid-corridor must remain blocked_insufficient_evidence.");
  }

  for (const key of [
    "canCreateAuthoritativeAnchors",
    "canCreateStorefrontAnchors",
    "canAssignTenantsToFrontages",
    "canPromoteBusinessIdentityClaims",
    "canPromoteFacadeClaims",
    "canPromoteEntranceClaims",
    "canPromoteSignageClaims",
    "canPromoteMaterialColorClaims",
    "canPromoteActiveStatusClaims",
    "canPromoteExactAddressClaims",
    "canCreateProductionCards",
    "canAffectRuntimeRendering",
  ]) {
    if (boundary?.[key] !== false) failures.push(`scopeBoundary.${key} must be false.`);
  }
}

function validateSummary(summary, failures) {
  if (summary?.evidenceRecordsByCornerScope?.manhattan_greenpoint !== 11) failures.push("Manhattan evidence count must be 11.");
  if (summary?.evidenceRecordsByCornerScope?.franklin_greenpoint !== 11) failures.push("Franklin evidence count must be 11.");
  if (summary?.possibleGeometryContainerCountByCornerScope?.manhattan_greenpoint !== 8) {
    failures.push("Manhattan possible geometry container count must be 8.");
  }
  if (summary?.possibleGeometryContainerCountByCornerScope?.franklin_greenpoint !== 8) {
    failures.push("Franklin possible geometry container count must be 8.");
  }

  for (const [key, expected] of [
    ["reviewRecordCount", 22],
    ["provisionalAssociationReviewCount", 22],
    ["selectedAssociationCount", 0],
    ["approvedAssociationCount", 0],
    ["linkedAssociationCount", 0],
    ["authoritativeAnchorCount", 0],
    ["storefrontAnchorCount", 0],
    ["tenantFrontageAssignmentCount", 0],
    ["promotedClaimCount", 0],
    ["normalModeRecordCount", 0],
    ["midCorridorAssociationCandidateCount", 0],
  ]) {
    if (summary?.[key] !== expected) failures.push(`summary.${key} must be ${expected}.`);
  }
}

function validateGeometryCoverage(coverage, failures) {
  for (const scope of ["manhattan_greenpoint", "franklin_greenpoint"]) {
    const containers = coverage?.[scope]?.candidateGeometryContainers ?? [];
    if (containers.length !== 8) failures.push(`${scope} must expose 8 possible geometry containers.`);
  }
  if (coverage?.mid_corridor?.status !== "blocked_insufficient_evidence") {
    failures.push("Mid-corridor geometry coverage must remain blocked_insufficient_evidence.");
  }
}

function validateReviewRecords(records, failures) {
  const evidenceById = new Map(facadeEvidencePacket.records.map((record) => [record.evidenceId, record]));
  const seen = new Set();

  if (records.length !== 22) failures.push(`Expected 22 review records, found ${records.length}.`);

  for (const record of records) {
    if (seen.has(record.associationReviewId)) failures.push(`Duplicate associationReviewId: ${record.associationReviewId}`);
    seen.add(record.associationReviewId);

    const evidence = evidenceById.get(record.evidenceId);
    if (!evidence) failures.push(`${record.associationReviewId} references missing evidence ${record.evidenceId}.`);
    if (!allowedCornerScopes.has(record.cornerScope)) failures.push(`${record.associationReviewId} has invalid cornerScope.`);
    if (evidence?.cornerScope?.scopeId !== record.cornerScope) failures.push(`${record.associationReviewId} scope does not match evidence.`);
    if (record.cornerScope === "franklin_greenpoint" && evidence?.cornerScope?.notCorridorWideEvidence !== true) {
      failures.push(`${record.associationReviewId} must keep Franklin evidence corner-only.`);
    }
    if (record.selectedGeometryContainerId !== null) failures.push(`${record.associationReviewId} must not select a geometry container.`);
    if (record.approvedGeometryContainerId !== null) failures.push(`${record.associationReviewId} must not approve a geometry container.`);
    if (record.associationStatus !== "provisional_unresolved_review_only") {
      failures.push(`${record.associationReviewId} must remain provisional_unresolved_review_only.`);
    }
    if (record.reviewOnly !== true || record.qaOnly !== true) failures.push(`${record.associationReviewId} must be review-only and QA-only.`);
    if (record.normalModeUse !== "not-rendered") failures.push(`${record.associationReviewId} must not render in normal mode.`);
    if (record.authoritativeAnchorCreated !== false) failures.push(`${record.associationReviewId} must not create an authoritative anchor.`);
    if (record.storefrontAnchorCreated !== false) failures.push(`${record.associationReviewId} must not create a storefront anchor.`);
    if (record.tenantFrontageAssignmentCreated !== false) failures.push(`${record.associationReviewId} must not create tenant frontage assignment.`);
    if (record.promotedClaimsCreated !== false) failures.push(`${record.associationReviewId} must not promote claims.`);
    if (record.supportedClaimLevel !== "level-8-facade-signage-evidence-review-only") {
      failures.push(`${record.associationReviewId} has unsupported claim level.`);
    }

    const possibleContainers = record.possibleGeometryContainers ?? [];
    if (possibleContainers.length !== 8) failures.push(`${record.associationReviewId} must carry 8 possible corner containers.`);
    const scopeContainers = new Set(getPossibleContainers(record.cornerScope).map((container) => container.renderedObjectId));
    for (const container of possibleContainers) {
      if (!scopeContainers.has(container.renderedObjectId)) {
        failures.push(`${record.associationReviewId} references geometry outside its corner scope.`);
      }
      if (!["safe", "uncertain", "blocked"].includes(container.geometryConfidence)) {
        failures.push(`${record.associationReviewId} has invalid geometry confidence ${container.geometryConfidence}.`);
      }
    }

    for (const level of requiredBlockedClaimLevels) {
      if (!record.blockedClaimLevels?.includes(level)) failures.push(`${record.associationReviewId} missing ${level}.`);
    }
    for (const reason of requiredBlockedReasons) {
      if (!record.blockedReasons?.includes(reason)) failures.push(`${record.associationReviewId} missing ${reason}.`);
    }
  }
}

function validateForbiddenStrings(text, failures) {
  const lower = text.toLowerCase();
  for (const forbidden of forbiddenFixtureStrings) {
    if (lower.includes(forbidden)) failures.push(`Fixture contains forbidden source or promotion string: ${forbidden}`);
  }
}
