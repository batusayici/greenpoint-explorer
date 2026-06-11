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

export function assembleFranklinScene({ geometrySource, sceneGeometryFixture, wrapFixture, contextRadiusMeters = 130 }) {
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
      isHero: Boolean(hero),
      placeId: hero?.placeId ?? null,
      label: hero?.shortLabel ?? null,
      cornerRole: hero?.cornerIntersectionRole ?? null,
      frontages: hero
        ? findHeroFrontages(polygon, { greenpointAxis, franklinAxis })
        : null,
    });
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

// For a hero footprint, pick the street-facing edges: the longest edge among
// the closest to each street axis (Greenpoint, then Franklin), per the R10E
// nearest-source-footprint-edge method extended edge-level in R10G.
function findHeroFrontages(polygon, { greenpointAxis, franklinAxis }) {
  const edges = polygonEdges(polygon);
  return {
    greenpoint: pickFrontageEdge(edges, greenpointAxis),
    franklin: pickFrontageEdge(edges, franklinAxis),
  };
}

function pickFrontageEdge(edges, axis) {
  let best = null;
  for (const edge of edges) {
    const distance = Math.abs(axis.x * edge.midpoint.z - axis.z * edge.midpoint.x);
    const alignment = Math.abs(
      (edge.direction.x * axis.x + edge.direction.z * axis.z),
    );
    // Prefer edges roughly parallel to the street and close to it; weight
    // length so door-sized jogs don't win over the real frontage wall.
    const score = distance - alignment * 0.4 - edge.length * 0.25;
    if (alignment < 0.6) continue;
    if (!best || score < best.score) best = { ...edge, score };
  }
  return best;
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
