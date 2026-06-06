import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json" with { type: "json" };
import geometryFixture from "../src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json" with { type: "json" };
import { buildPhase4BRuntimeScene } from "../src/phase4bRuntimeScene.js";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cueFixturePath = resolve(
  repoRoot,
  "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json",
);
const manifestPath =
  "src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
const geometryFixturePath =
  "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";

const allowedCueClasses = [
  "street-facing-plane",
  "building-width-rhythm",
  "height-tier",
  "corner-or-endpoint-role",
  "setback-or-depth-tier",
  "block-break",
  "side-of-corridor",
  "coverage-status",
];

const blockedClaimClasses = [
  "active-business-status",
  "business-identity",
  "business-storefront-anchor",
  "entrance-location",
  "exact-address-placement",
  "exact-facade-appearance",
  "facade-material",
  "production-public-readiness",
  "signage",
  "storefront-order",
  "storefront-segmentation",
  "tenant-frontage",
  "window-door-layout",
];

const forbiddenRuntimeClaimKeys = [
  "address",
  "business",
  "door",
  "entrance",
  "facadeAppearance",
  "material",
  "sign",
  "storefront",
  "tenant",
  "window",
];

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const expected = buildCueFixture();
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`;

  if (shouldWrite) {
    await writeFile(cueFixturePath, expectedText);
    console.log(`Wrote Phase 4C geometry cue fixture: ${cueFixturePath}`);
    return;
  }

  const actualText = await readFile(cueFixturePath, "utf8");
  const actual = JSON.parse(actualText);
  const failures = [];

  if (actualText !== expectedText) {
    failures.push("Cue fixture does not match deterministic output from the existing 4B manifest/runtime geometry.");
  }

  validateFixture(actual, failures);

  if (failures.length) {
    throw new Error(`Phase 4C geometry cue fixture failed verification:\n- ${failures.join("\n- ")}`);
  }

  console.log(`Phase 4C geometry cue fixture verified (${actual.cues.length} geometry-only cues).`);
}

function buildCueFixture() {
  const runtimeScene = buildPhase4BRuntimeScene(manifest, geometryFixture);
  const buildings = runtimeScene.buildings.slice().sort((a, b) => a.id.localeCompare(b.id));
  const breakFlagsByBuilding = buildBreakFlags(runtimeScene.buildings);
  const endpointRanges = buildEndpointRanges(runtimeScene.buildings);
  const cues = buildings.map((building) => buildCue(building, breakFlagsByBuilding, endpointRanges));

  const widthTierCounts = countBy(cues, (cue) => cue.geometryDerived.widthTier);
  const heightTierCounts = countBy(cues, (cue) => cue.geometryDerived.heightTier);
  const depthTierCounts = countBy(cues, (cue) => cue.geometryDerived.depthTier);

  return {
    schemaVersion: "phase-4c-geometry-only-facade-cues.v0.1",
    fixtureId: "p4c-geometry-only-facade-cues-greenpoint-ave-manhattan-to-franklin",
    phase: "4C-2",
    reviewOnly: true,
    status: "generated-review-only-geometry-cue-fixture",
    generatedFrom: {
      sceneManifestPath: manifestPath,
      geometryFixturePath,
      runtimeBuilderPath: "src/phase4bRuntimeScene.js",
      sourcePolicy: "existing-4b-manifest-and-geometry-only",
    },
    cuePolicy: {
      normalModeUse: "not-rendered",
      qaModeUse: "review-placement-and-type-only",
      allowedCueClasses,
      blockedClaimClasses,
      noExactFacadeClaims: true,
      noBusinessOrStorefrontClaims: true,
      noSourceExpansion: true,
    },
    tierRules: {
      widthTierSceneUnits: {
        narrow: "< 0.55",
        regular: ">= 0.55 and < 1.35",
        wide: ">= 1.35",
      },
      depthTierSceneUnits: {
        shallow: "< 0.28",
        regular: ">= 0.28 and < 0.75",
        deep: ">= 0.75",
      },
      heightTierSceneUnits: {
        low: "< 1.35",
        mid: ">= 1.35 and < 2.65",
        tall: ">= 2.65",
      },
      endpointRoleBands: "first/last 18% of generated corridor x-span only",
      blockBreakGapSceneUnits: ">= 0.62 between same-side generated building centroids",
    },
    summary: {
      cueCount: cues.length,
      targetSemanticObjectCount: cues.length,
      widthTierCounts,
      heightTierCounts,
      depthTierCounts,
    },
    manualReviewGates: [
      "Do not promote these QA cues to normal mode without Batu review.",
      "Do not treat review planes as exact facades, entrances, windows, doors, signs, materials, or tenant frontage.",
      "Do not attach business/storefront anchors to these cues until frontage evidence exists and is approved.",
    ],
    cues,
  };
}

function buildCue(building, breakFlagsByBuilding, endpointRanges) {
  const bounds = getBounds(building.points);
  const dimensions = roundDimensions(building.dimensions);
  const planeZ = building.corridorSide === "left" ? bounds.maxZ : bounds.minZ;
  const breakFlags = breakFlagsByBuilding.get(building.id) ?? { blockBreakBefore: false, blockBreakAfter: false };

  return {
    id: `p4c-cue-${building.id}-geometry-summary`,
    cueFamily: "geometry-only",
    cueClass: "street-facing-plane",
    secondaryCueClasses: allowedCueClasses.filter((cueClass) => cueClass !== "street-facing-plane"),
    claimStatus: "source_backed_contextual",
    confidence: "deterministic-from-existing-geometry",
    allowedUse: "qa-mode-review-only",
    targetSemanticId: building.id,
    targetSourceRecordId: building.sourceRecordId,
    targetGeometryReferenceId: building.geometryReferenceId,
    targetGeometryCollection: building.geometryCollection,
    corridorSide: building.corridorSide,
    evidenceInputs: [
      {
        type: "source-backed-geometry",
        manifestPath,
        geometryFixturePath,
        sourceRecordId: building.sourceRecordId,
        geometryReferenceId: building.geometryReferenceId,
      },
    ],
    geometryDerived: {
      streetFacingPlane: {
        status: "review-plane-from-building-footprint-edge-nearest-corridor-center",
        corridorSide: building.corridorSide,
        xMin: roundNumber(bounds.minX),
        xMax: roundNumber(bounds.maxX),
        z: roundNumber(planeZ),
      },
      widthTier: getWidthTier(building.dimensions.width),
      heightTier: getHeightTier(building.dimensions.height),
      depthTier: getDepthTier(building.dimensions.depth),
      cornerOrEndpointRole: getEndpointRole(building.centroid.x, endpointRanges),
      sideOfCorridor: building.corridorSide,
      coverageStatus: building.contextCoverageStatus,
      blockBreakBefore: breakFlags.blockBreakBefore,
      blockBreakAfter: breakFlags.blockBreakAfter,
      centroid: {
        x: roundNumber(building.centroid.x),
        z: roundNumber(building.centroid.z),
      },
      dimensions,
    },
    blockedClaims: blockedClaimClasses,
    reviewNotes: [
      "Geometry-only cue for QA placement/readability review.",
      "This record does not verify facade appearance, frontage, tenant identity, signage, entrance, material, window, or door details.",
    ],
  };
}

function validateFixture(fixture, failures) {
  if (fixture.phase !== "4C-2") failures.push("Fixture phase must be 4C-2.");
  if (fixture.reviewOnly !== true) failures.push("Fixture must be review-only.");
  if (fixture.cuePolicy?.normalModeUse !== "not-rendered") failures.push("Fixture must keep normal mode protected.");

  const allowedSet = new Set(allowedCueClasses);
  const blockedSet = new Set(blockedClaimClasses);
  const seenCueIds = new Set();

  for (const cue of fixture.cues ?? []) {
    if (seenCueIds.has(cue.id)) failures.push(`Duplicate cue id: ${cue.id}`);
    seenCueIds.add(cue.id);
    if (cue.id !== `p4c-cue-${cue.targetSemanticId}-geometry-summary`) {
      failures.push(`${cue.id} does not follow deterministic cue id format.`);
    }
    if (cue.cueFamily !== "geometry-only") failures.push(`${cue.id} is not geometry-only.`);
    if (!allowedSet.has(cue.cueClass)) failures.push(`${cue.id} has unsupported primary cue class ${cue.cueClass}.`);
    for (const secondaryClass of cue.secondaryCueClasses ?? []) {
      if (!allowedSet.has(secondaryClass)) failures.push(`${cue.id} has unsupported secondary cue class ${secondaryClass}.`);
    }
    if (cue.allowedUse !== "qa-mode-review-only") failures.push(`${cue.id} must be QA-mode review only.`);
    if (cue.claimStatus !== "source_backed_contextual") failures.push(`${cue.id} must keep source-backed contextual status.`);
    for (const requiredBlock of blockedSet) {
      if (!cue.blockedClaims?.includes(requiredBlock)) failures.push(`${cue.id} is missing blocked claim ${requiredBlock}.`);
    }
    for (const input of cue.evidenceInputs ?? []) {
      if (input.type !== "source-backed-geometry") failures.push(`${cue.id} includes non-geometry evidence input ${input.type}.`);
      if (input.manifestPath !== manifestPath) failures.push(`${cue.id} uses an unexpected manifest path.`);
      if (input.geometryFixturePath !== geometryFixturePath) failures.push(`${cue.id} uses an unexpected geometry fixture path.`);
    }
    for (const key of forbiddenRuntimeClaimKeys) {
      if (Object.hasOwn(cue.geometryDerived ?? {}, key)) {
        failures.push(`${cue.id} includes forbidden runtime claim key ${key}.`);
      }
    }
  }
}

function buildBreakFlags(buildings) {
  const flags = new Map(buildings.map((building) => [
    building.id,
    { blockBreakBefore: false, blockBreakAfter: false },
  ]));

  const buildingsBySide = Map.groupBy(
    buildings.slice().sort((a, b) => a.centroid.x - b.centroid.x),
    (building) => building.corridorSide,
  );

  for (const sideBuildings of buildingsBySide.values()) {
    for (let index = 0; index < sideBuildings.length; index += 1) {
      const building = sideBuildings[index];
      const previous = sideBuildings[index - 1];
      const next = sideBuildings[index + 1];
      if (previous && building.centroid.x - previous.centroid.x >= 0.62) {
        flags.get(building.id).blockBreakBefore = true;
      }
      if (next && next.centroid.x - building.centroid.x >= 0.62) {
        flags.get(building.id).blockBreakAfter = true;
      }
    }
  }

  return flags;
}

function buildEndpointRanges(buildings) {
  const xs = buildings.map((building) => building.centroid.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const band = (maxX - minX) * 0.18;
  return {
    franklinMaxX: roundNumber(minX + band),
    manhattanMinX: roundNumber(maxX - band),
  };
}

function getEndpointRole(x, endpointRanges) {
  if (x <= endpointRanges.franklinMaxX) return "franklin-end-review-band";
  if (x >= endpointRanges.manhattanMinX) return "manhattan-end-review-band";
  return "mid-corridor";
}

function getWidthTier(width) {
  if (width < 0.55) return "narrow";
  if (width < 1.35) return "regular";
  return "wide";
}

function getDepthTier(depth) {
  if (depth < 0.28) return "shallow";
  if (depth < 0.75) return "regular";
  return "deep";
}

function getHeightTier(height) {
  if (height < 1.35) return "low";
  if (height < 2.65) return "mid";
  return "tall";
}

function getBounds(points) {
  const xs = points.map((point) => point.x);
  const zs = points.map((point) => point.z);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  };
}

function roundDimensions(dimensions) {
  return {
    width: roundNumber(dimensions.width),
    depth: roundNumber(dimensions.depth),
    height: roundNumber(dimensions.height),
  };
}

function roundNumber(value) {
  return Number(value.toFixed(4));
}

function countBy(values, getKey) {
  return Object.fromEntries(
    [...Map.groupBy(values, getKey)]
      .map(([key, items]) => [key, items.length])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}
