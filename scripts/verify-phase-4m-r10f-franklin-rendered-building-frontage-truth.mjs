import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10f-rendered-building-frontage-truth.v0.1.json";
const r10eFixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json";
const geometryPath = "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const facadeCuePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylesPath = "src/styles.css";

const fixture = readJson(fixturePath);
const r10eFixture = readJson(r10eFixturePath);
const geometry = readJson(geometryPath);
const facadeCueFixture = readJson(facadeCuePath);
const runtime = readText(runtimePath);
const styles = readText(stylesPath);
const failures = [];

assert(fixture.phase === "4M-R10F", "Fixture must be scoped to 4M-R10F.");
assert(fixture.qaOnly === true && fixture.reviewOnly === true, "Fixture must remain QA-only and review-only.");
assert(fixture.normalModeExposure === "blocked", "Normal mode exposure must remain blocked.");
assert(fixture.renderedTruthModel?.sourceFrameFromR10E === "preserved", "R10F must preserve the corrected R10E Franklin-local frame.");
assert(fixture.renderedTruthModel?.sourceHypothesisFromR10B === "preserved", "R10F must preserve the R10B target BIN hypothesis.");
assert(fixture.renderedTruthModel?.artificialOffsetsUsedForCorrection === false, "R10F must not use artificial lateral offsets.");
assert(fixture.renderedTruthModel?.glbAssessmentStatus === "blocked_until_r10f_visual_review", "GLB assessment must remain blocked.");
assert(fixture.renderedTruthModel?.projectionBasis?.franklinStreetGeometry?.status === "bounded_review_only_derived_cross_street_missing_source_centerline", "Franklin centerline gap must remain bounded review-only.");

for (const row of fixture.rootCauseUpdate ?? []) {
  for (const key of ["symptom", "likelyRootCause", "responsibleFileFunctionOrRecord", "proposedFix", "verifierOrScreenshotProof"]) {
    assert(Boolean(row[key]), `Root-cause update row missing ${key}.`);
  }
}

for (const row of fixture.diagnosisTable ?? []) {
  for (const key of ["targetBusiness", "binOrObjectId", "expectedMapPosition", "expectedFrontageStreetOrEdge", "expectedFacadeEvidenceImages", "currentRenderedBuildingOrFacadeModule", "mismatchIfAny", "fixRequired"]) {
    assert(Boolean(row[key]), `Diagnosis table row missing ${key}.`);
  }
}
assert((fixture.diagnosisTable ?? []).length === 3, "R10F diagnosis table must cover the three target businesses.");

const expected = new Map([
  ["sereneco", {
    bin: "3337033",
    franklin: "west_across_franklin",
    greenpoint: "north",
    facing: "south_toward_greenpoint",
    cue: "p4e1-franklin-weathered-brick-glass-base",
  }],
  ["premier-franklin-organic", {
    bin: "3322608",
    franklin: "west_across_franklin",
    greenpoint: "south",
    facing: "north_toward_greenpoint",
    cue: "p4e1-franklin-red-brick-cornice-corner",
  }],
  ["sonnys-corner", {
    bin: "3064811",
    franklin: "east_corridor_side",
    greenpoint: "south",
    facing: "north_toward_greenpoint",
    cue: "p4e1-franklin-dark-brick-awned-base",
  }],
]);

const places = new Map((fixture.placeMappings ?? []).map((place) => [place.placeId, place]));
const projected = new Map();
for (const [placeId, expectation] of expected) {
  const place = places.get(placeId);
  assert(Boolean(place), `Missing place mapping ${placeId}.`);
  if (!place) continue;
  assert(place.sourceBackedFootprintBin === expectation.bin, `${placeId} must map to BIN ${expectation.bin}.`);
  assert(place.sideOfFranklinAve === expectation.franklin, `${placeId} must stay ${expectation.franklin}.`);
  assert(place.sideOfGreenpointAve === expectation.greenpoint, `${placeId} must stay ${expectation.greenpoint}.`);
  assert(place.frontageStreet === "Greenpoint Ave", `${placeId} frontage street must be Greenpoint Ave.`);
  assert(place.frontageFacing === expectation.facing, `${placeId} frontage facing must be ${expectation.facing}.`);
  assert(place.frontageEdgeMethod === "nearest_source_footprint_edge_to_greenpoint_axis", `${placeId} must use frontage-aware nearest-edge validation.`);
  assert(place.renderedCueRecordId === expectation.cue, `${placeId} must render cue ${expectation.cue}.`);
  assert(place.renderedModuleStatus === "qa_only_evidence_informed_not_exact", `${placeId} rendered module status must stay QA-only and non-exact.`);
  assert(place.renderProfile?.bayCount >= 4, `${placeId} render profile must expose facade/storefront rhythm.`);
  assert(place.renderProfile?.heightUnits > 0, `${placeId} render profile must define visible building height.`);

  const cue = findCue(expectation.cue);
  assert(Boolean(cue), `${placeId} cue record missing: ${expectation.cue}.`);
  if (cue) {
    assert(cue.targetSemanticId === place.sourceBackedObjectId, `${placeId} cue target semantic ID must match the R10F object ID.`);
    assert(cue.renderStatus === "rendered_qa_only", `${placeId} cue must remain rendered QA-only.`);
    assert(cue.claimStatus === "manual_draft", `${placeId} cue must remain manual draft.`);
  }

  for (const ref of place.evidenceScreenshotReferences ?? []) {
    assert(fs.existsSync(path.join(repoRoot, ref)), `${placeId} evidence screenshot missing: ${ref}`);
    assert(cue?.sourceEvidenceRefs?.some((entry) => entry.evidencePath === ref), `${placeId} cue must cite evidence screenshot ${ref}.`);
  }

  const record = findFootprintByBin(expectation.bin);
  assert(Boolean(record), `${placeId} source footprint ${expectation.bin} must exist.`);
  if (!record) continue;
  const centroid = centroidOfWgs(record.wgs84Polygon);
  assert(classifyFranklinSide(centroid) === expectation.franklin, `${placeId} WGS centroid must match Franklin side.`);
  assert(classifyGreenpointSide(centroid) === expectation.greenpoint, `${placeId} WGS centroid must match Greenpoint side.`);
  const footprint = projectWgsPolygon(record.wgs84Polygon);
  const sceneCentroid = centroidOfScene(footprint);
  const frontageEdge = findFrontageEdge(footprint);
  assert(frontageEdge.distanceToGreenpointAxis <= 0.95, `${placeId} frontage edge must be curb-adjacent in the corrected scene projection.`);
  const expectedSideSign = expectation.greenpoint === "north" ? -1 : 1;
  assert(Math.sign(frontageEdge.midpoint.z) === expectedSideSign || Math.abs(frontageEdge.midpoint.z) < 0.15, `${placeId} frontage midpoint must sit on the expected side before facing Greenpoint.`);
  projected.set(placeId, { centroid: sceneCentroid, frontageEdge });
}

const premier = projected.get("premier-franklin-organic")?.centroid;
const sereneco = projected.get("sereneco")?.centroid;
const sonnys = projected.get("sonnys-corner")?.centroid;
assert(premier && sereneco && Math.sign(premier.z) !== Math.sign(sereneco.z), "Premier and Sereneco must project to opposite Greenpoint sides.");
assert(premier && sereneco && premier.x < 0 && sereneco.x < 0, "Premier and Sereneco must project west/across Franklin.");
assert(sonnys && sonnys.x > 0 && sonnys.z > 0, "Sonny's must project southeast/corridor-side.");

for (const snippet of [
  "QA_LAYER_FOCUS_FRANKLIN_RENDERED_TRUTH",
  "Franklin Rendered",
  "franklin_rendered_truth",
  "franklinRenderedTruthTopDown",
  "franklinRenderedTruthOblique",
  "franklinRenderedTruthFrontageAcross",
  "franklinRenderedTruthSonny",
  "addFranklinRenderedTruthOverlay",
  "createRenderedTruthBuilding",
  "addRenderedTruthFacadeModules",
  "franklinRenderedTruthBuilding",
  "franklinRenderedTruthFacade",
  "franklinRenderedTruthFrontage",
  "child.userData.stateRole === \"franklinRenderedTruthBuilding\"",
  "child.userData.stateRole === \"franklinRenderedTruthFacade\"",
  "child.material.transparent = false",
  "child.material.depthWrite = true",
  "suppressOldStylizedTargetBodiesInFocus",
]) {
  assert(runtime.includes(snippet), `Runtime missing R10F rendered-truth snippet: ${snippet}`);
}

const roleSet = runtime.match(/const QA_FRANKLIN_RENDERED_TRUTH_VISIBLE_ROLES = new Set\(\[[\s\S]*?\]\);/)?.[0] ?? "";
assert(Boolean(roleSet), "Runtime must define QA_FRANKLIN_RENDERED_TRUTH_VISIBLE_ROLES.");
assert(roleSet.includes("franklinRenderedTruthBuilding"), "Rendered Truth focus must include rendered buildings.");
assert(roleSet.includes("franklinRenderedTruthFacade"), "Rendered Truth focus must include facade modules.");
assert(roleSet.includes("franklinRenderedTruthFrontage"), "Rendered Truth focus must include frontage highlights.");
assert(!roleSet.includes("franklinHeroAsset"), "Rendered Truth focus must not include the GLB hero asset.");
assert(!roleSet.includes("evidenceFacadeCue"), "Rendered Truth focus must not fall back to old evidence facade cue placement.");
assert(styles.includes("phase4b-runtime-franklin-rendered-truth"), "CSS must support Franklin Rendered Truth capture mode.");

for (const screenshotPath of fixture.requiredScreenshots ?? []) {
  const absolutePath = path.join(repoRoot, screenshotPath);
  assert(fs.existsSync(absolutePath), `Expected R10F review screenshot missing: ${screenshotPath}`);
  if (fs.existsSync(absolutePath)) {
    const header = fs.readFileSync(absolutePath).subarray(0, 8).toString("hex");
    assert(header === "89504e470d0a1a0a", `Expected PNG screenshot but found different bytes: ${screenshotPath}`);
  }
}

if (failures.length) {
  throw new Error(`4M-R10F Franklin rendered building/frontage truth verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Verified 4M-R10F Franklin rendered building/frontage truth: rendered modules align to source footprints, frontage edges, cue evidence, and GLB assessment remains blocked.");

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
  const endpoint = fixture.renderedTruthModel.projectionBasis.originWgs84;
  return point.lon < endpoint.lon ? "west_across_franklin" : "east_corridor_side";
}

function classifyGreenpointSide(point) {
  const west = fixture.renderedTruthModel.projectionBasis.greenpointAxisWgs84.westPointWgs84;
  const east = fixture.renderedTruthModel.projectionBasis.greenpointAxisWgs84.eastPointWgs84;
  const axis = { lon: east.lon - west.lon, lat: east.lat - west.lat };
  const toPoint = { lon: point.lon - west.lon, lat: point.lat - west.lat };
  const cross = axis.lon * toPoint.lat - axis.lat * toPoint.lon;
  return cross >= 0 ? "north" : "south";
}

function projectWgsPolygon(points) {
  return removeClosingWgsPoint(points).map(projectWgsToRenderedTruth);
}

function projectWgsToRenderedTruth(point) {
  const origin = fixture.renderedTruthModel.projectionBasis.originWgs84;
  const metersPerLon = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  const scale = fixture.renderedTruthModel.projectionBasis.scaleMetersToSceneUnits;
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
  const west = projectWgsToRenderedTruth(r10eFixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.westPointWgs84);
  const east = projectWgsToRenderedTruth(r10eFixture.sceneTruthModel.projectionBasis.greenpointAxisWgs84.eastPointWgs84);
  const vector = { x: east.x - west.x, z: east.z - west.z };
  const length = Math.hypot(vector.x, vector.z) || 1;
  return { x: vector.x / length, z: vector.z / length };
}

function cross2d(a, b) {
  return a.x * b.z - a.z * b.x;
}
