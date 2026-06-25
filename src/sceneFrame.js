// Scene frame assembly for the Franklin x Greenpoint Scene mode.
// Pure functions over the source fixtures — no Three.js, runnable in Node.
//
// Geometry truth: NYC Open Data footprints/centerlines projected into the
// Franklin-local scene frame proven in 4M-R10E (origin at the intersection,
// 0.075 scene units per meter).

import { carveEastFraction, chamferCorner } from "./carveFootprint.js";

const FEET_TO_METERS = 0.3048;

// BINs whose real building cuts its street corner at ~45° for an angled entrance
// — a chamfer the NYC-Open-Data footprint (square corner) omits. We cut it back
// `cutBackM` along each street edge, creating a diagonal "chamfer" face that
// carries the corner-entrance texture slice. Elder Greene (3064538): the
// "ELDER GREENE Nº160" door sits on a chamfered Franklin × Kent corner.
const CHAMFER_CORNER = { "3064538": { cutBackM: 2.1 } };

// If `bin` is configured for a corner chamfer, cut its street corner (the vertex
// shared by the longest franklin + longest greenpoint edge) back along both edges
// so a diagonal "chamfer" face appears for the angled entrance. No-op otherwise.
function maybeChamferCorner(polygon, bin, projection, axes) {
  const cfg = CHAMFER_CORNER[bin];
  if (!cfg) return polygon;
  const tmp = classifyHeroEdges(polygon, getCentroid(polygon), axes);
  const longest = (role) => tmp.filter((e) => e.role === role).sort((a, b) => b.length - a.length)[0];
  const fE = longest("franklin");
  const gE = longest("greenpoint");
  if (!fE || !gE) return polygon;
  let corner = null;
  for (const ge of [gE.start, gE.end]) {
    for (const fe of [fE.start, fE.end]) {
      if (Math.hypot(ge.x - fe.x, ge.z - fe.z) < 0.05) corner = ge;
    }
  }
  if (!corner) return polygon;
  return chamferCorner(polygon, corner, projection.metersToUnits(cfg.cutBackM));
}

// BINs whose single NYC-Open-Data footprint merges several real buildings, with
// the tall corner building on the EAST (Franklin) end and lower structures
// extending west. We carve the east `frac` of the x-extent as the real corner
// building (it gets the hero massing + facade) and re-emit the west remainder as
// a low context mass. Verge (3064387): tall corner at Franklin & India + two
// 1-story buildings west along India (Batu's India-St photo, 2026-06-25).
const CARVE_EAST_FRACTION = { "3064387": 0.57 };
const CARVE_WEST_STORIES_M = 4.2; // 1-story height for the carved-off remainder

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
  blockExtracts = [],
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
    let polygon = projectPolygon(record.wgs84Polygon, projection);
    if (!polygon.length) continue;
    const bin = String(record.sourceProperties?.bin ?? "");
    polygon = maybeChamferCorner(polygon, bin, projection, { greenpointAxis, franklinAxis });
    const centroid = getCentroid(polygon);
    if (Math.hypot(centroid.x, centroid.z) > contextRadiusUnits) continue;

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

  // Block extracts: pre-bounded footprint pulls for adjacent blocks (Franklin→Milton, etc.).
  // They are spatially bounded by their pull bbox, so they bypass the origin-radius cull.
  // Carry sourceProperties so the renderer can classify typology; tag fromBlockExtract so
  // it gets typological (non-hero) treatment.
  //
  // Override rule: if a BIN already exists in buildings as a plain (non-hero) entry, REPLACE
  // it in place so it gains rich sourceProperties (PLUTO fields) from the block extract.
  // Never override heroes or facade-group members — they must stay exactly as the main loop
  // built them. Dedupe within block-vs-block by tracking pushed block BINs separately.
  const pushedBlockBins = new Set();
  for (const extract of blockExtracts) {
    for (const record of extract.footprintRecords ?? []) {
      const bin = String(record.sourceProperties?.bin ?? "");
      if (!bin) continue;
      // Never override a real wrap-fixture hero.
      if (heroByBin.has(bin)) continue;
      // Dedupe within multiple block extracts.
      if (pushedBlockBins.has(bin)) continue;
      let polygon = projectPolygon(record.wgs84Polygon, projection);
      if (!polygon.length) continue;
      // Carve a merged multi-building footprint: keep the east corner building as
      // the hero mass, re-emit the west remainder as a low context structure.
      let carvedWest = null;
      const carveFrac = CARVE_EAST_FRACTION[bin];
      if (carveFrac) {
        const { keep, rest } = carveEastFraction(polygon, carveFrac);
        if (keep.length >= 3) {
          polygon = keep;
          if (rest.length >= 3) carvedWest = rest;
        }
      }
      // Chamfer the street corner (square in OpenData) for an angled entrance —
      // the classify below re-runs on the chamfered polygon and tags the new
      // diagonal edge role "chamfer". (For block-only corner buildings; Elder
      // Greene is reached by the main loop, which chamfers there.)
      polygon = maybeChamferCorner(polygon, bin, projection, { greenpointAxis, franklinAxis });
      const centroid = getCentroid(polygon);
      const heightFeet = Number.parseFloat(record.sourceProperties?.heightRoof);
      const heightUnits = projection.metersToUnits(
        (Number.isFinite(heightFeet) ? heightFeet : 30) * FEET_TO_METERS,
      );
      // A block-extract BIN registered in facadeGroupBins is a full-block hero
      // (e.g. Astral) that lives only in a block pull, beyond the main loop's
      // context-radius cull. Promote it here — classified hero edges + placeId
      // so it reaches buildHeroBuilding — while keeping fromBlockExtract so the
      // ground/context paths still treat its data as block-sourced.
      const groupPlaceId = facadeGroupBins[bin] ?? null;
      const blockBuilding = {
        bin,
        polygon,
        centroid,
        height: Math.max(heightUnits, 0.3),
        constructionYear: record.sourceProperties?.constructionYear ?? null,
        sourceProperties: record.sourceProperties ?? null,
        isHero: Boolean(groupPlaceId),
        placeId: groupPlaceId,
        label: null,
        cornerRole: null,
        edges: groupPlaceId
          ? classifyHeroEdges(polygon, centroid, { greenpointAxis, franklinAxis })
          : null,
        fromBlockExtract: true,
      };
      const idx = buildings.findIndex((b) => b.bin === bin);
      if (idx >= 0) {
        if (!buildings[idx].isHero) {
          // Replace the plain main-loop version in place (preserves array order).
          buildings[idx] = blockBuilding;
        }
        // If somehow isHero is true here (shouldn't happen given guard above), skip.
      } else {
        buildings.push(blockBuilding);
      }
      pushedBlockBins.add(bin);

      // Re-emit the carved-off west remainder as a low (1-story) context mass so
      // the merged footprint's short buildings don't render at the hero's height.
      if (carvedWest) {
        buildings.push({
          bin: `${bin}-west`,
          polygon: carvedWest,
          centroid: getCentroid(carvedWest),
          height: Math.max(projection.metersToUnits(CARVE_WEST_STORIES_M), 0.3),
          constructionYear: record.sourceProperties?.constructionYear ?? null,
          sourceProperties: record.sourceProperties ?? null,
          isHero: false,
          placeId: null,
          label: null,
          cornerRole: null,
          edges: null,
          fromBlockExtract: true,
        });
      }
    }
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
  const classified = polygonEdges(polygon).map((edge) => {
    // Outward normal: away from the footprint centroid.
    let normal = { x: -edge.direction.z, z: edge.direction.x };
    const toCentroid = { x: centroid.x - edge.midpoint.x, z: centroid.z - edge.midpoint.z };
    if (normal.x * toCentroid.x + normal.z * toCentroid.z > 0) {
      normal = { x: -normal.x, z: -normal.z };
    }

    const dotGreenpoint = Math.abs(edge.direction.x * greenpointAxis.x + edge.direction.z * greenpointAxis.z);
    const dotFranklin = Math.abs(edge.direction.x * franklinAxis.x + edge.direction.z * franklinAxis.z);
    const alongGreenpoint = dotGreenpoint > 0.7;
    const alongFranklin = dotFranklin > 0.7;

    let role = "other";
    // A ~45° diagonal edge (both axis-dots high) that faces outward is a cut
    // street corner — the chamfer face (Elder Greene's angled entrance). Checked
    // first so a 45° edge isn't mis-claimed by the greenpoint/franklin tests.
    if (dotGreenpoint > 0.6 && dotFranklin > 0.6) role = "chamfer";
    else if (alongGreenpoint && normal.z * Math.sign(centroid.z) < 0) role = "greenpoint";
    else if (alongFranklin && normal.x * Math.sign(centroid.x) < 0) role = "franklin";

    return { ...edge, normal, role };
  });
  return mergeCollinearRoledEdges(classified);
}

// Footprints often split one flat street frontage into several collinear
// edges (an extra vertex with no real kink). Only the longest edge per role
// carries the elevation texture, so a short collinear off-cut (e.g. Sonny's
// 1.5m Greenpoint segment at the corner) renders as a bare wall. Merge
// consecutive same-role edges whose directions are parallel (dot > 0.999) so
// each frontage is one continuous textured face. Truly distinct walls (any
// real corner) are not parallel and never merge, so this is a no-op
// everywhere except genuine micro-splits.
function mergeCollinearRoledEdges(edges) {
  if (edges.length < 2) return edges;
  const merged = [];
  for (const edge of edges) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      prev.role === edge.role &&
      prev.direction.x * edge.direction.x + prev.direction.z * edge.direction.z > 0.999
    ) {
      const start = prev.start;
      const end = edge.end;
      const length = Math.hypot(end.x - start.x, end.z - start.z);
      merged[merged.length - 1] = {
        ...prev,
        end,
        length,
        midpoint: { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 },
        direction: { x: (end.x - start.x) / length, z: (end.z - start.z) / length },
      };
    } else {
      merged.push(edge);
    }
  }
  // Polygon edges are cyclic: the last edge may also continue into the first.
  if (merged.length > 2) {
    const first = merged[0];
    const last = merged[merged.length - 1];
    if (
      first.role === last.role &&
      last.direction.x * first.direction.x + last.direction.z * first.direction.z > 0.999 &&
      Math.hypot(last.end.x - first.start.x, last.end.z - first.start.z) < 1e-6
    ) {
      const start = last.start;
      const end = first.end;
      const length = Math.hypot(end.x - start.x, end.z - start.z);
      merged[0] = {
        ...first,
        start,
        length,
        midpoint: { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 },
        direction: { x: (end.x - start.x) / length, z: (end.z - start.z) / length },
      };
      merged.pop();
    }
  }
  return merged;
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
