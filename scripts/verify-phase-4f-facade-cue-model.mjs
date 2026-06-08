#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const geometryCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";
const manifestPath = "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";

const REQUIRED_PHASE = "4F-1";
const REQUIRED_MODEL_STATUS = "qa_only_facade_cue_model_hardened";
const MIN_VISUAL_GAP_UNITS = 0.12;
const REQUIRED_STATUS_STATES = new Set(["manual_draft", "evidence_informed", "qa_only", "not_verified"]);
const REQUIRED_CONFIDENCE_VALUES = new Set(["low", "medium", "manual_review_required", "blocked"]);
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

const FORBIDDEN_RAW_FIELDS = new Set([
  "businessName",
  "tenantName",
  "activeStatus",
  "exactAddress",
  "exactFrontage",
  "exactEntrance",
  "storefrontAnchor",
  "entranceClaim",
  "frontageClaim",
  "frontageClaimValue",
  "logo",
  "signText",
  "productionAsset",
  "normalModeExposure",
]);

async function main() {
  const fixture = await readJson(fixturePath);
  const geometryCueFixture = await readJson(geometryCuePath);
  const manifest = await readJson(manifestPath);
  const geometryCueByTarget = new Map(geometryCueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));
  const semanticIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const sourceRecordIds = new Set(manifest.semanticObjects.map((object) => object.sourceRecordId).filter(Boolean));

  verifyFixtureGuardrails(fixture);
  verifyModelPolicy(fixture.facadeCueModelPolicy);

  const renderedRecords = fixture.facadeCueRecords.filter((record) => record.renderStatus === "rendered_qa_only");
  assert(renderedRecords.length === 6, "4F-1 hardening must preserve six rendered QA evidence facade records");
  assert(fixture.summary.facadePlaneCount === renderedRecords.length, "summary.facadePlaneCount mismatch");

  const facadePlaneIds = new Set();
  const extents = [];
  let bayCount = 0;
  for (const record of renderedRecords) {
    verifyNoForbiddenRawFields(record, record.cueRecordId);
    verifyRecordGuardrails(record, semanticIds, sourceRecordIds);
    const model = record.qaFacadeModel;
    verifyModel(record, model);
    await verifySourceEvidence(record);

    assert(!facadePlaneIds.has(model.facadePlaneId), `duplicate facadePlaneId ${model.facadePlaneId}`);
    facadePlaneIds.add(model.facadePlaneId);
    const computed = computeRenderedExtent(record, geometryCueByTarget.get(record.targetSemanticId));
    verifyExtent(model.streetwallLayout.slotExtentUnits, computed, record.cueRecordId);
    extents.push({ ...computed, recordId: record.cueRecordId, cornerScope: record.cornerScope });
    bayCount += model.storefrontBayPlaceholders.length;
  }

  assert(fixture.summary.storefrontBayPlaceholderCount === bayCount, "summary.storefrontBayPlaceholderCount mismatch");
  verifyRenderedGaps(extents);

  console.log(`Verified ${fixturePath}: ${renderedRecords.length} hardened QA facade planes, ${bayCount} non-claim bay placeholders`);
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

function verifyFixtureGuardrails(fixture) {
  assert(fixture.reviewOnly === true, "fixture must stay reviewOnly");
  assert(fixture.qaOnly === true, "fixture must stay qaOnly");
  assert(fixture.phase === "4E-5", "4F-1 must harden the passed 4E-5 visual proof without rewriting its phase");
  assert(fixture.renderPolicy.normalModeUse === "not-rendered", "normalModeUse must stay not-rendered");
  assert(fixture.renderPolicy.canAffectNormalRuntime === false, "normal runtime must not be affected");
  assert(fixture.renderPolicy.canConnectBusinessIdentity === false, "business identity connection must stay blocked");
  assert(fixture.renderPolicy.canCreateStorefrontAnchors === false, "storefront anchors must stay blocked");
  assert(fixture.renderPolicy.canAssignTenantsToFrontages === false, "tenant frontage assignment must stay blocked");
  assert(fixture.renderPolicy.canPromoteExactFacadeClaims === false, "exact facade claims must stay blocked");
  assert(fixture.renderPolicy.canPromoteExactFrontageClaims === false, "exact frontage claims must stay blocked");
  assert(fixture.renderPolicy.canPromoteExactAddressClaims === false, "exact address claims must stay blocked");
  assert(fixture.renderPolicy.canCreateProductionAssets === false, "production assets must stay blocked");
  assertSetIncludes(new Set(fixture.blockedClaimsRequired), REQUIRED_BLOCKED_CLAIMS, "fixture.blockedClaimsRequired");
  assert(fixture.summary.normalModeRecordCount === 0, "normal mode record count must remain 0");
  assert(fixture.summary.businessIdentityConnectionCount === 0, "business identity connection count must remain 0");
  assert(fixture.summary.exactFrontageClaimCount === 0, "exact frontage claim count must remain 0");
  assert(fixture.summary.productionClaimCount === 0, "production claim count must remain 0");
}

function verifyModelPolicy(policy) {
  assert(policy && typeof policy === "object", "facadeCueModelPolicy is required");
  assert(policy.phase === REQUIRED_PHASE, `facadeCueModelPolicy.phase must be ${REQUIRED_PHASE}`);
  assert(policy.qaOnly === true, "facadeCueModelPolicy must be QA-only");
  assert(policy.modelStatus === REQUIRED_MODEL_STATUS, "facadeCueModelPolicy.modelStatus mismatch");
  assert(policy.normalModeUse === "not-rendered", "facade cue model must not render in normal mode");
  assert(policy.facadePlaneIdRequired === true, "facade plane IDs must be required");
  assert(policy.uniqueFacadePlaneIdsRequired === true, "unique facade plane IDs must be required");
  assert(policy.streetwallSlotLayoutContractRequired === true, "streetwall slot layout contract must be required");
  assert(policy.sideReturnCornerWrapContractRequired === true, "side return/corner wrap contract must be required");
  assert(policy.depthSetbackGroundContactContractRequired === true, "depth/setback/ground-contact contract must be required");
  assert(policy.storefrontBayPlaceholdersAllowedUse === "qa_non_claim_placeholder_only", "bay placeholders must be QA non-claim only");
  assert(policy.canCreateStorefrontAnchors === false, "policy must block storefront anchors");
  assert(policy.canAssignBusinessLinkage === false, "policy must block business linkage");
  assert(policy.canClaimExactFrontage === false, "policy must block exact frontage claims");
  assert(policy.canClaimExactEntrance === false, "policy must block exact entrance claims");
  assert(policy.canAffectNormalRuntime === false, "policy must block normal runtime exposure");
  assertNumberInRange(policy.minimumVisualGapUnits, MIN_VISUAL_GAP_UNITS, 1, "policy.minimumVisualGapUnits");
  assertSetIncludes(new Set(policy.requiredStatusStates), REQUIRED_STATUS_STATES, "policy.requiredStatusStates");
  assertSetIncludes(new Set(policy.requiredConfidenceStates), REQUIRED_CONFIDENCE_VALUES, "policy.requiredConfidenceStates");
  for (const key of [
    "footprintDepthUnits",
    "facadeThicknessUnits",
    "cornerReturnDepthUnits",
    "storefrontSetbackUnits",
    "signBandDepthUnits",
    "windowReliefDepthUnits",
    "parapetDepthUnits",
    "corniceProjectionUnits",
  ]) {
    assert(typeof policy.normalizedDepthTerms?.[key] === "string", `policy.normalizedDepthTerms.${key} is required`);
  }
  assertSetIncludes(new Set(policy.blockedClaimsPreserved), REQUIRED_BLOCKED_CLAIMS, "policy.blockedClaimsPreserved");
}

function verifyRecordGuardrails(record, semanticIds, sourceRecordIds) {
  assert(record.reviewOnly !== false, `${record.cueRecordId} must stay review-only`);
  assert(record.claimStatus === "manual_draft", `${record.cueRecordId} must remain manual_draft`);
  assert(record.allowedUse === "qa-mode-evidence-informed-render-proof-only", `${record.cueRecordId} allowedUse mismatch`);
  assert(record.associationStatus === "provisional_geometry_target_for_qa_render_only", `${record.cueRecordId} association must remain provisional`);
  assert(record.targetGeometryContainerId === record.targetSemanticId, `${record.cueRecordId} targetGeometryContainerId must match targetSemanticId`);
  assert(semanticIds.has(record.targetSemanticId), `${record.cueRecordId} unresolved targetSemanticId`);
  assert(sourceRecordIds.has(record.targetSourceRecordId), `${record.cueRecordId} unresolved targetSourceRecordId`);
  assertSetIncludes(new Set(record.statusLabels), REQUIRED_STATUS_STATES, `${record.cueRecordId}.statusLabels`);
  assertSetIncludes(new Set(record.blockedClaims), REQUIRED_BLOCKED_CLAIMS, `${record.cueRecordId}.blockedClaims`);
}

function verifyModel(record, model) {
  assert(model && typeof model === "object", `${record.cueRecordId} missing qaFacadeModel`);
  assert(model.modelPhase === REQUIRED_PHASE, `${record.cueRecordId} modelPhase mismatch`);
  assert(model.modelStatus === REQUIRED_MODEL_STATUS, `${record.cueRecordId} modelStatus mismatch`);
  assert(/^qa-facade-plane-[a-z0-9-]+$/.test(model.facadePlaneId), `${record.cueRecordId} invalid facadePlaneId`);
  assert(model.facadePlaneRole === "qa_evidence_informed_facade_plane", `${record.cueRecordId} facadePlaneRole mismatch`);
  assertSetIncludes(new Set(model.statusStates), REQUIRED_STATUS_STATES, `${record.cueRecordId}.statusStates`);
  for (const [key, value] of Object.entries(model.confidenceStates ?? {})) {
    assert(REQUIRED_CONFIDENCE_VALUES.has(value), `${record.cueRecordId}.confidenceStates.${key} has invalid value ${value}`);
  }
  assert(model.confidenceStates.businessLinkage === "blocked", `${record.cueRecordId} businessLinkage confidence must be blocked`);
  assert(model.confidenceStates.frontagePromotionGate === "blocked", `${record.cueRecordId} frontage promotion gate must be blocked`);
  assert(model.confidenceStates.entrancePromotionGate === "blocked", `${record.cueRecordId} entrance promotion gate must be blocked`);

  assert(model.facadePlane.facadePlaneId === model.facadePlaneId, `${record.cueRecordId} facadePlaneId mismatch`);
  assert(model.facadePlane.targetSemanticId === record.targetSemanticId, `${record.cueRecordId} facadePlane target mismatch`);
  assert(model.facadePlane.targetGeometryContainerId === record.targetGeometryContainerId, `${record.cueRecordId} facadePlane container mismatch`);
  assert(model.facadePlane.targetSourceRecordId === record.targetSourceRecordId, `${record.cueRecordId} facadePlane source mismatch`);
  assert(model.facadePlane.associationStatus === record.associationStatus, `${record.cueRecordId} facadePlane association mismatch`);
  assert(model.facadePlane.normalRuntimeGate === "blocked_not_rendered", `${record.cueRecordId} facadePlane normal runtime gate must be blocked`);
  assert(model.facadePlane.canBecomeAuthoritativeWithoutReview === false, `${record.cueRecordId} facadePlane cannot be authoritative without review`);

  assert(model.streetwallLayout.streetwallSlotId === record.qaComposition.streetwallSlot, `${record.cueRecordId} streetwall slot mismatch`);
  assert(model.streetwallLayout.streetEdgeAlignment === record.qaComposition.streetEdgeAlignment, `${record.cueRecordId} street edge mismatch`);
  assert(model.streetwallLayout.slotOrder === record.qaComposition.recordSeparationIndex + 1, `${record.cueRecordId} slotOrder mismatch`);
  assert(model.streetwallLayout.slotCount === record.qaComposition.recordSeparationCount, `${record.cueRecordId} slotCount mismatch`);
  assert(model.streetwallLayout.layoutStatus === "qa_slot_layout_only_not_frontage_order", `${record.cueRecordId} layout status mismatch`);
  assert(model.streetwallLayout.canClaimExactFrontageOrder === false, `${record.cueRecordId} must not claim exact frontage order`);
  assertNumberInRange(model.streetwallLayout.minimumVisualGapUnits, MIN_VISUAL_GAP_UNITS, 1, `${record.cueRecordId}.minimumVisualGapUnits`);

  assert(model.sideReturnCornerWrap.sideReturnEnabled === record.qaComposition.sideReturn.enabled, `${record.cueRecordId} sideReturn enabled mismatch`);
  assert(model.sideReturnCornerWrap.sideReturnEdge === record.qaComposition.sideReturn.edge, `${record.cueRecordId} sideReturn edge mismatch`);
  assert(model.sideReturnCornerWrap.sideReturnDepthUnits === record.qaComposition.sideReturn.depthUnits, `${record.cueRecordId} sideReturn depth mismatch`);
  assert(model.sideReturnCornerWrap.cornerReturnDepthUnits === record.qaComposition.cornerReturnDepthUnits, `${record.cueRecordId} corner return depth mismatch`);
  assert(typeof model.sideReturnCornerWrap.cornerWrapEnabled === "boolean", `${record.cueRecordId} cornerWrapEnabled must be boolean`);
  assert(model.sideReturnCornerWrap.cornerWrapStatus === "qa_corner_wrap_placeholder_not_entrance_or_frontage", `${record.cueRecordId} corner wrap status mismatch`);

  const depth = model.depthSetbackGroundContact;
  for (const key of [
    "footprintDepthUnits",
    "facadeThicknessUnits",
    "storefrontSetbackUnits",
    "signBandDepthUnits",
    "windowReliefDepthUnits",
    "parapetDepthUnits",
    "corniceProjectionUnits",
  ]) {
    assert(Number.isFinite(depth[key]), `${record.cueRecordId}.${key} must be numeric`);
  }
  assert(depth.footprintDepthUnits === record.qaComposition.footprintDepthUnits, `${record.cueRecordId} footprint depth mismatch`);
  assert(depth.facadeThicknessUnits === record.qaComposition.facadeThicknessUnits, `${record.cueRecordId} facade thickness mismatch`);
  assert(depth.storefrontSetbackUnits === record.qaComposition.storefrontSetbackUnits, `${record.cueRecordId} storefront setback mismatch`);
  assert(depth.storefrontRecessDepthUnits === record.qaComposition.storefrontRecessDepth, `${record.cueRecordId} storefront recess mismatch`);
  assert(depth.groundContact.sidewalk === true, `${record.cueRecordId} sidewalk ground contact is required`);
  assert(depth.groundContact.curb === true, `${record.cueRecordId} curb ground contact is required`);
  assert(depth.groundContact.status === "qa_ground_contact_not_survey_or_frontage_claim", `${record.cueRecordId} ground contact status mismatch`);

  verifyBayPlaceholders(model.storefrontBayPlaceholders, record.cueRecordId);
  assert(model.blockedPromotion.canConnectBusinessIdentity === false, `${record.cueRecordId} must block business identity`);
  assert(model.blockedPromotion.canCreateStorefrontAnchor === false, `${record.cueRecordId} must block storefront anchors`);
  assert(model.blockedPromotion.canClaimExactFrontage === false, `${record.cueRecordId} must block exact frontage`);
  assert(model.blockedPromotion.canClaimExactEntrance === false, `${record.cueRecordId} must block exact entrance`);
  assert(model.blockedPromotion.canRenderInNormalMode === false, `${record.cueRecordId} must block normal-mode rendering`);
  assert(model.blockedPromotion.canCreateProductionAsset === false, `${record.cueRecordId} must block production assets`);
}

function verifyBayPlaceholders(placeholders, recordId) {
  assert(Array.isArray(placeholders) && placeholders.length > 0, `${recordId} must include non-claim bay placeholders`);
  const seen = new Set();
  for (const placeholder of placeholders) {
    assert(!seen.has(placeholder.placeholderId), `${recordId} duplicate bay placeholder ${placeholder.placeholderId}`);
    seen.add(placeholder.placeholderId);
    assert(placeholder.placeholderRole === "qa_non_claim_storefront_bay_placeholder", `${recordId} invalid bay placeholder role`);
    assert(placeholder.claimStatus === "not_a_storefront_claim", `${recordId} bay placeholder must stay non-claim`);
    assertSetIncludes(new Set(placeholder.statusLabels), new Set(["qa_only", "placeholder", "not_verified"]), `${recordId}.${placeholder.placeholderId}.statusLabels`);
    assert(placeholder.canRepresentBusiness === false, `${recordId} bay placeholder cannot represent business`);
    assert(placeholder.canRepresentEntrance === false, `${recordId} bay placeholder cannot represent entrance`);
    assert(placeholder.canRepresentExactFrontage === false, `${recordId} bay placeholder cannot represent exact frontage`);
    assert(placeholder.canLinkToBusinessEvidence === false, `${recordId} bay placeholder cannot link to business evidence`);
    assert(Number.isInteger(placeholder.bayOrder) && placeholder.bayOrder >= 1, `${recordId} bayOrder must be positive integer`);
    assert(placeholder.bayCount === placeholders.length, `${recordId} bayCount must match placeholder count`);
  }
}

async function verifySourceEvidence(record) {
  assert(Array.isArray(record.sourceEvidenceRefs) && record.sourceEvidenceRefs.length > 0, `${record.cueRecordId} missing source evidence refs`);
  for (const ref of record.sourceEvidenceRefs) {
    assert(ref.usage === "manual coarse cue reference only", `${record.cueRecordId} evidence usage mismatch`);
    assert(ref.evidencePath.startsWith("docs/mvp-reference-images/"), `${record.cueRecordId} evidence path must stay repo-local`);
    await assertPathExists(ref.evidencePath, `${record.cueRecordId} evidence path missing`);
  }
}

async function assertPathExists(path, message) {
  try {
    await access(resolve(repoRoot, path));
  } catch {
    throw new Error(message);
  }
}

function verifyExtent(actual, expected, recordId) {
  assert(actual && typeof actual === "object", `${recordId} missing slotExtentUnits`);
  assertClose(actual.xMin, expected.xMin, `${recordId}.slotExtentUnits.xMin`);
  assertClose(actual.xMax, expected.xMax, `${recordId}.slotExtentUnits.xMax`);
  assertClose(actual.widthUnits, expected.widthUnits, `${recordId}.slotExtentUnits.widthUnits`);
}

function computeRenderedExtent(record, geometryCue) {
  const plane = geometryCue?.geometryDerived?.streetFacingPlane;
  assert(plane, `${record.cueRecordId} missing geometry cue plane`);
  const sourceLength = Math.max(plane.xMax - plane.xMin, 0.2);
  const composition = record.qaComposition;
  const widthUnits = Number(Math.max(sourceLength * composition.widthScale, 0.16).toFixed(3));
  const centerX = plane.xMin + sourceLength / 2 + composition.lateralOffsetUnits;
  return {
    xMin: Number((centerX - widthUnits / 2).toFixed(3)),
    xMax: Number((centerX + widthUnits / 2).toFixed(3)),
    widthUnits,
  };
}

function verifyRenderedGaps(extents) {
  const byCorner = extents.reduce((groups, extent) => {
    if (!groups.has(extent.cornerScope)) groups.set(extent.cornerScope, []);
    groups.get(extent.cornerScope).push(extent);
    return groups;
  }, new Map());
  for (const [cornerScope, records] of byCorner.entries()) {
    const sorted = [...records].sort((a, b) => a.xMin - b.xMin);
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      const gap = current.xMin - previous.xMax;
      assert(gap >= MIN_VISUAL_GAP_UNITS, `${cornerScope} rendered gap between ${previous.recordId} and ${current.recordId} is ${gap.toFixed(3)}, below ${MIN_VISUAL_GAP_UNITS}`);
    }
  }
}

function verifyNoForbiddenRawFields(value, path) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyNoForbiddenRawFields(item, `${path}[${index}]`));
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    assert(!FORBIDDEN_RAW_FIELDS.has(key), `${path} contains forbidden raw field ${key}`);
    verifyNoForbiddenRawFields(nested, `${path}.${key}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSetIncludes(actual, expected, label) {
  for (const value of expected) {
    assert(actual.has(value), `${label} missing ${value}`);
  }
}

function assertNumberInRange(value, min, max, label) {
  assert(Number.isFinite(value), `${label} must be finite`);
  assert(value >= min && value <= max, `${label} must be between ${min} and ${max}`);
}

function assertClose(actual, expected, label) {
  assert(Number.isFinite(actual), `${label} must be finite`);
  assert(Math.abs(actual - expected) <= 0.002, `${label} expected ${expected}, got ${actual}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
