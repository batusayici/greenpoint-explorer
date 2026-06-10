#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/franklin-hero-records.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const heroPath = "src/components/hero/FranklinHeroCorner.jsx";
const packagePath = "package.json";

const requiredBlockedClaims = [
  "business_identity",
  "tenant_identity",
  "exact_frontage",
  "exact_sign_text",
  "production_asset",
  "normal_mode",
];

const forbiddenRuntimeSnippets = [
  "GLTFLoader",
  "GLBLoader",
  ".glb",
  ".gltf",
  "Cesium",
  "3DTiles",
  "three/examples/jsm/loaders/GLTFLoader",
  "textureAtlas",
  "rasterTextureAtlas",
  "productionModeFacade",
  "normalModeExposure: \"enabled\"",
];

async function main() {
  const failures = [];
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const hero = await readFile(resolve(repoRoot, heroPath), "utf8");
  const packageJson = await readFile(resolve(repoRoot, packagePath), "utf8");

  assertEqual(fixture.schemaVersion, "qa-facade-record.v0.1", "fixture.schemaVersion", failures);
  assertEqual(fixture.recordId, "qa-franklin-hero-facade-v0", "fixture.recordId", failures);
  assertEqual(fixture.qaOnly, true, "fixture.qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "fixture.normalModeExposure", failures);
  assertEqual(fixture.targetSemanticId, "p4b-object-nyc-footprint-bin-3064793", "fixture.targetSemanticId", failures);
  assertEqual(fixture.targetGeometryContainerId, "p4b-object-nyc-footprint-bin-3064793", "fixture.targetGeometryContainerId", failures);
  assertEqual(fixture.targetSourceRecordId, "p4b-record-nyc-footprint-bin-3064793", "fixture.targetSourceRecordId", failures);
  assertEqual(fixture.targetCueRecordId, "p4e1-franklin-red-brick-cornice-corner", "fixture.targetCueRecordId", failures);
  assertEqual(fixture.bin, "3064793", "fixture.bin", failures);
  assertEqual(fixture.associationStatus, "provisional_geometry_target_for_qa_render_only", "fixture.associationStatus", failures);

  for (const claim of requiredBlockedClaims) {
    if (!fixture.blockedClaims?.includes(claim)) failures.push(`Fixture blockedClaims missing ${claim}`);
  }
  if (!fixture.blockedClaims?.includes("storefront_anchor")) failures.push("Fixture must keep storefront_anchor blocked");
  if (!fixture.targetVerification?.verifiedAgainst?.length) failures.push("Fixture must record repo fixture target verification provenance");

  const requiredFixturePaths = [
    "greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json",
    "greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json",
    "greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json",
  ];
  for (const path of requiredFixturePaths) {
    if (!fixture.targetVerification.verifiedAgainst.some((entry) => entry.includes(path))) {
      failures.push(`Fixture targetVerification missing ${path}`);
    }
  }

  const runtimeSnippets = [
    "franklinHeroFacadeRecord",
    "matchingFranklinFacadeRecord",
    "franklinHeroFacadeRecord.targetSemanticId === \"p4b-object-nyc-footprint-bin-3064793\"",
    "franklinHeroFacadeRecord.targetCueRecordId === endpointHeroFacadeOverrides.franklin.targetCueRecordId",
    "facadeRecord: matchingFranklinFacadeRecord",
    "addFranklinHeroCorner(group",
  ];
  for (const snippet of runtimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing R8 binding snippet: ${snippet}`);
  }

  const heroSnippets = [
    "facadeRecord?.qaOnly",
    "addFranklinFacadeRecordAssembly(group, options)",
    "const groundFloor = front.groundFloor ?? {}",
    "const upperFloors = front.upperFloors ?? {}",
    "const roof = front.roof ?? {}",
    "const sideReturn = facadeRecord.faces?.sideReturn ?? {}",
    "readRecordValue(groundFloor.bayCount",
    "groundFloor.bayWidthRatios",
    "groundFloor.hasSignBand",
    "groundFloor.hasAwning",
    "groundFloor.storefrontRecess",
    "groundFloor.mullionDepth",
    "readRecordValue(upperFloors.rowCount",
    "upperFloors.bayPattern",
    "upperFloors.windowRecess",
    "upperFloors.windowTrimProjection",
    "roof.corniceLayerCount",
    "roof.corniceProjection",
    "roof.hasBulkhead?.value",
    "sideReturn.sparseWindowRows",
    "sideReturn.returnStorefrontBays",
  ];
  for (const snippet of heroSnippets) {
    if (!hero.includes(snippet)) failures.push(`Franklin hero module missing facade-record consumption snippet: ${snippet}`);
  }

  for (const forbidden of forbiddenRuntimeSnippets) {
    if (runtime.includes(forbidden) || hero.includes(forbidden)) failures.push(`Source introduced forbidden R8 runtime token: ${forbidden}`);
  }
  for (const forbiddenPackage of ["cesium", "@loaders.gl/3d-tiles", "GLTFLoader", "gltf", "3d-tiles"]) {
    if (packageJson.includes(forbiddenPackage)) failures.push(`package.json contains forbidden R8 package/token: ${forbiddenPackage}`);
  }

  if (failures.length > 0) {
    console.error("4M-R8 Franklin facade record assembly verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Verified 4M-R8 Franklin QA facade record assembly: fixture, binding, field consumption, and blocked technology/claim paths are intact");
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
