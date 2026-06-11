import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json";
const geometryPath = "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";
const heroRecordPath = "src/data/facade-cues/franklin-hero-records.v0.1.json";
const screenshotPaths = [
  "docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-top-down-r10e.png",
  "docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-oblique-r10e.png",
  "docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-frontage-r10e.png",
];

const fixture = readJson(fixturePath);
const geometry = readJson(geometryPath);
const heroRecord = readJson(heroRecordPath);
const runtime = readText(runtimePath);
const styles = readText(stylesPath);
const failures = [];

assert(fixture.phase === "4M-R10E", "Fixture must be scoped to 4M-R10E.", failures);
assert(fixture.qaOnly === true && fixture.reviewOnly === true, "Fixture must remain QA-only and review-only.", failures);
assert(fixture.normalModeExposure === "blocked", "Normal mode exposure must remain blocked.", failures);
assert((fixture.rootCauseDiagnosis ?? []).length >= 4, "Fixture must include the root-cause diagnosis table.", failures);
for (const row of fixture.rootCauseDiagnosis ?? []) {
  for (const key of ["symptom", "likelyRootCause", "responsibleFileFunctionOrRecord", "proposedFix", "verifierOrScreenshotProof"]) {
    assert(Boolean(row[key]), `Diagnosis row missing ${key}.`, failures);
  }
}
assert(fixture.sceneTruthModel?.sourceHypothesisFromR10B === "preserved", "R10E must state whether R10B IDs were preserved.", failures);
assert(fixture.sceneTruthModel?.artificialOffsetsUsedForCorrection === false, "Artificial offsets must not be used for correction.", failures);
assert(fixture.sceneTruthModel?.oldStylizedRuntimePlacementStatus === "disabled_in_franklin_scene_truth_focus_when_conflicting", "Old conflicting stylized runtime placement must be disabled in focus.", failures);
assert(fixture.sceneTruthModel?.projectionBasis?.franklinStreetGeometry?.status === "bounded_review_only_derived_cross_street_missing_source_centerline", "Franklin centerline gap must remain explicitly bounded review-only.", failures);
assert(fixture.sceneTruthModel?.renderingRules?.renderActualSourceFootprintBodies === true, "Scene Truth must render actual source footprint bodies.", failures);
assert(fixture.sceneTruthModel?.renderingRules?.renderFrontageEdgeHighlights === true, "Scene Truth must render frontage edge highlights.", failures);
assert((fixture.successCriteria ?? []).length >= 10, "Fixture must record the ten R10E success criteria.", failures);

const expected = new Map([
  ["premier-franklin-organic", { bin: "3322608", franklin: "west_across_franklin", greenpoint: "south", facing: "north_toward_greenpoint" }],
  ["sereneco", { bin: "3337033", franklin: "west_across_franklin", greenpoint: "north", facing: "south_toward_greenpoint" }],
  ["sonnys-corner", { bin: "3064811", franklin: "east_corridor_side", greenpoint: "south", facing: "north_toward_greenpoint" }],
]);

const places = new Map((fixture.placeMappings ?? []).map((place) => [place.placeId, place]));
for (const [placeId, expectation] of expected) {
  const place = places.get(placeId);
  assert(Boolean(place), `Missing place mapping ${placeId}.`, failures);
  if (!place) continue;
  assert(place.sourceBackedFootprintBin === expectation.bin, `${placeId} must map to BIN ${expectation.bin}.`, failures);
  assert(place.sideOfFranklinAve === expectation.franklin, `${placeId} must stay ${expectation.franklin}.`, failures);
  assert(place.sideOfGreenpointAve === expectation.greenpoint, `${placeId} must stay ${expectation.greenpoint} of Greenpoint.`, failures);
  assert(place.frontageStreet === "Greenpoint Ave", `${placeId} frontage street must be Greenpoint Ave.`, failures);
  assert(place.frontageFacing === expectation.facing, `${placeId} frontage facing must be ${expectation.facing}.`, failures);
  assert(place.frontageEdgeMethod === "nearest_source_footprint_edge_to_greenpoint_axis", `${placeId} must use frontage-aware nearest-edge validation.`, failures);
  assert((place.targetRenderBins ?? []).includes(expectation.bin), `${placeId} targetRenderBins must include ${expectation.bin}.`, failures);
  for (const ref of place.evidenceScreenshotReferences ?? []) {
    assert(fs.existsSync(path.join(repoRoot, ref)), `${placeId} evidence screenshot missing: ${ref}`, failures);
  }
}

const projected = new Map();
for (const [placeId, expectation] of expected) {
  const record = findFootprintByBin(expectation.bin);
  assert(Boolean(record), `${placeId} source footprint ${expectation.bin} must exist.`, failures);
  if (!record) continue;
  const centroid = centroidOfWgs(record.wgs84Polygon);
  assert(classifyFranklinSide(centroid) === expectation.franklin, `${placeId} WGS centroid must match Franklin side.`, failures);
  assert(classifyGreenpointSide(centroid) === expectation.greenpoint, `${placeId} WGS centroid must match Greenpoint side.`, failures);
  const footprint = projectWgsPolygon(record.wgs84Polygon);
  const projectedCentroid = centroidOfScene(footprint);
  const frontageEdge = findFrontageEdge(footprint);
  assert(frontageEdge.distanceToGreenpointAxis <= 0.95, `${placeId} frontage edge must be curb-adjacent in scene projection.`, failures);
  projected.set(placeId, { centroid: projectedCentroid, frontageEdge });
}

const premier = projected.get("premier-franklin-organic")?.centroid;
const sereneco = projected.get("sereneco")?.centroid;
const sonnys = projected.get("sonnys-corner")?.centroid;
assert(premier && sereneco && Math.sign(premier.z) !== Math.sign(sereneco.z), "Premier and Sereneco must project to opposite Greenpoint sides.", failures);
assert(premier && sereneco && premier.x < 0 && sereneco.x < 0, "Premier and Sereneco must project west/across Franklin.", failures);
assert(sonnys && sonnys.x > 0 && sonnys.z > 0, "Sonny's must project southeast/corridor-side.", failures);

for (const snippet of [
  "QA_LAYER_FOCUS_FRANKLIN_SCENE_TRUTH",
  "Franklin Scene",
  "franklin_scene_truth",
  "franklinSceneTruthTopDown",
  "franklinSceneTruthOblique",
  "franklinSceneTruthFrontage",
  "addFranklinSceneTruthOverlay",
  "createSceneTruthBuilding",
  "addSceneTruthFrontageEdge",
  "franklinSceneTruthBuilding",
  "franklinSceneTruthFrontage",
  "suppressOldStylizedTargetBodiesInFocus",
]) {
  assert(runtime.includes(snippet), `Runtime missing R10E scene-truth snippet: ${snippet}`, failures);
}
assert(styles.includes("phase4b-runtime-franklin-scene-truth"), "CSS must hide nonessential panels in Franklin Scene Truth capture mode.", failures);
const sceneRoleSet = runtime.match(/const QA_FRANKLIN_SCENE_TRUTH_VISIBLE_ROLES = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? "";
assert(Boolean(sceneRoleSet), "Runtime must define QA_FRANKLIN_SCENE_TRUTH_VISIBLE_ROLES.", failures);
assert(!sceneRoleSet.includes("franklinHeroAsset"), "Franklin Scene Truth focus must not include GLB hero asset rendering.", failures);
assert(!sceneRoleSet.includes("evidenceFacadeCue"), "Franklin Scene Truth focus must not include facade styling.", failures);

const heroBinding = heroRecord.detailModules?.heroAssetBindings?.bindings?.[0];
assert(heroBinding?.assetPath === "assets/windows/Bay_Window_10K_texture.glb", "R10 GLB binding must remain preserved.", failures);
assert(heroBinding?.fallbackDetailModule === "bayWindowProjection", "R9 procedural fallback must remain preserved.", failures);

for (const screenshotPath of screenshotPaths) {
  const absolutePath = path.join(repoRoot, screenshotPath);
  assert(fs.existsSync(absolutePath), `Expected R10E review screenshot missing: ${screenshotPath}`, failures);
  if (fs.existsSync(absolutePath)) {
    const header = fs.readFileSync(absolutePath).subarray(0, 8).toString("hex");
    assert(header === "89504e470d0a1a0a", `Expected PNG screenshot but found different bytes: ${screenshotPath}`, failures);
  }
}

if (failures.length) {
  throw new Error(`4M-R10E Franklin scene geometry verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Verified 4M-R10E Franklin scene geometry: source-projected building bodies, frontage edges, street control slabs, and blocked GLB/facade paths hold.");

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assert(condition, message, targetFailures) {
  if (!condition) targetFailures.push(message);
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

function centroidOfScene(points) {
  const clean = removeClosingScenePoint(points);
  return {
    x: clean.reduce((sum, point) => sum + point.x, 0) / clean.length,
    z: clean.reduce((sum, point) => sum + point.z, 0) / clean.length,
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
  const endpoint = fixture.sceneTruthModel.projectionBasis.originWgs84;
  return point.lon < endpoint.lon ? "west_across_franklin" : "east_corridor_side";
}

function classifyGreenpointSide(point) {
  const west = fixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.westPointWgs84;
  const east = fixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.eastPointWgs84;
  const axis = { lon: east.lon - west.lon, lat: east.lat - west.lat };
  const toPoint = { lon: point.lon - west.lon, lat: point.lat - west.lat };
  const cross = axis.lon * toPoint.lat - axis.lat * toPoint.lon;
  return cross >= 0 ? "north" : "south";
}

function projectWgsPolygon(points) {
  return removeClosingWgsPoint(points).map(projectWgsToSceneTruth);
}

function projectWgsToSceneTruth(point) {
  const origin = fixture.sceneTruthModel.projectionBasis.originWgs84;
  const metersPerLon = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  const scale = fixture.sceneTruthModel.projectionBasis.scaleMetersToSceneUnits;
  return {
    x: (point.lon - origin.lon) * metersPerLon * scale,
    z: -(point.lat - origin.lat) * 110540 * scale,
  };
}

function findFrontageEdge(points) {
  const clean = removeClosingScenePoint(points);
  const axis = getGreenpointSceneAxis();
  let best = null;
  for (let index = 0; index < clean.length; index += 1) {
    const start = clean[index];
    const end = clean[(index + 1) % clean.length];
    const midpoint = { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 };
    const distanceToGreenpointAxis = Math.abs(cross2d(axis, midpoint));
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    const candidate = { start, end, midpoint, distanceToGreenpointAxis, length };
    if (!best || candidate.distanceToGreenpointAxis < best.distanceToGreenpointAxis) best = candidate;
  }
  return best;
}

function getGreenpointSceneAxis() {
  const west = projectWgsToSceneTruth(fixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.westPointWgs84);
  const east = projectWgsToSceneTruth(fixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.eastPointWgs84);
  const vector = { x: east.x - west.x, z: east.z - west.z };
  const length = Math.hypot(vector.x, vector.z) || 1;
  return { x: vector.x / length, z: vector.z / length };
}

function cross2d(a, b) {
  return a.x * b.z - a.z * b.x;
}
