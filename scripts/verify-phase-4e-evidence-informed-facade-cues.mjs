#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const manifestPath = "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
const geometryCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";

const REQUIRED_SCHEMA = "phase-4e-evidence-informed-qa-facade-cues.v0.1";
const REQUIRED_PHASE = "4E-5";
const REQUIRED_EVIDENCE_FACADE_ROLE = "evidence-informed-qa-facade";
const REQUIRED_SYNTHETIC_CONTEXT_ROLE = "non-evidence-placeholder-context";
const REQUIRED_CONTEXT_VISIBILITY_POLICY = "synthetic_context_low_contrast_outline_only";
const MIN_SLOT_GAP_UNITS = 0.18;
const MIN_FOOTPRINT_DEPTH_UNITS = 0.44;
const MIN_FACADE_THICKNESS_UNITS = 0.08;
const MIN_CORNER_RETURN_DEPTH_UNITS = 0.32;
const MIN_RENDERED_GAP_UNITS = 0.12;
const MIN_PRIMARY_MASS_OPACITY = 0.92;
const MIN_FRONT_FACE_OPACITY = 0.92;
const MIN_RETURN_WALL_OPACITY = 0.92;
const MIN_BASE_OPACITY = 0.92;
const MIN_GROUND_CONTACT_OPACITY = 0.74;
const REQUIRED_SILHOUETTE_HIERARCHY = new Set([
  "solid-body-mass",
  "front-face",
  "side-return",
  "storefront-base-inset",
  "sign-band",
  "windows-openings",
  "cornice-trim",
  "ground-contact",
]);
const ALLOWED_CUE_TYPES = new Set([
  "facade-rhythm",
  "sign-band-zone",
  "awning-canopy",
  "window-glass-rhythm",
  "corner-emphasis",
  "street-transit-detail-cue",
  "palette-family",
  "blocked-claim-readout",
]);
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

const FORBIDDEN_FIELDS = [
  "businessName",
  "tenantName",
  "activeStatus",
  "exactAddress",
  "exactFrontage",
  "exactEntrance",
  "logo",
  "signText",
  "photoTexture",
  "texturePath",
  "benchmarkEvidence",
  "syntheticEvidence",
];

async function main() {
  const fixture = await readJson(fixturePath);
  const manifest = await readJson(manifestPath);
  const geometryCueFixture = await readJson(geometryCuePath);

  const semanticIds = new Set(manifest.semanticObjects.map((object) => object.id));
  const sourceRecordIds = new Set(manifest.semanticObjects.map((object) => object.sourceRecordId).filter(Boolean));
  const geometryCueTargets = new Set(geometryCueFixture.cues.map((cue) => cue.targetSemanticId));
  const geometryCueByTarget = new Map(geometryCueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));

  assert(fixture.schemaVersion === REQUIRED_SCHEMA, `schemaVersion must be ${REQUIRED_SCHEMA}`);
  assert(fixture.phase === REQUIRED_PHASE, `fixture phase must be ${REQUIRED_PHASE}`);
  assert(fixture.reviewOnly === true, "fixture must be reviewOnly");
  assert(fixture.qaOnly === true, "fixture must be qaOnly");
  assert(fixture.renderPolicy.normalModeUse === "not-rendered", "normal mode use must be not-rendered");
  assert(fixture.renderPolicy.canAffectNormalRuntime === false, "fixture must not affect normal runtime");
  assert(fixture.renderPolicy.usesPhotoTextures === false, "photo textures must be disabled");
  assert(fixture.renderPolicy.usesAutomatedImageAnalysis === false, "automated image analysis must be disabled");
  assert(fixture.renderPolicy.usesTracing === false, "tracing must be disabled");
  assert(fixture.renderPolicy.usesLogosOrExactSignText === false, "logos or exact sign text must be disabled");
  assert(fixture.renderPolicy.usesBusinessNames === false, "business names must be disabled");
  assert(fixture.renderPolicy.canConnectBusinessIdentity === false, "business identity connection must be disabled");
  assert(fixture.renderPolicy.canCreateStorefrontAnchors === false, "storefront anchors must be disabled");
  assert(fixture.renderPolicy.canAssignTenantsToFrontages === false, "tenant frontage assignment must be disabled");
  assert(fixture.renderPolicy.canPromoteExactFacadeClaims === false, "exact facade claims must be disabled");
  assert(fixture.renderPolicy.canPromoteExactFrontageClaims === false, "exact frontage claims must be disabled");
  assert(fixture.renderPolicy.canPromoteExactAddressClaims === false, "exact address claims must be disabled");
  assert(fixture.renderPolicy.canCreateProductionAssets === false, "production asset creation must be disabled");
  verifyCompositionPolicy(fixture.compositionPolicy);

  assertSetEquals(new Set(fixture.allowedCueVocabulary), ALLOWED_CUE_TYPES, "allowedCueVocabulary");
  assertSetIncludes(new Set(fixture.blockedClaimsRequired), REQUIRED_BLOCKED_CLAIMS, "blockedClaimsRequired");

  const renderedRecords = fixture.facadeCueRecords.filter((record) => record.renderStatus === "rendered_qa_only");
  const blockedRecords = fixture.blockedCueRecords ?? [];
  assert(fixture.summary.renderedCueRecordCount === renderedRecords.length, "summary rendered count mismatch");
  assert(renderedRecords.length === 6, "4E-5 must render exactly 6 QA evidence facade records");
  assert(fixture.summary.blockedCueRecordCount === blockedRecords.length, "summary blocked count mismatch");
  assert(fixture.summary.normalModeRecordCount === 0, "normal mode records must be 0");
  assert(fixture.summary.businessIdentityConnectionCount === 0, "business identity connections must be 0");
  assert(fixture.summary.exactFrontageClaimCount === 0, "exact frontage claims must be 0");
  assert(fixture.summary.productionClaimCount === 0, "production claims must be 0");
  assert(fixture.summary.syntheticContextPromotionCount === 0, "synthetic context promotion count must be 0");

  const seen = new Set();
  const visualSlots = new Set();
  const renderedExtents = [];
  for (const record of fixture.facadeCueRecords) {
    verifyNoForbiddenFields(record, `record ${record.cueRecordId}`);
    assert(!seen.has(record.cueRecordId), `duplicate cueRecordId ${record.cueRecordId}`);
    seen.add(record.cueRecordId);
    assert(record.reviewOnly !== false, `${record.cueRecordId} must not opt out of review-only behavior`);
    assert(record.claimStatus === "manual_draft", `${record.cueRecordId} must remain manual_draft`);
    assert(record.allowedUse === "qa-mode-evidence-informed-render-proof-only", `${record.cueRecordId} has invalid allowedUse`);
    assert(Array.isArray(record.statusLabels) && record.statusLabels.includes("qa_only"), `${record.cueRecordId} missing qa_only label`);
    assert(Array.isArray(record.statusLabels) && record.statusLabels.includes("not_verified"), `${record.cueRecordId} missing not_verified label`);
    assertSetIncludes(new Set(record.blockedClaims), REQUIRED_BLOCKED_CLAIMS, `${record.cueRecordId} blockedClaims`);
    verifyComposition(record.qaComposition, record.cueRecordId);
    visualSlots.add(record.qaComposition.streetwallSlot);

    if (record.renderStatus === "rendered_qa_only") {
      assert(record.targetSemanticId, `${record.cueRecordId} missing targetSemanticId`);
      assert(record.targetGeometryContainerId === record.targetSemanticId, `${record.cueRecordId} targetGeometryContainerId must match targetSemanticId`);
      assert(semanticIds.has(record.targetSemanticId), `${record.cueRecordId} targetSemanticId does not resolve: ${record.targetSemanticId}`);
      assert(sourceRecordIds.has(record.targetSourceRecordId), `${record.cueRecordId} targetSourceRecordId does not resolve: ${record.targetSourceRecordId}`);
      assert(geometryCueTargets.has(record.targetSemanticId), `${record.cueRecordId} has no geometry-only facade cue target`);
      assert(record.associationStatus === "provisional_geometry_target_for_qa_render_only", `${record.cueRecordId} must remain provisional`);
      renderedExtents.push({
        ...computeRenderedExtent(record, geometryCueByTarget.get(record.targetSemanticId)),
        recordId: record.cueRecordId,
        cornerScope: record.cornerScope,
      });
    } else {
      assert(record.renderStatus === "blocked_unrendered", `${record.cueRecordId} invalid renderStatus`);
      assert(record.blockReason, `${record.cueRecordId} blocked record missing blockReason`);
      assert(!record.targetSemanticId || semanticIds.has(record.targetSemanticId), `${record.cueRecordId} blocked target must be absent or resolvable`);
    }

    assert(Array.isArray(record.sourceEvidenceRefs) && record.sourceEvidenceRefs.length > 0, `${record.cueRecordId} missing sourceEvidenceRefs`);
    for (const ref of record.sourceEvidenceRefs) {
      assert(ref.usage === "manual coarse cue reference only", `${record.cueRecordId} evidence ref has invalid usage`);
      assert(ref.evidencePath.startsWith("docs/mvp-reference-images/"), `${record.cueRecordId} evidence path must stay repo-local`);
      await assertPathExists(ref.evidencePath, `${record.cueRecordId} evidence path missing`);
    }

    const cueTypes = new Set();
    for (const cue of record.cues) {
      assert(ALLOWED_CUE_TYPES.has(cue.cueType), `${record.cueRecordId} has disallowed cueType ${cue.cueType}`);
      cueTypes.add(cue.cueType);
      if (cue.cueType === "palette-family") {
        assert(fixture.allowedPaletteFamilies.includes(cue.semanticValue), `${record.cueRecordId} has disallowed palette ${cue.semanticValue}`);
        assert(cue.semanticValue === record.paletteFamily, `${record.cueRecordId} palette cue must match record paletteFamily`);
      }
      if (cue.cueType === "blocked-claim-readout") {
        assertSetIncludes(new Set(cue.blockedClaims), REQUIRED_BLOCKED_CLAIMS, `${record.cueRecordId} blocked-claim-readout`);
      }
    }
    assert(cueTypes.has("palette-family"), `${record.cueRecordId} missing palette-family cue`);
    assert(cueTypes.has("facade-rhythm"), `${record.cueRecordId} missing facade-rhythm cue`);
    assert(cueTypes.has("window-glass-rhythm"), `${record.cueRecordId} missing window-glass-rhythm cue`);
    assert(cueTypes.has("blocked-claim-readout"), `${record.cueRecordId} missing blocked-claim-readout cue`);
  }

  const cornerCounts = renderedRecords.reduce((counts, record) => {
    counts[record.cornerScope] = (counts[record.cornerScope] ?? 0) + 1;
    return counts;
  }, {});
  assert(cornerCounts.manhattan_greenpoint >= 1, "Manhattan endpoint must have rendered records");
  assert(cornerCounts.franklin_greenpoint >= 1, "Franklin endpoint must have rendered records");
  assert(cornerCounts.manhattan_greenpoint === 3, "Manhattan endpoint must have exactly 3 rendered records");
  assert(cornerCounts.franklin_greenpoint === 3, "Franklin endpoint must have exactly 3 rendered records");
  assert(visualSlots.size === 6, "4E-5 requires six unique visual streetwall slots");
  assert(fixture.summary.uniqueStreetwallSlotCount === visualSlots.size, "uniqueStreetwallSlotCount mismatch");
  verifyRenderedGaps(renderedExtents);

  console.log(`Verified ${fixturePath}: ${renderedRecords.length} rendered QA records, ${blockedRecords.length} blocked records`);
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

async function assertPathExists(path, message) {
  try {
    await access(resolve(repoRoot, path));
  } catch {
    throw new Error(message);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSetEquals(actual, expected, label) {
  assert(actual.size === expected.size, `${label} size mismatch`);
  assertSetIncludes(actual, expected, label);
}

function assertSetIncludes(actual, expected, label) {
  for (const value of expected) {
    assert(actual.has(value), `${label} missing ${value}`);
  }
}

function verifyNoForbiddenFields(value, path) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyNoForbiddenFields(item, `${path}[${index}]`));
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    assert(!FORBIDDEN_FIELDS.includes(key), `${path} contains forbidden field ${key}`);
    verifyNoForbiddenFields(nested, `${path}.${key}`);
  }
}

function verifyCompositionPolicy(policy) {
  assert(policy && typeof policy === "object", "compositionPolicy is required for 4E-5");
  assert(policy.phase === REQUIRED_PHASE, `compositionPolicy.phase must be ${REQUIRED_PHASE}`);
  assert(policy.qaOnly === true, "compositionPolicy must be QA-only");
  assert(policy.normalModeUse === "not-rendered", "compositionPolicy normal mode use must be not-rendered");
  assert(policy.evidenceFacadeRole === REQUIRED_EVIDENCE_FACADE_ROLE, "compositionPolicy evidence role mismatch");
  assert(policy.syntheticContextRole === REQUIRED_SYNTHETIC_CONTEXT_ROLE, "compositionPolicy synthetic context role mismatch");
  assert(policy.evidenceFacadeRole !== policy.syntheticContextRole, "evidence and synthetic context roles must remain distinct");
  assert(policy.canPromoteSyntheticContextToEvidence === false, "synthetic context must not promote to evidence");
  assert(policy.canUseBenchmarkAsEvidence === false, "benchmark image must not become evidence");
  assert(policy.requiresUniqueStreetwallSlots === true, "4E-5 must require unique streetwall slots");
  assertNumberInRange(policy.minimumSlotGapUnits, MIN_SLOT_GAP_UNITS, 1, "compositionPolicy.minimumSlotGapUnits");
  assertNumberInRange(policy.minimumFootprintDepthUnits, MIN_FOOTPRINT_DEPTH_UNITS, 2, "compositionPolicy.minimumFootprintDepthUnits");
  assertNumberInRange(policy.minimumFacadeThicknessUnits, MIN_FACADE_THICKNESS_UNITS, 1, "compositionPolicy.minimumFacadeThicknessUnits");
  assertNumberInRange(policy.minimumCornerReturnDepthUnits, MIN_CORNER_RETURN_DEPTH_UNITS, 2, "compositionPolicy.minimumCornerReturnDepthUnits");
  assertNumberInRange(policy.minimumRenderedGapUnits, MIN_RENDERED_GAP_UNITS, 1, "compositionPolicy.minimumRenderedGapUnits");
  assertNumberInRange(policy.minimumPrimaryMassOpacity, MIN_PRIMARY_MASS_OPACITY, 1, "compositionPolicy.minimumPrimaryMassOpacity");
  assertNumberInRange(policy.minimumGroundContactOpacity, MIN_GROUND_CONTACT_OPACITY, 1, "compositionPolicy.minimumGroundContactOpacity");
  assert(policy.requiresOpaquePrimaryMasses === true, "4E-5 must require opaque primary masses");
  assert(policy.requiresComputedRenderExtents === true, "4E-5 must require computed render extents");
  assert(policy.requiresGroundContact === true, "4E-5 must require ground contact");
  assertSetIncludes(new Set(policy.requiredSilhouetteHierarchy), REQUIRED_SILHOUETTE_HIERARCHY, "compositionPolicy.requiredSilhouetteHierarchy");
  assert(policy.requiresContextVisibilityPolicy === true, "4E-5 must require context visibility policy");
  assert(policy.contextVisibilityPolicy === REQUIRED_CONTEXT_VISIBILITY_POLICY, "compositionPolicy context visibility must keep synthetic context low-contrast");
}

function verifyComposition(composition, recordId) {
  assert(composition && typeof composition === "object", `${recordId} missing qaComposition`);
  assert(composition.compositionStatus === "qa_only_composition_metadata", `${recordId} qaComposition must be QA-only metadata`);
  assert(composition.evidenceFacadeRole === REQUIRED_EVIDENCE_FACADE_ROLE, `${recordId} evidenceFacadeRole mismatch`);
  assert(composition.syntheticContextRole === REQUIRED_SYNTHETIC_CONTEXT_ROLE, `${recordId} syntheticContextRole mismatch`);
  assert(composition.evidenceFacadeRole !== composition.syntheticContextRole, `${recordId} evidence/synthetic roles must differ`);
  assertIntegerInRange(composition.recordSeparationIndex, 0, 8, `${recordId} recordSeparationIndex`);
  assertIntegerInRange(composition.recordSeparationCount, 1, 8, `${recordId} recordSeparationCount`);
  assert(composition.recordSeparationIndex < composition.recordSeparationCount, `${recordId} recordSeparationIndex must be less than count`);
  assertNumberInRange(composition.lateralOffsetUnits, -1.2, 1.2, `${recordId} lateralOffsetUnits`);
  assert(typeof composition.streetwallSlot === "string" && composition.streetwallSlot.length > 0, `${recordId} missing streetwallSlot`);
  assertNumberInRange(composition.slotGapUnits, MIN_SLOT_GAP_UNITS, 1, `${recordId} slotGapUnits`);
  assertNumberInRange(composition.footprintDepthUnits, MIN_FOOTPRINT_DEPTH_UNITS, 2, `${recordId} footprintDepthUnits`);
  assertNumberInRange(composition.facadeThicknessUnits, MIN_FACADE_THICKNESS_UNITS, 0.4, `${recordId} facadeThicknessUnits`);
  assertNumberInRange(composition.cornerReturnDepthUnits, MIN_CORNER_RETURN_DEPTH_UNITS, 2, `${recordId} cornerReturnDepthUnits`);
  assertNumberInRange(composition.storefrontSetbackUnits, 0.06, 0.32, `${recordId} storefrontSetbackUnits`);
  assertNumberInRange(composition.signBandDepthUnits, 0.08, 0.36, `${recordId} signBandDepthUnits`);
  assertNumberInRange(composition.windowReliefDepthUnits, 0.04, 0.22, `${recordId} windowReliefDepthUnits`);
  assertNumberInRange(composition.parapetDepthUnits, 0.04, 0.24, `${recordId} parapetDepthUnits`);
  assertNumberInRange(composition.corniceProjectionUnits, 0.08, 0.32, `${recordId} corniceProjectionUnits`);
  assert(typeof composition.streetEdgeAlignment === "string" && composition.streetEdgeAlignment.includes("streetwall"), `${recordId} streetEdgeAlignment must be a streetwall label`);
  assert(composition.contextVisibilityPolicy === REQUIRED_CONTEXT_VISIBILITY_POLICY, `${recordId} contextVisibilityPolicy must keep synthetic context low-contrast`);
  assert(composition.groundPlaneExtent && typeof composition.groundPlaneExtent === "object", `${recordId} missing groundPlaneExtent`);
  assertNumberInRange(composition.groundPlaneExtent.sidewalkDepthUnits, 0.36, 1.2, `${recordId} groundPlaneExtent.sidewalkDepthUnits`);
  assertNumberInRange(composition.groundPlaneExtent.curbDepthUnits, 0.04, 0.18, `${recordId} groundPlaneExtent.curbDepthUnits`);
  assertNumberInRange(composition.groundPlaneExtent.streetDepthUnits, 0.42, 1.4, `${recordId} groundPlaneExtent.streetDepthUnits`);
  assertNumberInRange(composition.widthScale, 0.45, 1.2, `${recordId} widthScale`);
  assertNumberInRange(composition.basePlaneRatio, 0.22, 0.5, `${recordId} basePlaneRatio`);
  assertNumberInRange(composition.upperPlaneRatio, 0.5, 0.78, `${recordId} upperPlaneRatio`);
  assert(Math.abs(composition.basePlaneRatio + composition.upperPlaneRatio - 1) < 0.02, `${recordId} base/upper ratios must sum to 1`);
  assertNumberInRange(composition.storefrontRecessDepth, 0, 0.2, `${recordId} storefrontRecessDepth`);
  assertNumberInRange(composition.upperProjectionDepth, 0, 0.16, `${recordId} upperProjectionDepth`);
  assertNumberInRange(composition.signBandProjectionDepth, 0.04, 0.22, `${recordId} signBandProjectionDepth`);
  assert(typeof composition.depthProfile === "string" && composition.depthProfile.length > 0, `${recordId} missing depthProfile`);
  assert(composition.sideReturn && typeof composition.sideReturn === "object", `${recordId} missing sideReturn`);
  assert(typeof composition.sideReturn.enabled === "boolean", `${recordId} sideReturn.enabled must be boolean`);
  assert(["left", "right"].includes(composition.sideReturn.edge), `${recordId} sideReturn.edge must be left/right`);
  assertNumberInRange(composition.sideReturn.depthUnits, 0, 0.7, `${recordId} sideReturn.depthUnits`);
  assert(composition.sideReturn.enabled === true, `${recordId} 4E-5 requires a real side return`);
  assert(composition.sideReturn.depthUnits >= MIN_CORNER_RETURN_DEPTH_UNITS, `${recordId} sideReturn depth below 4E-5 minimum`);
  assert(Math.abs(composition.sideReturn.depthUnits - composition.cornerReturnDepthUnits) < 0.001, `${recordId} sideReturn depth must match cornerReturnDepthUnits`);
  assertNumberInRange(composition.sideReturn.widthRatio, 0.05, 0.28, `${recordId} sideReturn.widthRatio`);
  assert(composition.grounding && typeof composition.grounding === "object", `${recordId} missing grounding`);
  for (const key of ["sidewalk", "curb", "crosswalk"]) {
    assert(typeof composition.grounding[key] === "boolean", `${recordId} grounding.${key} must be boolean`);
  }
  assert(composition.grounding.sidewalk === true, `${recordId} 4E-5 requires sidewalk ground contact`);
  assert(composition.grounding.curb === true, `${recordId} 4E-5 requires curb ground contact`);
  verifyRenderLegibility(composition.renderLegibility, recordId);
}

function verifyRenderLegibility(renderLegibility, recordId) {
  assert(renderLegibility && typeof renderLegibility === "object", `${recordId} missing renderLegibility`);
  assertNumberInRange(renderLegibility.primaryMassOpacity, MIN_PRIMARY_MASS_OPACITY, 1, `${recordId} renderLegibility.primaryMassOpacity`);
  assertNumberInRange(renderLegibility.frontFaceOpacity, MIN_FRONT_FACE_OPACITY, 1, `${recordId} renderLegibility.frontFaceOpacity`);
  assertNumberInRange(renderLegibility.returnWallOpacity, MIN_RETURN_WALL_OPACITY, 1, `${recordId} renderLegibility.returnWallOpacity`);
  assertNumberInRange(renderLegibility.baseOpacity, MIN_BASE_OPACITY, 1, `${recordId} renderLegibility.baseOpacity`);
  assertNumberInRange(renderLegibility.groundContactOpacity, MIN_GROUND_CONTACT_OPACITY, 1, `${recordId} renderLegibility.groundContactOpacity`);
  assertNumberInRange(renderLegibility.minimumRenderedGapUnits, MIN_RENDERED_GAP_UNITS, 1, `${recordId} renderLegibility.minimumRenderedGapUnits`);
  assertSetIncludes(new Set(renderLegibility.silhouetteHierarchy), REQUIRED_SILHOUETTE_HIERARCHY, `${recordId} renderLegibility.silhouetteHierarchy`);
}

function computeRenderedExtent(record, geometryCue) {
  const plane = geometryCue?.geometryDerived?.streetFacingPlane;
  assert(plane, `${record.cueRecordId} missing geometry cue streetFacingPlane`);
  const sourceLength = Math.max(plane.xMax - plane.xMin, 0.2);
  const composition = record.qaComposition;
  const length = Math.max(sourceLength * composition.widthScale, 0.16);
  const centerX = plane.xMin + sourceLength / 2 + composition.lateralOffsetUnits;
  return {
    xMin: centerX - length / 2,
    xMax: centerX + length / 2,
    length,
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
      assert(gap >= MIN_RENDERED_GAP_UNITS, `${cornerScope} rendered gap between ${previous.recordId} and ${current.recordId} is ${gap.toFixed(3)}, below ${MIN_RENDERED_GAP_UNITS}`);
    }
  }
}

function assertNumberInRange(value, min, max, label) {
  assert(Number.isFinite(value), `${label} must be a finite number`);
  assert(value >= min && value <= max, `${label} must be between ${min} and ${max}`);
}

function assertIntegerInRange(value, min, max, label) {
  assert(Number.isInteger(value), `${label} must be an integer`);
  assert(value >= min && value <= max, `${label} must be between ${min} and ${max}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
