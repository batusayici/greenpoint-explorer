#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packetDir, "../../..");
const outputDirArgIndex = process.argv.indexOf("--output-dir");
const outputDirArg = outputDirArgIndex >= 0 ? process.argv[outputDirArgIndex + 1] : null;
const generatedDir = outputDirArg ? path.resolve(outputDirArg) : path.join(packetDir, "generated");
const canonicalGeneratedDir = path.join(packetDir, "generated");

const fixturePath = path.join(
  repoRoot,
  "docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/generated/exact-review-geometry-fixture.json"
);
const dtr7ReportPath = path.join(
  repoRoot,
  "docs/mvp-review/phase-2dtr-7-fixture-to-blueprint-scene-layout-validation/generated/blueprint-validation-report.json"
);

const primitiveFixturePath = path.join(generatedDir, "geometry-primitive-fixture.json");
const adapterPath = path.join(generatedDir, "styled-raster-ready-geometry-adapter.json");
const blueprintPath = path.join(generatedDir, "geometry-primitive-blueprint.svg");
const validationPath = path.join(generatedDir, "geometry-primitive-validation-report.json");
const promptPath = path.join(generatedDir, "styled-raster-geometry-prompt.txt");
const canonicalPrimitiveFixturePath = path.join(canonicalGeneratedDir, "geometry-primitive-fixture.json");
const canonicalAdapterPath = path.join(canonicalGeneratedDir, "styled-raster-ready-geometry-adapter.json");
const canonicalBlueprintPath = path.join(canonicalGeneratedDir, "geometry-primitive-blueprint.svg");
const canonicalValidationPath = path.join(canonicalGeneratedDir, "geometry-primitive-validation-report.json");
const canonicalPromptPath = path.join(canonicalGeneratedDir, "styled-raster-geometry-prompt.txt");

const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const dtr7Report = JSON.parse(fs.readFileSync(dtr7ReportPath, "utf8"));
const width = fixture.coordinateSystem.pixelSize.width;
const height = fixture.coordinateSystem.pixelSize.height;

fs.mkdirSync(generatedDir, { recursive: true });

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function value(field) {
  return field && Object.prototype.hasOwnProperty.call(field, "value") ? field.value : field;
}

function withMeta(valueField, sourceCategory, status, notes, sourcePaths = []) {
  return {
    value: valueField,
    sourceCategory,
    sourceCategories: [sourceCategory],
    status,
    sourceIds: ["phase-2dtr-8.geometry-primitive-completion"],
    sourcePaths,
    notes,
  };
}

function esc(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function rectAttrs(rect) {
  return `x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"`;
}

function center(rect) {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function rectIntersects(a, b) {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function inFrameRect(rect) {
  return rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width && rect.y + rect.height <= height;
}

function inFramePoint(point) {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}

function targetLabel(target) {
  return target.targetId === "greenpoint-g-subway" ? "Greenpoint G station" : target.reviewLabel;
}

const sourcePaths = [
  rel(fixturePath),
  rel(dtr7ReportPath),
];

const greenpointAveRoadBand = dtr7Report.derivedLayout.greenpointAveRoadBand;
const manhattanAveRoadBand = dtr7Report.derivedLayout.manhattanAveRoadBand;
const intersectionPolygon = {
  x: manhattanAveRoadBand.x,
  y: greenpointAveRoadBand.y,
  width: manhattanAveRoadBand.width,
  height: greenpointAveRoadBand.height,
};

const cornerZones = dtr7Report.derivedLayout.cornerZones.map((zone) => ({
  id: zone.id,
  label: zone.label,
  bounds: zone.rect,
  status: "derived_review_only",
  sourceCategory: "dtr7_blueprint_gap_derivation",
}));

const sidewalks = [
  { id: "sidewalk-nw-greenpoint-edge", cornerId: "corner-nw", relationship: "between NW storefront zone and Greenpoint Ave road band", bounds: { x: 0, y: greenpointAveRoadBand.y - 40, width: manhattanAveRoadBand.x, height: 40 } },
  { id: "sidewalk-nw-manhattan-edge", cornerId: "corner-nw", relationship: "between NW storefront zone and Manhattan Ave road band", bounds: { x: manhattanAveRoadBand.x - 40, y: 0, width: 40, height: greenpointAveRoadBand.y } },
  { id: "sidewalk-ne-greenpoint-edge", cornerId: "corner-ne", relationship: "between NE storefront zone and Greenpoint Ave road band", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y - 40, width: width - (manhattanAveRoadBand.x + manhattanAveRoadBand.width), height: 40 } },
  { id: "sidewalk-ne-manhattan-edge", cornerId: "corner-ne", relationship: "between NE storefront zone and Manhattan Ave road band", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: 0, width: 40, height: greenpointAveRoadBand.y } },
  { id: "sidewalk-sw-greenpoint-edge", cornerId: "corner-sw", relationship: "between SW storefront zone and Greenpoint Ave road band", bounds: { x: 0, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: manhattanAveRoadBand.x, height: 44 } },
  { id: "sidewalk-sw-manhattan-edge", cornerId: "corner-sw", relationship: "between SW storefront zone and Manhattan Ave road band", bounds: { x: manhattanAveRoadBand.x - 40, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: 40, height: height - (greenpointAveRoadBand.y + greenpointAveRoadBand.height) } },
  { id: "sidewalk-se-greenpoint-edge", cornerId: "corner-se", relationship: "between SE storefront zone and Greenpoint Ave road band", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: width - (manhattanAveRoadBand.x + manhattanAveRoadBand.width), height: 44 } },
  { id: "sidewalk-se-manhattan-edge", cornerId: "corner-se", relationship: "between SE storefront zone and Manhattan Ave road band", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: 40, height: height - (greenpointAveRoadBand.y + greenpointAveRoadBand.height) } },
];

const curbs = [
  { id: "curb-greenpoint-north-west", from: { x: 0, y: greenpointAveRoadBand.y }, to: { x: manhattanAveRoadBand.x, y: greenpointAveRoadBand.y }, adjacentRoad: "greenpoint-ave-road-band" },
  { id: "curb-greenpoint-north-east", from: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y }, to: { x: width, y: greenpointAveRoadBand.y }, adjacentRoad: "greenpoint-ave-road-band" },
  { id: "curb-greenpoint-south-west", from: { x: 0, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, to: { x: manhattanAveRoadBand.x, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, adjacentRoad: "greenpoint-ave-road-band" },
  { id: "curb-greenpoint-south-east", from: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, to: { x: width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, adjacentRoad: "greenpoint-ave-road-band" },
  { id: "curb-manhattan-west-north", from: { x: manhattanAveRoadBand.x, y: 0 }, to: { x: manhattanAveRoadBand.x, y: greenpointAveRoadBand.y }, adjacentRoad: "manhattan-ave-road-band" },
  { id: "curb-manhattan-west-south", from: { x: manhattanAveRoadBand.x, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, to: { x: manhattanAveRoadBand.x, y: height }, adjacentRoad: "manhattan-ave-road-band" },
  { id: "curb-manhattan-east-north", from: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: 0 }, to: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y }, adjacentRoad: "manhattan-ave-road-band" },
  { id: "curb-manhattan-east-south", from: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height }, to: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: height }, adjacentRoad: "manhattan-ave-road-band" },
];

const crosswalks = [
  {
    id: "crosswalk-greenpoint-west-leg",
    crosses: "greenpoint-ave-road-band",
    orientation: "north-south",
    bounds: { x: intersectionPolygon.x, y: greenpointAveRoadBand.y + 20, width: 70, height: greenpointAveRoadBand.height - 40 },
    stripeAxis: "horizontal",
  },
  {
    id: "crosswalk-greenpoint-east-leg",
    crosses: "greenpoint-ave-road-band",
    orientation: "north-south",
    bounds: { x: intersectionPolygon.x + intersectionPolygon.width - 70, y: greenpointAveRoadBand.y + 20, width: 70, height: greenpointAveRoadBand.height - 40 },
    stripeAxis: "horizontal",
  },
  {
    id: "crosswalk-manhattan-north-leg",
    crosses: "manhattan-ave-road-band",
    orientation: "east-west",
    bounds: { x: manhattanAveRoadBand.x + 42, y: intersectionPolygon.y, width: manhattanAveRoadBand.width - 84, height: 54 },
    stripeAxis: "vertical",
  },
  {
    id: "crosswalk-manhattan-south-leg",
    crosses: "manhattan-ave-road-band",
    orientation: "east-west",
    bounds: { x: manhattanAveRoadBand.x + 42, y: intersectionPolygon.y + intersectionPolygon.height - 54, width: manhattanAveRoadBand.width - 84, height: 54 },
    stripeAxis: "vertical",
  },
];

const curbCuts = [
  { id: "curb-cut-nw-greenpoint", cornerId: "corner-nw", bounds: { x: manhattanAveRoadBand.x - 88, y: greenpointAveRoadBand.y - 18, width: 52, height: 18 }, connectsCrosswalk: "crosswalk-greenpoint-west-leg" },
  { id: "curb-cut-ne-greenpoint", cornerId: "corner-ne", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width + 36, y: greenpointAveRoadBand.y - 18, width: 52, height: 18 }, connectsCrosswalk: "crosswalk-greenpoint-east-leg" },
  { id: "curb-cut-sw-greenpoint", cornerId: "corner-sw", bounds: { x: manhattanAveRoadBand.x - 88, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: 52, height: 18 }, connectsCrosswalk: "crosswalk-greenpoint-west-leg" },
  { id: "curb-cut-se-greenpoint", cornerId: "corner-se", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width + 36, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height, width: 52, height: 18 }, connectsCrosswalk: "crosswalk-greenpoint-east-leg" },
  { id: "curb-cut-nw-manhattan", cornerId: "corner-nw", bounds: { x: manhattanAveRoadBand.x - 18, y: greenpointAveRoadBand.y - 78, width: 18, height: 50 }, connectsCrosswalk: "crosswalk-manhattan-north-leg" },
  { id: "curb-cut-ne-manhattan", cornerId: "corner-ne", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y - 78, width: 18, height: 50 }, connectsCrosswalk: "crosswalk-manhattan-north-leg" },
  { id: "curb-cut-sw-manhattan", cornerId: "corner-sw", bounds: { x: manhattanAveRoadBand.x - 18, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height + 28, width: 18, height: 50 }, connectsCrosswalk: "crosswalk-manhattan-south-leg" },
  { id: "curb-cut-se-manhattan", cornerId: "corner-se", bounds: { x: manhattanAveRoadBand.x + manhattanAveRoadBand.width, y: greenpointAveRoadBand.y + greenpointAveRoadBand.height + 28, width: 18, height: 50 }, connectsCrosswalk: "crosswalk-manhattan-south-leg" },
];

const streetNamePlacementZones = [
  { id: "street-name-greenpoint-west", streetId: "greenpoint-ave", text: "GREENPOINT AVE", bounds: { x: 150, y: greenpointAveRoadBand.y + 46, width: 360, height: 40 }, orientation: "horizontal" },
  { id: "street-name-greenpoint-east", streetId: "greenpoint-ave", text: "GREENPOINT AVE", bounds: { x: 1060, y: greenpointAveRoadBand.y + 46, width: 380, height: 40 }, orientation: "horizontal" },
  { id: "street-name-manhattan-north", streetId: "manhattan-ave", text: "MANHATTAN AVE", bounds: { x: manhattanAveRoadBand.x + 112, y: 88, width: 44, height: 230 }, orientation: "vertical" },
  { id: "street-name-manhattan-south", streetId: "manhattan-ave", text: "MANHATTAN AVE", bounds: { x: manhattanAveRoadBand.x + 112, y: 572, width: 44, height: 250 }, orientation: "vertical" },
];

const orientationCues = [
  { id: "north-arrow", type: "north-arrow", anchor: { x: 54, y: height - 88 }, label: "N", status: "review_orientation_only" },
  { id: "manhattan-axis-cue", type: "street-axis", anchor: center(manhattanAveRoadBand), label: "Manhattan Ave north-south axis", status: "review_orientation_only" },
  { id: "greenpoint-axis-cue", type: "street-axis", anchor: center(greenpointAveRoadBand), label: "Greenpoint Ave east-west axis", status: "review_orientation_only" },
];

const addressLabelPolicy = {
  policyId: "phase-2dtr-8.address-label-policy",
  inSceneAddressText: "disabled_for_styled_raster",
  qaOnlyAddressLabels: "enabled",
  reason: "DTR-6 showed generated address text can drift, including Dunkin appearing as 993 instead of the fixture-intended 893.",
  renderRule: "Styled raster must render address anchors as geometry only. Exact address strings may appear only in QA overlays, captions, validation boards, or non-raster metadata unless Batu explicitly reopens in-scene address text.",
  targets: fixture.targets
    .filter((target) => target.renderingKind === "storefront")
    .map((target) => {
      const address = value(target.businessOrPlace?.addressOrContext) || value(target.visibleTextCues?.secondaryAddressCue);
      return {
        targetId: target.targetId,
        label: targetLabel(target),
        address,
        addressAnchorPoint: value(target.geometry.addressAnchorPoint),
        inSceneTextAllowed: false,
        qaOnlyTextAllowed: true,
        specialNotes: target.targetId === "dunkin"
          ? "Dunkin address is 893 Manhattan Ave in the fixture/source context. Do not render generated in-scene address text; QA-only label may use 893 Manhattan Ave."
          : "Address is QA-only unless later explicitly approved for in-scene rendering.",
      };
    }),
};

const subwayCuePolicy = {
  policyId: "phase-2dtr-8.greenpoint-g-cue-policy",
  primaryCueTargetId: "greenpoint-g-subway",
  primaryCue: {
    cueCenter: value(fixture.targets.find((target) => target.targetId === "greenpoint-g-subway").geometry.cueCenter),
    cueRadius: value(fixture.targets.find((target) => target.targetId === "greenpoint-g-subway").geometry.cueRadius),
    entranceCueBounds: value(fixture.targets.find((target) => target.targetId === "greenpoint-g-subway").geometry.entranceCueBounds),
    status: "primary_review_only_symbolic_station_cue",
  },
  additionalCuePolicy: "omit_from_styled_raster_unless_marked_secondary_symbolic",
  allowedAdditionalCueStatuses: ["secondary_symbolic", "context_only", "omitted"],
  renderRule: "DTR-9 styled raster may render one primary Greenpoint G cue. Additional G circles, signs, or entrance hints are omitted unless the geometry adapter marks them secondary_symbolic or context_only.",
  dtr6Correction: "Prevents multiple ambiguous primary G markers/entrances seen in DTR-6.",
};

const renderOrder = [
  { z: 0, layerId: "coordinate-frame", draws: ["review frame", "watermark", "orientation cues"], occlusion: "never occludes scene primitives" },
  { z: 10, layerId: "road-bands", draws: ["manhattan-ave-road-band", "greenpoint-ave-road-band", "intersection-overlap-zone"], occlusion: "below all pedestrian and storefront primitives" },
  { z: 20, layerId: "sidewalks-and-corner-zones", draws: ["sidewalks", "corner zones"], occlusion: "above roads, below curbs and buildings" },
  { z: 30, layerId: "curbs-and-curb-cuts", draws: ["curb lines", "curb cuts"], occlusion: "above sidewalks and roads" },
  { z: 40, layerId: "crosswalks", draws: ["crosswalk stripe bounds"], occlusion: "above road bands, below subway cues and labels" },
  { z: 50, layerId: "building-masses", draws: ["buildingMassBounds"], occlusion: "building masses may occlude rear sidewalk bands inside their corner zone" },
  { z: 60, layerId: "storefront-footprints", draws: ["storefrontBounds", "frontageSegment"], occlusion: "above building mass, below facade detail fields" },
  { z: 70, layerId: "facade-detail", draws: ["signPanelBounds", "entranceBounds", "windowBounds"], occlusion: "above storefront footprint" },
  { z: 80, layerId: "transit-primary-cue", draws: ["primary Greenpoint G cueCenter/cueRadius", "entranceCueBounds"], occlusion: "above sidewalk/crosswalk primitives; does not create additional entrances" },
  { z: 90, layerId: "qa-only-address-anchors", draws: ["addressAnchorPoint markers"], occlusion: "QA overlay only; not styled raster text" },
  { z: 100, layerId: "qa-labels-and-status", draws: ["review-only labels", "status text"], occlusion: "not part of styled raster primary world art" },
];

const occlusionRules = [
  "Road bands are always base geometry.",
  "Sidewalks sit above road bands and below curbs, buildings, and storefronts.",
  "Crosswalks sit above road bands and below subway cue and QA labels.",
  "Building masses may cover sidewalk portions inside their own corner zone, but must not cover road bands, crosswalks, or the primary subway cue.",
  "Storefront bounds, frontage lines, sign panels, entrances, and windows render above building masses.",
  "Address anchors are QA-only overlays and must not become generated in-scene text in DTR-9.",
  "Only the primary Greenpoint G cue renders as a subway cue unless an additional cue is explicitly marked secondary_symbolic or context_only.",
];

const targetPrimitives = fixture.targets.map((target) => {
  const geometry = target.geometry;
  const primitive = {
    targetId: target.targetId,
    label: targetLabel(target),
    renderingKind: target.renderingKind,
    cornerId: target.cornerId,
    drawOrder: target.drawOrder,
    zOrderGroup: target.renderingKind === "symbolic_transit" ? "transit-primary-cue" : "facade-detail",
    unsupportedFieldsOmitted: target.unsupportedFields || [],
  };

  if (target.renderingKind === "storefront") {
    const storefrontBounds = value(geometry.storefrontBounds);
    const linkedSidewalks = sidewalks.filter((sidewalk) => sidewalk.cornerId === target.cornerId).map((sidewalk) => sidewalk.id);
    primitive.buildingMassBounds = value(geometry.buildingMassBounds);
    primitive.storefrontBounds = storefrontBounds;
    primitive.facadeFrontageBounds = {
      storefrontBounds,
      frontageSegment: value(geometry.frontageSegment),
      relationshipToSidewalk: "frontageSegment faces the nearest corner sidewalk edge in the same review-coordinate frame",
      linkedSidewalks,
    };
    primitive.signPanelBounds = value(geometry.signPanelBounds);
    primitive.entranceBounds = value(geometry.entranceBounds);
    primitive.windowBounds = value(geometry.windowBounds);
    primitive.addressAnchorPoint = value(geometry.addressAnchorPoint);
    primitive.addressPolicy = {
      inSceneTextAllowed: false,
      qaOnlyTextAllowed: true,
      labelText: addressLabelPolicy.targets.find((entry) => entry.targetId === target.targetId)?.address,
    };
  } else {
    primitive.primarySubwayCue = subwayCuePolicy.primaryCue;
    primitive.additionalCueTreatment = subwayCuePolicy.additionalCuePolicy;
    primitive.addressAnchorPoint = value(geometry.addressAnchorPoint);
  }

  return primitive;
});

const primitiveFixture = {
  schemaVersion: "phase-2dtr-8-geometry-primitive-fixture.v0.1",
  artifactId: "phase-2dtr-8.geometry-primitive-fixture",
  status: "review-only-styled-raster-readiness-fixture",
  generatedOn: "2026-06-03",
  sourceArtifacts: sourcePaths,
  dirtyPreExistingFileState: {
    path: "docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png",
    status: "pre-existing dirty visual artifact intentionally left untouched and out of DTR-8 scope",
  },
  coordinateSystem: fixture.coordinateSystem,
  roadGeometry: {
    manhattanAveRoadBand: withMeta(manhattanAveRoadBand, "dtr7_blueprint_gap_derivation", "derived_review_only", "Explicit review-coordinate road band promoted from DTR-7 building-mass gap derivation.", sourcePaths),
    greenpointAveRoadBand: withMeta(greenpointAveRoadBand, "dtr7_blueprint_gap_derivation", "derived_review_only", "Explicit review-coordinate road band promoted from DTR-7 building-mass gap derivation.", sourcePaths),
    intersectionPolygon: withMeta(intersectionPolygon, "dtr7_blueprint_gap_derivation", "derived_review_only", "Overlap of Manhattan Ave and Greenpoint Ave road bands; review-only, not GIS/survey geometry.", sourcePaths),
    streetNamePlacementZones: withMeta(streetNamePlacementZones, "manual_review_only_interpretation", "styled_raster_ready_review_only", "Deterministic text placement zones for street-name rendering or QA overlay.", sourcePaths),
    orientationCues: withMeta(orientationCues, "manual_review_only_interpretation", "review_orientation_only", "Review-coordinate orientation marks only.", sourcePaths),
  },
  pedestrianCornerGeometry: {
    cornerZones: withMeta(cornerZones, "dtr7_blueprint_gap_derivation", "derived_review_only", "Corner zones promoted from DTR-7 blueprint derivation.", sourcePaths),
    sidewalks: withMeta(sidewalks, "manual_review_only_interpretation", "styled_raster_ready_review_only", "Sidewalk rectangles derived around road/building gaps for DTR-9 layout control.", sourcePaths),
    curbs: withMeta(curbs, "manual_review_only_interpretation", "styled_raster_ready_review_only", "Curb line primitives separate road bands from sidewalk/corner zones.", sourcePaths),
    crosswalks: withMeta(crosswalks, "manual_review_only_interpretation", "styled_raster_ready_review_only", "Crosswalk stripe bounds for each intersection leg.", sourcePaths),
    curbCuts: withMeta(curbCuts, "manual_review_only_interpretation", "styled_raster_ready_review_only", "Curb-cut review primitives connecting sidewalks to crosswalk bounds.", sourcePaths),
  },
  storefrontBuildingPrimitives: targetPrimitives,
  addressLabelPolicy,
  greenpointGSubwayCuePolicy: subwayCuePolicy,
  renderOrder,
  occlusionRules,
  unsupportedOrOmittedClaims: fixture.targets.flatMap((target) =>
    (target.unsupportedFields || []).map((claim) => ({
      targetId: target.targetId,
      label: targetLabel(target),
      claim,
      treatment: "omitted from styled-raster-ready geometry unless later supported and explicitly approved",
    }))
  ),
};

const adapter = {
  schemaVersion: "phase-2dtr-8-styled-raster-ready-geometry-adapter.v0.1",
  artifactId: "phase-2dtr-8.styled-raster-ready-geometry-adapter",
  status: "json-primary-review-only-layout-spec",
  generatedOn: "2026-06-03",
  sourceOfTruth: rel(canonicalPrimitiveFixturePath),
  jsonIsPrimary: true,
  prosePromptIsSecondary: true,
  dtr9Readiness: {
    readyForControlledStyledRaster: true,
    conditions: [
      "DTR-9 must consume geometryPrimitiveFixture and this adapter JSON as source of truth.",
      "DTR-9 must not rely on prose prompt text to invent layout, address text, extra subway cues, roads, crosswalks, or facade placements.",
      "DTR-9 may use supplied reference imagery for facade styling only after geometry placement is locked by this spec.",
      "DTR-9 must keep review-only labels/provenance and must not claim production/public exact geometry.",
    ],
  },
  frame: {
    width,
    height,
    coordinateSystemId: fixture.coordinateSystem.id,
  },
  layoutPrimitives: {
    roads: primitiveFixture.roadGeometry,
    pedestrian: primitiveFixture.pedestrianCornerGeometry,
    targets: primitiveFixture.storefrontBuildingPrimitives,
    policies: {
      addressLabelPolicy,
      greenpointGSubwayCuePolicy: subwayCuePolicy,
    },
    renderOrder,
    occlusionRules,
  },
  dtr9SecondaryPrompt: [
    "Create one controlled, review-only styled isometric raster for Manhattan Ave / Greenpoint Ave using the Phase 2DTR-8 JSON geometry adapter as the layout source of truth.",
    "Use roadGeometry, pedestrianCornerGeometry, storefrontBuildingPrimitives, renderOrder, and occlusionRules exactly as placement controls.",
    "Do not render in-scene address text. Address anchors are geometry only; exact addresses are QA-only labels.",
    "Render one primary Greenpoint G cue from greenpointGSubwayCuePolicy. Do not invent additional primary G markers or entrances.",
    "Use supplied reference imagery only for facade styling cues after geometry placement is locked.",
    "Keep the artifact review-only and do not claim production/public exact geometry.",
  ],
};

const validationRequired = {
  roadGeometry: ["manhattanAveRoadBand", "greenpointAveRoadBand", "intersectionPolygon", "streetNamePlacementZones", "orientationCues"],
  pedestrianCornerGeometry: ["sidewalks", "curbs", "crosswalks", "curbCuts", "cornerZones"],
  storefrontTargetFields: ["storefrontBounds", "facadeFrontageBounds", "signPanelBounds", "entranceBounds", "windowBounds", "buildingMassBounds"],
  policyFields: ["addressLabelPolicy", "greenpointGSubwayCuePolicy", "renderOrder", "occlusionRules"],
};

const validationIssues = [];

for (const key of validationRequired.roadGeometry) {
  if (!primitiveFixture.roadGeometry[key]) validationIssues.push(`missing roadGeometry.${key}`);
}
for (const key of validationRequired.pedestrianCornerGeometry) {
  if (!primitiveFixture.pedestrianCornerGeometry[key]) validationIssues.push(`missing pedestrianCornerGeometry.${key}`);
}

for (const target of primitiveFixture.storefrontBuildingPrimitives.filter((target) => target.renderingKind === "storefront")) {
  for (const key of validationRequired.storefrontTargetFields) {
    if (!target[key]) validationIssues.push(`missing ${target.targetId}.${key}`);
  }
}

for (const key of validationRequired.policyFields) {
  if (!primitiveFixture[key]) validationIssues.push(`missing ${key}`);
}

const primaryCueCount = subwayCuePolicy.primaryCueTargetId ? 1 : 0;
if (primaryCueCount !== 1) validationIssues.push(`expected one primary Greenpoint G cue, found ${primaryCueCount}`);

for (const rect of [
  manhattanAveRoadBand,
  greenpointAveRoadBand,
  intersectionPolygon,
  ...sidewalks.map((item) => item.bounds),
  ...crosswalks.map((item) => item.bounds),
  ...curbCuts.map((item) => item.bounds),
]) {
  if (!inFrameRect(rect)) validationIssues.push(`primitive outside frame: ${JSON.stringify(rect)}`);
}

for (const target of primitiveFixture.storefrontBuildingPrimitives) {
  if (target.addressAnchorPoint && !inFramePoint(target.addressAnchorPoint)) {
    validationIssues.push(`address anchor outside frame for ${target.targetId}`);
  }
}

for (const crosswalk of crosswalks) {
  if (!rectIntersects(crosswalk.bounds, intersectionPolygon) && crosswalk.id.includes("leg")) {
    validationIssues.push(`${crosswalk.id} does not touch the intersection polygon`);
  }
}

const validationReport = {
  schemaVersion: "phase-2dtr-8-geometry-primitive-validation-report.v0.1",
  artifactId: "phase-2dtr-8.geometry-primitive-validation-report",
  status: validationIssues.length ? "review-only-with-validation-issues" : "review-only-ready-for-dtr9",
  generatedOn: "2026-06-03",
  generatedArtifacts: {
    primitiveFixture: rel(canonicalPrimitiveFixturePath),
    adapter: rel(canonicalAdapterPath),
    blueprint: rel(canonicalBlueprintPath),
    prompt: rel(canonicalPromptPath),
  },
  noPolishedRasterGenerated: true,
  noAiImageGenerationUsed: true,
  primitivePresence: {
    allRequiredPrimitivesExist: validationIssues.length === 0,
    required: validationRequired,
    issues: validationIssues,
  },
  greenpointGSubwayCueValidation: {
    primaryCueCount,
    primaryCueTargetId: subwayCuePolicy.primaryCueTargetId,
    additionalCuePolicy: subwayCuePolicy.additionalCuePolicy,
    passes: primaryCueCount === 1,
  },
  addressLabelPolicyValidation: {
    exists: Boolean(addressLabelPolicy),
    inSceneAddressText: addressLabelPolicy.inSceneAddressText,
    qaOnlyAddressLabels: addressLabelPolicy.qaOnlyAddressLabels,
    dunkinIssueHandled: addressLabelPolicy.targets.some((target) => target.targetId === "dunkin" && target.inSceneTextAllowed === false && /893 Manhattan Ave/.test(target.specialNotes)),
    passes: Boolean(addressLabelPolicy) && addressLabelPolicy.targets.every((target) => target.inSceneTextAllowed === false && target.qaOnlyTextAllowed === true),
  },
  renderOrderOcclusionValidation: {
    renderOrderLayerCount: renderOrder.length,
    occlusionRuleCount: occlusionRules.length,
    passes: renderOrder.length > 0 && occlusionRules.length > 0,
  },
  unsupportedOrBlockedClaims: primitiveFixture.unsupportedOrOmittedClaims,
  dtr9Readiness: adapter.dtr9Readiness,
  dirtyPreExistingFileState: primitiveFixture.dirtyPreExistingFileState,
};

const promptText = [
  "Phase 2DTR-8 Styled-Raster Geometry Prompt (secondary to JSON)",
  "",
  ...adapter.dtr9SecondaryPrompt.map((line) => `- ${line}`),
  "",
  "JSON source of truth:",
  `- ${rel(canonicalAdapterPath)}`,
  `- ${rel(canonicalPrimitiveFixturePath)}`,
].join("\n");

function svgText(x, y, text, size = 16, weight = "400", extra = "") {
  return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" font-weight="${weight}" fill="#000" ${extra}>${esc(text)}</text>`;
}

const svg = [];
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Phase 2DTR-8 geometry primitive blueprint">`);
svg.push("<title>Phase 2DTR-8 Geometry Primitive Blueprint</title>");
svg.push("<desc>Black-and-white deterministic SVG showing completed road, sidewalk, crosswalk, storefront, address-policy, and subway-cue primitives for styled-raster readiness.</desc>");
svg.push(`<defs>
  <pattern id="road-hatch" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 18 L18 0" stroke="#000" stroke-width="1"/></pattern>
  <pattern id="sidewalk-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 0 L10 10 M10 0 L0 10" stroke="#000" stroke-width="0.7"/></pattern>
  <pattern id="building-hatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M-2 12 L12 -2 M4 16 L16 4" stroke="#000" stroke-width="1"/></pattern>
</defs>`);
svg.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>`);
svg.push(`<rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#000" stroke-width="2"/>`);

for (let x = 0; x <= width; x += 200) {
  svg.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#000" stroke-width="0.5" stroke-dasharray="3 9"/>`);
  svg.push(svgText(x + 4, 16, String(x), 12));
}
for (let y = 0; y <= height; y += 100) {
  svg.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#000" stroke-width="0.5" stroke-dasharray="3 9"/>`);
  svg.push(svgText(4, y + 14, String(y), 12));
}

svg.push(`<rect ${rectAttrs(greenpointAveRoadBand)} fill="url(#road-hatch)" stroke="#000" stroke-width="4"/>`);
svg.push(`<rect ${rectAttrs(manhattanAveRoadBand)} fill="url(#road-hatch)" stroke="#000" stroke-width="4"/>`);
svg.push(`<rect ${rectAttrs(intersectionPolygon)} fill="#fff" stroke="#000" stroke-width="5"/>`);
svg.push(svgText(32, greenpointAveRoadBand.y + 28, "road band primitives", 16, "700"));
svg.push(svgText(intersectionPolygon.x + 28, intersectionPolygon.y + 74, "intersection polygon / overlap zone", 18, "700"));

for (const zone of cornerZones) {
  svg.push(`<rect ${rectAttrs(zone.bounds)} fill="none" stroke="#000" stroke-width="2" stroke-dasharray="12 8"/>`);
  svg.push(svgText(zone.bounds.x + 16, zone.bounds.y + 34, `${zone.label} corner zone`, 22, "700"));
}

for (const sidewalk of sidewalks) {
  svg.push(`<rect ${rectAttrs(sidewalk.bounds)} fill="url(#sidewalk-hatch)" stroke="#000" stroke-width="2"/>`);
}
svg.push(svgText(24, greenpointAveRoadBand.y - 14, "sidewalk primitives", 16, "700"));

for (const curb of curbs) {
  svg.push(`<line x1="${curb.from.x}" y1="${curb.from.y}" x2="${curb.to.x}" y2="${curb.to.y}" stroke="#000" stroke-width="5"/>`);
}
svg.push(svgText(manhattanAveRoadBand.x - 124, 66, "curb lines", 15, "700"));

for (const cut of curbCuts) {
  svg.push(`<rect ${rectAttrs(cut.bounds)} fill="#fff" stroke="#000" stroke-width="3"/>`);
}
svg.push(svgText(manhattanAveRoadBand.x - 166, greenpointAveRoadBand.y - 92, "curb cuts", 15, "700"));

for (const crosswalk of crosswalks) {
  svg.push(`<rect ${rectAttrs(crosswalk.bounds)} fill="#fff" stroke="#000" stroke-width="3"/>`);
  const stripeCount = 5;
  for (let i = 1; i < stripeCount; i += 1) {
    if (crosswalk.stripeAxis === "horizontal") {
      const y = crosswalk.bounds.y + (crosswalk.bounds.height / stripeCount) * i;
      svg.push(`<line x1="${crosswalk.bounds.x}" y1="${y}" x2="${crosswalk.bounds.x + crosswalk.bounds.width}" y2="${y}" stroke="#000" stroke-width="2"/>`);
    } else {
      const x = crosswalk.bounds.x + (crosswalk.bounds.width / stripeCount) * i;
      svg.push(`<line x1="${x}" y1="${crosswalk.bounds.y}" x2="${x}" y2="${crosswalk.bounds.y + crosswalk.bounds.height}" stroke="#000" stroke-width="2"/>`);
    }
  }
}
svg.push(svgText(intersectionPolygon.x + 22, intersectionPolygon.y - 24, "crosswalk primitives", 16, "700"));

for (const zone of streetNamePlacementZones) {
  svg.push(`<rect ${rectAttrs(zone.bounds)} fill="none" stroke="#000" stroke-width="2" stroke-dasharray="5 5"/>`);
  if (zone.orientation === "vertical") {
    svg.push(svgText(zone.bounds.x + 8, zone.bounds.y + 20, zone.text, 14, "700", `transform="rotate(90 ${zone.bounds.x + 8} ${zone.bounds.y + 20})"`));
  } else {
    svg.push(svgText(zone.bounds.x + 8, zone.bounds.y + 26, zone.text, 18, "700"));
  }
}

for (const target of targetPrimitives) {
  if (target.renderingKind === "storefront") {
    svg.push(`<rect ${rectAttrs(target.buildingMassBounds)} fill="url(#building-hatch)" stroke="#000" stroke-width="2"/>`);
    svg.push(`<rect ${rectAttrs(target.storefrontBounds)} fill="#fff" stroke="#000" stroke-width="5"/>`);
    svg.push(`<line x1="${target.facadeFrontageBounds.frontageSegment.from.x}" y1="${target.facadeFrontageBounds.frontageSegment.from.y}" x2="${target.facadeFrontageBounds.frontageSegment.to.x}" y2="${target.facadeFrontageBounds.frontageSegment.to.y}" stroke="#000" stroke-width="8"/>`);
    svg.push(`<rect ${rectAttrs(target.signPanelBounds)} fill="#fff" stroke="#000" stroke-width="3" stroke-dasharray="8 5"/>`);
    svg.push(`<rect ${rectAttrs(target.entranceBounds)} fill="#000" stroke="#000" stroke-width="2"/>`);
    for (const win of target.windowBounds) {
      svg.push(`<rect ${rectAttrs(win)} fill="#fff" stroke="#000" stroke-width="3"/>`);
      svg.push(`<line x1="${win.x}" y1="${win.y}" x2="${win.x + win.width}" y2="${win.y + win.height}" stroke="#000" stroke-width="1"/>`);
      svg.push(`<line x1="${win.x + win.width}" y1="${win.y}" x2="${win.x}" y2="${win.y + win.height}" stroke="#000" stroke-width="1"/>`);
    }
    svg.push(svgText(target.storefrontBounds.x + 6, target.storefrontBounds.y - 10, `${target.label} storefront`, 17, "700"));
    svg.push(svgText(target.signPanelBounds.x + 5, target.signPanelBounds.y + 20, "sign panel", 13, "700"));
    svg.push(svgText(target.entranceBounds.x - 12, target.entranceBounds.y + target.entranceBounds.height + 18, "entrance", 12, "700"));
    const point = target.addressAnchorPoint;
    svg.push(`<line x1="${point.x - 12}" y1="${point.y}" x2="${point.x + 12}" y2="${point.y}" stroke="#000" stroke-width="3"/>`);
    svg.push(`<line x1="${point.x}" y1="${point.y - 12}" x2="${point.x}" y2="${point.y + 12}" stroke="#000" stroke-width="3"/>`);
  }
}

const subway = subwayCuePolicy.primaryCue;
svg.push(`<rect ${rectAttrs(subway.entranceCueBounds)} fill="none" stroke="#000" stroke-width="5" stroke-dasharray="10 6"/>`);
svg.push(`<circle cx="${subway.cueCenter.x}" cy="${subway.cueCenter.y}" r="${subway.cueRadius}" fill="#fff" stroke="#000" stroke-width="5"/>`);
svg.push(svgText(subway.cueCenter.x - 12, subway.cueCenter.y + 10, "G", 32, "700"));
svg.push(svgText(subway.entranceCueBounds.x + subway.entranceCueBounds.width + 10, subway.entranceCueBounds.y + 24, "subway-cue: one primary Greenpoint G station", 15, "700"));

svg.push(`<rect x="24" y="${height - 156}" width="625" height="112" fill="#fff" stroke="#000" stroke-width="2"/>`);
svg.push(svgText(40, height - 126, "address-policy: in-scene address text disabled", 18, "700"));
svg.push(svgText(40, height - 98, "QA-only address anchors prevent Dunkin 893/993 text drift", 15));
svg.push(svgText(40, height - 70, "review-only / not production or public exact geometry", 15, "700"));
svg.push(svgText(width - 430, height - 42, "DTR-8 geometry-first adapter ready for DTR-9", 15, "700"));
svg.push("</svg>");

fs.writeFileSync(primitiveFixturePath, `${JSON.stringify(primitiveFixture, null, 2)}\n`);
fs.writeFileSync(adapterPath, `${JSON.stringify(adapter, null, 2)}\n`);
fs.writeFileSync(validationPath, `${JSON.stringify(validationReport, null, 2)}\n`);
fs.writeFileSync(promptPath, `${promptText}\n`);
fs.writeFileSync(blueprintPath, svg.join("\n"));

console.log(`Wrote ${path.relative(process.cwd(), primitiveFixturePath)}`);
console.log(`Wrote ${path.relative(process.cwd(), adapterPath)}`);
console.log(`Wrote ${path.relative(process.cwd(), validationPath)}`);
console.log(`Wrote ${path.relative(process.cwd(), promptPath)}`);
console.log(`Wrote ${path.relative(process.cwd(), blueprintPath)}`);
