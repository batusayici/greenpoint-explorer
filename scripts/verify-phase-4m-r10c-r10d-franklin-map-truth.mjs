import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10c-r10d-map-truth.v0.1.json";
const geometryPath = "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";
const heroRecordPath = "src/data/facade-cues/franklin-hero-records.v0.1.json";
const evidenceCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const screenshotPaths = [
  "docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-top-down-r10c.png",
  "docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-oblique-r10d.png",
];

const mapping = readJson(fixturePath);
const geometry = readJson(geometryPath);
const heroRecord = readJson(heroRecordPath);
const evidenceCueFixture = readJson(evidenceCuePath);
const runtime = readText(runtimePath);
const styles = readText(stylesPath);
const failures = [];

assert(mapping.phase === "4M-R10C-R10D", "Fixture must be scoped to 4M-R10C-R10D.", failures);
assert(mapping.qaOnly === true && mapping.reviewOnly === true, "Fixture must remain QA-only and review-only.", failures);
assert(mapping.normalModeExposure === "blocked", "Normal mode exposure must remain blocked.", failures);
assert(mapping.mapTruthModel?.sourceHypothesisFromR10B === "preserved", "Fixture must explicitly say whether the R10B mapping was preserved or corrected.", failures);
assert(mapping.mapTruthModel?.renderingRules?.artificialOffsetsUsedForCorrection === false, "Artificial offsets must not be used for correction.", failures);
assert(mapping.mapTruthModel?.renderingRules?.renderGreenpointAveAsStreetSlab === true, "Greenpoint Ave must render as a street slab.", failures);
assert(mapping.mapTruthModel?.renderingRules?.renderFranklinAveAsPerpendicularStreetSlab === true, "Franklin Ave must render as a perpendicular street slab.", failures);
assert(mapping.mapTruthModel?.renderingRules?.suppressCorridorClutter === true, "Corridor clutter must be suppressed in Franklin Map Truth mode.", failures);
assert(mapping.mapTruthModel?.renderingRules?.showOrientationCues === true, "Orientation cues must be present.", failures);
assert(mapping.mapTruthModel?.renderingRules?.showFootprintIds === true, "Footprint IDs must be shown.", failures);
assert((mapping.visualSuccessCriteria ?? []).length >= 10, "Fixture must record the ten R10C/R10D visual success criteria.", failures);

const expected = new Map([
  ["premier-franklin-organic", { bin: "3322608", franklin: "west_across_franklin", greenpoint: "south", role: "southwest_across_franklin_corner" }],
  ["sereneco", { bin: "3337033", franklin: "west_across_franklin", greenpoint: "north", role: "northwest_across_franklin_corner" }],
  ["sonnys-corner", { bin: "3064811", franklin: "east_corridor_side", greenpoint: "south", role: "southeast_corridor_side_corner" }],
]);

const places = new Map((mapping.placeMappings ?? []).map((place) => [place.placeId, place]));
for (const [placeId, expectation] of expected) {
  const place = places.get(placeId);
  assert(Boolean(place), `Missing place mapping ${placeId}.`, failures);
  if (!place) continue;
  assert(place.sourceBackedFootprintBin === expectation.bin, `${placeId} must map to BIN ${expectation.bin}.`, failures);
  assert(place.sideOfFranklinAve === expectation.franklin, `${placeId} must stay ${expectation.franklin}.`, failures);
  assert(place.sideOfGreenpointAve === expectation.greenpoint, `${placeId} must stay ${expectation.greenpoint} of Greenpoint.`, failures);
  assert(place.cornerIntersectionRole === expectation.role, `${placeId} must keep ${expectation.role}.`, failures);
  assert((place.evidenceScreenshotReferences ?? []).every((ref) => fs.existsSync(path.join(repoRoot, ref))), `${placeId} evidence screenshots must exist.`, failures);
  assert((place.targetRenderBins ?? []).includes(expectation.bin), `${placeId} targetRenderBins must include ${expectation.bin}.`, failures);
}

const premier = places.get("premier-franklin-organic");
const sereneco = places.get("sereneco");
const sonnys = places.get("sonnys-corner");
assert(premier?.sideOfFranklinAve !== sonnys?.sideOfFranklinAve, "Premier/Franklin Organic must not share Sonny's Franklin side.", failures);
assert(sereneco?.sideOfFranklinAve !== sonnys?.sideOfFranklinAve, "Sereneco must not share Sonny's Franklin side.", failures);
assert(sereneco?.sideOfGreenpointAve !== premier?.sideOfGreenpointAve, "Sereneco must be north while Premier is south.", failures);
assert(sereneco?.sideOfGreenpointAve !== sonnys?.sideOfGreenpointAve, "Sereneco must be north while Sonny is south.", failures);

for (const place of places.values()) {
  const record = findFootprintByBin(place.sourceBackedFootprintBin);
  assert(Boolean(record), `${place.placeId} source footprint ${place.sourceBackedFootprintBin} must exist.`, failures);
  if (!record) continue;
  const centroid = centroidOf(record.wgs84Polygon);
  assert(classifyFranklinSide(centroid) === place.sideOfFranklinAve, `${place.placeId} WGS centroid must match recorded Franklin side.`, failures);
  assert(classifyGreenpointSide(centroid) === place.sideOfGreenpointAve, `${place.placeId} WGS centroid must match recorded Greenpoint side.`, failures);
}

const labelPoints = [...places.values()].map((place) => ({
  id: place.placeId,
  x: place.labelPlacement?.offsetMeters?.east ?? 0,
  y: place.labelPlacement?.offsetMeters?.north ?? 0,
}));
for (let i = 0; i < labelPoints.length; i += 1) {
  for (let j = i + 1; j < labelPoints.length; j += 1) {
    const distance = Math.hypot(labelPoints[i].x - labelPoints[j].x, labelPoints[i].y - labelPoints[j].y);
    assert(distance >= 38, `Labels ${labelPoints[i].id} and ${labelPoints[j].id} are too close for the review overlay.`, failures);
  }
}

for (const snippet of [
  "QA_LAYER_FOCUS_FRANKLIN_TRUTH",
  "Franklin Truth",
  "franklin_map_truth",
  "franklinTruthTopDown",
  "franklinTruthOblique",
  "addFranklinMapTruthOverlay",
  "createStreetSlab",
  "Greenpoint Ave",
  "Franklin Ave",
  "franklinMapTruthStreet",
  "franklinMapTruthOrientation",
  "createMapTruthLabel",
]) {
  assert(runtime.includes(snippet), `Runtime missing Franklin Map Truth snippet: ${snippet}`, failures);
}
assert(styles.includes("phase4b-runtime-franklin-truth"), "CSS must hide nonessential panels in Franklin Map Truth capture mode.", failures);
const truthRoleSet = runtime.match(/const QA_FRANKLIN_TRUTH_VISIBLE_ROLES = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? "";
assert(Boolean(truthRoleSet), "Runtime must define QA_FRANKLIN_TRUTH_VISIBLE_ROLES.", failures);
assert(!truthRoleSet.includes("franklinHeroAsset"), "Franklin Truth focus must not include GLB hero asset rendering.", failures);
assert(!truthRoleSet.includes("evidenceFacadeCue"), "Franklin Truth focus must not include facade cue rendering.", failures);

const offsetRecords = evidenceCueFixture.records?.filter((record) => record.qaComposition?.lateralOffsetUnits && record.qaComposition.lateralOffsetUnits !== 0) ?? [];
assert(offsetRecords.length === 0, "Evidence cue fixture must not use lateral offsets for Franklin correction.", failures);
const heroBinding = heroRecord.detailModules?.heroAssetBindings?.bindings?.[0];
assert(heroBinding?.assetPath === "assets/windows/Bay_Window_10K_texture.glb", "R10 GLB binding must remain preserved.", failures);
assert(heroBinding?.fallbackDetailModule === "bayWindowProjection", "R9 procedural fallback must remain preserved.", failures);

for (const screenshotPath of screenshotPaths) {
  const absolutePath = path.join(repoRoot, screenshotPath);
  assert(fs.existsSync(absolutePath), `Expected review screenshot missing: ${screenshotPath}`, failures);
  if (fs.existsSync(absolutePath)) {
    const header = fs.readFileSync(absolutePath).subarray(0, 8).toString("hex");
    assert(header === "89504e470d0a1a0a", `Expected PNG screenshot but found different bytes: ${screenshotPath}`, failures);
  }
}

if (failures.length) {
  throw new Error(`4M-R10C/R10D Franklin map truth verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Verified 4M-R10C/R10D Franklin map truth: R10B IDs preserved, Franklin and Greenpoint render as crossing street slabs, target side assignments hold, GLB/facade fidelity paths remain excluded.");

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

function centroidOf(points) {
  const clean = removeClosingPoint(points);
  return {
    lon: clean.reduce((sum, point) => sum + point.lon, 0) / clean.length,
    lat: clean.reduce((sum, point) => sum + point.lat, 0) / clean.length,
  };
}

function removeClosingPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.lon === last.lon && first.lat === last.lat) return points.slice(0, -1);
  return points;
}

function classifyFranklinSide(point) {
  const endpoint = mapping.mapTruthModel.sharedGreenpointEndpointWgs84;
  return point.lon < endpoint.lon ? "west_across_franklin" : "east_corridor_side";
}

function classifyGreenpointSide(point) {
  const west = mapping.mapTruthModel.greenpointAxisWgs84.westPointWgs84;
  const east = mapping.mapTruthModel.greenpointAxisWgs84.eastPointWgs84;
  const axis = { lon: east.lon - west.lon, lat: east.lat - west.lat };
  const toPoint = { lon: point.lon - west.lon, lat: point.lat - west.lat };
  const cross = axis.lon * toPoint.lat - axis.lat * toPoint.lon;
  return cross >= 0 ? "north" : "south";
}
