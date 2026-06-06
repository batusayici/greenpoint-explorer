import manifest from "../src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json" with { type: "json" };
import geometryFixture from "../src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json" with { type: "json" };
import geometryCueFixture from "../src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json" with { type: "json" };
import qaFacadeSliceFixture from "../src/data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json" with { type: "json" };
import { buildPhase4BRuntimeScene } from "../src/phase4bRuntimeScene.js";

const allowedModules = new Set([
  "bay-divisions",
  "upper-lower-split",
  "window-row-placeholder",
  "sign-band-placeholder",
  "awning-placeholder",
  "parapet-cornice-tier",
  "endpoint-corner-emphasis",
]);

const requiredStatusLabels = new Set(["manual_draft", "fictional_safe", "not_verified"]);

const requiredBlockedClaims = [
  "active-business-status",
  "business-identity",
  "business-storefront-anchor",
  "entrance-location",
  "exact-address-placement",
  "exact-facade-appearance",
  "exact-frontage",
  "facade-material",
  "production-public-readiness",
  "real-signage",
  "storefront-order",
  "storefront-segmentation",
  "tenant-frontage",
  "window-door-layout",
];

const forbiddenKeys = [
  "address",
  "brand",
  "business",
  "door",
  "entrance",
  "exact",
  "facadeMaterial",
  "frontage",
  "logo",
  "material",
  "signText",
  "storefront",
  "tenant",
  "windowLayout",
];

main();

function main() {
  const failures = [];
  const runtimeScene = buildPhase4BRuntimeScene(manifest, geometryFixture);
  const buildingIds = new Set(runtimeScene.buildings.map((building) => building.id));
  const geometryCueByTarget = new Map(geometryCueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));

  validateFixtureShape(qaFacadeSliceFixture, failures);
  validateSliceTargets(qaFacadeSliceFixture, buildingIds, geometryCueByTarget, failures);
  validateFacadeRecords(qaFacadeSliceFixture, geometryCueByTarget, failures);

  if (failures.length) {
    throw new Error(`Phase 4C QA facade slice failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4C QA facade slice verified (${qaFacadeSliceFixture.facades.length} manual_draft / fictional_safe / not_verified records).`,
  );
}

function validateFixtureShape(fixture, failures) {
  if (fixture.schemaVersion !== "phase-4c-qa-facade-slice.v0.1") {
    failures.push("Unexpected QA facade slice schemaVersion.");
  }
  if (fixture.phase !== "4C-4") failures.push("QA facade slice phase must be 4C-4.");
  if (fixture.reviewOnly !== true) failures.push("QA facade slice must be review-only.");
  if (fixture.renderPolicy?.normalModeUse !== "not-rendered") {
    failures.push("QA facade slice must not render in normal mode.");
  }
  for (const label of requiredStatusLabels) {
    if (!fixture.statusLabels?.includes(label)) failures.push(`Fixture statusLabels is missing ${label}.`);
  }
  for (const module of fixture.allowedModules ?? []) {
    if (!allowedModules.has(module)) failures.push(`Unsupported allowed module ${module}.`);
  }
  for (const claim of requiredBlockedClaims) {
    if (!fixture.blockedClaims?.includes(claim)) failures.push(`Fixture blockedClaims is missing ${claim}.`);
  }
}

function validateSliceTargets(fixture, buildingIds, geometryCueByTarget, failures) {
  const targets = fixture.selectedSlice?.targetSemanticIds ?? [];
  const facades = fixture.facades ?? [];
  const facadeTargets = new Set(facades.map((facade) => facade.targetSemanticId));

  if (targets.length < 6 || targets.length > 10) {
    failures.push(`Selected slice must include 6-10 buildings, found ${targets.length}.`);
  }
  if (facades.length !== targets.length) {
    failures.push("Facade record count must match selectedSlice target count.");
  }
  if (new Set(targets).size !== targets.length) failures.push("Selected slice includes duplicate target IDs.");

  for (const targetId of targets) {
    if (!buildingIds.has(targetId)) failures.push(`Selected target does not exist in runtime buildings: ${targetId}`);
    if (!geometryCueByTarget.has(targetId)) failures.push(`Selected target lacks an existing 4C geometry cue: ${targetId}`);
    if (!facadeTargets.has(targetId)) failures.push(`Selected target lacks a facade record: ${targetId}`);
  }
}

function validateFacadeRecords(fixture, geometryCueByTarget, failures) {
  const seenIds = new Set();

  for (const facade of fixture.facades ?? []) {
    if (seenIds.has(facade.id)) failures.push(`Duplicate facade id: ${facade.id}`);
    seenIds.add(facade.id);

    const geometryCue = geometryCueByTarget.get(facade.targetSemanticId);
    if (!geometryCue) continue;

    if (facade.geometryCueId !== geometryCue.id) {
      failures.push(`${facade.id} does not reference the matching 4C geometry cue.`);
    }
    if (facade.targetSourceRecordId !== geometryCue.targetSourceRecordId) {
      failures.push(`${facade.id} source record does not match the existing geometry cue.`);
    }
    if (facade.corridorSide !== geometryCue.corridorSide) {
      failures.push(`${facade.id} corridor side does not match the existing geometry cue.`);
    }
    if (geometryCue.geometryDerived?.cornerOrEndpointRole !== "franklin-end-review-band") {
      failures.push(`${facade.id} is not inside the selected Franklin-end review band.`);
    }
    if (facade.claimStatus !== "manual_draft") failures.push(`${facade.id} must remain manual_draft.`);
    if (facade.allowedUse !== "qa-mode-recognizable-street-feel-review-only") {
      failures.push(`${facade.id} must be QA-mode review only.`);
    }
    for (const label of requiredStatusLabels) {
      if (!facade.statusLabels?.includes(label)) failures.push(`${facade.id} is missing status label ${label}.`);
    }
    for (const claim of requiredBlockedClaims) {
      if (!facade.blockedClaims?.includes(claim)) failures.push(`${facade.id} is missing blocked claim ${claim}.`);
    }
    validateModules(facade, failures);
    validateNoForbiddenClaimKeys(facade, failures);
  }
}

function validateModules(facade, failures) {
  const modules = facade.modules ?? {};
  const numericRules = [
    ["bayCount", 1, 6],
    ["upperRows", 0, 3],
    ["lowerSplitRatio", 0.25, 0.7],
    ["signBandRatio", 0.22, 0.5],
    ["awningSegments", 0, 5],
    ["parapetTiers", 0, 3],
  ];

  for (const [key, min, max] of numericRules) {
    const value = modules[key];
    if (!Number.isFinite(value) || value < min || value > max) {
      failures.push(`${facade.id} has invalid module value ${key}: ${value}`);
    }
  }
  if (!["none", "left-edge", "right-edge"].includes(modules.endpointEmphasis)) {
    failures.push(`${facade.id} has invalid endpointEmphasis ${modules.endpointEmphasis}.`);
  }
}

function validateNoForbiddenClaimKeys(value, failures, path = "fixture") {
  if (!value || typeof value !== "object") return;

  for (const [key, childValue] of Object.entries(value)) {
    if (forbiddenKeys.includes(key)) failures.push(`${path} includes forbidden claim key ${key}.`);
    validateNoForbiddenClaimKeys(childValue, failures, `${path}.${key}`);
  }
}
