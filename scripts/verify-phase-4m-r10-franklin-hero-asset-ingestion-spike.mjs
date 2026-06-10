#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = "src/data/facade-cues/franklin-hero-records.v0.1.json";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const heroPath = "src/components/hero/FranklinHeroCorner.jsx";
const loaderPath = "src/components/hero/FranklinHeroAssetLoader.js";
const assetPath = "assets/windows/Bay_Window_10K_texture.glb";
const packagePath = "package.json";

async function main() {
  const failures = [];
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const hero = await readFile(resolve(repoRoot, heroPath), "utf8");
  const loader = await readFile(resolve(repoRoot, loaderPath), "utf8");
  const packageJson = await readFile(resolve(repoRoot, packagePath), "utf8");
  const asset = await readFile(resolve(repoRoot, assetPath));
  const assetStats = await stat(resolve(repoRoot, assetPath));

  assertEqual(asset.toString("utf8", 0, 4), "glTF", `${assetPath} magic`, failures);
  assertEqual(asset.readUInt32LE(4), 2, `${assetPath} version`, failures);
  if (assetStats.size < 1024 * 1024) failures.push(`${assetPath} is unexpectedly small for the supplied GLB asset`);

  assertEqual(fixture.qaOnly, true, "fixture.qaOnly", failures);
  assertEqual(fixture.normalModeExposure, "blocked", "fixture.normalModeExposure", failures);
  for (const claim of ["production_asset", "normal_mode", "exact_facade", "exact_sign_text", "public_claim"]) {
    if (!fixture.blockedClaims?.includes(claim)) failures.push(`Fixture blockedClaims missing ${claim}`);
  }

  const assetBindings = fixture.detailModules?.heroAssetBindings;
  if (!assetBindings) {
    failures.push("Fixture missing detailModules.heroAssetBindings");
  } else {
    assertEqual(assetBindings.status, "qa_only_r10_one_asset_ingestion_spike_not_production", "heroAssetBindings.status", failures);
    assertEqual(assetBindings.normalModeExposure, "blocked", "heroAssetBindings.normalModeExposure", failures);
    const bindings = assetBindings.bindings ?? [];
    assertEqual(bindings.length, 1, "heroAssetBindings.bindings.length", failures);
    const binding = bindings[0] ?? {};
    assertEqual(binding.assetId, "franklin-side-bay-window-candidate", "binding.assetId", failures);
    assertEqual(binding.assetType, "glb", "binding.assetType", failures);
    assertEqual(binding.assetPath, assetPath, "binding.assetPath", failures);
    assertEqual(binding.qaOnly, true, "binding.qaOnly", failures);
    assertEqual(binding.enabled, true, "binding.enabled", failures);
    assertEqual(binding.targetDetailModule, "bayWindowProjection", "binding.targetDetailModule", failures);
    assertEqual(binding.fallbackDetailModule, "bayWindowProjection", "binding.fallbackDetailModule", failures);
    assertEqual(binding.anchorFace, "sideReturn", "binding.anchorFace", failures);
    assertEqual(binding.normalModeExposure, "blocked", "binding.normalModeExposure", failures);
    assertEqual(binding.reviewToggleQueryParam, "r10HeroAsset", "binding.reviewToggleQueryParam", failures);
    if (!String(binding.status).includes("not_production")) failures.push("binding.status must remain not_production");
  }

  const loaderRequiredSnippets = [
    "GLTFLoader",
    "Bay_Window_10K_texture.glb?url",
    "HERO_ASSET_REGISTRY",
    "franklin-side-bay-window-candidate",
    "addFranklinHeroAssetBindings",
    "isFranklinHeroAssetBindingEnabled",
    "computeBayWindowAssetPlacement",
    "targetDetailModule !== \"bayWindowProjection\"",
    "child.userData.stateRole = \"franklinHeroAsset\"",
  ];
  for (const snippet of loaderRequiredSnippets) {
    if (!loader.includes(snippet)) failures.push(`Hero asset loader missing snippet: ${snippet}`);
  }

  const heroRequiredSnippets = [
    "FranklinHeroAssetLoader.js",
    "addFranklinHeroAssetBindings(group, {",
    "facadeRecord,",
    "facadeXMax,",
    "recordFaceZ,",
    "isFranklinHeroAssetBindingEnabled(options.facadeRecord, \"bayWindowProjection\", options.heroAssetOptions)",
    "addRecordBayWindowProjection(group, options)",
  ];
  for (const snippet of heroRequiredSnippets) {
    if (!hero.includes(snippet)) failures.push(`Franklin hero module missing R10 snippet: ${snippet}`);
  }

  const runtimeRequiredSnippets = [
    "r10HeroAsset",
    "heroAssetEnabled",
    "Toggle R10 Franklin GLB hero asset",
    "{ enabled: heroAssetEnabled }",
    "addPlaceRecognitionLandmarks(group, {",
    "heroAssetOptions",
    "franklinHeroAsset",
  ];
  for (const snippet of runtimeRequiredSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing R10 toggle/role snippet: ${snippet}`);
  }

  for (const forbiddenRuntime of ["GLTFLoader", "Bay_Window_10K_texture.glb", ".glb?url"]) {
    if (runtime.includes(forbiddenRuntime)) failures.push(`Runtime owns forbidden asset-loading detail: ${forbiddenRuntime}`);
  }
  for (const forbiddenDiagnostic of ["__r10", "R10 asset placement", "R10 asset loaded"]) {
    if (runtime.includes(forbiddenDiagnostic) || loader.includes(forbiddenDiagnostic)) failures.push(`R10 temporary diagnostic leaked into source: ${forbiddenDiagnostic}`);
  }
  for (const forbiddenPackage of ["cesium", "@loaders.gl/3d-tiles", "3d-tiles", "three-stdlib", "@react-three"]) {
    if (packageJson.includes(forbiddenPackage)) failures.push(`package.json contains forbidden R10 package/token: ${forbiddenPackage}`);
  }

  if (failures.length > 0) {
    console.error("4M-R10 Franklin hero asset ingestion spike verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Verified 4M-R10 Franklin QA hero asset ingestion spike: one GLB, structured binding, loader boundary, toggle/fallback path, and blocked claims are intact");
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
