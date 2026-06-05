#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_FIXTURE_PATH = "src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json";
const REQUIRED_SCHEMA_VERSION = "phase-4b-corridor-source-fixture.v0.1";
const REQUIRED_BLOCKED_CLAIMS = [
  "tenant-frontage",
  "storefront-order",
  "storefront-anchor",
  "storefront-segmentation",
  "business-identity",
  "business-active-status",
  "entrance-location",
  "facade-appearance",
  "exact-address-placement",
  "raster-readiness",
];
const ID_PATTERN = /^p4b-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIMESTAMP_OR_RANDOM_PATTERN = /\b(\d{4}-\d{2}-\d{2}|t\d{2}:?\d{2}|uuid|random|Math\.random|Date\.now)\b/i;

async function main() {
  const fixturePath = process.argv[2] ?? DEFAULT_FIXTURE_PATH;
  const fixture = await readJson(fixturePath);
  const failures = [];

  verifyPacketMetadata(failures, fixture);
  verifyStableIds(failures, fixture);
  await verifyDeterministicHashInputs(failures, fixture);
  await verifySourceAndGeometryReferences(failures, fixture);
  verifyClaimDiscipline(failures, fixture);
  verifyManualAssumptions(failures, fixture);

  if (failures.length) {
    console.error(`FAIL Phase 4B source fixture verification: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log([
    "PASS Phase 4B source fixture:",
    `${fixture.fixtureId};`,
    `sourceRecords=${fixture.sourceRecords.length};`,
    `sources=${fixture.sources.length};`,
    `hashInputs=${fixture.deterministicHashInputs.length};`,
    "storefrontAnchors=blocked_no_candidates.",
  ].join(" "));
}

function verifyPacketMetadata(failures, fixture) {
  requireValue(failures, fixture.schemaVersion, REQUIRED_SCHEMA_VERSION, "schemaVersion");
  requireString(failures, fixture.fixtureId, "fixtureId");
  requireValue(failures, fixture.phase, "4B-2", "phase");
  requireValue(failures, fixture.reviewOnly, true, "reviewOnly");
  requireObject(failures, fixture.sourcePacket, "sourcePacket");
  requireObject(failures, fixture.corridor, "corridor");
  requireArray(failures, fixture.sources, "sources");
  requireArray(failures, fixture.sourceRecords, "sourceRecords");
  requireObject(failures, fixture.claimPolicy, "claimPolicy");
  requireArray(failures, fixture.claimPolicy?.allowedClaimClasses, "claimPolicy.allowedClaimClasses");
  requireArray(failures, fixture.claimPolicy?.blockedClaimClasses, "claimPolicy.blockedClaimClasses");
  requireArray(failures, fixture.deterministicHashInputs, "deterministicHashInputs");

  for (const key of [
    "id",
    "normalizedPath",
    "normalizedSha256",
    "rawPath",
    "rawSha256",
    "storageStatus",
    "retrievalStatus",
  ]) {
    requireString(failures, fixture.sourcePacket?.[key], `sourcePacket.${key}`);
  }
  requireValue(failures, fixture.sourcePacket?.scrapingAttempted, false, "sourcePacket.scrapingAttempted");
  requireValue(failures, fixture.sourcePacket?.liveApiCalledInThisBatch, false, "sourcePacket.liveApiCalledInThisBatch");
  requireValue(failures, fixture.sourcePacket?.businessClaimsPromoted, false, "sourcePacket.businessClaimsPromoted");
  requireValue(failures, fixture.sourcePacket?.attributionRequired, true, "sourcePacket.attributionRequired");
}

function verifyStableIds(failures, fixture) {
  const stableIds = requireArray(failures, fixture.stableIds, "stableIds") ? fixture.stableIds : [];
  const stableIdSet = new Set();

  for (const entry of stableIds) {
    requireString(failures, entry.id, "stableIds[].id");
    requireString(failures, entry.namespace, `${entry.id}.namespace`);
    requireString(failures, entry.sourceKey, `${entry.id}.sourceKey`);
    requireValue(failures, entry.method, "p4b-{namespace}-{sourceKey}", `${entry.id}.method`);
    if (!ID_PATTERN.test(entry.id)) failures.push(`${entry.id} does not match the Phase 4B stable ID pattern`);
    if (TIMESTAMP_OR_RANDOM_PATTERN.test(entry.id) || TIMESTAMP_OR_RANDOM_PATTERN.test(entry.sourceKey)) {
      failures.push(`${entry.id} appears timestamp/random-derived`);
    }
    const expected = `p4b-${entry.namespace}-${entry.sourceKey}`;
    if (entry.id !== expected) failures.push(`${entry.id} expected deterministic ID ${expected}`);
    stableIdSet.add(entry.id);
  }

  const requiredIds = [
    fixture.fixtureId,
    fixture.sourcePacket?.id,
    fixture.corridor?.id,
    ...(fixture.sources ?? []).map((source) => source.id),
    ...(fixture.sourceRecords ?? []).map((record) => record.id),
    ...(fixture.manualAssumptions ?? []).map((assumption) => assumption.id),
  ].filter(Boolean);
  for (const id of requiredIds) {
    if (!stableIdSet.has(id)) failures.push(`${id} is missing from stableIds`);
  }
}

async function verifyDeterministicHashInputs(failures, fixture) {
  const hashInputs = requireArray(failures, fixture.deterministicHashInputs, "deterministicHashInputs")
    ? fixture.deterministicHashInputs
    : [];
  const seenPaths = new Set();

  for (const input of hashInputs) {
    requireString(failures, input.role, "deterministicHashInputs[].role");
    requireString(failures, input.path, `${input.role}.path`);
    requireString(failures, input.sha256, `${input.role}.sha256`);
    if (seenPaths.has(input.path)) failures.push(`${input.path} is duplicated in deterministicHashInputs`);
    seenPaths.add(input.path);
    if (!/^[a-f0-9]{64}$/.test(input.sha256 ?? "")) failures.push(`${input.path} has an invalid sha256`);
    const actual = await sha256(input.path);
    if (actual !== input.sha256) failures.push(`${input.path} hash mismatch: expected ${input.sha256}, received ${actual}`);
  }

  requireHashInput(failures, hashInputs, fixture.sourcePacket?.normalizedPath, fixture.sourcePacket?.normalizedSha256);
  requireHashInput(failures, hashInputs, fixture.sourcePacket?.rawPath, fixture.sourcePacket?.rawSha256);
}

async function verifySourceAndGeometryReferences(failures, fixture) {
  const geometryFixture = await readJson(fixture.sourcePacket.normalizedPath);
  requireValue(failures, geometryFixture.fixtureId, fixture.corridor.sourceGeometryFixtureId, "referenced geometry fixtureId");

  const geometrySources = new Set((geometryFixture.sources ?? []).map((source) => source.id));
  const fixtureSources = new Map((fixture.sources ?? []).map((source) => [source.id, source]));
  const fixtureRecords = new Map((fixture.sourceRecords ?? []).map((record) => [record.id, record]));

  for (const source of fixture.sources ?? []) {
    requireString(failures, source.sourceFixtureId, `${source.id}.sourceFixtureId`);
    requireString(failures, source.provenancePath, `${source.id}.provenancePath`);
    requireValue(failures, source.attributionRequired, true, `${source.id}.attributionRequired`);
    if (!geometrySources.has(source.sourceFixtureId)) {
      failures.push(`${source.id} references missing geometry source ${source.sourceFixtureId}`);
    }
  }

  for (const record of fixture.sourceRecords ?? []) {
    if (!fixtureSources.has(record.sourceId)) failures.push(`${record.id} references missing source ${record.sourceId}`);
    requireString(failures, record.geometryReferenceId, `${record.id}.geometryReferenceId`);
    requireString(failures, record.geometryCollection, `${record.id}.geometryCollection`);
    const collection = geometryFixture[record.geometryCollection];
    if (!Array.isArray(collection)) {
      failures.push(`${record.id} geometry collection ${record.geometryCollection} is missing`);
      continue;
    }
    const geometryRecord = collection.find((candidate) => candidate.id === record.geometryReferenceId);
    if (!geometryRecord) {
      failures.push(`${record.id} geometry reference ${record.geometryReferenceId} is missing`);
      continue;
    }
    if (!hasGeometryPresence(geometryRecord)) failures.push(`${record.id} geometry reference has no usable geometry presence`);
    const source = fixtureSources.get(record.sourceId);
    if (source && geometryRecord.source !== source.sourceFixtureId) {
      failures.push(`${record.id} source ${record.sourceId} does not match geometry source ${geometryRecord.source}`);
    }
  }

  for (const claim of allAllowedClaims(fixture)) {
    if (!fixtureSources.has(claim.provenanceSourceId)) failures.push(`${claim.claimClass} references missing provenance source ${claim.provenanceSourceId}`);
    if (!fixtureRecords.has(claim.sourceRecordId)) failures.push(`${claim.claimClass} references missing source record ${claim.sourceRecordId}`);
  }
}

function verifyClaimDiscipline(failures, fixture) {
  const allowed = new Set(fixture.claimPolicy?.allowedClaimClasses ?? []);
  const blocked = new Set(fixture.claimPolicy?.blockedClaimClasses ?? []);

  for (const required of REQUIRED_BLOCKED_CLAIMS) {
    if (!blocked.has(required)) failures.push(`claimPolicy.blockedClaimClasses is missing ${required}`);
  }
  for (const claimClass of allowed) {
    if (blocked.has(claimClass)) failures.push(`${claimClass} cannot be both allowed and blocked`);
  }

  for (const record of fixture.sourceRecords ?? []) {
    const allowedClaims = requireArray(failures, record.allowedClaims, `${record.id}.allowedClaims`)
      ? record.allowedClaims
      : [];
    requireArray(failures, record.blockedClaimClasses, `${record.id}.blockedClaimClasses`);
    for (const claim of allowedClaims) {
      if (!allowed.has(claim.claimClass)) failures.push(`${record.id} allows undeclared claim ${claim.claimClass}`);
      if (blocked.has(claim.claimClass)) failures.push(`${record.id} allows blocked claim ${claim.claimClass}`);
      requireString(failures, claim.status, `${record.id}.${claim.claimClass}.status`);
      requireString(failures, claim.provenanceSourceId, `${record.id}.${claim.claimClass}.provenanceSourceId`);
      requireString(failures, claim.sourceRecordId, `${record.id}.${claim.claimClass}.sourceRecordId`);
    }
    for (const required of REQUIRED_BLOCKED_CLAIMS.filter((claim) => claim !== "business-active-status" && claim !== "storefront-segmentation")) {
      if (!record.blockedClaimClasses?.includes(required)) failures.push(`${record.id}.blockedClaimClasses is missing ${required}`);
    }
  }

  requireObject(failures, fixture.storefrontAnchorPolicy, "storefrontAnchorPolicy");
  requireValue(failures, fixture.storefrontAnchorPolicy?.status, "blocked_no_candidates", "storefrontAnchorPolicy.status");
  if (!Array.isArray(fixture.storefrontAnchorPolicy?.anchors) || fixture.storefrontAnchorPolicy.anchors.length !== 0) {
    failures.push("storefrontAnchorPolicy.anchors must exist and remain empty in 4B-2");
  }
  if (JSON.stringify(fixture).includes("\"businessLinks\"")) {
    failures.push("businessLinks must not appear in the 4B-2 source fixture");
  }
}

function verifyManualAssumptions(failures, fixture) {
  const assumptions = new Map((fixture.manualAssumptions ?? []).map((assumption) => [assumption.id, assumption]));
  if (!assumptions.size) failures.push("manualAssumptions must not be empty");

  for (const assumption of assumptions.values()) {
    requireString(failures, assumption.status, `${assumption.id}.status`);
    requireString(failures, assumption.target, `${assumption.id}.target`);
    requireString(failures, assumption.reason, `${assumption.id}.reason`);
    requireArray(failures, assumption.notClaims, `${assumption.id}.notClaims`);
  }

  for (const record of fixture.sourceRecords ?? []) {
    const refs = requireArray(failures, record.manualAssumptionRefs, `${record.id}.manualAssumptionRefs`)
      ? record.manualAssumptionRefs
      : [];
    if (!refs.length) failures.push(`${record.id} has no explicit manualAssumptionRefs`);
    for (const ref of refs) {
      if (!assumptions.has(ref)) failures.push(`${record.id} references missing manual assumption ${ref}`);
    }
  }
}

function allAllowedClaims(fixture) {
  return (fixture.sourceRecords ?? []).flatMap((record) => record.allowedClaims ?? []);
}

function hasGeometryPresence(record) {
  return [record.wgs84Line, record.sceneLine, record.wgs84Polygon, record.scenePolygon]
    .some((geometry) => Array.isArray(geometry) && geometry.length > 0);
}

function requireHashInput(failures, hashInputs, path, sha256Value) {
  if (!hashInputs.some((input) => input.path === path && input.sha256 === sha256Value)) {
    failures.push(`${path} is missing from deterministicHashInputs with the sourcePacket sha256`);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repoRoot, path), "utf8"));
}

async function sha256(path) {
  return createHash("sha256")
    .update(await readFile(resolve(repoRoot, path)))
    .digest("hex");
}

function requireObject(failures, value, label) {
  const passes = value && typeof value === "object" && !Array.isArray(value);
  if (!passes) failures.push(`${label} must be an object`);
  return passes;
}

function requireArray(failures, value, label) {
  const passes = Array.isArray(value);
  if (!passes) failures.push(`${label} must be an array`);
  return passes;
}

function requireString(failures, value, label) {
  const passes = typeof value === "string" && value.length > 0;
  if (!passes) failures.push(`${label} must be a non-empty string`);
  return passes;
}

function requireValue(failures, actual, expected, label) {
  if (actual !== expected) failures.push(`${label} expected ${expected}, received ${actual}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
