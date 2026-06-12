// Scene frame assembly for the Franklin x Greenpoint Scene mode.
// Pure functions over the source fixtures — no Three.js, runnable in Node.
//
// Geometry truth: NYC Open Data footprints/centerlines projected into the
// Franklin-local scene frame proven in 4M-R10E (origin at the intersection,
// 0.075 scene units per meter).

const FEET_TO_METERS = 0.3048;

export function createProjection(projectionBasis) {
  const origin = projectionBasis.originWgs84;
  const scale = projectionBasis.scaleMetersToSceneUnits ?? 0.075;
  const metersPerLon = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  const metersPerLat = 110540;
  return {
    scale,
    project(point) {
      return {
        x: (point.lon - origin.lon) * metersPerLon * scale,
        z: -(point.lat - origin.lat) * metersPerLat * scale,
      };
    },
    metersToUnits(meters) {
      return meters * scale;
    },
  };
}

export function assembleFranklinScene({
  geometrySource,
  sceneGeometryFixture,
  wrapFixture,
  contextRadiusMeters = 130,
  facadeGroupBins = {},
}) {
  const projectionBasis = sceneGeometryFixture.sceneTruthModel.projectionBasis;
  const projection = createProjection(projectionBasis);
  const contextRadiusUnits = projection.metersToUnits(contextRadiusMeters);

  const greenpointAxis = getAxis(projectionBasis.greenpointAxisWgs84, projection);
  const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };

  const heroByBin = new Map();
  for (const mapping of wrapFixture.placeMappings) {
    heroByBin.set(String(mapping.sourceBackedFootprintBin), mapping);
  }

  const buildings = [];
  for (const record of geometrySource.footprintRecords) {
    const polygon = projectPolygon(record.wgs84Polygon, projection);
    if (!polygon.length) continue;
    const centroid = getCentroid(polygon);
    if (Math.hypot(centroid.x, centroid.z) > contextRadiusUnits) continue;

    const bin = String(record.sourceProperties?.bin ?? "");
    const hero = heroByBin.get(bin) ?? null;
    // Facade-group members (e.g. the sibling parcel component carrying the
    // rest of a hero's streetwall) get the full hero wall treatment under
    // the group's placeId.
    const groupPlaceId = facadeGroupBins[bin] ?? null;
    const heightFeet = Number.parseFloat(record.sourceProperties?.heightRoof);
    const heightUnits = projection.metersToUnits(
      (Number.isFinite(heightFeet) ? heightFeet : 30) * FEET_TO_METERS,
    );

    buildings.push({
      bin,
      polygon,
      centroid,
      height: Math.max(heightUnits, 0.3),
      constructionYear: record.sourceProperties?.constructionYear ?? null,
      isHero: Boolean(hero) || Boolean(groupPlaceId),
      placeId: hero?.placeId ?? groupPlaceId,
      label: hero?.shortLabel ?? null,
      cornerRole: hero?.cornerIntersectionRole ?? null,
      edges:
        hero || groupPlaceId
          ? classifyHeroEdges(polygon, centroid, { greenpointAxis, franklinAxis })
          : null,
    });
  }

  // Flush facade groups: the source records for sibling parcel components
  // disagree on the streetwall line (the sister's Franklin edge sits ~1.3m
  // east of the corner component's), so a continuous drawn elevation breaks
  // at the parcel seam. The corner component is the spatial authority —
  // snap group members' near-street vertices onto its frontage line, then
  // reclassify their edges.
  for (const member of buildings) {
    if (!facadeGroupBins[member.bin]) continue;
    const hero = buildings.find((b) => b.placeId === member.placeId && heroByBin.has(b.bin));
    if (!hero) continue;
    for (const role of ["greenpoint", "franklin"]) {
      const heroEdge = hero.edges
        .filter((edge) => edge.role === role)
        .sort((a, b) => b.length - a.length)[0];
      const memberEdge = member.edges
        .filter((edge) => edge.role === role)
        .sort((a, b) => b.length - a.length)[0];
      if (!heroEdge || !memberEdge) continue;
      const direction = heroEdge.direction;
      const origin = heroEdge.start;
      const distanceToLine = (point) => {
        const dx = point.x - origin.x;
        const dz = point.z - origin.z;
        return dx * heroEdge.normal.x + dz * heroEdge.normal.z;
      };
      const snapLimit = projection.metersToUnits(2.0);
      for (const vertex of member.polygon) {
        const offset = distanceToLine(vertex);
        if (Math.abs(offset) < snapLimit) {
          vertex.x -= heroEdge.normal.x * offset;
          vertex.z -= heroEdge.normal.z * offset;
        }
      }
    }
    member.centroid = getCentroid(member.polygon);
    member.edges = classifyHeroEdges(member.polygon, member.centroid, { greenpointAxis, franklinAxis });
  }

  const streets = geometrySource.streetCenterlineRecords.map((record) => ({
    id: record.id,
    name: record.fullStreetName,
    widthUnits: projection.metersToUnits(Number.parseFloat(record.streetWidth ?? "15") * FEET_TO_METERS),
    line: record.wgs84Line.map((point) => projection.project(point)),
  }));

  // Franklin Ave has no source centerline in this packet (known data gap from
  // R10E). Derive a bounded review-only slab perpendicular to Greenpoint
  // through the intersection origin.
  const franklinHalfLength = projection.metersToUnits(110);
  streets.push({
    id: "derived-franklin-ave",
    name: "FRANKLIN AVE (derived)",
    derived: true,
    widthUnits: projection.metersToUnits(15),
    line: [
      { x: -franklinAxis.x * franklinHalfLength, z: -franklinAxis.z * franklinHalfLength },
      { x: franklinAxis.x * franklinHalfLength, z: franklinAxis.z * franklinHalfLength },
    ],
  });

  return { projection, buildings, streets, greenpointAxis, franklinAxis };
}

// Classify every footprint edge of a hero by which street it faces, per the
// R10G edge-level frontage method. The intersection origin sits at
// (0, 0): Greenpoint Ave runs along the x-axis (buildings north of it have
// negative-z centroids), Franklin along z. An edge faces a street when it
// runs parallel to that street's axis and its outward normal points from the
// building toward that street.
function classifyHeroEdges(polygon, centroid, { greenpointAxis, franklinAxis }) {
  return polygonEdges(polygon).map((edge) => {
    // Outward normal: away from the footprint centroid.
    let normal = { x: -edge.direction.z, z: edge.direction.x };
    const toCentroid = { x: centroid.x - edge.midpoint.x, z: centroid.z - edge.midpoint.z };
    if (normal.x * toCentroid.x + normal.z * toCentroid.z > 0) {
      normal = { x: -normal.x, z: -normal.z };
    }

    const alongGreenpoint = Math.abs(edge.direction.x * greenpointAxis.x + edge.direction.z * greenpointAxis.z) > 0.7;
    const alongFranklin = Math.abs(edge.direction.x * franklinAxis.x + edge.direction.z * franklinAxis.z) > 0.7;

    let role = "other";
    if (alongGreenpoint && normal.z * Math.sign(centroid.z) < 0) role = "greenpoint";
    else if (alongFranklin && normal.x * Math.sign(centroid.x) < 0) role = "franklin";

    return { ...edge, normal, role };
  });
}

function polygonEdges(polygon) {
  const clean = removeClosingPoint(polygon);
  const edges = [];
  for (let index = 0; index < clean.length; index += 1) {
    const start = clean[index];
    const end = clean[(index + 1) % clean.length];
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    if (length < 1e-6) continue;
    edges.push({
      start,
      end,
      length,
      midpoint: { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 },
      direction: { x: (end.x - start.x) / length, z: (end.z - start.z) / length },
    });
  }
  return edges;
}

function projectPolygon(wgs84Polygon, projection) {
  if (!wgs84Polygon?.length) return [];
  return removeClosingWgsPoint(wgs84Polygon).map((point) => projection.project(point));
}

function getAxis(axisWgs84, projection) {
  const west = projection.project(axisWgs84.westPointWgs84);
  const east = projection.project(axisWgs84.eastPointWgs84);
  const vector = { x: east.x - west.x, z: east.z - west.z };
  const length = Math.hypot(vector.x, vector.z) || 1;
  return { x: vector.x / length, z: vector.z / length };
}

function getCentroid(points) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    z: points.reduce((sum, point) => sum + point.z, 0) / points.length,
  };
}

function removeClosingPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.x === last.x && first.z === last.z) return points.slice(0, -1);
  return points;
}

function removeClosingWgsPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.lon === last.lon && first.lat === last.lat) return points.slice(0, -1);
  return points;
}
