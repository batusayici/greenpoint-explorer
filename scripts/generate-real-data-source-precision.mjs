#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INPUT_FIXTURE_PATH = "src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2z.json";
const MANIFEST_PATH = "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
const OUTPUT_FIXTURE_PATH = "src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json";
const SOURCE_PRECISION_TARGETS = new Set(["mcdonalds", "citizens-bank"]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outputPath = options.output ?? OUTPUT_FIXTURE_PATH;
  const inputFixture = await readJson(INPUT_FIXTURE_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  const manifestIndexes = buildManifestIndexes(manifest);
  const outputFixture = applySourcePrecision(inputFixture, manifestIndexes);

  await writeFile(
    resolve(repoRoot, outputPath),
    `${JSON.stringify(outputFixture, null, 2)}\n`,
    "utf8",
  );

  console.log([
    "Wrote source precision fixture:",
    outputPath,
    `records=${outputFixture.records.length}`,
    `upgradedTargets=${[...SOURCE_PRECISION_TARGETS].join(",")}.`,
  ].join(" "));
}

function applySourcePrecision(fixture, indexes) {
  return {
    ...fixture,
    fixtureId: "manhattan-greenpoint-ave.active-targets.phase-2aa.real-data",
    status: "prototype-local-source-precision-sample",
    sourceLane: "deterministic-review-manifest-source-precision-transform",
    notes: [
      "Phase 2AA applies a deterministic source-precision transform over the Phase 2Z active-target fixture.",
      "Only fields with stronger local review-manifest support are upgraded; exact product/public geometry remains blocked.",
      "McDonald's and Citizens Bank receive source-backed QA frontage alignment from review-manifest storefront confidence and address/building links.",
      "Building samples for McDonald's and Citizens Bank move from human_prepared to estimated_from_source because they are now derived from review-manifest address/building/storefront links plus raster alignment.",
      "Grillpoint, Dunkin', and Greenpoint G geometry remains unchanged because the available local evidence does not support a stronger geometry tier."
    ],
    sourcePrecision: {
      generatedBy: "scripts/generate-real-data-source-precision.mjs",
      inputFixturePath: INPUT_FIXTURE_PATH,
      manifestPath: MANIFEST_PATH,
      upgradedTargets: [...SOURCE_PRECISION_TARGETS],
      blockedTargets: ["grillpoint-deli", "dunkin", "greenpoint-g-subway"],
      rules: [
        "Upgrade frontageSegment to source_backed only when the manifest storefront confidence is medium-high and its rationale contains medium exact frontage.",
        "Upgrade buildingSample to estimated_from_source for the same targets because local manifest address/building/storefront links support a source-derived review envelope, not an exact footprint.",
        "Do not upgrade entranceGeometry, facadePlaceholder, Greenpoint G symbolic geometry, or any low-confidence target geometry."
      ]
    },
    records: fixture.records.map((record) => upgradeRecord(record, indexes)),
  };
}

function upgradeRecord(record, indexes) {
  if (!SOURCE_PRECISION_TARGETS.has(record.targetId)) return record;

  const manifestLinks = getManifestLinks(record, indexes);
  if (!hasMediumFrontageSupport(manifestLinks.storefront)) return record;

  return {
    ...record,
    sourcePrecision: {
      upgradedBy: "review-manifest-source-precision-transform",
      upgradedFields: [
        "geometry.buildingSample.status",
        "geometry.frontageSegment.status"
      ],
      manifestRefs: {
        addressId: manifestLinks.address?.id,
        buildingId: manifestLinks.building?.id,
        parcelId: manifestLinks.parcel?.id,
        storefrontId: manifestLinks.storefront?.id
      },
      rationale: "Review manifest links this address to a building/storefront record with medium-high confidence and medium exact-frontage rationale; exact footprint, storefront order, and entrance geometry remain blocked."
    },
    geometry: {
      ...record.geometry,
      buildingSample: {
        ...record.geometry.buildingSample,
        status: "estimated_from_source",
        sourceIds: uniqueStrings([
          ...record.geometry.buildingSample.sourceIds,
          ...manifestLinks.sourceIds,
        ]),
        notes: "Source-derived QA building envelope from review-manifest address/building/storefront links plus raster alignment; not exact parcel/tax-lot or building footprint geometry."
      },
      frontageSegment: {
        ...record.geometry.frontageSegment,
        status: "source_backed",
        sourceIds: uniqueStrings([
          ...record.geometry.frontageSegment.sourceIds,
          ...manifestLinks.sourceIds,
        ]),
        notes: "Source-backed QA frontage alignment from review-manifest storefront confidence and official address context; exact frontage/order and entrance placement remain blocked."
      }
    }
  };
}

function getManifestLinks(record, indexes) {
  const place = indexes.placesById.get(record.placeId);
  const address = (place?.addressIds ?? [])
    .map((id) => indexes.addressesById.get(id))
    .find(Boolean);
  const storefront = (place?.storefrontIds ?? [])
    .map((id) => indexes.storefrontsById.get(id))
    .find(Boolean);
  const building = address?.buildingId
    ? indexes.buildingsById.get(address.buildingId)
    : storefront?.buildingId
      ? indexes.buildingsById.get(storefront.buildingId)
      : null;
  const parcel = address?.parcelId
    ? indexes.parcelsById.get(address.parcelId)
    : building?.parcelId
      ? indexes.parcelsById.get(building.parcelId)
      : null;

  return {
    address,
    storefront,
    building,
    parcel,
    sourceIds: uniqueStrings([
      ...(address?.sourceIds ?? []),
      ...(storefront?.sourceIds ?? []),
      ...(building?.sourceIds ?? []),
      ...(parcel?.sourceIds ?? []),
    ]),
  };
}

function hasMediumFrontageSupport(storefront) {
  return (
    storefront?.confidence?.value === "medium-high" &&
    storefront.confidence.rationale.includes("medium exact frontage")
  );
}

function buildManifestIndexes(manifest) {
  return {
    placesById: indexById(manifest.places),
    addressesById: indexById(manifest.addresses),
    storefrontsById: indexById(manifest.storefronts),
    buildingsById: indexById(manifest.geometry.buildings),
    parcelsById: indexById(manifest.geometry.parcels),
  };
}

function indexById(records) {
  return new Map(records.map((record) => [record.id, record]));
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
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
