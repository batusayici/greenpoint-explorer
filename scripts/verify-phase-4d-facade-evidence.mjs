import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureRepoPath =
  "src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json";
const fixturePath = resolve(repoRoot, fixtureRepoPath);
const claimContractPath = "docs/phase-4d-claim-ladder-matching-contract.md";

const eligibleRecords = [
  ["p4d-facade-evidence-nw-grillpoint-closeup", "docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected local field-photo reference with iPhone 15 Pro metadata dated 2026-05-30. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-nw-grillpoint-facade", "docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as a local reference normalized to readable JPG after earlier review. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-nw-grillpoint-wide", "docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as a local reference normalized to readable JPG after earlier review. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-nw-subway-context", "docs/mvp-reference-images/northwest-subwayA.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as a local station-area context reference normalized to readable JPG after earlier review. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-ne-mcdonalds-closeup", "docs/mvp-reference-images/northeast-mcdonalds-closeup.jpeg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected local field-photo reference with iPhone 15 Pro metadata. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-ne-mcdonalds-facade", "docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable JPG export from the local reference set. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-ne-mcdonalds-wide", "docs/mvp-reference-images/northeast-mcdonalds-wide.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable JPG export from the local reference set. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-se-citizens-facade-a", "docs/mvp-reference-images/southeast-citizens-facadeA.jpeg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable local reference. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-se-citizens-facade-b", "docs/mvp-reference-images/southeast-citizens-facadeB.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable JPG export from the local reference set. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-se-citizens-wide", "docs/mvp-reference-images/southeast-citizens-wide.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable JPG export from the local reference set. Use remains review-only until Batu confirms rights and intended use for a later batch."],
  ["p4d-facade-evidence-se-subway-context", "docs/mvp-reference-images/southeast-subwayB.jpg", "manhattan_greenpoint", "Manhattan Ave x Greenpoint Ave", "Prior repo docs record this as an inspected readable JPG export from the local reference set. Use remains review-only until Batu confirms rights and intended use for a later batch."],
];

const allowedUse = [
  "facade-evidence-review",
  "provenance-review",
  "future-manual-review-input-if-batu-approves",
];

const disallowedUse = [
  "normal-runtime-rendering",
  "production-asset-use",
  "asset-generation-input",
  "texture-extraction",
  "tracing",
  "storefront-anchor-creation",
  "tenant-frontage-assignment",
  "exact-facade-or-signage-claim",
];

const requiredBlockedClaims = [
  "active-status-finality",
  "business-storefront-anchor",
  "exact-address-placement",
  "exact-entrance-location",
  "exact-facade-appearance",
  "exact-facade-color",
  "exact-facade-material",
  "exact-frontage-order",
  "exact-signage-reproduction",
  "production-asset-readiness",
  "storefront-segmentation",
  "tenant-frontage-assignment",
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
    console.log(`Wrote Phase 4D facade evidence packet: ${fixturePath}`);
    return;
  }

  const actualText = await readFile(fixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Facade evidence packet does not match deterministic verifier output.");
  }

  validateFixture(actual, actualText, failures);

  if (failures.length) {
    throw new Error(`Phase 4D facade evidence packet failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D facade evidence packet verified (${actual.records.length} review-only records; no runtime or claim promotion).`,
  );
}

function buildFixture() {
  const records = eligibleRecords.map(([evidenceId, filePath, cornerScopeId, cornerScopeLabel, captureProvenanceNotes]) =>
    buildRecord(evidenceId, filePath, cornerScopeId, cornerScopeLabel, captureProvenanceNotes),
  );

  return {
    schemaVersion: "phase-4d-batu-supplied-facade-evidence.v0.1",
    packetId: "p4d-batu-supplied-facade-evidence-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-4",
    reviewOnly: true,
    status: "review-only-facade-evidence-index",
    generatedFrom: {
      claimContractPath,
      localEvidenceRoots: ["docs/mvp-reference-images/"],
      sourcePolicy: "repo-local-batu-supplied-or-project-owned-evidence-only",
    },
    packetBoundary: {
      normalRuntimeUse: "not-rendered",
      qaRuntimeUse: "none-in-this-batch",
      canAffectNormalRuntime: false,
      canCreateProductionAssets: false,
      canCreateStorefrontAnchors: false,
      canAssignTenantsToFrontages: false,
      canPromoteFacadeClaims: false,
      canPromoteEntranceClaims: false,
      canPromoteSignageClaims: false,
      canPromoteActiveStatusClaims: false,
    },
    claimBoundary: {
      allowedClaimLevels: [
        {
          level: 8,
          claim: "facade/signage evidence review",
          status: "manual_review_required",
          limit:
            "Evidence may be reviewed for future facade/frontage questions, but it does not promote exact facade, signage, material, color, entrance, frontage, tenant, active-status, or production asset claims.",
        },
      ],
      blockedClaimLevels: [
        {
          level: 6,
          claim: "storefront/frontage claim",
          reason: "No storefront anchor, tenant frontage, frontage order, or width assignment is created in 4D-4.",
        },
        {
          level: 7,
          claim: "entrance claim",
          reason: "No entrance location or tenant/building entrance assignment is created in 4D-4.",
        },
        {
          level: 8,
          claim: "facade/signage promotion",
          reason: "Records remain evidence-review material only and do not promote exact facade or signage claims.",
        },
        {
          level: 9,
          claim: "landmark/special-treatment claim",
          reason: "No landmark, transit, civic, or special art treatment is approved in 4D-4.",
        },
      ],
      requiredBlockedClaims,
    },
    summary: {
      evidenceRecordCount: records.length,
      ingestionResult: "repo-local-batu-supplied-field-photo-references-indexed-review-only",
      evidenceRecordsByCornerScope: {
        manhattan_greenpoint: records.filter((record) => record.cornerScope.scopeId === "manhattan_greenpoint").length,
        franklin_greenpoint: records.filter((record) => record.cornerScope.scopeId === "franklin_greenpoint").length,
        unresolved_unknown: records.filter((record) => record.cornerScope.scopeId === "unresolved_unknown").length,
      },
      recordsWithAssociatedGeometryContainer: 0,
      recordsWithStorefrontAssignment: 0,
      recordsWithTenantAssignment: 0,
      recordsAllowedForProductionRuntime: 0,
      recordsAllowedForAssetGeneration: 0,
      excludedKnownRestrictedOrExceptionOnlyMaterial:
        "SW Dunkin / SW subway exception-only references are not indexed in this 4D-4 packet because this batch allows only Batu-supplied/project-owned non-restricted evidence.",
      correctionNote:
        "4D-5 narrowed this packet to corner-scoped evidence only. Indexed records are not corridor-wide evidence.",
    },
    records,
    futureUseNotes: [
      "Future facade/frontage batches may reference this packet only as evidence/provenance input after Batu accepts the packet and opens a new batch.",
      "Any future anchor must separately link approved evidence to a safe or explicitly reviewed geometry container.",
      "Any future visual work needs Batu approval for usage rights, claim level, treatment, and whether exact or stylized representation is allowed.",
    ],
  };
}

function buildRecord(evidenceId, filePath, cornerScopeId, cornerScopeLabel, captureProvenanceNotes) {
  const disallowed = filePath.includes("subway")
    ? [...disallowedUse, "exact-station-geometry-claim"]
    : disallowedUse;

  return {
    evidenceId,
    sourceOwnerSupplier: "Batu-supplied repo-local field photo reference",
    filePath,
    cornerScope: {
      scopeId: cornerScopeId,
      label: cornerScopeLabel,
      notCorridorWideEvidence: true,
    },
    captureProvenanceNotes,
    allowedUse,
    disallowedUse: disallowed,
    usageRightsStatus: "review_only_owner_confirmation_required_before_promotion",
    associatedCorridorSideOrGeometryContainer: {
      corridorSegment: cornerScopeId,
      corridorSide: "unknown_for_phase_4d_container",
      geometryContainerId: null,
      notes: "Not linked to a Phase 4D rendered geometry container in the 4D-4 evidence packet.",
    },
    confidenceReviewStatus: "manual_review_required",
    claimLevelsSupported: ["level-8-facade-signage-evidence-review-only"],
    blockedClaimLevels: [
      "level-6-storefront-frontage",
      "level-7-entrance",
      "level-8-facade-signage-promotion",
      "level-9-special-treatment",
    ],
    blockedClaims: requiredBlockedClaims,
    manualReviewNotes: [
      "Treat as provenance/evidence material only.",
      filePath.includes("subway")
        ? "Do not infer station geometry, storefront order, entrance placement, tenant frontage, exact signage, material, color, or active status."
        : "Do not infer storefront order, entrance placement, tenant frontage, exact signage, material, color, or active status.",
    ],
  };
}

function validateFixture(fixture, fixtureText, failures) {
  if (fixture.schemaVersion !== "phase-4d-batu-supplied-facade-evidence.v0.1") {
    failures.push("Unexpected schemaVersion.");
  }
  if (fixture.phase !== "4D-4") failures.push("Fixture phase must be 4D-4.");
  if (fixture.reviewOnly !== true) failures.push("Fixture must be review-only.");
  if (fixture.packetBoundary?.normalRuntimeUse !== "not-rendered") failures.push("Normal runtime use must be not-rendered.");
  if (fixture.packetBoundary?.qaRuntimeUse !== "none-in-this-batch") failures.push("QA runtime use must be none in this batch.");

  const boundaryBooleans = [
    "canAffectNormalRuntime",
    "canCreateProductionAssets",
    "canCreateStorefrontAnchors",
    "canAssignTenantsToFrontages",
    "canPromoteFacadeClaims",
    "canPromoteEntranceClaims",
    "canPromoteSignageClaims",
    "canPromoteActiveStatusClaims",
  ];
  for (const key of boundaryBooleans) {
    if (fixture.packetBoundary?.[key] !== false) failures.push(`packetBoundary.${key} must be false.`);
  }

  if (fixture.summary?.evidenceRecordCount !== eligibleRecords.length) {
    failures.push("Summary evidenceRecordCount does not match expected allowlist count.");
  }
  if (fixture.summary?.recordsWithAssociatedGeometryContainer !== 0) {
    failures.push("4D-4 must not associate records to geometry containers yet.");
  }
  if (fixture.summary?.recordsWithStorefrontAssignment !== 0) failures.push("4D-4 must not create storefront assignments.");
  if (fixture.summary?.recordsWithTenantAssignment !== 0) failures.push("4D-4 must not create tenant assignments.");
  if (fixture.summary?.recordsAllowedForProductionRuntime !== 0) failures.push("4D-4 must not allow production runtime use.");
  if (fixture.summary?.recordsAllowedForAssetGeneration !== 0) failures.push("4D-4 must not allow asset generation.");

  validateRecords(fixture.records ?? [], failures);
  validateForbiddenStrings(fixtureText, failures);
}

function validateRecords(records, failures) {
  const seen = new Set();
  if (records.length !== eligibleRecords.length) failures.push(`Expected ${eligibleRecords.length} records, found ${records.length}.`);

  for (const record of records) {
    if (seen.has(record.evidenceId)) failures.push(`Duplicate evidenceId: ${record.evidenceId}`);
    seen.add(record.evidenceId);

    for (const field of [
      "evidenceId",
      "sourceOwnerSupplier",
      "filePath",
      "captureProvenanceNotes",
      "usageRightsStatus",
      "confidenceReviewStatus",
    ]) {
      if (!record[field]) failures.push(`${record.evidenceId ?? "record"} missing ${field}.`);
    }

    if (!existsSync(resolve(repoRoot, record.filePath))) failures.push(`${record.evidenceId} filePath does not exist: ${record.filePath}`);
    if (!["manhattan_greenpoint", "franklin_greenpoint", "unresolved_unknown"].includes(record.cornerScope?.scopeId)) {
      failures.push(`${record.evidenceId} has invalid cornerScope.`);
    }
    if (record.cornerScope?.notCorridorWideEvidence !== true) {
      failures.push(`${record.evidenceId} must explicitly be not corridor-wide evidence.`);
    }
    if (!Array.isArray(record.allowedUse) || record.allowedUse.length < 2) failures.push(`${record.evidenceId} missing allowedUse.`);
    if (!Array.isArray(record.disallowedUse) || record.disallowedUse.length < 6) failures.push(`${record.evidenceId} missing disallowedUse.`);
    if (record.usageRightsStatus !== "review_only_owner_confirmation_required_before_promotion") {
      failures.push(`${record.evidenceId} has unsupported usageRightsStatus.`);
    }
    if (record.confidenceReviewStatus !== "manual_review_required") {
      failures.push(`${record.evidenceId} must remain manual_review_required.`);
    }
    if (record.associatedCorridorSideOrGeometryContainer?.geometryContainerId !== null) {
      failures.push(`${record.evidenceId} must not attach to a geometry container in 4D-4.`);
    }
    if (!record.claimLevelsSupported?.includes("level-8-facade-signage-evidence-review-only")) {
      failures.push(`${record.evidenceId} missing review-only claim level support.`);
    }
    for (const blockedLevel of [
      "level-6-storefront-frontage",
      "level-7-entrance",
      "level-8-facade-signage-promotion",
      "level-9-special-treatment",
    ]) {
      if (!record.blockedClaimLevels?.includes(blockedLevel)) failures.push(`${record.evidenceId} missing ${blockedLevel}.`);
    }
    for (const claim of requiredBlockedClaims) {
      if (!record.blockedClaims?.includes(claim)) failures.push(`${record.evidenceId} missing blocked claim ${claim}.`);
    }
    for (const blockedUse of [
      "normal-runtime-rendering",
      "production-asset-use",
      "asset-generation-input",
      "storefront-anchor-creation",
      "tenant-frontage-assignment",
      "exact-facade-or-signage-claim",
    ]) {
      if (!record.disallowedUse?.includes(blockedUse)) failures.push(`${record.evidenceId} missing disallowed use ${blockedUse}.`);
    }
  }
}

function validateForbiddenStrings(text, failures) {
  const lower = text.toLowerCase();
  for (const forbidden of forbiddenFixtureStrings) {
    if (lower.includes(forbidden)) failures.push(`Fixture contains forbidden source or promotion string: ${forbidden}`);
  }
}
