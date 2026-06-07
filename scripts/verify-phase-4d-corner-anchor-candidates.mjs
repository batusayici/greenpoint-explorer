import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import facadeEvidencePacket from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json" with { type: "json" };
import geometryValidationReport from "../src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json" with { type: "json" };
import manifest from "../src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json" with { type: "json" };

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureRepoPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json";
const fixturePath = resolve(repoRoot, fixtureRepoPath);
const facadeEvidencePacketPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json";
const geometryValidationReportPath =
  "src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json";
const manifestPath =
  "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";

const allowedCornerScopes = new Set(["manhattan_greenpoint", "franklin_greenpoint"]);
const requiredBlockedClaimLevels = [
  "level-5-tenant-at-address",
  "level-6-storefront-frontage",
  "level-7-entrance",
  "level-8-facade-signage-promotion",
  "level-9-special-treatment",
];
const requiredBlockedReasons = [
  "not-a-storefront-assignment",
  "not-a-tenant-frontage-assignment",
  "no-exact-frontage-order-or-width",
  "no-entrance-ownership-claim",
  "no-signage-material-color-or-active-status-claim",
  "no-production-runtime-use",
  "specific-evidence-to-geometry-container-association-unresolved",
];
const forbiddenFixtureStrings = [
  "3d tiles",
  "active_business_verified",
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
    console.log(`Wrote Phase 4D corner anchor candidates: ${fixturePath}`);
    return;
  }

  const actualText = await readFile(fixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Corner anchor candidate fixture does not match deterministic verifier output.");
  }

  validateFixture(actual, actualText, failures);

  if (failures.length) {
    throw new Error(`Phase 4D corner anchor candidates failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D corner anchor candidates verified (${actual.anchorCandidates.length} QA-only unresolved candidates; linked=${actual.summary.linkedCandidateCount}).`,
  );
}

function buildFixture() {
  const validationByObjectId = new Map(
    geometryValidationReport.buildingRecords.map((record) => [record.renderedObjectId, record]),
  );
  const buildingObjects = manifest.semanticObjects
    .filter((object) => object.type === "primitive-building-massing")
    .map((object) => ({
      object,
      validation: validationByObjectId.get(object.id),
      axisT: object.qa?.contextCoverage?.corridorAxisT,
      sideOffset: object.qa?.contextCoverage?.corridorSideOffset,
      corridorSide: object.qa?.contextCoverage?.corridorSide,
    }))
    .filter((entry) => Number.isFinite(entry.axisT) && entry.validation);

  const geometryCoverage = buildGeometryCoverage(buildingObjects);
  const eligibleEvidence = facadeEvidencePacket.records.filter(
    (record) => record.cornerScope?.scopeId === "manhattan_greenpoint",
  );
  const anchorCandidates = eligibleEvidence.map((record) => buildAnchorCandidate(record));

  return {
    schemaVersion: "phase-4d-corner-anchor-candidates.v0.1",
    fixtureId: "p4d-corner-anchor-candidates-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-5",
    reviewOnly: true,
    qaOnly: true,
    status: "qa-only-unresolved-corner-evidence-to-geometry-anchor-candidates",
    generatedFrom: {
      facadeEvidencePacketPath,
      geometryValidationReportPath,
      manifestPath,
      sourcePolicy: "corner-scoped-batu-supplied-project-owned-evidence-only-no-new-imagery",
    },
    scopeBoundary: {
      allowedCornerScopes: ["manhattan_greenpoint", "franklin_greenpoint"],
      blockedScope: "manhattan-to-franklin-mid-corridor",
      midCorridorFacadeEvidenceStatus: "blocked_insufficient_evidence",
      normalModeUse: "not-rendered",
      qaModeUse: "inspector-only-anchor-candidate-review",
      canCreateAuthoritativeStorefrontAnchors: false,
      canAssignTenantsToFrontages: false,
      canPromoteFacadeClaims: false,
      canPromoteEntranceClaims: false,
      canPromoteSignageClaims: false,
      canPromoteActiveStatusClaims: false,
    },
    geometryCoverage,
    summary: {
      evidenceRecordsByCornerScope: {
        manhattan_greenpoint: eligibleEvidence.length,
        franklin_greenpoint: facadeEvidencePacket.records.filter(
          (record) => record.cornerScope?.scopeId === "franklin_greenpoint",
        ).length,
        unresolved_unknown: facadeEvidencePacket.records.filter(
          (record) => record.cornerScope?.scopeId === "unresolved_unknown",
        ).length,
      },
      anchorCandidateCount: anchorCandidates.length,
      linkedCandidateCount: anchorCandidates.filter((candidate) => candidate.candidateGeometryContainerId).length,
      unresolvedCandidateCount: anchorCandidates.filter((candidate) => candidate.associationStatus === "unresolved").length,
      blockedCornerScopeCount: 1,
      midCorridorAnchorCandidateCount: 0,
      normalModeAnchorCandidateCount: 0,
      qaOnlyAnchorCandidateCount: anchorCandidates.length,
    },
    blockedCornerScopes: [
      {
        cornerScope: "franklin_greenpoint",
        status: "blocked_insufficient_evidence",
        reason:
          "Franklin Ave x Greenpoint Ave has deterministic endpoint geometry containers, but no eligible repo-local Batu-supplied/project-owned facade evidence record is present in the 4D-4 packet.",
        geometryCoverageStatus: geometryCoverage.franklin_greenpoint.status,
        candidateGeometryContainerIds: geometryCoverage.franklin_greenpoint.candidateGeometryContainers.map(
          (container) => container.renderedObjectId,
        ),
        qaOnly: true,
      },
    ],
    blockedClaimsPreserved: [
      "business-identity",
      "tenant-frontage",
      "storefront-anchor",
      "storefront-order",
      "frontage-width",
      "entrance-location",
      "entrance-ownership",
      "exact-facade-appearance",
      "signage",
      "material",
      "color",
      "active-status",
      "production-card",
      "normal-runtime-rendering",
    ],
    anchorCandidates,
  };
}

function buildGeometryCoverage(buildingObjects) {
  const franklin = buildingObjects
    .filter((entry) => entry.validation.gapAndBlockBreak?.endpointRole === "franklin-end-review-band")
    .sort((a, b) => a.axisT - b.axisT)
    .slice(0, 8)
    .map(toGeometryContainer);

  const manhattan = buildingObjects
    .slice()
    .sort((a, b) => b.axisT - a.axisT)
    .slice(0, 8)
    .sort((a, b) => a.axisT - b.axisT)
    .map(toGeometryContainer);

  return {
    manhattan_greenpoint: {
      status: manhattan.length ? "represented_by_deterministic_geometry_containers" : "blocked_no_geometry_container",
      method:
        "Runtime corridor guide labels the high-axis endpoint as Manhattan Ave; listed containers are the highest-axis rendered building containers from the manifest with 4D-1 confidence.",
      candidateGeometryContainers: manhattan,
      associationReadiness:
        "corner_geometry_present_specific_evidence_to_container_association_unresolved_manual_review_required",
    },
    franklin_greenpoint: {
      status: franklin.length ? "represented_by_deterministic_geometry_containers" : "blocked_no_geometry_container",
      method:
        "4D-1 validation marks these rendered building containers as the Franklin-end review band.",
      candidateGeometryContainers: franklin,
      associationReadiness:
        "corner_geometry_present_but_facade_evidence_missing_from_4d4_packet",
    },
    mid_corridor: {
      status: "blocked_insufficient_evidence",
      reason: "4D-5 authorizes only Manhattan and Franklin corner evidence. No mid-corridor facade evidence is present or indexed.",
    },
  };
}

function toGeometryContainer(entry) {
  return {
    renderedObjectId: entry.object.id,
    sourceRecordId: entry.object.sourceRecordId,
    geometryReferenceId: entry.object.geometryReference?.id ?? null,
    corridorSide: entry.corridorSide ?? entry.validation.corridorSide,
    sideOrderHint: {
      basis: "corridor-axis-t-and-side-offset",
      corridorAxisT: entry.axisT,
      corridorSideOffset: entry.sideOffset,
    },
    geometryConfidence: entry.validation.geometryConfidence?.label ?? "unknown",
    confidenceStatus: entry.validation.geometryConfidence?.status ?? "unknown",
  };
}

function buildAnchorCandidate(evidenceRecord) {
  return {
    anchorCandidateId: `p4d-corner-anchor-candidate-${evidenceRecord.evidenceId.replace("p4d-facade-evidence-", "")}`,
    cornerScope: evidenceRecord.cornerScope.scopeId,
    evidenceId: evidenceRecord.evidenceId,
    evidencePath: evidenceRecord.filePath,
    candidateGeometryContainerId: null,
    sideOrderHint: null,
    associationStatus: "unresolved",
    associationConfidence: "unresolved_corner_scope_only",
    supportedClaimLevel: "level-8-facade-signage-evidence-review-only",
    blockedClaimLevels: requiredBlockedClaimLevels,
    blockedReasons: requiredBlockedReasons,
    provenanceNotes: [
      evidenceRecord.captureProvenanceNotes,
      "Corner scope is known, but this batch does not have enough support to associate the evidence record with one specific rendered geometry container.",
    ],
    manualReviewNotes: [
      "Corner anchor candidate only. Not a storefront assignment.",
      "Manual Batu review is required before any evidence record can be linked to a specific geometry container.",
      "Do not infer business identity, active status, signage, entrance ownership, frontage width, storefront order, material, color, or exact facade truth.",
    ],
    qaOnly: true,
    normalModeUse: "not-rendered",
  };
}

function validateFixture(fixture, fixtureText, failures) {
  if (fixture.schemaVersion !== "phase-4d-corner-anchor-candidates.v0.1") {
    failures.push("Unexpected schemaVersion.");
  }
  if (fixture.phase !== "4D-5") failures.push("Fixture phase must be 4D-5.");
  if (fixture.reviewOnly !== true || fixture.qaOnly !== true) failures.push("Fixture must be review-only and QA-only.");
  if (fixture.scopeBoundary?.normalModeUse !== "not-rendered") failures.push("Normal mode must not render anchor candidates.");
  if (fixture.summary?.midCorridorAnchorCandidateCount !== 0) failures.push("Mid-corridor anchor candidate count must be zero.");
  if (fixture.summary?.normalModeAnchorCandidateCount !== 0) failures.push("Normal-mode anchor candidate count must be zero.");

  validateGeometryCoverage(fixture.geometryCoverage, failures);
  validateCandidates(fixture.anchorCandidates ?? [], failures);
  validateBlockedScopes(fixture.blockedCornerScopes ?? [], failures);
  validateForbiddenStrings(fixtureText, failures);
}

function validateGeometryCoverage(coverage, failures) {
  for (const scope of ["manhattan_greenpoint", "franklin_greenpoint"]) {
    const scopeCoverage = coverage?.[scope];
    if (!scopeCoverage) {
      failures.push(`Missing geometry coverage for ${scope}.`);
      continue;
    }
    const containers = scopeCoverage.candidateGeometryContainers ?? [];
    if (!containers.length) failures.push(`${scope} must report deterministic geometry containers or an explicit blocked status.`);
    for (const container of containers) {
      if (!geometryValidationReport.buildingRecords.some((record) => record.renderedObjectId === container.renderedObjectId)) {
        failures.push(`${scope} references unknown rendered object ${container.renderedObjectId}.`);
      }
      if (!["safe", "uncertain", "blocked"].includes(container.geometryConfidence)) {
        failures.push(`${container.renderedObjectId} has invalid geometry confidence ${container.geometryConfidence}.`);
      }
    }
  }
  if (coverage?.mid_corridor?.status !== "blocked_insufficient_evidence") {
    failures.push("Mid-corridor geometry coverage must remain blocked_insufficient_evidence.");
  }
}

function validateCandidates(candidates, failures) {
  const evidenceById = new Map(facadeEvidencePacket.records.map((record) => [record.evidenceId, record]));
  const seen = new Set();

  for (const candidate of candidates) {
    if (seen.has(candidate.anchorCandidateId)) failures.push(`Duplicate anchorCandidateId: ${candidate.anchorCandidateId}`);
    seen.add(candidate.anchorCandidateId);

    const evidence = evidenceById.get(candidate.evidenceId);
    if (!evidence) failures.push(`${candidate.anchorCandidateId} references missing evidence ${candidate.evidenceId}.`);
    if (!allowedCornerScopes.has(candidate.cornerScope)) failures.push(`${candidate.anchorCandidateId} has invalid corner scope.`);
    if (candidate.cornerScope !== "manhattan_greenpoint") {
      failures.push(`${candidate.anchorCandidateId} is not scoped to the only evidenced 4D-5 corner.`);
    }
    if (evidence && evidence.cornerScope?.scopeId !== candidate.cornerScope) {
      failures.push(`${candidate.anchorCandidateId} corner scope does not match evidence record.`);
    }
    if (candidate.qaOnly !== true) failures.push(`${candidate.anchorCandidateId} must be QA-only.`);
    if (candidate.normalModeUse !== "not-rendered") failures.push(`${candidate.anchorCandidateId} must not render in normal mode.`);
    if (candidate.candidateGeometryContainerId !== null) {
      failures.push(`${candidate.anchorCandidateId} must remain unresolved; 4D-5 must not force a geometry association.`);
    }
    if (candidate.associationStatus !== "unresolved") failures.push(`${candidate.anchorCandidateId} must remain unresolved.`);
    if (candidate.supportedClaimLevel !== "level-8-facade-signage-evidence-review-only") {
      failures.push(`${candidate.anchorCandidateId} has unsupported claim level.`);
    }
    for (const level of requiredBlockedClaimLevels) {
      if (!candidate.blockedClaimLevels?.includes(level)) failures.push(`${candidate.anchorCandidateId} missing ${level}.`);
    }
    for (const reason of requiredBlockedReasons) {
      if (!candidate.blockedReasons?.includes(reason)) failures.push(`${candidate.anchorCandidateId} missing ${reason}.`);
    }
  }
}

function validateBlockedScopes(blockedScopes, failures) {
  const franklin = blockedScopes.find((scope) => scope.cornerScope === "franklin_greenpoint");
  if (!franklin) failures.push("Franklin corner blocked scope record is required.");
  if (franklin?.status !== "blocked_insufficient_evidence") failures.push("Franklin corner must remain blocked_insufficient_evidence.");
  if (franklin?.qaOnly !== true) failures.push("Franklin blocked scope must be QA-only.");
}

function validateForbiddenStrings(text, failures) {
  const lower = text.toLowerCase();
  for (const forbidden of forbiddenFixtureStrings) {
    if (lower.includes(forbidden)) failures.push(`Fixture contains forbidden source or promotion string: ${forbidden}`);
  }
}
