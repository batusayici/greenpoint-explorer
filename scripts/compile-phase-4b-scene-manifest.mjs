#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_FIXTURE_PATH = "src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json";
const DEFAULT_OUTPUT_PATH = "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
const COMPILER_ID = "phase-4b-primitive-scene-manifest-compiler";
const COMPILER_VERSION = "0.1";
const MANIFEST_SCHEMA_VERSION = "phase-4b-semantic-scene-manifest.v0.1";
const BUILDING_FOOTPRINT_SOURCE_ID = "p4b-source-nyc-open-data-building-footprints";
const CORRIDOR_CENTERLINE_GEOMETRY_ID = "nyc-centerline-physicalid-47237";
const CONTEXT_FOOTPRINT_SIDE_LIMIT = 50;
const FRANKLIN_CROSS_STREET_REVIEW_CONTEXT_IDS = new Set([
  "nyc-footprint-bin-3337033",
]);
const REQUIRED_BLOCKED_CLAIMS = new Set([
  "tenant-frontage",
  "storefront-order",
  "storefront-anchor",
  "storefront-segmentation",
  "business-identity",
  "business-active-status",
  "entrance-location",
  "facade-appearance",
  "exact-address-placement",
  "raster-readiness",
]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await compileSceneManifest(options.fixturePath);
  const manifestText = stableStringify(manifest);

  if (options.check) {
    await verifyDeterminism(options.fixturePath, options.outputPath, manifestText);
    return;
  }

  await writeFile(resolve(repoRoot, options.outputPath), manifestText, "utf8");
  console.log(`Wrote ${options.outputPath}`);
}

async function compileSceneManifest(fixturePath) {
  const fixture = await readJson(fixturePath);
  const geometryFixture = await readJson(fixture.sourcePacket.normalizedPath);
  const sourceFixtureSha256 = await sha256(fixturePath);
  const sourceById = new Map(fixture.sources.map((source) => [source.id, source]));
  const manualAssumptionById = new Map(fixture.manualAssumptions.map((assumption) => [assumption.id, assumption]));
  const sourceRecords = [
    ...fixture.sourceRecords,
    ...buildContextFootprintRecords(fixture, geometryFixture),
  ].sort((a, b) => a.id.localeCompare(b.id));
  const sourceRecordById = new Map(sourceRecords.map((record) => [record.id, record]));

  const semanticObjects = sourceRecords
    .map((record) => buildSemanticObject(record, fixture, geometryFixture, sourceById, manualAssumptionById))
    .sort((a, b) => a.id.localeCompare(b.id));

  const manifest = {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    manifestId: `p4b-scene-manifest-${fixture.corridor.sourceKey}`,
    phase: "4B-3",
    status: "generated-review-only-primitive-scene-manifest",
    reviewOnly: true,
    generatedBy: {
      compilerId: COMPILER_ID,
      compilerVersion: COMPILER_VERSION,
      compilerPath: "scripts/compile-phase-4b-scene-manifest.mjs",
      deterministic: true,
      generatedAt: "deterministic-no-wall-clock",
    },
    generatedFrom: {
      sourceFixtureId: fixture.fixtureId,
      sourceFixturePath: fixturePath,
      sourceFixtureSha256,
      sourcePacketId: fixture.sourcePacket.id,
      normalizedGeometryPath: fixture.sourcePacket.normalizedPath,
      normalizedGeometrySha256: fixture.sourcePacket.normalizedSha256,
      rawSourcePacketPath: fixture.sourcePacket.rawPath,
      rawSourcePacketSha256: fixture.sourcePacket.rawSha256,
    },
    corridor: {
      id: fixture.corridor.id,
      sourceKey: fixture.corridor.sourceKey,
      label: fixture.corridor.label,
      sourceGeometryFixtureId: fixture.corridor.sourceGeometryFixtureId,
      geometryStatus: fixture.corridor.geometryStatus,
      sceneProjectionStatus: fixture.corridor.sceneProjectionStatus,
      claimLimit: fixture.corridor.claimLimit,
    },
    sourceReferences: fixture.sources
      .map((source) => ({
        id: source.id,
        sourceFixtureId: source.sourceFixtureId,
        label: source.label,
        usageStatus: source.usageStatus,
        attributionRequired: source.attributionRequired,
        provenancePath: source.provenancePath,
        allowedClaimClasses: sorted(source.allowedClaimClasses),
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    stableIds: buildStableIds(fixture, semanticObjects),
    claimState: {
      allowedClaimClasses: sorted(fixture.claimPolicy.allowedClaimClasses),
      blockedClaimClasses: sorted(fixture.claimPolicy.blockedClaimClasses),
      blockedClaimsPreserved: fixture.claimPolicy.blockedClaimClasses.length,
      inferencePolicy: "blocked-claims-must-remain-blocked; no tenant-frontage, entrance, facade, storefront-order, business-placement, or exact-address inference",
    },
    sceneStructure: {
      sceneKind: "future-3d-graybox-corridor",
      rendererStatus: "not_implemented_in_4b_3",
      coordinateSystems: [
        {
          id: "wgs84-source",
          status: "source_backed_contextual",
          use: "source provenance and future spatial checks",
        },
        {
          id: "stylized-scene-projection",
          status: "manual_draft",
          use: "future graybox placement only; not exact GIS or raster proof",
        },
      ],
      objectOrder: semanticObjects.map((object) => object.id),
      futureRendererRequirements: [
        "pan",
        "zoom",
        "orbit_or_rotate",
        "semantic_id_inspection",
        "hover_click_hooks_resolve_through_semantic_ids",
        "qa_provenance_blocked_claim_visibility",
      ],
    },
    contextCoverage: buildContextCoverageSummary(sourceRecords),
    semanticObjects,
    storefrontAnchors: buildStorefrontAnchors(fixture),
    qa: {
      provenancePreserved: true,
      stableIdsPreserved: true,
      blockedClaimsPreserved: true,
      hiddenInferenceIntroduced: false,
      runtimeImplemented: false,
      rendererImplemented: false,
      assetsGenerated: false,
      businessEnrichmentIncluded: false,
      liveApisUsed: false,
      scrapingUsed: false,
      manualAssumptionIds: fixture.manualAssumptions.map((assumption) => assumption.id).sort(),
      verificationNotes: [
        "Manifest is generated from one approved 4B-2 source fixture.",
        "Semantic objects reference source geometry records instead of hand-composed art.",
        "Storefront anchors remain blocked/no-candidate because the fixture does not permit them.",
      ],
    },
  };

  verifyManifest(manifest, sourceRecordById);
  return manifest;
}

function buildContextFootprintRecords(fixture, geometryFixture) {
  const existingGeometryReferences = new Set(fixture.sourceRecords.map((record) => record.geometryReferenceId));
  const centerlineRecord = geometryFixture.streetCenterlineRecords
    ?.find((record) => record.id === CORRIDOR_CENTERLINE_GEOMETRY_ID);
  const centerline = centerlineRecord?.sceneLine;
  const footprintSource = fixture.sources.find((source) => source.id === BUILDING_FOOTPRINT_SOURCE_ID);
  const manualAssumptionId = "p4b-assumption-stylized-scene-projection";
  if (!centerline?.length || !footprintSource) return [];

  return (geometryFixture.footprintRecords ?? [])
    .map((geometryRecord) => ({
      geometryRecord,
      contextCoverage: getFootprintContextCoverage(geometryRecord, centerline),
    }))
    .filter(({ geometryRecord, contextCoverage }) => (
      !existingGeometryReferences.has(geometryRecord.id)
      && contextCoverage.status === "source-backed"
    ))
    .sort((a, b) => {
      const byAxis = a.contextCoverage.corridorAxisT - b.contextCoverage.corridorAxisT;
      if (byAxis !== 0) return byAxis;
      return a.geometryRecord.id.localeCompare(b.geometryRecord.id);
    })
    .map(({ geometryRecord, contextCoverage }) => {
      const sourceKey = geometryRecord.id.replace(/^nyc-/, "nyc-");
      const sourceRecordId = `p4b-record-${sourceKey}`;
      return {
        id: sourceRecordId,
        sourceId: footprintSource.id,
        geometryReferenceId: geometryRecord.id,
        geometryCollection: "footprintRecords",
        generatedInBatch: "4B-5",
        sourceRecordStatus: "compiler-promoted-from-approved-geometry-fixture",
        contextCoverage,
        allowedClaims: [
          {
            claimClass: "building-footprint-context",
            status: "source_backed_contextual",
            provenanceSourceId: footprintSource.id,
            sourceRecordId,
          },
          {
            claimClass: "building-height-context",
            status: geometryRecord.sourceProperties?.heightRoof ? "source_backed_contextual" : "missing",
            provenanceSourceId: footprintSource.id,
            sourceRecordId,
          },
          {
            claimClass: "tax-lot-building-context",
            status: geometryRecord.sourceProperties?.baseBbl ? "source_backed_contextual" : "missing",
            provenanceSourceId: footprintSource.id,
            sourceRecordId,
          },
        ],
        blockedClaimClasses: sorted(fixture.claimPolicy.blockedClaimClasses),
        manualAssumptionRefs: [manualAssumptionId],
      };
    });
}

function getFootprintContextCoverage(geometryRecord, centerline) {
  if (!Array.isArray(geometryRecord.scenePolygon) || geometryRecord.scenePolygon.length < 3) {
    return {
      status: "missing",
      reason: "Footprint has no usable scenePolygon in the approved geometry fixture.",
    };
  }

  const axis = buildLineBasis(centerline[0], centerline[centerline.length - 1]);
  const polygonOffsets = geometryRecord.scenePolygon.map((point) => projectPointToLine(point, axis));
  const centroidOffsets = projectPointToLine(getSceneCentroid(geometryRecord.scenePolygon), axis);
  const minT = Math.min(...polygonOffsets.map((point) => point.t));
  const maxT = Math.max(...polygonOffsets.map((point) => point.t));
  const overlapsCorridor = maxT >= 0 && minT <= axis.length;
  const withinSideBand = Math.abs(centroidOffsets.side) <= CONTEXT_FOOTPRINT_SIDE_LIMIT;
  const isFranklinCrossStreetReviewContext = FRANKLIN_CROSS_STREET_REVIEW_CONTEXT_IDS.has(geometryRecord.id);
  const status = (overlapsCorridor || isFranklinCrossStreetReviewContext) && withinSideBand ? "source-backed" : "out-of-scope";

  return {
    status,
    method: isFranklinCrossStreetReviewContext
      ? "deterministic-corridor-adjacent-footprint-selection-plus-franklin-cross-street-review-context"
      : "deterministic-corridor-adjacent-footprint-selection",
    source: "approved-normalized-geometry-fixture",
    corridorCenterlineGeometryId: CORRIDOR_CENTERLINE_GEOMETRY_ID,
    corridorAxisT: roundForManifest(centroidOffsets.t),
    corridorSide: centroidOffsets.side < 0 ? "left" : "right",
    corridorSideOffset: roundForManifest(centroidOffsets.side),
    footprintAxisMin: roundForManifest(minT),
    footprintAxisMax: roundForManifest(maxT),
    sideLimit: CONTEXT_FOOTPRINT_SIDE_LIMIT,
    reason: status === "source-backed"
      ? isFranklinCrossStreetReviewContext
        ? "Footprint is an approved Franklin cross-street corner review context needed to place the northwest repo-local evidence cluster; it remains contextual and QA-only."
        : "Footprint overlaps the approved corridor centerline segment and its centroid is within the deterministic context side band."
      : "Footprint is outside the deterministic corridor-adjacent context band for 4B-5.",
    notClaims: [
      "tenant-frontage",
      "storefront-order",
      "storefront-anchor",
      "entrance-location",
      "facade-appearance",
      "exact-address-placement",
      "business-identity",
      "business-active-status",
    ],
  };
}

function buildContextCoverageSummary(sourceRecords) {
  const buildingRecords = sourceRecords.filter((record) => record.geometryCollection === "footprintRecords");
  const sourceBackedRecords = buildingRecords.filter((record) => record.contextCoverage?.status === "source-backed");
  return {
    status: "source-backed-context-expanded",
    batch: "4B-5",
    method: "compiler-promotes-corridor-adjacent-footprints-from-approved-normalized-geometry-fixture",
    sourceBackedBuildingCount: sourceBackedRecords.length,
    renderedBuildingCount: buildingRecords.length,
    corridorSideCounts: {
      left: sourceBackedRecords.filter((record) => record.contextCoverage?.corridorSide === "left").length,
      right: sourceBackedRecords.filter((record) => record.contextCoverage?.corridorSide === "right").length,
    },
    labelsUsed: ["source-backed", "missing", "blocked", "out-of-scope"],
    claimLimit: "Building coverage is contextual primitive massing only; not storefronts, frontage, entrances, facades, signage, address placement, or business verification.",
  };
}

function buildSemanticObject(record, fixture, geometryFixture, sourceById, manualAssumptionById) {
  const source = sourceById.get(record.sourceId);
  if (!source) throw new Error(`${record.id} references missing source ${record.sourceId}`);

  const geometryRecord = findGeometryRecord(geometryFixture, record);
  const sourceKey = record.id.replace(/^p4b-record-/, "");
  const objectType = objectTypeForRecord(record);
  const manualAssumptions = record.manualAssumptionRefs.map((id) => {
    const assumption = manualAssumptionById.get(id);
    if (!assumption) throw new Error(`${record.id} references missing manual assumption ${id}`);
    return {
      id: assumption.id,
      status: assumption.status,
      target: assumption.target,
      notClaims: sorted(assumption.notClaims),
    };
  }).sort((a, b) => a.id.localeCompare(b.id));

  return {
    id: `p4b-object-${sourceKey}`,
    stableIdMethod: "p4b-object-{sourceRecordSourceKey}",
    type: objectType,
    semanticRole: semanticRoleForObjectType(objectType),
    corridorId: fixture.corridor.id,
    sourceId: record.sourceId,
    sourceRecordId: record.id,
    geometryReference: {
      sourceGeometryFixturePath: fixture.sourcePacket.normalizedPath,
      collection: record.geometryCollection,
      id: record.geometryReferenceId,
      geometryStatus: geometryRecord.geometryStatus,
      geometryPresence: geometryPresence(geometryRecord),
      useForFutureRenderer: rendererUseForObjectType(objectType),
    },
    primitiveMassing: primitiveMassingForRecord(record, geometryRecord),
    allowedClaims: record.allowedClaims
      .map((claim) => ({
        claimClass: claim.claimClass,
        status: claim.status,
        provenanceSourceId: claim.provenanceSourceId,
        sourceRecordId: claim.sourceRecordId,
      }))
      .sort((a, b) => a.claimClass.localeCompare(b.claimClass)),
    blockedClaimClasses: sorted(record.blockedClaimClasses),
    provenance: {
      sourceFixtureId: source.sourceFixtureId,
      sourceLabel: source.label,
      usageStatus: source.usageStatus,
      attributionRequired: source.attributionRequired,
      provenancePath: source.provenancePath,
      sourceRecordId: record.id,
      geometryReferenceId: record.geometryReferenceId,
    },
    qa: {
      status: "compiled-from-source-fixture",
      sourceRecordStatus: record.sourceRecordStatus ?? "source-fixture-record",
      contextCoverage: record.contextCoverage ?? null,
      manualAssumptions,
      hiddenInferenceIntroduced: false,
      exactFacadeClaim: false,
      exactFrontageClaim: false,
      exactEntranceClaim: false,
      businessPlacementClaim: false,
    },
  };
}

function buildStableIds(fixture, semanticObjects) {
  const sourceFixtureIds = new Set(fixture.stableIds.map((entry) => entry.id));
  const generatedRecordIds = semanticObjects
    .filter((object) => !sourceFixtureIds.has(object.sourceRecordId))
    .map((object) => ({
      id: object.sourceRecordId,
      namespace: "record",
      sourceKey: object.sourceRecordId.replace(/^p4b-record-/, ""),
      method: "p4b-record-{sourceRecordSourceKey}",
      origin: "compiler-4b-5-context-coverage",
    }));

  return [
    ...fixture.stableIds.map((entry) => ({
      id: entry.id,
      namespace: entry.namespace,
      sourceKey: entry.sourceKey,
      method: entry.method,
      origin: "source-fixture",
    })),
    {
      id: `p4b-scene-manifest-${fixture.corridor.sourceKey}`,
      namespace: "scene-manifest",
      sourceKey: fixture.corridor.sourceKey,
      method: "p4b-scene-manifest-{corridorSourceKey}",
      origin: "compiler",
    },
    ...semanticObjects.map((object) => ({
      id: object.id,
      namespace: "object",
      sourceKey: object.sourceRecordId.replace(/^p4b-record-/, ""),
      method: "p4b-object-{sourceRecordSourceKey}",
      origin: "compiler",
    })),
    ...generatedRecordIds,
  ].sort((a, b) => a.id.localeCompare(b.id));
}

function buildStorefrontAnchors(fixture) {
  if (fixture.storefrontAnchorPolicy.status !== "blocked_no_candidates") {
    return {
      status: "requires-future-evidence-review",
      anchors: fixture.storefrontAnchorPolicy.anchors.map((anchor) => ({ ...anchor })),
      reason: fixture.storefrontAnchorPolicy.reason,
    };
  }
  return {
    status: "blocked_no_candidates",
    anchors: [],
    reason: fixture.storefrontAnchorPolicy.reason,
    requiredFutureEvidence: sorted(fixture.storefrontAnchorPolicy.requiredFutureEvidence),
  };
}

function findGeometryRecord(geometryFixture, record) {
  const collection = geometryFixture[record.geometryCollection];
  if (!Array.isArray(collection)) throw new Error(`${record.id} geometry collection ${record.geometryCollection} is missing`);
  const geometryRecord = collection.find((candidate) => candidate.id === record.geometryReferenceId);
  if (!geometryRecord) throw new Error(`${record.id} geometry reference ${record.geometryReferenceId} is missing`);
  return geometryRecord;
}

function objectTypeForRecord(record) {
  if (record.geometryCollection === "footprintRecords") return "primitive-building-massing";
  if (record.geometryCollection === "streetCenterlineRecords") return "corridor-street-centerline";
  if (record.geometryCollection === "sidewalkLineRecords") return "planimetrics-line-context";
  return "source-geometry-reference";
}

function semanticRoleForObjectType(type) {
  if (type === "primitive-building-massing") return "future-graybox-building-massing";
  if (type === "corridor-street-centerline") return "future-corridor-orientation-axis";
  if (type === "planimetrics-line-context") return "future-planimetrics-context-line";
  return "future-source-geometry-reference";
}

function rendererUseForObjectType(type) {
  if (type === "primitive-building-massing") return "extruded-footprint-graybox-candidate";
  if (type === "corridor-street-centerline") return "orientation-and-corridor-axis";
  if (type === "planimetrics-line-context") return "line-context-only-not-sidewalk-surface";
  return "source-reference-only";
}

function primitiveMassingForRecord(record, geometryRecord) {
  if (record.geometryCollection !== "footprintRecords") {
    return {
      status: "not-building-massing",
      extrusionAllowed: false,
      reason: "Record is line/context geometry, not a building footprint.",
    };
  }
  return {
    status: "source_backed_contextual",
    extrusionAllowed: true,
    footprintReferenceId: record.geometryReferenceId,
    contextCoverageStatus: record.contextCoverage?.status ?? "source-backed-minimal-fixture-record",
    contextCoverageMethod: record.contextCoverage?.method ?? "minimal-source-fixture-record",
    corridorSide: record.contextCoverage?.corridorSide ?? "not-classified-in-4b-5",
    corridorSideOffset: record.contextCoverage?.corridorSideOffset ?? null,
    heightSource: geometryRecord.sourceProperties?.heightRoof ? "sourceProperties.heightRoof" : "missing",
    heightValue: geometryRecord.sourceProperties?.heightRoof ?? null,
    exactFacadeClaim: false,
    exactStorefrontOrderClaim: false,
  };
}

function geometryPresence(record) {
  return {
    hasWgs84Line: Array.isArray(record.wgs84Line) && record.wgs84Line.length > 0,
    hasSceneLine: Array.isArray(record.sceneLine) && record.sceneLine.length > 0,
    hasWgs84Polygon: Array.isArray(record.wgs84Polygon) && record.wgs84Polygon.length > 0,
    hasScenePolygon: Array.isArray(record.scenePolygon) && record.scenePolygon.length > 0,
  };
}

function buildLineBasis(start, end) {
  const vector = { x: end.x - start.x, y: end.y - start.y };
  const length = Math.hypot(vector.x, vector.y) || 1;
  return {
    start,
    length,
    unit: { x: vector.x / length, y: vector.y / length },
    normal: { x: -(vector.y / length), y: vector.x / length },
  };
}

function projectPointToLine(point, basis) {
  const delta = { x: point.x - basis.start.x, y: point.y - basis.start.y };
  return {
    t: delta.x * basis.unit.x + delta.y * basis.unit.y,
    side: delta.x * basis.normal.x + delta.y * basis.normal.y,
  };
}

function getSceneCentroid(points) {
  const cleanPoints = removeClosingPoint(points);
  return {
    x: cleanPoints.reduce((sum, point) => sum + point.x, 0) / cleanPoints.length,
    y: cleanPoints.reduce((sum, point) => sum + point.y, 0) / cleanPoints.length,
  };
}

function removeClosingPoint(points) {
  const first = points[0];
  const last = points[points.length - 1];
  if (first?.x === last?.x && first?.y === last?.y) return points.slice(0, -1);
  return points;
}

function roundForManifest(value) {
  return Math.round(value * 1000) / 1000;
}

function verifyManifest(manifest, sourceRecordById) {
  const objectSourceRecords = new Set(manifest.semanticObjects.map((object) => object.sourceRecordId));
  for (const sourceRecordId of sourceRecordById.keys()) {
    if (!objectSourceRecords.has(sourceRecordId)) throw new Error(`Manifest is missing semantic object for ${sourceRecordId}`);
  }
  if (manifest.storefrontAnchors.status === "blocked_no_candidates" && manifest.storefrontAnchors.anchors.length !== 0) {
    throw new Error("Blocked storefront anchors must remain empty.");
  }
  const serialized = JSON.stringify(manifest);
  for (const blockedClaim of REQUIRED_BLOCKED_CLAIMS) {
    if (!serialized.includes(blockedClaim)) throw new Error(`Manifest does not preserve blocked claim ${blockedClaim}`);
  }
  if (serialized.includes("\"businessLinks\"")) throw new Error("Manifest must not include businessLinks.");
}

async function verifyDeterminism(fixturePath, outputPath, currentManifestText) {
  const secondManifestText = stableStringify(await compileSceneManifest(fixturePath));
  if (currentManifestText !== secondManifestText) {
    throw new Error("Compiler is not deterministic across repeated in-process runs.");
  }

  const committedManifestText = await readFile(resolve(repoRoot, outputPath), "utf8");
  if (currentManifestText !== committedManifestText) {
    throw new Error(`Generated manifest drift: ${outputPath} does not match compiler output.`);
  }

  const manifest = JSON.parse(currentManifestText);
  console.log([
    "PASS Phase 4B primitive compiler determinism:",
    `${manifest.manifestId};`,
    `semanticObjects=${manifest.semanticObjects.length};`,
    `sourceFixture=${manifest.generatedFrom.sourceFixtureId};`,
    `storefrontAnchors=${manifest.storefrontAnchors.status}.`,
  ].join(" "));
}

function stableStringify(value) {
  return `${JSON.stringify(sortDeep(value), null, 2)}\n`;
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortDeep(value[key])]),
  );
}

function sorted(values) {
  return [...values].sort();
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

async function sha256(path) {
  return createHash("sha256")
    .update(await readFile(resolve(repoRoot, path)))
    .digest("hex");
}

function parseArgs(args) {
  const options = {
    fixturePath: DEFAULT_FIXTURE_PATH,
    outputPath: DEFAULT_OUTPUT_PATH,
    check: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--fixture") {
      options.fixturePath = requireNext(args, index, arg);
      index += 1;
    } else if (arg === "--output") {
      options.outputPath = requireNext(args, index, arg);
      index += 1;
    } else if (arg === "--check") {
      options.check = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function requireNext(args, index, arg) {
  const value = args[index + 1];
  if (!value) throw new Error(`${arg} requires a value`);
  return value;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
