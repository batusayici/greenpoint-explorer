import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json" with { type: "json" };
import geometryFixture from "../src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json" with { type: "json" };
import geometryCueFixture from "../src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json" with { type: "json" };
import qaFacadeSliceFixture from "../src/data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json" with { type: "json" };
import { buildPhase4BRuntimeScene } from "../src/phase4bRuntimeScene.js";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const reportPath = resolve(
  repoRoot,
  "src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json",
);

const manifestPath =
  "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
const geometryFixturePath =
  "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const runtimeBuilderPath = "src/phase4bRuntimeScene.js";
const geometryCueFixturePath =
  "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";
const qaFacadeSliceFixturePath =
  "src/data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json";

const requiredBlockedClaims = [
  "active-business-status",
  "business-identity",
  "business-storefront-anchor",
  "entrance-location",
  "exact-address-placement",
  "exact-facade-appearance",
  "facade-material",
  "production-public-readiness",
  "signage",
  "storefront-order",
  "storefront-segmentation",
  "tenant-frontage",
  "window-door-layout",
];

const allowedConfidenceLabels = new Set(["safe", "uncertain", "blocked"]);
const allowedEligibility = new Set([
  "geometry_container_candidate_only",
  "geometry_review_required",
  "blocked_until_geometry_resolved",
]);

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const report = buildGeometryValidationReport();
  const reportText = `${JSON.stringify(report, null, 2)}\n`;

  if (shouldWrite) {
    await writeFile(reportPath, reportText, "utf8");
    console.log(`Wrote Phase 4D geometry validation report: ${reportPath}`);
    return;
  }

  const actualText = await readFile(reportPath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== reportText) {
    failures.push("Geometry validation report does not match deterministic output from the existing 4B/4C runtime inputs.");
  }

  validateReport(actual, failures);

  if (failures.length) {
    throw new Error(`Phase 4D geometry validation failed:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `Phase 4D geometry validation verified (${actual.summary.renderedBuildingCount} buildings; safe=${actual.summary.confidenceCounts.safe}, uncertain=${actual.summary.confidenceCounts.uncertain}, blocked=${actual.summary.confidenceCounts.blocked}).`,
  );
}

function buildGeometryValidationReport() {
  const runtimeScene = buildPhase4BRuntimeScene(manifest, geometryFixture);
  const geometryCueByTarget = new Map(geometryCueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));
  const qaFacadeSliceTargets = new Set(qaFacadeSliceFixture.facades.map((facade) => facade.targetSemanticId));
  const sourceObjectsById = new Map(manifest.semanticObjects.map((object) => [object.id, object]));
  const geometryRecordsById = new Map((geometryFixture.footprintRecords ?? []).map((record) => [record.id, record]));
  const baseBblCounts = countBy(
    runtimeScene.buildings,
    (building) => geometryRecordsById.get(building.geometryReferenceId)?.sourceProperties?.baseBbl ?? "missing",
  );
  const orderBySide = buildRelativeOrderBySide(runtimeScene.buildings);
  const buildingRecords = runtimeScene.buildings
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((building) => {
      const sourceObject = sourceObjectsById.get(building.id);
      const geometryRecord = geometryRecordsById.get(building.geometryReferenceId);
      const geometryCue = geometryCueByTarget.get(building.id);
      return buildBuildingRecord({
        building,
        sourceObject,
        geometryRecord,
        geometryCue,
        qaFacadeSliceTargets,
        baseBblCounts,
        orderBySide,
      });
    });
  const confidenceCounts = countBy(buildingRecords, (record) => record.geometryConfidence.label);
  const gapCounts = countBy(buildingRecords, (record) => record.gapAndBlockBreak.status);
  const sideCounts = countBy(buildingRecords, (record) => record.corridorSide);
  const eligibilityCounts = countBy(buildingRecords, (record) => record.poiMatchingEligibility.status);

  return {
    schemaVersion: "phase-4d-geometry-validation-report.v0.1",
    reportId: "p4d-geometry-validation-greenpoint-ave-manhattan-to-franklin",
    phase: "4D-1",
    reviewOnly: true,
    status: "generated-review-only-geometry-validation-gap-report",
    generatedFrom: {
      sceneManifestPath: manifestPath,
      geometryFixturePath,
      runtimeBuilderPath,
      geometryCueFixturePath,
      qaFacadeSliceFixturePath,
      sourcePolicy: "existing-4b-4c-manifest-runtime-and-geometry-only",
    },
    reportPolicy: {
      normalModeUse: "not-rendered",
      qaModeUse: "building-geometry-confidence-and-gap-inspection-only",
      noSourceExpansion: true,
      noPoiOverlay: true,
      noFacadeImagery: true,
      noStorefrontAnchors: true,
      noProductionClaims: true,
      claimLimit: "Stylized/normalized geometry confidence review only; not survey-grade correctness.",
      requiredBlockedClaims,
    },
    summary: {
      renderedBuildingCount: buildingRecords.length,
      geometryCueCount: geometryCueFixture.cues.length,
      qaFacadeSliceCount: qaFacadeSliceFixture.facades.length,
      confidenceCounts: withDefaults(confidenceCounts, ["safe", "uncertain", "blocked"]),
      sideCounts: withDefaults(sideCounts, ["left", "right", "unknown"]),
      gapStatusCounts: withDefaults(gapCounts, ["continuous", "block-break-before", "block-break-after", "block-break-both", "unknown"]),
      poiEligibilityCounts: withDefaults(eligibilityCounts, Array.from(allowedEligibility)),
    },
    manualReviewGates: [
      "Batu must review geometry confidence before POI, facade evidence, or storefront anchor work opens.",
      "Safe means the current stylized geometry container is suitable for later review; it does not prove tenant, frontage, facade, entrance, signage, exact address, active status, or production readiness.",
      "Uncertain and blocked records require geometry review or source/evidence decisions before later matching can rely on them.",
    ],
    buildingRecords,
  };
}

function buildBuildingRecord({
  building,
  sourceObject,
  geometryRecord,
  geometryCue,
  qaFacadeSliceTargets,
  baseBblCounts,
  orderBySide,
}) {
  const issues = [];
  const hasSourcePolygon = Array.isArray(geometryRecord?.scenePolygon) && geometryRecord.scenePolygon.length >= 3;
  const hasWgs84Polygon = Array.isArray(geometryRecord?.wgs84Polygon) && geometryRecord.wgs84Polygon.length >= 3;
  const geometryStatus = building.sourceGeometryStatus ?? sourceObject?.geometryReference?.geometryStatus ?? "unknown";
  const coverageStatus = building.contextCoverageStatus ?? "unknown";
  const sideKnown = building.corridorSide === "left" || building.corridorSide === "right";
  const heightClaim = (building.allowedClaims ?? []).find((claim) => claim.claimClass === "building-height-context");
  const heightStatus = heightClaim?.status ?? "missing";
  const hasHeightContext = heightStatus === "source_backed_contextual";
  const hasValidMassing = building.dimensions.width > 0 && building.dimensions.depth > 0 && building.dimensions.height > 0;
  const hasGeometryCue = Boolean(geometryCue);
  const baseBbl = geometryRecord?.sourceProperties?.baseBbl ?? "missing";
  const duplicateBaseBblCount = baseBbl === "missing" ? 0 : baseBblCounts.get(baseBbl) ?? 0;
  const hasAddressAmbiguity = baseBbl === "missing" || duplicateBaseBblCount > 1;

  if (!hasSourcePolygon) issues.push("missing-scene-polygon");
  if (!hasWgs84Polygon) issues.push("missing-wgs84-polygon");
  if (geometryStatus !== "source_backed_contextual") issues.push(`geometry-status-${geometryStatus}`);
  if (coverageStatus !== "source-backed") issues.push(`coverage-${coverageStatus}`);
  if (!sideKnown) issues.push("unknown-corridor-side");
  if (!hasValidMassing) issues.push("invalid-runtime-massing");
  if (!hasGeometryCue) issues.push("missing-4c-geometry-cue");
  if (!hasHeightContext) issues.push(`height-${heightStatus}`);
  if (hasAddressAmbiguity) issues.push(baseBbl === "missing" ? "missing-tax-lot-context" : "multi-building-tax-lot-context");

  const geometryConfidence = classifyGeometryConfidence({
    issues,
    hasSourcePolygon,
    hasValidMassing,
    sideKnown,
    hasGeometryCue,
    hasHeightContext,
    hasAddressAmbiguity,
  });
  const relativeOrder = orderBySide.get(building.id) ?? null;
  const gapAndBlockBreak = buildGapStatus(geometryCue);
  const poiMatchingEligibility = buildEligibility(geometryConfidence.label, hasAddressAmbiguity);
  const facadeEvidenceAnchorEligibility = buildFacadeEvidenceEligibility(geometryConfidence.label);

  return {
    renderedObjectId: building.id,
    sourceRecordId: building.sourceRecordId,
    sourceFootprintId: building.geometryReferenceId,
    sourceBuildingId: geometryRecord?.sourceProperties?.bin ?? building.geometryReferenceId,
    sourceTaxLotId: baseBbl,
    corridorSide: building.corridorSide ?? "unknown",
    relativeOrder,
    sourceAndReviewStatus: {
      sourceRecordStatus: building.qa?.sourceRecordStatus ?? "unknown",
      geometryStatus,
      coverageStatus,
      runtimeProjectionStatus: "stylized_normalized_review_geometry",
      qaFacadeSliceStatus: qaFacadeSliceTargets.has(building.id)
        ? "manual_draft_fictional_safe_not_verified"
        : "not_in_qa_facade_slice",
    },
    geometryConfidence,
    massingConfidence: {
      status: hasHeightContext ? "source_backed_contextual" : "uncertain_height_context",
      heightSource: sourceObject?.primitiveMassing?.heightSource ?? "unknown",
      heightTier: geometryCue?.geometryDerived?.heightTier ?? "unknown",
      widthTier: geometryCue?.geometryDerived?.widthTier ?? "unknown",
      depthTier: geometryCue?.geometryDerived?.depthTier ?? "unknown",
      dimensions: roundDimensions(building.dimensions),
    },
    gapAndBlockBreak,
    addressBuildingAmbiguity: {
      status: hasAddressAmbiguity ? "ambiguous" : "not_detected_in_existing_geometry",
      reason: baseBbl === "missing"
        ? "No baseBbl is present in the existing footprint properties."
        : duplicateBaseBblCount > 1
          ? "Multiple rendered building masses share this tax-lot identifier in the existing geometry."
          : "One rendered building mass is associated with this tax-lot identifier in the current report.",
      sameTaxLotRenderedBuildingCount: duplicateBaseBblCount,
    },
    poiMatchingEligibility,
    facadeEvidenceAnchorEligibility,
    blockedClaims: requiredBlockedClaims,
    reviewNotes: [
      "This report validates the current stylized geometry container only.",
      "It does not attach POIs, facade evidence, storefront anchors, business identity, frontage, entrances, signage, exact address placement, or production readiness.",
    ],
  };
}

function classifyGeometryConfidence({
  issues,
  hasSourcePolygon,
  hasValidMassing,
  sideKnown,
  hasGeometryCue,
  hasHeightContext,
  hasAddressAmbiguity,
}) {
  if (!hasSourcePolygon || !hasValidMassing || !sideKnown || !hasGeometryCue) {
    return {
      label: "blocked",
      status: "blocked_until_geometry_resolved",
      reasons: issues,
    };
  }

  if (!hasHeightContext || hasAddressAmbiguity || issues.length) {
    return {
      label: "uncertain",
      status: "review_required_before_later_matching",
      reasons: issues,
    };
  }

  return {
    label: "safe",
    status: "geometry_container_ready_for_later_review",
    reasons: ["source-backed-footprint-side-height-and-cue-present"],
  };
}

function buildGapStatus(geometryCue) {
  const before = geometryCue?.geometryDerived?.blockBreakBefore;
  const after = geometryCue?.geometryDerived?.blockBreakAfter;
  const status = before && after
    ? "block-break-both"
    : before
      ? "block-break-before"
      : after
        ? "block-break-after"
        : geometryCue
          ? "continuous"
          : "unknown";

  return {
    status,
    blockBreakBefore: Boolean(before),
    blockBreakAfter: Boolean(after),
    endpointRole: geometryCue?.geometryDerived?.cornerOrEndpointRole ?? "unknown",
  };
}

function buildEligibility(confidenceLabel, hasAddressAmbiguity) {
  if (confidenceLabel === "safe") {
    return {
      status: "geometry_container_candidate_only",
      reason: "Geometry container is safe for later candidate POI review, but POI sources and storefront assignment remain blocked.",
    };
  }
  if (confidenceLabel === "uncertain" || hasAddressAmbiguity) {
    return {
      status: "geometry_review_required",
      reason: "Geometry or address/building ambiguity must be reviewed before later candidate matching can rely on this object.",
    };
  }
  return {
    status: "blocked_until_geometry_resolved",
    reason: "Required geometry identity, side, massing, or cue information is missing.",
  };
}

function buildFacadeEvidenceEligibility(confidenceLabel) {
  if (confidenceLabel === "safe") {
    return {
      status: "geometry_container_candidate_only",
      reason: "May be considered as a later facade-evidence target after Batu-approved evidence exists; no anchor is created here.",
    };
  }
  if (confidenceLabel === "uncertain") {
    return {
      status: "geometry_review_required",
      reason: "Needs geometry confidence review before facade evidence can be aligned to this object.",
    };
  }
  return {
    status: "blocked_until_geometry_resolved",
    reason: "Do not use for facade evidence alignment until geometry blockers are resolved.",
  };
}

function buildRelativeOrderBySide(buildings) {
  const result = new Map();
  const bySide = Map.groupBy(buildings, (building) => building.corridorSide ?? "unknown");

  for (const [side, sideBuildings] of bySide.entries()) {
    const ordered = sideBuildings.slice().sort((a, b) => {
      const byX = a.centroid.x - b.centroid.x;
      if (byX !== 0) return byX;
      return a.id.localeCompare(b.id);
    });
    ordered.forEach((building, index) => {
      result.set(building.id, {
        side,
        index: index + 1,
        countOnSide: ordered.length,
        orderBasis: "runtime-centroid-x-within-corridor-side",
      });
    });
  }

  return result;
}

function validateReport(report, failures) {
  if (report.schemaVersion !== "phase-4d-geometry-validation-report.v0.1") failures.push("Unexpected schemaVersion.");
  if (report.phase !== "4D-1") failures.push("Report phase must be 4D-1.");
  if (report.reviewOnly !== true) failures.push("Report must be review-only.");
  if (report.reportPolicy?.normalModeUse !== "not-rendered") failures.push("Report must keep normal mode protected.");
  if (report.reportPolicy?.noSourceExpansion !== true) failures.push("Report must forbid source expansion.");
  if (report.reportPolicy?.noPoiOverlay !== true) failures.push("Report must forbid POI overlays.");
  if (report.reportPolicy?.noFacadeImagery !== true) failures.push("Report must forbid facade imagery.");
  if (report.reportPolicy?.noStorefrontAnchors !== true) failures.push("Report must forbid storefront anchors.");
  if (report.summary?.renderedBuildingCount !== report.buildingRecords?.length) {
    failures.push("Summary renderedBuildingCount does not match buildingRecords length.");
  }

  const runtimeScene = buildPhase4BRuntimeScene(manifest, geometryFixture);
  const runtimeBuildingIds = new Set(runtimeScene.buildings.map((building) => building.id));
  const seenIds = new Set();

  for (const record of report.buildingRecords ?? []) {
    if (seenIds.has(record.renderedObjectId)) failures.push(`Duplicate renderedObjectId ${record.renderedObjectId}.`);
    seenIds.add(record.renderedObjectId);
    if (!runtimeBuildingIds.has(record.renderedObjectId)) failures.push(`${record.renderedObjectId} does not exist in runtime buildings.`);
    if (!allowedConfidenceLabels.has(record.geometryConfidence?.label)) {
      failures.push(`${record.renderedObjectId} has invalid confidence label ${record.geometryConfidence?.label}.`);
    }
    if (!allowedEligibility.has(record.poiMatchingEligibility?.status)) {
      failures.push(`${record.renderedObjectId} has invalid POI eligibility ${record.poiMatchingEligibility?.status}.`);
    }
    if (!allowedEligibility.has(record.facadeEvidenceAnchorEligibility?.status)) {
      failures.push(`${record.renderedObjectId} has invalid facade evidence eligibility ${record.facadeEvidenceAnchorEligibility?.status}.`);
    }
    for (const claim of requiredBlockedClaims) {
      if (!record.blockedClaims?.includes(claim)) failures.push(`${record.renderedObjectId} is missing blocked claim ${claim}.`);
    }
    if (record.poiMatchingEligibility?.status === "geometry_container_candidate_only" && record.geometryConfidence?.label !== "safe") {
      failures.push(`${record.renderedObjectId} cannot be POI candidate with non-safe geometry.`);
    }
  }

  if (seenIds.size !== runtimeBuildingIds.size) {
    failures.push(`Report building count ${seenIds.size} does not match runtime building count ${runtimeBuildingIds.size}.`);
  }
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function withDefaults(counts, keys) {
  const result = {};
  for (const key of keys.sort()) result[key] = counts.get(key) ?? 0;
  for (const [key, value] of [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!Object.hasOwn(result, key)) result[key] = value;
  }
  return result;
}

function roundDimensions(dimensions) {
  return {
    width: roundNumber(dimensions.width),
    depth: roundNumber(dimensions.depth),
    height: roundNumber(dimensions.height),
  };
}

function roundNumber(value) {
  return Number.parseFloat(Number(value).toFixed(3));
}
