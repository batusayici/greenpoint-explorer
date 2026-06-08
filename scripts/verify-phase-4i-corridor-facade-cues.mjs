#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json";
const manifestPath = "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
const geometryCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";
const endpointCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const notePath = "docs/phase-4i-corridor-facade-cue-expansion.md";

const REQUIRED_BLOCKED_CLAIMS = new Set([
  "business-identity",
  "active-status",
  "storefront-anchor",
  "tenant-frontage",
  "exact-frontage",
  "exact-frontage-order",
  "exact-address-placement",
  "exact-entrance-location",
  "exact-facade-appearance",
  "exact-signage-reproduction",
  "facade-material",
  "facade-color",
  "production-asset-readiness",
  "normal-runtime-rendering",
  "public-product-claim",
]);

const REQUIRED_RECORD_LANES = new Set([
  "endpoint_evidence_backed",
  "mid_corridor_insufficient_evidence",
  "blocked_no_evidence_gap",
]);

const FORBIDDEN_RAW_FIELDS = new Set([
  "businessName",
  "tenantName",
  "activeStatus",
  "exactAddress",
  "exactFrontage",
  "exactEntrance",
  "storefrontAnchor",
  "frontageClaim",
  "entranceClaim",
  "signText",
  "logo",
  "materialTruth",
  "colorTruth",
  "photoTexture",
  "texturePath",
  "imageUrl",
  "thumbnailUrl",
  "fileUrl",
  "apiUrl",
  "trainingInput",
  "productionAsset",
]);

const FORBIDDEN_PROMOTION_PHRASES = [
  "source approved",
  "normal mode enabled",
  "production ready",
  "business linked",
  "storefront anchor approved",
  "exact frontage approved",
  "exact entrance approved",
  "real imagery ingested",
  "external imagery cached",
  "source-derived texture",
];

async function main() {
  const failures = [];
  const fixture = await readJson(fixturePath);
  const manifest = await readJson(manifestPath);
  const geometryCueFixture = await readJson(geometryCuePath);
  const endpointFixture = await readJson(endpointCuePath);
  const note = await readText(notePath);

  const semanticIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const sourceRecordIds = new Set(manifest.semanticObjects.map((object) => object.sourceRecordId).filter(Boolean));
  const geometryCueTargets = new Set(geometryCueFixture.cues.map((cue) => cue.targetSemanticId));
  const endpointTargets = new Set(endpointFixture.facadeCueRecords.map((record) => record.targetSemanticId));
  const endpointRecordIds = new Set(endpointFixture.facadeCueRecords.map((record) => record.cueRecordId));

  assertEqual(fixture.schemaVersion, "phase-4i-corridor-qa-facade-cues.v0.1", "schemaVersion", failures);
  assertEqual(fixture.phase, "4I-2", "phase", failures);
  assertEqual(fixture.reviewOnly, true, "reviewOnly", failures);
  assertEqual(fixture.qaOnly, true, "qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(fixture.productionUsePolicy, "blocked", "productionUsePolicy", failures);
  verifyRenderPolicy(fixture.renderPolicy, failures);
  assertSetIncludes(new Set(fixture.allowedRecordLanes), REQUIRED_RECORD_LANES, "allowedRecordLanes", failures);
  assertSetIncludes(new Set(fixture.blockedClaimsRequired), REQUIRED_BLOCKED_CLAIMS, "blockedClaimsRequired", failures);

  const seenIds = new Set();
  const laneCounts = {
    endpoint_evidence_backed: 0,
    mid_corridor_insufficient_evidence: 0,
    blocked_no_evidence_gap: 0,
  };
  let renderedQaCount = 0;
  let sourceEvidenceRefRecordCount = 0;

  for (const record of fixture.corridorCueRecords ?? []) {
    verifyNoForbiddenRawFields(record, record.corridorCueRecordId ?? "unknown", failures);
    if (seenIds.has(record.corridorCueRecordId)) failures.push(`Duplicate corridorCueRecordId: ${record.corridorCueRecordId}`);
    seenIds.add(record.corridorCueRecordId);
    if (!/^p4i-(endpoint-evidence-backed|mid-insufficient-evidence|blocked-no-evidence-gap)-/.test(record.corridorCueRecordId)) {
      failures.push(`Non-deterministic-looking record id: ${record.corridorCueRecordId}`);
    }
    if (!REQUIRED_RECORD_LANES.has(record.recordLane)) failures.push(`${record.corridorCueRecordId} invalid recordLane ${record.recordLane}`);
    laneCounts[record.recordLane] += 1;

    assertEqual(record.reviewOnly, true, `${record.corridorCueRecordId}.reviewOnly`, failures);
    assertEqual(record.qaOnly, true, `${record.corridorCueRecordId}.qaOnly`, failures);
    assertEqual(record.normalModeExposure, "blocked", `${record.corridorCueRecordId}.normalModeExposure`, failures);
    assertEqual(record.productionUsePolicy, "blocked", `${record.corridorCueRecordId}.productionUsePolicy`, failures);
    assertEqual(record.targetGeometryContainerId, record.targetSemanticId, `${record.corridorCueRecordId}.targetGeometryContainerId`, failures);
    if (!semanticIds.has(record.targetSemanticId)) failures.push(`${record.corridorCueRecordId} unresolved targetSemanticId`);
    if (!sourceRecordIds.has(record.targetSourceRecordId)) failures.push(`${record.corridorCueRecordId} unresolved targetSourceRecordId`);
    if (!geometryCueTargets.has(record.targetSemanticId)) failures.push(`${record.corridorCueRecordId} missing geometry cue target`);
    assertSetIncludes(new Set(record.blockedClaims ?? []), REQUIRED_BLOCKED_CLAIMS, `${record.corridorCueRecordId}.blockedClaims`, failures);
    if (!record.statusLabels?.includes("qa_only")) failures.push(`${record.corridorCueRecordId} missing qa_only status`);
    if (!record.statusLabels?.includes("not_verified")) failures.push(`${record.corridorCueRecordId} missing not_verified status`);
    verifySourceRefs(record.sourceRefs, record.corridorCueRecordId, failures);

    if (record.recordLane === "endpoint_evidence_backed") {
      verifyEndpointRecord(record, endpointTargets, endpointRecordIds, failures);
      sourceEvidenceRefRecordCount += 1;
      renderedQaCount += 1;
    } else if (record.recordLane === "mid_corridor_insufficient_evidence") {
      verifyMidCorridorRecord(record, failures);
      renderedQaCount += 1;
    } else if (record.recordLane === "blocked_no_evidence_gap") {
      verifyBlockedGapRecord(record, failures);
    }
  }

  assertEqual(fixture.summary.totalRecordCount, fixture.corridorCueRecords.length, "summary.totalRecordCount", failures);
  assertEqual(fixture.summary.endpointEvidenceBackedRecordCount, laneCounts.endpoint_evidence_backed, "summary.endpointEvidenceBackedRecordCount", failures);
  assertEqual(fixture.summary.midCorridorInsufficientEvidenceRecordCount, laneCounts.mid_corridor_insufficient_evidence, "summary.midCorridorInsufficientEvidenceRecordCount", failures);
  assertEqual(fixture.summary.blockedNoEvidenceGapRecordCount, laneCounts.blocked_no_evidence_gap, "summary.blockedNoEvidenceGapRecordCount", failures);
  assertEqual(fixture.summary.renderedQaOnlyRecordCount, renderedQaCount, "summary.renderedQaOnlyRecordCount", failures);
  assertEqual(fixture.summary.normalModeRecordCount, 0, "summary.normalModeRecordCount", failures);
  assertEqual(fixture.summary.productionRecordCount, 0, "summary.productionRecordCount", failures);
  assertEqual(fixture.summary.businessLinkageRecordCount, 0, "summary.businessLinkageRecordCount", failures);
  assertEqual(fixture.summary.exactClaimRecordCount, 0, "summary.exactClaimRecordCount", failures);
  assertEqual(fixture.summary.sourceAccessRecordCount, 0, "summary.sourceAccessRecordCount", failures);
  assertEqual(fixture.summary.externalSourceUseCount, 0, "summary.externalSourceUseCount", failures);
  assertEqual(fixture.summary.sourceEvidenceRefRecordCount, sourceEvidenceRefRecordCount, "summary.sourceEvidenceRefRecordCount", failures);

  if (laneCounts.endpoint_evidence_backed !== 6) failures.push("Expected exactly six endpoint evidence-backed records");
  if (laneCounts.mid_corridor_insufficient_evidence < 24) failures.push("Expected at least 24 mid-corridor insufficient-evidence records");
  if (laneCounts.blocked_no_evidence_gap < 1) failures.push("Expected blocked/no-evidence gap records");

  for (const snippet of [
    "No external source access, download, cache, ingestion, rendering, extraction, training, or source promotion.",
    "No normal-mode exposure.",
    "4I-3 consumes this fixture in QA mode only",
  ]) {
    if (!note.includes(snippet)) failures.push(`Missing note snippet: ${snippet}`);
  }

  const combinedLower = `${JSON.stringify(fixture)}\n${note}`.toLowerCase();
  for (const phrase of FORBIDDEN_PROMOTION_PHRASES) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden promotion phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error("4I corridor facade cue fixture verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${fixturePath}: ${fixture.summary.endpointEvidenceBackedRecordCount} endpoint, ${fixture.summary.midCorridorInsufficientEvidenceRecordCount} mid-corridor, ${fixture.summary.blockedNoEvidenceGapRecordCount} blocked/no-evidence records`);
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

async function readText(path) {
  return readFile(resolve(repoRoot, path), "utf8");
}

function verifyRenderPolicy(policy, failures) {
  if (!policy || typeof policy !== "object") {
    failures.push("renderPolicy is required");
    return;
  }
  for (const [key, expected] of Object.entries({
    normalModeUse: "not-rendered",
    qaModeUse: "corridor-facade-cue-review-only",
    canAffectNormalRuntime: false,
    canAccessExternalSources: false,
    canDownloadOrCacheSourceData: false,
    canIngestImagery: false,
    canRenderFromRealImagery: false,
    canUseSourceDerivedTextures: false,
    canUseModelTrainingInputs: false,
    canPromoteSources: false,
    canConnectBusinessIdentity: false,
    canCreateAuthoritativeStorefrontAnchors: false,
    canClaimExactFrontage: false,
    canClaimExactEntrance: false,
    canClaimExactAddress: false,
    canClaimExactSignage: false,
    canClaimTenantOrActiveStatus: false,
    canCreateProductionAssets: false,
  })) {
    assertEqual(policy[key], expected, `renderPolicy.${key}`, failures);
  }
}

function verifyEndpointRecord(record, endpointTargets, endpointRecordIds, failures) {
  if (!endpointTargets.has(record.targetSemanticId)) failures.push(`${record.corridorCueRecordId} endpoint target not in 4E/4F fixture`);
  if (!endpointRecordIds.has(record.reference4eCueRecordId)) failures.push(`${record.corridorCueRecordId} invalid reference4eCueRecordId`);
  for (const status of ["evidence_backed", "manual_draft", "evidence_informed", "qa_only", "not_verified"]) {
    if (!record.statusLabels.includes(status)) failures.push(`${record.corridorCueRecordId} missing endpoint status ${status}`);
  }
  assertEqual(record.evidenceStatus, "evidence_backed_review_only", `${record.corridorCueRecordId}.evidenceStatus`, failures);
  assertEqual(record.renderStatus, "rendered_qa_only", `${record.corridorCueRecordId}.renderStatus`, failures);
  if (!Array.isArray(record.sourceEvidenceRefs) || record.sourceEvidenceRefs.length === 0) failures.push(`${record.corridorCueRecordId} must preserve endpoint evidence refs`);
  for (const ref of record.sourceEvidenceRefs ?? []) {
    if (!ref.evidencePath?.startsWith("docs/mvp-reference-images/")) failures.push(`${record.corridorCueRecordId} evidence ref must stay repo-local`);
    if (ref.usage !== "manual coarse cue reference only") failures.push(`${record.corridorCueRecordId} evidence ref usage changed`);
  }
  assertEqual(record.qaCueGeometry?.qaRenderRole, "primary_endpoint_evidence_backed_volume", `${record.corridorCueRecordId}.qaRenderRole`, failures);
}

function verifyMidCorridorRecord(record, failures) {
  for (const status of ["manual_draft", "insufficient_evidence", "qa_only", "not_verified"]) {
    if (!record.statusLabels.includes(status)) failures.push(`${record.corridorCueRecordId} missing mid-corridor status ${status}`);
  }
  assertEqual(record.evidenceStatus, "insufficient_evidence", `${record.corridorCueRecordId}.evidenceStatus`, failures);
  assertEqual(record.renderStatus, "rendered_qa_only_candidate_placeholder", `${record.corridorCueRecordId}.renderStatus`, failures);
  assertEqual(record.sourceEvidenceRefs?.length ?? 0, 0, `${record.corridorCueRecordId}.sourceEvidenceRefs`, failures);
  if (record.geometryDerived?.cornerOrEndpointRole !== "mid-corridor") failures.push(`${record.corridorCueRecordId} mid record must target mid-corridor geometry`);
  assertEqual(record.qaCueGeometry?.qaRenderRole, "subdued_mid_corridor_insufficient_evidence_placeholder", `${record.corridorCueRecordId}.qaRenderRole`, failures);
  assertEqual(record.qaCueGeometry?.bayPlaceholderStatus, "qa_non_claim_placeholder_not_storefront_frontage_or_entrance", `${record.corridorCueRecordId}.bayPlaceholderStatus`, failures);
}

function verifyBlockedGapRecord(record, failures) {
  if (!record.statusLabels.includes("blocked_no_evidence")) failures.push(`${record.corridorCueRecordId} missing blocked_no_evidence status`);
  assertEqual(record.claimStatus, "blocked", `${record.corridorCueRecordId}.claimStatus`, failures);
  assertEqual(record.evidenceStatus, "blocked_no_evidence", `${record.corridorCueRecordId}.evidenceStatus`, failures);
  assertEqual(record.renderStatus, "blocked_unrendered_gap_label_only", `${record.corridorCueRecordId}.renderStatus`, failures);
  assertEqual(record.sourceEvidenceRefs?.length ?? 0, 0, `${record.corridorCueRecordId}.sourceEvidenceRefs`, failures);
  if (!record.blockReason) failures.push(`${record.corridorCueRecordId} missing blockReason`);
}

function verifySourceRefs(sourceRefs, recordId, failures) {
  if (!Array.isArray(sourceRefs) || sourceRefs.length === 0) {
    failures.push(`${recordId} missing sourceRefs`);
    return;
  }
  for (const ref of sourceRefs) {
    if (!ref.path || ![
      geometryCuePath,
      manifestPath,
      endpointCuePath,
      "src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json",
    ].includes(ref.path)) {
      failures.push(`${recordId} has disallowed sourceRef path ${ref.path}`);
    }
  }
}

function verifyNoForbiddenRawFields(value, path, failures) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyNoForbiddenRawFields(item, `${path}[${index}]`, failures));
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_RAW_FIELDS.has(key)) failures.push(`${path} contains forbidden raw field ${key}`);
    verifyNoForbiddenRawFields(nested, `${path}.${key}`, failures);
  }
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
}

function assertSetIncludes(actual, expected, label, failures) {
  for (const value of expected) {
    if (!actual.has(value)) failures.push(`${label} missing ${value}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
