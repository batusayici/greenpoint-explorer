import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json";
const r10fFixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10f-rendered-building-frontage-truth.v0.1.json";
const geometryPath = "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const facadeCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";

const fixture = readJson(fixturePath);
const r10fFixture = readJson(r10fFixturePath);
const geometry = readJson(geometryPath);
const facadeCueFixture = readJson(facadeCuePath);
const runtime = readText(runtimePath);
const styles = readText(stylesPath);
const failures = [];

assert(fixture.phase === "4M-R10G", "Fixture must be scoped to 4M-R10G.");
assert(fixture.qaOnly === true && fixture.reviewOnly === true, "Fixture must stay QA-only and review-only.");
assert(fixture.normalModeExposure === "blocked", "Normal mode exposure must remain blocked.");
assert(fixture.preservation?.targetBinMapping === "preserved", "R10G must preserve the R10B/R10F target BIN mapping.");
assert(fixture.preservation?.sourceFrameFromR10E === "preserved", "R10G must preserve the corrected R10E Franklin-local frame.");
assert(fixture.preservation?.sourceFootprintBasedPlacement === true, "R10G placement must stay source-footprint based.");
assert(fixture.preservation?.glbAssessmentStatus === "blocked_until_r10g_visual_review", "GLB assessment must remain blocked.");
assert(fixture.frontageSchema?.model === "edge_level_frontage_segments", "R10G must move to edge-level frontage segments.");
assert(fixture.frontageSchema?.artificialOffsetsUsedForCorrection === false, "R10G must not use artificial offsets.");
assert((fixture.diagnosisTable ?? []).length === 3, "Diagnosis table must cover the three targets.");

for (const row of fixture.diagnosisTable ?? []) {
  for (const key of ["targetBusiness", "expectedGreenpointFrontage", "expectedFranklinFrontage", "expectedCornerCondition", "currentRenderedMismatch", "rootCause", "exactFix"]) {
    assert(Boolean(row[key]), `Diagnosis row missing ${key}.`);
  }
}

const expected = new Map([
  ["sereneco", {
    bin: "3337033",
    objectId: "p4b-object-nyc-footprint-bin-3337033",
    franklin: "west_across_franklin",
    greenpoint: "north",
    franklinFacing: "east_toward_franklin",
    greenpointFacing: "south_toward_greenpoint",
    cue: "p4e1-franklin-weathered-brick-glass-base",
  }],
  ["premier-franklin-organic", {
    bin: "3322608",
    objectId: "p4b-object-nyc-footprint-bin-3322608",
    franklin: "west_across_franklin",
    greenpoint: "south",
    franklinFacing: "east_toward_franklin",
    greenpointFacing: "north_toward_greenpoint",
    cue: "p4e1-franklin-red-brick-cornice-corner",
  }],
  ["sonnys-corner", {
    bin: "3064811",
    objectId: "p4b-object-nyc-footprint-bin-3064811",
    franklin: "east_corridor_side",
    greenpoint: "south",
    franklinFacing: "west_toward_franklin",
    greenpointFacing: "north_toward_greenpoint",
    cue: "p4e1-franklin-dark-brick-awned-base",
  }],
]);

const r10fPlaces = new Map((r10fFixture.placeMappings ?? []).map((place) => [place.placeId, place]));
const places = new Map((fixture.placeMappings ?? []).map((place) => [place.placeId, place]));

for (const [placeId, expectation] of expected) {
  const r10fPlace = r10fPlaces.get(placeId);
  const place = places.get(placeId);
  assert(Boolean(place), `Missing R10G place mapping: ${placeId}.`);
  assert(Boolean(r10fPlace), `Missing R10F preservation mapping: ${placeId}.`);
  if (!place || !r10fPlace) continue;

  assert(place.sourceBackedFootprintBin === expectation.bin, `${placeId} must preserve BIN ${expectation.bin}.`);
  assert(place.sourceBackedFootprintBin === r10fPlace.sourceBackedFootprintBin, `${placeId} BIN must match R10F.`);
  assert(place.sourceBackedObjectId === expectation.objectId, `${placeId} must preserve object ID ${expectation.objectId}.`);
  assert(place.sideOfFranklinAve === expectation.franklin, `${placeId} must preserve Franklin side ${expectation.franklin}.`);
  assert(place.sideOfGreenpointAve === expectation.greenpoint, `${placeId} must preserve Greenpoint side ${expectation.greenpoint}.`);
  assert(place.renderedCueRecordId === expectation.cue, `${placeId} must preserve cue ${expectation.cue}.`);
  assert(place.renderedModuleStatus === "qa_only_evidence_informed_not_exact", `${placeId} rendered module status must stay QA-only/non-exact.`);

  const cue = findCue(expectation.cue);
  assert(Boolean(cue), `${placeId} cue record missing.`);
  assert(cue?.targetSemanticId === expectation.objectId, `${placeId} cue must target the preserved object ID.`);

  const segments = place.frontageSegments ?? [];
  const byRole = new Map(segments.map((segment) => [segment.segmentRole, segment]));
  for (const role of fixture.frontageSchema.requiredSegmentRoles ?? []) {
    assert(Boolean(byRole.get(role)), `${placeId} missing required frontage role ${role}.`);
  }
  assert(segments.filter((segment) => segment.activeFrontage === true).length >= 3, `${placeId} must have at least three active frontage/corner segments.`);

  const greenpoint = byRole.get("greenpoint_frontage");
  const franklin = byRole.get("franklin_frontage");
  const corner = byRole.get("corner_wrap");
  const sideReturn = byRole.get("side_return");
  assert(greenpoint?.street === "Greenpoint Ave", `${placeId} Greenpoint segment must bind to Greenpoint Ave.`);
  assert(greenpoint?.edgeSelector === "nearest_greenpoint_axis_edge", `${placeId} Greenpoint segment must use the Greenpoint source-footprint edge.`);
  assert(greenpoint?.expectedFacing === expectation.greenpointFacing, `${placeId} Greenpoint segment must face ${expectation.greenpointFacing}.`);
  assert(franklin?.street === "Franklin Ave", `${placeId} Franklin segment must bind to Franklin Ave.`);
  assert(franklin?.edgeSelector === "nearest_franklin_axis_edge", `${placeId} Franklin segment must use the Franklin source-footprint edge.`);
  assert(franklin?.expectedFacing === expectation.franklinFacing, `${placeId} Franklin segment must face ${expectation.franklinFacing}.`);
  assert(corner?.edgeSelector === "shared_greenpoint_franklin_corner", `${placeId} corner wrap must bind to the shared corner.`);
  assert(sideReturn?.activeFrontage === true, `${placeId} side return must be active rather than blank.`);

  for (const segment of segments) {
    assert(segment.qaClaimStatus === "manual_draft_evidence_informed_not_exact", `${placeId}/${segment.segmentId} must remain manual-draft/non-exact.`);
    assert(Array.isArray(segment.evidenceRefs) && segment.evidenceRefs.length >= 1, `${placeId}/${segment.segmentId} must cite evidence refs.`);
    for (const ref of segment.evidenceRefs ?? []) {
      assert(fs.existsSync(path.join(repoRoot, ref)), `${placeId}/${segment.segmentId} evidence ref missing: ${ref}`);
      assert(cue?.sourceEvidenceRefs?.some((entry) => entry.evidencePath === ref), `${placeId}/${segment.segmentId} cue must cite ${ref}.`);
    }
  }

  const record = findFootprintByBin(expectation.bin);
  assert(Boolean(record), `${placeId} source footprint ${expectation.bin} must exist.`);
  if (!record) continue;
  const centroid = centroidOfWgs(record.wgs84Polygon);
  assert(classifyFranklinSide(centroid) === expectation.franklin, `${placeId} WGS centroid must preserve Franklin side.`);
  assert(classifyGreenpointSide(centroid) === expectation.greenpoint, `${placeId} WGS centroid must preserve Greenpoint side.`);

  const footprint = projectWgsPolygon(record.wgs84Polygon);
  const greenpointEdge = findEdgeNearestAxis(footprint, greenpointAxis());
  const franklinEdge = findEdgeNearestAxis(footprint, franklinAxis());
  assert(greenpointEdge.length > 0.24, `${placeId} Greenpoint frontage edge must be renderable.`);
  assert(franklinEdge.length > 0.18, `${placeId} Franklin frontage edge must be renderable, not negligible.`);
  assert(greenpointEdge.distanceToAxis <= 0.95, `${placeId} Greenpoint edge must remain curb-adjacent.`);
  assert(franklinEdge.distanceToAxis <= 0.95, `${placeId} Franklin edge must remain bounded to the cross-street condition.`);
  assert(sharedCornerDistance(greenpointEdge, franklinEdge) <= 0.95, `${placeId} Greenpoint and Franklin frontage edges must form a corner-wrap condition.`);
}

assert(places.get("sereneco")?.contextMassTreatment === "larger_source_footprint_body_muted_as_context_not_main_sereneco_frontage", "Sereneco must separate active corner frontage from the larger context mass.");

for (const snippet of [
  "QA_LAYER_FOCUS_FRANKLIN_RENDERED_WRAP_TRUTH",
  "Franklin Wrap",
  "franklin_rendered_wrap_truth",
  "franklinRenderedWrapTruthTopDown",
  "franklinRenderedWrapTruthOblique",
  "franklinRenderedWrapTruthPremier",
  "franklinRenderedWrapTruthSonny",
  "franklinRenderedWrapTruthSereneco",
  "addFranklinRenderedWrapTruthOverlay",
  "createRenderedWrapTruthBuilding",
  "addRenderedWrapTruthFacadeModules",
  "frontageSegments",
  "nearest_franklin_axis_edge",
  "shared_greenpoint_franklin_corner",
  "franklinRenderedWrapTruthBuilding",
  "franklinRenderedWrapTruthFacade",
  "franklinRenderedWrapTruthFrontage",
  "child.userData.stateRole === \"franklinRenderedWrapTruthBuilding\"",
  "child.userData.stateRole === \"franklinRenderedWrapTruthFacade\"",
  "r10gCaptureRequested",
  "R10G_CAPTURE_SEQUENCE",
  "captureR10GReviewScreenshots",
  "saveR10GCapture",
  "suppressOldStylizedTargetBodiesInFocus",
]) {
  assert(runtime.includes(snippet), `Runtime missing R10G wrap-truth snippet: ${snippet}`);
}

const roleSet = runtime.match(/const QA_FRANKLIN_RENDERED_WRAP_TRUTH_VISIBLE_ROLES = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? "";
assert(Boolean(roleSet), "Runtime must define QA_FRANKLIN_RENDERED_WRAP_TRUTH_VISIBLE_ROLES.");
assert(roleSet.includes("franklinRenderedWrapTruthBuilding"), "Wrap Truth focus must include rendered buildings.");
assert(roleSet.includes("franklinRenderedWrapTruthFacade"), "Wrap Truth focus must include facade modules.");
assert(roleSet.includes("franklinRenderedWrapTruthFrontage"), "Wrap Truth focus must include frontage highlights.");
assert(!roleSet.includes("franklinHeroAsset"), "Wrap Truth focus must not include the GLB hero asset.");
assert(!roleSet.includes("evidenceFacadeCue"), "Wrap Truth focus must not fall back to old evidence facade cue placement.");
assert(styles.includes("phase4b-runtime-franklin-rendered-wrap-truth"), "CSS must support Franklin Rendered Wrap Truth capture mode.");
assert(styles.includes("phase4b-r10g-capture-tray"), "CSS must support the R10G browser self-capture tray.");
const screenshotStatus = fixture.screenshotCaptureStatus;
if (screenshotStatus === "captured") {
  for (const screenshotPath of fixture.requiredScreenshots ?? []) {
    const absolutePath = path.join(repoRoot, screenshotPath);
    assert(fs.existsSync(absolutePath), `Expected R10G review screenshot missing: ${screenshotPath}`);
    if (fs.existsSync(absolutePath)) {
      const header = fs.readFileSync(absolutePath).subarray(0, 8).toString("hex");
      assert(header === "89504e470d0a1a0a", `Expected PNG screenshot but found different bytes: ${screenshotPath}`);
    }
  }
} else {
  assert(screenshotStatus === "pending_browser_self_capture_run", "Screenshot status must be either captured or pending_browser_self_capture_run.");
}

if (failures.length) {
  throw new Error(`4M-R10G Franklin corner frontage wrap verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Verified 4M-R10G Franklin corner frontage wrap: edge-level Greenpoint/Franklin/corner segments preserve placement, add active Franklin frontages, and keep GLB assessment blocked.");

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function findCue(cueRecordId) {
  return facadeCueFixture.facadeCueRecords?.find((record) => record.cueRecordId === cueRecordId) ?? null;
}

function findFootprintByBin(bin) {
  return geometry.footprintRecords?.find((record) => record.sourceProperties?.bin === String(bin)) ?? null;
}

function centroidOfWgs(points) {
  const clean = removeClosingWgsPoint(points);
  return {
    lon: clean.reduce((sum, point) => sum + point.lon, 0) / clean.length,
    lat: clean.reduce((sum, point) => sum + point.lat, 0) / clean.length,
  };
}

function removeClosingWgsPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.lon === last.lon && first.lat === last.lat) return points.slice(0, -1);
  return points;
}

function removeClosingScenePoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.x === last.x && first.z === last.z) return points.slice(0, -1);
  return points;
}

function classifyFranklinSide(point) {
  const endpoint = fixture.projectionBasis.originWgs84;
  return point.lon < endpoint.lon ? "west_across_franklin" : "east_corridor_side";
}

function classifyGreenpointSide(point) {
  const west = fixture.projectionBasis.greenpointAxisWgs84.westPointWgs84;
  const east = fixture.projectionBasis.greenpointAxisWgs84.eastPointWgs84;
  const axis = { lon: east.lon - west.lon, lat: east.lat - west.lat };
  const toPoint = { lon: point.lon - west.lon, lat: point.lat - west.lat };
  const cross = axis.lon * toPoint.lat - axis.lat * toPoint.lon;
  return cross >= 0 ? "north" : "south";
}

function projectWgsPolygon(points) {
  return removeClosingWgsPoint(points).map(projectWgsToRenderedTruth);
}

function projectWgsToRenderedTruth(point) {
  const origin = fixture.projectionBasis.originWgs84;
  const metersPerLon = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  const scale = fixture.projectionBasis.scaleMetersToSceneUnits;
  return {
    x: (point.lon - origin.lon) * metersPerLon * scale,
    z: -(point.lat - origin.lat) * 110540 * scale,
  };
}

function greenpointAxis() {
  const west = projectWgsToRenderedTruth(fixture.projectionBasis.greenpointAxisWgs84.westPointWgs84);
  const east = projectWgsToRenderedTruth(fixture.projectionBasis.greenpointAxisWgs84.eastPointWgs84);
  const vector = { x: east.x - west.x, z: east.z - west.z };
  const length = Math.hypot(vector.x, vector.z) || 1;
  return { x: vector.x / length, z: vector.z / length };
}

function franklinAxis() {
  const axis = greenpointAxis();
  return { x: -axis.z, z: axis.x };
}

function findEdgeNearestAxis(points, axis) {
  const clean = removeClosingScenePoint(points);
  let best = null;
  for (let index = 0; index < clean.length; index += 1) {
    const start = clean[index];
    const end = clean[(index + 1) % clean.length];
    const midpoint = { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 };
    const distanceToAxis = Math.abs(axis.x * midpoint.z - axis.z * midpoint.x);
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    const candidate = { start, end, midpoint, distanceToAxis, length };
    if (!best || candidate.distanceToAxis < best.distanceToAxis) best = candidate;
  }
  return best;
}

function sharedCornerDistance(edgeA, edgeB) {
  const candidates = [
    distance(edgeA.start, edgeB.start),
    distance(edgeA.start, edgeB.end),
    distance(edgeA.end, edgeB.start),
    distance(edgeA.end, edgeB.end),
  ];
  return Math.min(...candidates);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
