import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import manualAssociationReview from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-manual-corner-association-review.v0.1.json" with { type: "json" };

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureRepoPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-provisional-corner-association-shortlist.v0.1.json";
const fixturePath = resolve(repoRoot, fixtureRepoPath);
const manualAssociationReviewFixturePath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-manual-corner-association-review.v0.1.json";

const allowedCornerScopes = new Set(["manhattan_greenpoint", "franklin_greenpoint"]);
const requiredBlockedClaims = [
  "authoritative-evidence-to-geometry-association",
  "storefront-anchor",
  "tenant-frontage",
  "business-identity",
  "exact-frontage-order",
  "exact-frontage-width",
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
  "visual-facade-generation",
  "mid-corridor-inference",
];
const requiredFalseFlags = [
  "approvedAssociationCreated",
  "authoritativeAssociationCreated",
  "storefrontAnchorCreated",
  "tenantFrontageAssignmentCreated",
  "businessIdentityAssignmentCreated",
  "facadeClaimCreated",
  "signageClaimCreated",
  "entranceClaimCreated",
  "materialClaimCreated",
  "colorClaimCreated",
  "activeStatusClaimCreated",
  "exactAddressPlacementClaimCreated",
  "normalRuntimeRenderingChanged",
  "productionAssetCreated",
];
const endpointDirectionByScope = {
  manhattan_greenpoint: "high-axis",
  franklin_greenpoint: "low-axis",
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const expected = buildFixture();
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`;

  if (process.argv.includes("--write")) {
    await writeFile(fixturePath, expectedText, "utf8");
    console.log(`Wrote Phase 4D-8 provisional corner association shortlist: ${fixturePath}`);
    return;
  }

  const actualText = await readFile(fixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Provisional corner association shortlist fixture does not match deterministic verifier output.");
  }

  validateFixture(actual, failures);

  if (failures.length) {
    throw new Error(`Phase 4D-8 provisional corner association shortlist failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D-8 provisional corner association shortlist verified (${actual.shortlistRecords.length} records; approved=0; authoritative=0; mid-corridor=0).`,
  );
}

function buildFixture() {
  const reviewRecords = manualAssociationReview.reviewRecords
    .filter((record) => allowedCornerScopes.has(record.cornerScope))
    .slice()
    .sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
  const shortlistRecords = reviewRecords.map(buildShortlistRecord);
  const candidateEntryCount = shortlistRecords.reduce((sum, record) => sum + record.candidateGeometryContainers.length, 0);
  const primaryCandidateEntryCount = shortlistRecords.reduce(
    (sum, record) =>
      sum + record.candidateGeometryContainers.filter((candidate) => candidate.shortlistRole === "primary_provisional_review_candidate").length,
    0,
  );

  return {
    schemaVersion: "phase-4d-provisional-corner-association-shortlist.v0.1",
    fixtureId: "p4d-provisional-corner-association-shortlist-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-8",
    reviewOnly: true,
    qaOnly: true,
    status: "qa-only-provisional-corner-geometry-association-shortlist",
    generatedFrom: {
      manualAssociationReviewFixturePath,
      sourcePolicy:
        "existing-4d-7-review-records-and-existing-deterministic-geometry-containers-only-no-image-inspection-no-new-sources",
    },
    scopeBoundary: {
      allowedCornerScopes: ["manhattan_greenpoint", "franklin_greenpoint"],
      franklinScope: "franklin_greenpoint-only",
      blockedScope: "manhattan-to-franklin-mid-corridor",
      midCorridorFacadeEvidenceStatus: "blocked_insufficient_evidence",
      normalModeUse: "not-rendered",
      qaModeUse: "manual-review-shortlist-only",
      canApproveAssociations: false,
      canCreateAuthoritativeAssociations: false,
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
      canCreateProductionAssets: false,
      canAffectRuntimeRendering: false,
    },
    shortlistMethod: {
      evidenceSignal:
        "Evidence records inherit only 4D-7 corner scope plus direction words from existing evidence IDs and repo-local paths.",
      geometrySignal:
        "Candidate containers inherit only 4D-7 deterministic corner geometry coverage, corridorAxisT endpoint proximity, corridorSideOffset, and 4D-1 geometry confidence.",
      primaryCandidateRule:
        "For each evidence record, the three same-corner containers nearest that corner endpoint by corridorAxisT are marked as primary provisional review candidates when their geometry confidence is safe or uncertain.",
      limitation:
        "Primary means review priority only. It is not a selected, linked, approved, authoritative, storefront, tenant, facade, signage, entrance, material, color, active-status, address-placement, runtime, or production claim.",
    },
    summary: {
      evidenceRecordsByCornerScope: {
        manhattan_greenpoint: shortlistRecords.filter((record) => record.cornerScope === "manhattan_greenpoint").length,
        franklin_greenpoint: shortlistRecords.filter((record) => record.cornerScope === "franklin_greenpoint").length,
        unresolved_unknown: 0,
      },
      shortlistRecordCount: shortlistRecords.length,
      candidateEntryCount,
      primaryCandidateEntryCount,
      secondaryPossibleContainerCount: shortlistRecords.reduce(
        (sum, record) => sum + record.deferredPossibleGeometryContainerIds.length,
        0,
      ),
      provisionalAssociationCount: shortlistRecords.length,
      selectedAssociationCount: 0,
      approvedAssociationCount: 0,
      authoritativeAssociationCount: 0,
      authoritativeAnchorCount: 0,
      storefrontAnchorCount: 0,
      tenantFrontageAssignmentCount: 0,
      promotedClaimCount: 0,
      normalModeRecordCount: 0,
      midCorridorAssociationCandidateCount: 0,
    },
    blockedClaimsPreserved: requiredBlockedClaims,
    shortlistRecords,
  };
}

function buildShortlistRecord(reviewRecord) {
  const rankedContainers = rankContainersForScope(reviewRecord.cornerScope, reviewRecord.possibleGeometryContainers);
  const candidateContainers = rankedContainers.slice(0, 3).map((container, index) =>
    buildCandidateEntry(reviewRecord, container, index),
  );
  const directionHint = extractDirectionHint(reviewRecord);

  return {
    shortlistRecordId: `p4d-provisional-shortlist-${reviewRecord.evidenceId.replace("p4d-facade-evidence-", "")}`,
    sourceAssociationReviewId: reviewRecord.associationReviewId,
    cornerScope: reviewRecord.cornerScope,
    evidenceId: reviewRecord.evidenceId,
    evidencePath: reviewRecord.evidencePath,
    evidenceDirectionHint: directionHint,
    associationStatus: "provisional_shortlist_review_only",
    selectedGeometryContainerId: null,
    approvedGeometryContainerId: null,
    authoritativeGeometryContainerId: null,
    candidateGeometryContainers: candidateContainers,
    primaryCandidateContainerIds: candidateContainers.map((candidate) => candidate.renderedObjectId),
    deferredPossibleGeometryContainerIds: rankedContainers.slice(3).map((container) => container.renderedObjectId),
    confidence: "medium_provisional_review_priority_only",
    rationale: [
      `Evidence record is already scoped to ${reviewRecord.cornerScope} by the 4D-7 review packet.`,
      `Candidate containers are same-corner deterministic geometry from ${manualAssociationReviewFixturePath}.`,
      `Primary candidates are nearest the ${endpointDirectionByScope[reviewRecord.cornerScope]} endpoint by corridorAxisT.`,
      "No image content was interpreted and no external source was used.",
    ],
    uncertaintyNotes: [
      "Direction words in evidence filenames are manual review hints only, not geometry bindings.",
      "corridorSide and corridorSideOffset do not prove cardinal corner, tenant frontage, facade, entrance, or storefront order.",
      "Manual Batu review is required before any single candidate can be selected, linked, or approved.",
    ],
    manualReviewPrompt:
      "Check whether the evidence frame and one of the provisional candidate containers describe the same physical corner area before authorizing any later association batch.",
    reviewOnly: true,
    qaOnly: true,
    normalModeUse: "not-rendered",
    blockedClaimsPreserved: requiredBlockedClaims,
    claimCreationFlags: Object.fromEntries(requiredFalseFlags.map((flag) => [flag, false])),
  };
}

function buildCandidateEntry(reviewRecord, container, index) {
  return {
    renderedObjectId: container.renderedObjectId,
    sourceRecordId: container.sourceRecordId,
    geometryReferenceId: container.geometryReferenceId,
    corridorSide: container.corridorSide,
    sideOrderHint: container.sideOrderHint,
    geometryConfidence: container.geometryConfidence,
    confidenceStatus: container.confidenceStatus,
    shortlistRole: "primary_provisional_review_candidate",
    rank: index + 1,
    associationConfidence:
      container.geometryConfidence === "safe"
        ? "medium_provisional_same_corner_endpoint_geometry"
        : "low_provisional_geometry_requires_review",
    rationale: [
      `Container belongs to the same ${reviewRecord.cornerScope} possible-container set from 4D-7.`,
      `Container is rank ${index + 1} by deterministic endpoint proximity for ${reviewRecord.cornerScope}.`,
      `Geometry confidence is ${container.geometryConfidence}.`,
    ],
    uncertaintyNotes: [
      "Not selected, linked, approved, or authoritative.",
      "Does not assign a tenant, storefront, frontage, facade, signage, entrance, material, color, active status, or exact address placement.",
    ],
  };
}

function rankContainersForScope(cornerScope, containers) {
  const sorted = containers.slice().sort((a, b) => {
    const axisA = a.sideOrderHint?.corridorAxisT;
    const axisB = b.sideOrderHint?.corridorAxisT;
    if (!Number.isFinite(axisA) || !Number.isFinite(axisB)) return a.renderedObjectId.localeCompare(b.renderedObjectId);
    if (cornerScope === "manhattan_greenpoint") return axisB - axisA;
    return axisA - axisB;
  });

  return sorted;
}

function extractDirectionHint(reviewRecord) {
  const source = `${reviewRecord.evidenceId} ${reviewRecord.evidencePath}`.toLowerCase();
  const direction =
    ["northwest", "northeast", "southeast", "southwest"].find((token) => source.includes(token)) ?? "unresolved";

  return {
    direction,
    source: "existing-evidence-id-and-file-path-label",
    status: direction === "unresolved" ? "unresolved_label_only" : "label_only_manual_review_hint",
    limitation: "Not translated into corridorSide or authoritative geometry selection.",
  };
}

function validateFixture(fixture, failures) {
  if (fixture.schemaVersion !== "phase-4d-provisional-corner-association-shortlist.v0.1") {
    failures.push("Unexpected schemaVersion.");
  }
  if (fixture.phase !== "4D-8") failures.push("Fixture phase must be 4D-8.");
  if (fixture.reviewOnly !== true || fixture.qaOnly !== true) failures.push("Fixture must be review-only and QA-only.");
  if (fixture.status !== "qa-only-provisional-corner-geometry-association-shortlist") {
    failures.push("Fixture status must remain provisional shortlist review.");
  }

  validateBoundary(fixture.scopeBoundary, failures);
  validateSummary(fixture.summary, failures);
  validateShortlistRecords(fixture.shortlistRecords ?? [], failures);
}

function validateBoundary(boundary, failures) {
  if (boundary?.franklinScope !== "franklin_greenpoint-only") failures.push("Franklin must remain scoped only to franklin_greenpoint.");
  if (boundary?.midCorridorFacadeEvidenceStatus !== "blocked_insufficient_evidence") {
    failures.push("Mid-corridor must remain blocked_insufficient_evidence.");
  }
  if (boundary?.normalModeUse !== "not-rendered") failures.push("Normal mode must remain not-rendered.");

  for (const key of [
    "canApproveAssociations",
    "canCreateAuthoritativeAssociations",
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
    "canCreateProductionAssets",
    "canAffectRuntimeRendering",
  ]) {
    if (boundary?.[key] !== false) failures.push(`scopeBoundary.${key} must be false.`);
  }
}

function validateSummary(summary, failures) {
  const expected = [
    ["shortlistRecordCount", 22],
    ["candidateEntryCount", 66],
    ["primaryCandidateEntryCount", 66],
    ["secondaryPossibleContainerCount", 110],
    ["provisionalAssociationCount", 22],
    ["selectedAssociationCount", 0],
    ["approvedAssociationCount", 0],
    ["authoritativeAssociationCount", 0],
    ["authoritativeAnchorCount", 0],
    ["storefrontAnchorCount", 0],
    ["tenantFrontageAssignmentCount", 0],
    ["promotedClaimCount", 0],
    ["normalModeRecordCount", 0],
    ["midCorridorAssociationCandidateCount", 0],
  ];

  if (summary?.evidenceRecordsByCornerScope?.manhattan_greenpoint !== 11) failures.push("Manhattan evidence count must be 11.");
  if (summary?.evidenceRecordsByCornerScope?.franklin_greenpoint !== 11) failures.push("Franklin evidence count must be 11.");
  if (summary?.evidenceRecordsByCornerScope?.unresolved_unknown !== 0) failures.push("Unresolved evidence count must be 0.");

  for (const [key, value] of expected) {
    if (summary?.[key] !== value) failures.push(`summary.${key} must be ${value}.`);
  }
}

function validateShortlistRecords(records, failures) {
  const sourceRecordsById = new Map(manualAssociationReview.reviewRecords.map((record) => [record.associationReviewId, record]));
  const seen = new Set();

  if (records.length !== 22) failures.push(`Expected 22 shortlist records, found ${records.length}.`);

  for (const record of records) {
    if (seen.has(record.shortlistRecordId)) failures.push(`Duplicate shortlistRecordId: ${record.shortlistRecordId}`);
    seen.add(record.shortlistRecordId);

    const source = sourceRecordsById.get(record.sourceAssociationReviewId);
    if (!source) failures.push(`${record.shortlistRecordId} references missing 4D-7 review record.`);
    if (!allowedCornerScopes.has(record.cornerScope)) failures.push(`${record.shortlistRecordId} has invalid cornerScope.`);
    if (source?.cornerScope !== record.cornerScope) failures.push(`${record.shortlistRecordId} cornerScope does not match 4D-7 source.`);
    if (record.cornerScope === "franklin_greenpoint" && !record.evidencePath.includes("greenpoint franklin  corner")) {
      failures.push(`${record.shortlistRecordId} Franklin record must remain in the Franklin corner evidence folder.`);
    }

    if (record.associationStatus !== "provisional_shortlist_review_only") {
      failures.push(`${record.shortlistRecordId} must remain provisional_shortlist_review_only.`);
    }
    if (record.selectedGeometryContainerId !== null) failures.push(`${record.shortlistRecordId} must not select a container.`);
    if (record.approvedGeometryContainerId !== null) failures.push(`${record.shortlistRecordId} must not approve a container.`);
    if (record.authoritativeGeometryContainerId !== null) failures.push(`${record.shortlistRecordId} must not set authoritative container.`);
    if (record.reviewOnly !== true || record.qaOnly !== true) failures.push(`${record.shortlistRecordId} must be review-only and QA-only.`);
    if (record.normalModeUse !== "not-rendered") failures.push(`${record.shortlistRecordId} must not render in normal mode.`);

    for (const claim of requiredBlockedClaims) {
      if (!record.blockedClaimsPreserved?.includes(claim)) failures.push(`${record.shortlistRecordId} missing blocked claim ${claim}.`);
    }
    for (const flag of requiredFalseFlags) {
      if (record.claimCreationFlags?.[flag] !== false) failures.push(`${record.shortlistRecordId} claim flag ${flag} must be false.`);
    }

    const scopeContainers = new Set((source?.possibleGeometryContainers ?? []).map((container) => container.renderedObjectId));
    const candidateIds = record.candidateGeometryContainers?.map((candidate) => candidate.renderedObjectId) ?? [];
    if (candidateIds.length !== 3) failures.push(`${record.shortlistRecordId} must list exactly 3 primary provisional candidates.`);
    if (record.primaryCandidateContainerIds?.length !== 3) failures.push(`${record.shortlistRecordId} must expose 3 primary candidate ids.`);
    if (record.deferredPossibleGeometryContainerIds?.length !== 5) {
      failures.push(`${record.shortlistRecordId} must preserve 5 deferred possible container ids.`);
    }

    for (const candidate of record.candidateGeometryContainers ?? []) {
      if (!scopeContainers.has(candidate.renderedObjectId)) failures.push(`${record.shortlistRecordId} references outside-scope container.`);
      if (candidate.shortlistRole !== "primary_provisional_review_candidate") {
        failures.push(`${record.shortlistRecordId} candidate ${candidate.renderedObjectId} must be primary provisional only.`);
      }
      if (!["safe", "uncertain"].includes(candidate.geometryConfidence)) {
        failures.push(`${record.shortlistRecordId} candidate ${candidate.renderedObjectId} has invalid confidence.`);
      }
    }

    for (const deferredId of record.deferredPossibleGeometryContainerIds ?? []) {
      if (!scopeContainers.has(deferredId)) failures.push(`${record.shortlistRecordId} defers outside-scope container ${deferredId}.`);
      if (candidateIds.includes(deferredId)) failures.push(`${record.shortlistRecordId} duplicates candidate and deferred id ${deferredId}.`);
    }
  }
}
