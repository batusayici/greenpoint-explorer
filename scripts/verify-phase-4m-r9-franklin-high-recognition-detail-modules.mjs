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
  "storefront_anchor",
  "exact_frontage",
  "exact_sign_text",
  "production_asset",
  "normal_mode",
];

const requiredDetailModules = [
  "bayWindowProjection",
  "fireEscape",
  "windowUtilities",
  "facadeRhythmVariation",
  "materialBands",
  "streetDressing",
];

const forbiddenSourceSnippets = [
  "GLTFLoader",
  "GLBLoader",
  ".glb",
  ".gltf",
  "Cesium",
  "3DTiles",
  "three/examples/jsm/loaders/GLTFLoader",
  "textureAtlas",
  "rasterTextureAtlas",
  "ShaderMaterial",
  "RawShaderMaterial",
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
  assertEqual(fixture.qaOnly, true, "fixture.qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "fixture.normalModeExposure", failures);
  assertEqual(fixture.targetSemanticId, "p4b-object-nyc-footprint-bin-3064793", "fixture.targetSemanticId", failures);
  assertEqual(fixture.bin, "3064793", "fixture.bin", failures);

  for (const claim of requiredBlockedClaims) {
    if (!fixture.blockedClaims?.includes(claim)) failures.push(`Fixture blockedClaims missing ${claim}`);
  }

  if (!fixture.detailModules || typeof fixture.detailModules !== "object") {
    failures.push("Fixture missing detailModules object");
  } else {
    assertEqual(fixture.detailModules.status, "qa_manual_draft_high_recognition_cues_not_exact_facade", "fixture.detailModules.status", failures);
    for (const moduleName of requiredDetailModules) {
      const detailModule = fixture.detailModules[moduleName];
      if (!detailModule) {
        failures.push(`Fixture detailModules missing ${moduleName}`);
        continue;
      }
      assertEqual(detailModule.qaOnly, true, `fixture.detailModules.${moduleName}.qaOnly`, failures);
      if (detailModule.enabled !== true) failures.push(`Fixture detailModules.${moduleName}.enabled must be true for R9 proof`);
      if (!detailModule.status || !String(detailModule.status).includes("not_exact") && !String(detailModule.status).includes("candidate") && !String(detailModule.status).includes("qa")) {
        failures.push(`Fixture detailModules.${moduleName}.status must remain candidate/QA/not-exact language`);
      }
    }
    if (fixture.detailModules.facadeRhythmVariation?.deterministic !== true) {
      failures.push("facadeRhythmVariation must be deterministic");
    }
    if (!Array.isArray(fixture.detailModules.windowUtilities?.frontAcPlacements) || fixture.detailModules.windowUtilities.frontAcPlacements.length < 2) {
      failures.push("windowUtilities must include frontAcPlacements");
    }
    if (!Array.isArray(fixture.detailModules.streetDressing?.contextProps) || fixture.detailModules.streetDressing.contextProps.length < 3) {
      failures.push("streetDressing must include bounded contextProps");
    }
  }

  const heroSnippets = [
    "const detailModules = facadeRecord.detailModules ?? {}",
    "addRecordDetailModules(group",
    "detailModules.bayWindowProjection",
    "detailModules.fireEscape",
    "detailModules.windowUtilities",
    "detailModules.facadeRhythmVariation",
    "detailModules.materialBands",
    "detailModules.streetDressing",
    "addRecordBayWindowProjection",
    "addRecordFireEscape",
    "addRecordWindowUtilities",
    "addRecordRhythmVariation",
    "addRecordMaterialBands",
    "addRecordStreetDressing",
  ];
  for (const snippet of heroSnippets) {
    if (!hero.includes(snippet)) failures.push(`Franklin hero module missing R9 detail consumption snippet: ${snippet}`);
  }

  const runtimeSnippets = [
    "franklinHeroFacadeRecord",
    "matchingFranklinFacadeRecord",
    "facadeRecord: matchingFranklinFacadeRecord",
    "addFranklinHeroCorner(group",
  ];
  for (const snippet of runtimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing record assembly snippet: ${snippet}`);
  }

  const runtimeForbiddenDetailSnippets = [
    "addRecordFireEscape",
    "addRecordBayWindowProjection",
    "detailModules.fireEscape",
    "detailModules.bayWindowProjection",
    "facadeRhythmVariation",
    "streetDressing.contextProps",
  ];
  for (const snippet of runtimeForbiddenDetailSnippets) {
    if (runtime.includes(snippet)) failures.push(`Runtime absorbed Franklin visual detail logic: ${snippet}`);
  }

  for (const forbidden of forbiddenSourceSnippets) {
    if (runtime.includes(forbidden) || hero.includes(forbidden)) failures.push(`Source introduced forbidden R9 token: ${forbidden}`);
  }
  for (const forbiddenPackage of ["cesium", "@loaders.gl/3d-tiles", "GLTFLoader", "gltf", "3d-tiles"]) {
    if (packageJson.includes(forbiddenPackage)) failures.push(`package.json contains forbidden R9 package/token: ${forbiddenPackage}`);
  }

  if (failures.length > 0) {
    console.error("4M-R9 Franklin high-recognition detail module verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Verified 4M-R9 Franklin QA high-recognition detail modules: record fields, hero-module consumption, runtime boundary, and blocked paths are intact");
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
