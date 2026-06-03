#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_MAP_PATH =
  "docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/generated/exact-geometry-source-map.json";
const TARGET_SCENE_SPEC_PATH =
  "docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/generated/target-scene-spec.json";
const GAP_LIST_PATH =
  "docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/generated/reproducibility-gap-list.json";
const DEFAULT_OUTPUT_DIR =
  "docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/generated";
const LOCAL_SOURCE_PATHS = {
  sourceMap: SOURCE_MAP_PATH,
  targetSceneSpec: TARGET_SCENE_SPEC_PATH,
  gapList: GAP_LIST_PATH,
  sourceEvidence: "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json",
  activeTargets: "src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json",
  draftScene: "src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json",
  geometrySource: "src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json",
};

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outputDir = options["output-dir"] ?? DEFAULT_OUTPUT_DIR;
  const sourceMap = await readJson(SOURCE_MAP_PATH);
  const targetSceneSpec = await readJson(TARGET_SCENE_SPEC_PATH);
  const gapList = await readJson(GAP_LIST_PATH);

  validateInputs(sourceMap, targetSceneSpec);

  const fixture = buildExactReviewGeometryFixture(sourceMap, targetSceneSpec);
  const adapterSpec = buildRasterPromptAdapterSpec(fixture, gapList);
  const promptText = buildPromptText(adapterSpec);
  const provenanceMap = buildAdapterProvenanceMap(fixture, adapterSpec);

  await mkdir(resolve(repoRoot, outputDir), { recursive: true });
  await writeJson(resolve(repoRoot, outputDir, "exact-review-geometry-fixture.json"), fixture);
  await writeJson(resolve(repoRoot, outputDir, "raster-prompt-adapter-spec.json"), adapterSpec);
  await writeJson(resolve(repoRoot, outputDir, "adapter-provenance-map.json"), provenanceMap);
  await writeFile(resolve(repoRoot, outputDir, "raster-prompt.txt"), `${promptText}\n`, "utf8");

  console.log([
    "Wrote Phase 2DTR-5 exact review geometry adapter artifacts:",
    outputDir,
    `targets=${fixture.targets.length}`,
    `promptSections=${adapterSpec.promptSections.length}.`,
  ].join(" "));
}

function buildExactReviewGeometryFixture(sourceMap, targetSceneSpec) {
  const specByTarget = new Map(
    targetSceneSpec.visualPlacementRequirements.map((target) => [target.targetId, target]),
  );

  return {
    schemaVersion: "phase-2dtr-exact-review-geometry-fixture.v0.1",
    fixtureId: "phase-2dtr-5.exact-review-geometry-fixture",
    status: "review-only-exact-geometry-fixture",
    generatedOn: "2026-06-03",
    generatedBy: "scripts/generate-phase-2dtr-5-exact-review-raster-prompt.mjs",
    sourceArtifacts: [
      SOURCE_MAP_PATH,
      TARGET_SCENE_SPEC_PATH,
      GAP_LIST_PATH,
    ],
    coordinateSystem: {
      id: "mvp-29e-review-plate-pixels",
      sourcePlate: sourceMap.coordinateSpace.sourcePlate,
      pixelSize: sourceMap.coordinateSpace.pixelSize,
      meaning: sourceMap.coordinateSpace.meaning,
    },
    sourceCategories: sourceMap.sourceTaxonomy,
    sceneFrame: {
      sceneId: targetSceneSpec.sceneId,
      visualDirection: "Inked Indie / Compact Corner, review-only",
      camera: "compact isometric four-corner Manhattan Ave / Greenpoint Ave scene",
      targetOrder: targetSceneSpec.targetOrder,
      nonApprovals: [
        "No production/public exact-geometry claims.",
        "No production assets or production asset pipeline.",
        "No live scraping, live APIs, Google/Street View/3D Tiles extraction, tracing, texture extraction, or training use.",
        "No app/source/package/tooling changes.",
        "No normal-mode raster replacement.",
      ],
    },
    targets: sourceMap.sceneElements.map((element) => {
      const spec = specByTarget.get(element.targetId);
      if (!spec) throw new Error(`Missing target scene spec for ${element.targetId}`);
      return buildFixtureTarget(element, spec);
    }),
  };
}

function buildFixtureTarget(element, spec) {
  const facts = element.businessAndPlaceFacts;
  const geometry = element.reviewCoordinateRequirements;
  const isTransit = element.targetId === "greenpoint-g-subway";
  const addressValue = facts.addressContext?.value ?? "";
  const sourceEvidenceIds = facts.sourceEvidence.map((record) => record.id);
  const referencePhotoPaths = element.referencePhotoInputs.map((input) => input.path);

  const base = {
    targetId: element.targetId,
    placeId: `place-${element.targetId}`,
    reviewLabel: element.reviewLabel,
    cornerId: element.cornerId,
    renderingKind: element.renderingKind,
    drawOrder: spec.drawOrder,
    businessOrPlace: {
      name: field(facts.name.value, "existing_source_evidence", facts.name.status, facts.name.sourceIds, facts.name.notes, [LOCAL_SOURCE_PATHS.sourceEvidence]),
      category: field(facts.category.value, "existing_source_evidence", facts.category.status, facts.category.sourceIds, facts.category.notes, [LOCAL_SOURCE_PATHS.sourceEvidence]),
      addressOrContext: field(addressValue, "existing_source_evidence", facts.addressContext.status, facts.addressContext.sourceIds, facts.addressContext.notes, [LOCAL_SOURCE_PATHS.sourceEvidence]),
    },
    evidenceInputs: {
      existingSourceEvidence: facts.sourceEvidence,
      nycOpenData: element.openDataScaffold?.footprintId ? {
        footprintId: element.openDataScaffold.footprintId,
        bin: element.openDataScaffold.bin,
        bbl: element.openDataScaffold.bbl,
        matchStatus: element.openDataScaffold.matchStatus,
        supports: element.openDataScaffold.supports,
        doesNotSupport: element.openDataScaffold.doesNotSupport,
        notes: element.openDataScaffold.matchNotes,
      } : null,
      suppliedReferencePhotos: element.referencePhotoInputs,
    },
    visibleTextCues: {
      primarySignText: field(isTransit ? "G" : element.reviewLabel, "existing_source_evidence", isTransit ? "symbolic_review" : "source_backed", isTransit ? sourceEvidenceIds : facts.name.sourceIds, isTransit ? "Route/station cue text for review-only station context." : "Visible review sign text derived from the review label/business identity.", [LOCAL_SOURCE_PATHS.sourceEvidence]),
      secondaryAddressCue: field(addressValue, "existing_source_evidence", "review_only", sourceEvidenceIds, "Address/context text supports scene targeting but is not a production/public exact-placement claim.", [LOCAL_SOURCE_PATHS.sourceEvidence]),
    },
    sourceCategoryByField: spec.exactReviewPlacementRequirement.sourceMap,
    requiredRenderingNotes: spec.visibleSceneRequirements,
  };

  if (isTransit) {
    return {
      ...base,
      geometry: {
        cueCenter: field(geometry.symbolicCueCenter, "manual_review_only_interpretation", geometry.status.symbolicCue.reviewGeometryStatus, geometry.status.symbolicCue.sourceIds, geometry.status.symbolicCue.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets]),
        cueRadius: field(geometry.symbolicCueRadius, "manual_review_only_interpretation", geometry.status.symbolicCue.reviewGeometryStatus, geometry.status.symbolicCue.sourceIds, "Radius of the review-coordinate symbolic station cue.", [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets]),
        entranceCueBounds: field(geometry.entranceCueBounds, "manual_review_only_interpretation", geometry.status.entranceGeometry.reviewGeometryStatus, geometry.status.entranceGeometry.sourceIds, geometry.status.entranceGeometry.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets, ...referencePhotoPaths]),
        addressAnchorPoint: field(geometry.addressAnchorPoint, "manual_review_only_interpretation", geometry.status.addressAnchor.reviewGeometryStatus, geometry.status.addressAnchor.sourceIds, geometry.status.addressAnchor.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets]),
        storefrontOrder: field("not_applicable_transit_context", "unsupported_or_unresolved", "not_applicable", [], "Transit cue is not a storefront order/frontage claim.", [LOCAL_SOURCE_PATHS.gapList]),
        facadeFrontageWindowEntrance: field("station cue only; no storefront facade/windows", "unsupported_or_unresolved", "not_applicable", [], "Exact station entrance details still require stronger evidence before public/product claims.", [LOCAL_SOURCE_PATHS.gapList]),
      },
      adapterDirectives: [
        "Render a Greenpoint G station-area cue at the review-coordinate center and entrance cue bounds.",
        "Use supplied station-context reference photos only as MVP review/source imagery.",
        "Keep station geometry marked review-only unless exact entrance evidence is later accepted.",
      ],
      unsupportedFields: [
        "automatic exact station entrance geometry",
        "station stair/elevator orientation from official geometry",
        "public/product station coordinate claim",
      ],
    };
  }

  return {
    ...base,
    geometry: {
      buildingMassBounds: field(geometry.buildingMassBounds, categoryFor("buildingMass", geometry.sourceMap), geometry.status.buildingMass.reviewGeometryStatus, geometry.status.buildingMass.sourceIds, geometry.status.buildingMass.notes, [LOCAL_SOURCE_PATHS.geometrySource, LOCAL_SOURCE_PATHS.targetSceneSpec]),
      frontageSegment: field(geometry.frontageSegment, categoryFor("frontageSegment", geometry.sourceMap), geometry.status.frontageSegment.reviewGeometryStatus, geometry.status.frontageSegment.sourceIds, geometry.status.frontageSegment.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets, ...referencePhotoPaths]),
      storefrontBounds: field(geometry.storefrontBounds, categoryFor("storefrontFacadeOrder", geometry.sourceMap), geometry.status.storefrontSample.reviewGeometryStatus, geometry.status.storefrontSample.sourceIds, geometry.status.storefrontSample.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets, ...referencePhotoPaths]),
      storefrontOrder: field({
        sceneOrder: spec.drawOrder,
        cornerId: element.cornerId,
        bayCount: geometry.storefrontBayCount,
      }, "manual_review_only_interpretation", "exact_review_candidate", ["phase-2dtr-4.target-scene-spec"], "Review-coordinate storefront order inside the MVP slice.", [LOCAL_SOURCE_PATHS.targetSceneSpec]),
      signPanelBounds: field(geometry.signPanelBounds, "manual_review_only_interpretation", "exact_review_candidate", ["phase-2dtr-4.target-scene-spec"], "Review-coordinate sign panel placement for adapter generation.", [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.draftScene, ...referencePhotoPaths]),
      entranceBounds: field(geometry.entranceBounds, categoryFor("entranceWindowGeometry", geometry.sourceMap), geometry.status.entranceGeometry.reviewGeometryStatus, geometry.status.entranceGeometry.sourceIds, geometry.status.entranceGeometry.notes, [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets, ...referencePhotoPaths]),
      windowBounds: field(geometry.windowBounds.map((window) => window.bounds), categoryFor("entranceWindowGeometry", geometry.sourceMap), "exact_review_candidate", referencePhotoPaths, "Review-coordinate window cues derived from supplied reference-photo review and manual plate interpretation.", [LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.draftScene, ...referencePhotoPaths]),
      addressAnchorPoint: field(geometry.addressAnchorPoint, categoryFor("exactAddressPlacement", geometry.sourceMap), geometry.status.addressAnchor.reviewGeometryStatus, geometry.status.addressAnchor.sourceIds, geometry.status.addressAnchor.notes, [LOCAL_SOURCE_PATHS.sourceEvidence, LOCAL_SOURCE_PATHS.targetSceneSpec, LOCAL_SOURCE_PATHS.activeTargets]),
    },
    adapterDirectives: [
      `Render ${element.reviewLabel} at ${element.cornerId} using its exact review-coordinate storefront bounds.`,
      "Use frontageSegment as the required visible-facing line on the MVP review plate.",
      "Place sign text inside signPanelBounds and align entrance/window cues to their exact review-coordinate bounds.",
      "Use supplied reference photos for facade rhythm, entrance/window interpretation, and sign-band relationship only.",
      "Carry sourceCategory/status/provenance for every visible target field.",
    ],
    unsupportedFields: [
      "automatic reference-photo facade parsing",
      "automatic storefront frontage/order measurement",
      "automatic exact address-to-scene projection",
      "production/public exact-geometry claim",
    ],
  };
}

function buildRasterPromptAdapterSpec(fixture, gapList) {
  const promptSections = fixture.targets.map((target) => ({
    targetId: target.targetId,
    reviewLabel: target.reviewLabel,
    cornerId: target.cornerId,
    drawOrder: target.drawOrder,
    promptText: buildTargetPrompt(target),
    requiredGeometry: target.geometry,
    provenanceRequirements: requiredProvenanceForTarget(target),
    unsupportedMustRemainLabeled: target.unsupportedFields,
  }));

  return {
    schemaVersion: "phase-2dtr-raster-prompt-adapter-spec.v0.1",
    artifactId: "phase-2dtr-5.raster-prompt-adapter-spec",
    status: "deterministic-review-only-raster-prompt-spec",
    generatedOn: "2026-06-03",
    generatedBy: fixture.generatedBy,
    inputFixture: "exact-review-geometry-fixture.json",
    scenePrompt: {
      title: "Manhattan Ave / Greenpoint Ave exact review geometry raster prompt",
      purpose: "Generate a true-to-life review-only isometric MVP scene from structured exact review geometry, provenance, and supplied reference imagery.",
      coordinateSystem: fixture.coordinateSystem,
      globalPrompt: [
        "Create one review-only, true-to-life compact isometric raster scene for Manhattan Ave / Greenpoint Ave in Greenpoint, Brooklyn.",
        "Use the supplied exact review-coordinate geometry fixture as the placement authority for storefront bounds, frontage lines, sign panels, entrance cues, window cues, address anchors, and Greenpoint G station cue bounds.",
        "Preserve the approved Inked Indie / Compact Corner visual direction while keeping real names and address context clearly review-only.",
        "Use NYC/open data only as building scaffold context; do not infer tenant frontage, storefront order, entrance placement, facade appearance, active-business status, address placement, or station geometry from building footprints alone.",
        "Use supplied reference photos as MVP review/source imagery for facade rhythm, sign-band relationship, entrance/window cues, and station cue interpretation; do not trace, texture-extract, train on, or treat them as production assets.",
        "Every visible scene field must retain sourceCategory, status, and source path in the companion provenance map.",
      ],
      negativePrompt: [
        "No production/public exact-geometry claims.",
        "No ratings, reviews, hours, endorsements, partnership claims, promotions, or service availability claims.",
        "No Google/Street View/3D Tiles extraction, scraping, tracing, texture extraction, or production reuse.",
        "No generated brand/trade-dress exactness claims or production trademark clearance claims.",
        "No unlabeled exact geometry: unsupported fields must remain review-only, unsupported, symbolic, or blocked in provenance.",
      ],
    },
    promptSections,
    reproducibilityStatus: {
      automaticNow: gapList.automaticallyReproducibleNow,
      notAutomaticYet: gapList.notAutomaticallyReproducibleYet,
    },
    adapterVerificationRules: [
      "Fail if any promptSection lacks targetId, reviewLabel, cornerId, drawOrder, promptText, requiredGeometry, or provenanceRequirements.",
      "Fail if any visible geometry field lacks value, sourceCategory, sourceCategories, status, sourceIds, and sourcePaths.",
      "Fail if a target prompt omits review-only/non-production language.",
      "Fail if the global prompt omits supplied reference photo constraints or NYC/open-data scaffold limits.",
    ],
  };
}

function buildAdapterProvenanceMap(fixture, adapterSpec) {
  return {
    schemaVersion: "phase-2dtr-adapter-provenance-map.v0.1",
    artifactId: "phase-2dtr-5.adapter-provenance-map",
    status: "review-only-adapter-provenance-map",
    generatedOn: "2026-06-03",
    generatedBy: fixture.generatedBy,
    inputFixture: "exact-review-geometry-fixture.json",
    adapterSpec: "raster-prompt-adapter-spec.json",
    targetFieldMap: fixture.targets.map((target) => ({
      targetId: target.targetId,
      reviewLabel: target.reviewLabel,
      businessOrPlaceFields: Object.fromEntries(
        Object.entries(target.businessOrPlace).map(([key, value]) => [key, compactProvenance(value)]),
      ),
      geometryFields: Object.fromEntries(
        Object.entries(target.geometry).map(([key, value]) => [key, compactProvenance(value)]),
      ),
      promptSection: adapterSpec.promptSections.find((section) => section.targetId === target.targetId)?.promptText,
      unsupportedFields: target.unsupportedFields,
    })),
  };
}

function buildTargetPrompt(target) {
  const identity = `${target.reviewLabel} (${target.businessOrPlace.addressOrContext.value})`;
  const geometryBits = Object.entries(target.geometry)
    .filter(([, value]) => value.value !== null && value.value !== undefined)
    .map(([key, value]) => `${key}=${JSON.stringify(value.value)} [${value.sourceCategory}; ${value.status}]`);

  return [
    `Target ${target.drawOrder}: ${identity} at ${target.cornerId}.`,
    `Rendering kind: ${target.renderingKind}.`,
    `Visible text cue: ${target.visibleTextCues.primarySignText.value}.`,
    `Use exact review-coordinate geometry: ${geometryBits.join("; ")}.`,
    `Required directives: ${target.adapterDirectives.join(" ")}`,
    "Keep this target review-only; do not imply production/public exact geometry.",
  ].join(" ");
}

function buildPromptText(adapterSpec) {
  return [
    adapterSpec.scenePrompt.title,
    "",
    "GLOBAL PROMPT",
    ...adapterSpec.scenePrompt.globalPrompt.map((line) => `- ${line}`),
    "",
    "TARGET PROMPTS",
    ...adapterSpec.promptSections.map((section) => `- ${section.promptText}`),
    "",
    "NEGATIVE / DO-NOT-CLAIM PROMPT",
    ...adapterSpec.scenePrompt.negativePrompt.map((line) => `- ${line}`),
  ].join("\n");
}

function requiredProvenanceForTarget(target) {
  return {
    businessOrPlace: Object.fromEntries(
      Object.entries(target.businessOrPlace).map(([key, value]) => [key, compactProvenance(value)]),
    ),
    visibleTextCues: Object.fromEntries(
      Object.entries(target.visibleTextCues).map(([key, value]) => [key, compactProvenance(value)]),
    ),
    geometry: Object.fromEntries(
      Object.entries(target.geometry).map(([key, value]) => [key, compactProvenance(value)]),
    ),
  };
}

function field(value, sourceCategory, status, sourceIds, notes, sourcePaths = []) {
  return {
    value,
    sourceCategory,
    sourceCategories: sourceCategory.split("+").map((category) => category.trim()).filter(Boolean),
    status,
    sourceIds: [...new Set((sourceIds ?? []).filter(Boolean))].sort(),
    sourcePaths: [...new Set((sourcePaths ?? []).filter(Boolean))].sort(),
    notes,
  };
}

function compactProvenance(value) {
  return {
    sourceCategory: value.sourceCategory,
    sourceCategories: value.sourceCategories,
    status: value.status,
    sourceIds: value.sourceIds,
    sourcePaths: value.sourcePaths,
    notes: value.notes,
  };
}

function categoryFor(key, sourceMap) {
  const source = sourceMap?.[key] ?? "";
  if (source.includes("nyc_open_data")) return "nyc_open_data";
  if (source.includes("existing_source_evidence")) return "existing_source_evidence";
  if (source.includes("reference_photo_derived")) return "reference_photo_derived";
  if (source.includes("manual_review_only_interpretation")) return "manual_review_only_interpretation";
  return "unsupported_or_unresolved";
}

function validateInputs(sourceMap, targetSceneSpec) {
  const sourceTargets = sourceMap.sceneElements.map((target) => target.targetId);
  const specTargets = targetSceneSpec.targetOrder;
  if (JSON.stringify(sourceTargets) !== JSON.stringify(specTargets)) {
    throw new Error(`Target mismatch: sourceMap=${sourceTargets.join(",")} targetSceneSpec=${specTargets.join(",")}`);
  }
  for (const element of sourceMap.sceneElements) {
    if (!element.reviewCoordinateRequirements) throw new Error(`${element.targetId} is missing reviewCoordinateRequirements`);
    if (!element.businessAndPlaceFacts?.name?.value) throw new Error(`${element.targetId} is missing business/place name`);
    if (!element.referencePhotoInputs?.length) throw new Error(`${element.targetId} is missing referencePhotoInputs`);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    options[key] = value;
    index += 1;
  }
  return options;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
