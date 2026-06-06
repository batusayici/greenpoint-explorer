const BUILDING_TYPE = "primitive-building-massing";
const CENTERLINE_TYPE = "corridor-street-centerline";
const CONTEXT_LINE_TYPE = "planimetrics-line-context";
const PREVIEW_LENGTH = 15;
const PERPENDICULAR_SCALE_MULTIPLIER = 2.15;
const HEIGHT_SCALE = 0.06;
const MIN_BUILDING_HEIGHT = 1;
const DEFAULT_STREET_WIDTH_SOURCE_UNITS = 50;
const SIDEWALK_GUIDE_WIDTH = 0.8;
const PATH_GUIDE_HALF_WIDTH = 0.42;
const RHYTHM_TICK_MIN_SPACING = 0.38;

export function buildPhase4BRuntimeScene(manifest, geometryFixture) {
  assertObject(manifest, "manifest");
  assertObject(geometryFixture, "geometryFixture");

  const semanticObjects = Array.isArray(manifest.semanticObjects) ? manifest.semanticObjects : [];
  const sourceObjects = semanticObjects
    .map((object) => resolveRuntimeObject(object, geometryFixture))
    .filter(Boolean);
  const bounds = getSourceBounds(sourceObjects);
  const transform = createTransform(bounds, sourceObjects);

  const objects = sourceObjects.map((object) => {
    if (object.kind === "building") return buildBuildingObject(object, transform);
    return buildLineObject(object, transform);
  });
  const guide = buildCorridorGuide(sourceObjects, transform, objects);

  return {
    manifestId: manifest.manifestId,
    schemaVersion: manifest.schemaVersion,
    corridor: manifest.corridor,
    storefrontAnchors: manifest.storefrontAnchors,
    claimState: manifest.claimState,
    sourceReferences: manifest.sourceReferences ?? [],
    generatedFrom: manifest.generatedFrom,
    coverage: manifest.contextCoverage ?? null,
    qa: manifest.qa,
    transform: {
      bounds,
      scaleX: transform.scaleX,
      scaleZ: transform.scaleZ,
      centerX: transform.centerX,
      centerY: transform.centerY,
      axisUnit: transform.axisUnit,
      perpendicularUnit: transform.perpendicularUnit,
      note: "Scene-space coordinates are normalized for this graybox preview and are not exact GIS/rendering claims.",
    },
    guide,
    objects,
    buildings: objects.filter((object) => object.kind === "building"),
    lines: objects.filter((object) => object.kind === "line"),
  };
}

function resolveRuntimeObject(object, geometryFixture) {
  const geometryReference = object.geometryReference;
  if (!geometryReference) return null;

  const collection = geometryFixture[geometryReference.collection];
  if (!Array.isArray(collection)) return null;

  const geometryRecord = collection.find((record) => record.id === geometryReference.id);
  if (!geometryRecord) return null;

  if (object.type === BUILDING_TYPE && Array.isArray(geometryRecord.scenePolygon)) {
    return {
      kind: "building",
      semantic: object,
      geometryRecord,
      sourcePoints: cleanPoints(geometryRecord.scenePolygon),
    };
  }

  if (
    (object.type === CENTERLINE_TYPE || object.type === CONTEXT_LINE_TYPE) &&
    Array.isArray(geometryRecord.sceneLine)
  ) {
    return {
      kind: "line",
      semantic: object,
      geometryRecord,
      sourcePoints: cleanPoints(geometryRecord.sceneLine),
    };
  }

  return null;
}

function buildBuildingObject(object, transform) {
  const semantic = object.semantic;
  const height = getBuildingHeight(semantic, object.geometryRecord);
  const points = object.sourcePoints.map((point) => toPreviewPoint(point, transform));
  const centroid = getCentroid(points);
  const dimensions = getPreviewDimensions(points, height);

  return {
    id: semantic.id,
    kind: "building",
    semanticType: semantic.type,
    semanticRole: semantic.semanticRole,
    sourceRecordId: semantic.sourceRecordId,
    geometryReferenceId: semantic.geometryReference.id,
    geometryCollection: semantic.geometryReference.collection,
    height,
    dimensions,
    points,
    centroid,
    primitiveMassing: semantic.primitiveMassing ?? null,
    contextCoverage: semantic.qa?.contextCoverage ?? null,
    contextCoverageStatus: semantic.qa?.contextCoverage?.status
      ?? semantic.primitiveMassing?.contextCoverageStatus
      ?? "source-backed",
    corridorSide: semantic.qa?.contextCoverage?.corridorSide
      ?? semantic.primitiveMassing?.corridorSide
      ?? "unknown",
    allowedClaims: semantic.allowedClaims ?? [],
    blockedClaimClasses: semantic.blockedClaimClasses ?? [],
    provenance: semantic.provenance ?? null,
    qa: semantic.qa ?? null,
    sourceGeometryStatus: semantic.geometryReference.geometryStatus,
    sourceProperties: object.geometryRecord.sourceProperties ?? {},
  };
}

function buildLineObject(object, transform) {
  const semantic = object.semantic;
  const points = object.sourcePoints.map((point) => toPreviewPoint(point, transform));
  const centroid = getCentroid(points);

  return {
    id: semantic.id,
    kind: "line",
    semanticType: semantic.type,
    semanticRole: semantic.semanticRole,
    sourceRecordId: semantic.sourceRecordId,
    geometryReferenceId: semantic.geometryReference.id,
    geometryCollection: semantic.geometryReference.collection,
    points,
    centroid,
    contextCoverage: semantic.qa?.contextCoverage ?? null,
    contextCoverageStatus: semantic.qa?.contextCoverage?.status ?? "source-backed",
    corridorSide: semantic.qa?.contextCoverage?.corridorSide ?? "unknown",
    allowedClaims: semantic.allowedClaims ?? [],
    blockedClaimClasses: semantic.blockedClaimClasses ?? [],
    provenance: semantic.provenance ?? null,
    qa: semantic.qa ?? null,
    sourceGeometryStatus: semantic.geometryReference.geometryStatus,
    sourceProperties: object.geometryRecord.sourceProperties ?? {},
  };
}

function getSourceBounds(objects) {
  const points = objects.flatMap((object) => object.sourcePoints);
  if (!points.length) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  }
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

function createTransform(bounds, objects) {
  const centerline = objects.find((object) => object.semantic.type === CENTERLINE_TYPE);
  const lineStart = centerline?.sourcePoints[0];
  const lineEnd = centerline?.sourcePoints.at(-1);
  const fallbackWidth = Math.max(bounds.maxX - bounds.minX, 1);
  const fallbackDepth = Math.max(bounds.maxY - bounds.minY, 1);
  const rawAxis = lineStart && lineEnd
    ? normalizeVector({ x: lineEnd.x - lineStart.x, y: lineEnd.y - lineStart.y })
    : { x: 1, y: 0 };
  let perpendicularUnit = { x: -rawAxis.y, y: rawAxis.x };
  const lineCenterX = lineStart && lineEnd ? (lineStart.x + lineEnd.x) / 2 : (bounds.minX + bounds.maxX) / 2;
  const lineCenterY = lineStart && lineEnd ? (lineStart.y + lineEnd.y) / 2 : (bounds.minY + bounds.maxY) / 2;

  const buildingPoints = objects
    .filter((object) => object.kind === "building")
    .flatMap((object) => object.sourcePoints);
  const averageBuildingSide = buildingPoints.length
    ? buildingPoints.reduce((sum, point) => {
      const delta = { x: point.x - lineCenterX, y: point.y - lineCenterY };
      return sum + dot(delta, perpendicularUnit);
    }, 0) / buildingPoints.length
    : 1;
  if (averageBuildingSide < 0) {
    perpendicularUnit = { x: -perpendicularUnit.x, y: -perpendicularUnit.y };
  }

  const corridorLength = lineStart && lineEnd
    ? Math.hypot(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y)
    : Math.max(fallbackWidth, fallbackDepth, 1);
  const axisOffsets = objects
    .flatMap((object) => object.sourcePoints)
    .map((point) => dot({ x: point.x - lineCenterX, y: point.y - lineCenterY }, rawAxis));
  const minAxisOffset = axisOffsets.length ? Math.min(...axisOffsets) : -corridorLength / 2;
  const maxAxisOffset = axisOffsets.length ? Math.max(...axisOffsets) : corridorLength / 2;
  const axisRange = Math.max(maxAxisOffset - minAxisOffset, corridorLength, 1);
  const axisCenterOffset = (minAxisOffset + maxAxisOffset) / 2;
  const centerX = lineCenterX + rawAxis.x * axisCenterOffset;
  const centerY = lineCenterY + rawAxis.y * axisCenterOffset;
  const scaleX = PREVIEW_LENGTH / axisRange;

  return {
    centerX,
    centerY,
    axisUnit: rawAxis,
    perpendicularUnit,
    scaleX,
    scaleZ: scaleX * PERPENDICULAR_SCALE_MULTIPLIER,
  };
}

function toPreviewPoint(point, transform) {
  const delta = { x: point.x - transform.centerX, y: point.y - transform.centerY };
  return {
    x: dot(delta, transform.axisUnit) * transform.scaleX,
    z: dot(delta, transform.perpendicularUnit) * transform.scaleZ,
  };
}

function buildCorridorGuide(sourceObjects, transform, objects) {
  const sourceCenterline = sourceObjects.find((object) => object.semantic.type === CENTERLINE_TYPE);
  const centerline = objects.find((object) => object.semanticType === CENTERLINE_TYPE);
  if (!sourceCenterline || !centerline || centerline.points.length < 2) return null;

  const streetWidth = Number.parseFloat(sourceCenterline.geometryRecord.streetWidth)
    || Number.parseFloat(sourceCenterline.geometryRecord.sourceProperties?.streetWidth)
    || DEFAULT_STREET_WIDTH_SOURCE_UNITS;
  const halfStreetWidth = Math.max((streetWidth / 2) * transform.scaleZ, 0.7);
  const sourceStart = centerline.points[0];
  const sourceEnd = centerline.points.at(-1);
  const allScenePoints = objects.flatMap((object) => object.points);
  const minX = Math.min(sourceStart.x, sourceEnd.x, ...allScenePoints.map((point) => point.x)) - 0.8;
  const maxX = Math.max(sourceStart.x, sourceEnd.x, ...allScenePoints.map((point) => point.x)) + 0.8;
  const start = { x: minX, z: 0 };
  const end = { x: maxX, z: 0 };
  const rhythmTicks = buildRhythmTicks(objects, halfStreetWidth, SIDEWALK_GUIDE_WIDTH);
  const endpointBandHalfWidth = Math.max(halfStreetWidth + SIDEWALK_GUIDE_WIDTH + 0.18, 1.3);

  return {
    status: "visual_qa_guide",
    note: "Street-edge, endpoint, path, and rhythm bands are deterministic visual QA guides derived from the existing centerline direction, recorded street width, manifest endpoint text, and source-backed object extents; they are not frontage, curb, sidewalk-surface, endpoint-survey, or facade claims.",
    centerline: [sourceStart, sourceEnd],
    guideAxis: [start, end],
    streetPolygon: offsetBand(start, end, -halfStreetWidth, halfStreetWidth),
    pathBand: offsetBand(start, end, -PATH_GUIDE_HALF_WIDTH, PATH_GUIDE_HALF_WIDTH),
    curbLines: [
      offsetLine(start, end, -halfStreetWidth),
      offsetLine(start, end, halfStreetWidth),
    ],
    sidewalkBands: [
      offsetBand(start, end, halfStreetWidth, halfStreetWidth + SIDEWALK_GUIDE_WIDTH),
      offsetBand(start, end, -halfStreetWidth - SIDEWALK_GUIDE_WIDTH, -halfStreetWidth),
    ],
    rhythmTicks,
    endpointBands: [
      [
        { x: start.x, z: -endpointBandHalfWidth },
        { x: start.x, z: endpointBandHalfWidth },
      ],
      [
        { x: end.x, z: -endpointBandHalfWidth },
        { x: end.x, z: endpointBandHalfWidth },
      ],
    ],
    endpointMarkers: [
      {
        label: "Franklin Ave",
        note: "Project-facing endpoint cue; official source notes Franklin St naming.",
        point: start,
      },
      {
        label: "Manhattan Ave",
        note: "Project-facing endpoint cue from the existing corridor scope.",
        point: end,
      },
    ],
  };
}

function buildRhythmTicks(objects, halfStreetWidth, sidewalkGuideWidth) {
  const buildingCentroids = objects
    .filter((object) => object.kind === "building" && object.points.length)
    .map((object) => ({
      x: object.centroid.x,
      side: object.centroid.z >= 0 ? 1 : -1,
    }))
    .sort((a, b) => a.x - b.x);
  const lastXBySide = new Map();
  const ticks = [];

  for (const centroid of buildingCentroids) {
    const previous = lastXBySide.get(centroid.side);
    if (previous !== undefined && Math.abs(centroid.x - previous) < RHYTHM_TICK_MIN_SPACING) continue;
    lastXBySide.set(centroid.side, centroid.x);

    const curbZ = centroid.side * halfStreetWidth;
    const outerZ = centroid.side * (halfStreetWidth + sidewalkGuideWidth + 0.34);
    ticks.push([
      { x: centroid.x, z: curbZ },
      { x: centroid.x, z: outerZ },
    ]);
  }

  return ticks;
}

function offsetLine(start, end, offset) {
  const direction = normalizeVector({ x: end.x - start.x, y: end.z - start.z });
  const normal = { x: -direction.y, y: direction.x };
  return [
    { x: start.x + normal.x * offset, z: start.z + normal.y * offset },
    { x: end.x + normal.x * offset, z: end.z + normal.y * offset },
  ];
}

function offsetBand(start, end, offsetA, offsetB) {
  const lineA = offsetLine(start, end, offsetA);
  const lineB = offsetLine(start, end, offsetB);
  return [lineA[0], lineA[1], lineB[1], lineB[0]];
}

function getBuildingHeight(semantic, geometryRecord) {
  const sourceHeight = Number.parseFloat(
    semantic.primitiveMassing?.heightValue ?? geometryRecord.sourceProperties?.heightRoof,
  );
  if (!Number.isFinite(sourceHeight)) return MIN_BUILDING_HEIGHT;
  return Math.max(sourceHeight * HEIGHT_SCALE, MIN_BUILDING_HEIGHT);
}

function cleanPoints(points) {
  return points
    .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function normalizeVector(vector) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

function getCentroid(points) {
  if (!points.length) return { x: 0, z: 0 };
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    z: points.reduce((sum, point) => sum + point.z, 0) / points.length,
  };
}

function getPreviewDimensions(points, height = 0) {
  if (!points.length) {
    return { width: 0, depth: 0, height };
  }
  const xs = points.map((point) => point.x);
  const zs = points.map((point) => point.z);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    depth: Math.max(...zs) - Math.min(...zs),
    height,
  };
}

function assertObject(value, label) {
  if (!value || typeof value !== "object") {
    throw new Error(`Phase 4B runtime scene expected ${label} to be an object.`);
  }
}
