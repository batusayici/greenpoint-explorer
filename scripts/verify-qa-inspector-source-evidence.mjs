#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMvpSceneFromManifest } from "../src/sceneManifest.js";

const PROMOTION_CLAIM_KEYS = [
  "identityName",
  "categoryBusinessType",
  "addressLocation",
  "storefrontFacade",
  "entranceFrontageGeometry",
];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifestInput = options.manifest ?? "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
  const evidenceInput = options.evidence ?? "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
  const coverageInput = options.coverage ?? "src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json";
  const grillpointReportInput = options["grillpoint-report"]
    ?? "src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json";

  const manifest = await readJson(resolve(repoRoot, manifestInput), "scene manifest");
  const evidenceFixture = await readJson(resolve(repoRoot, evidenceInput), "source evidence fixture");
  const coverageReport = await readJson(resolve(repoRoot, coverageInput), "source evidence coverage report");
  const grillpointReport = await readJson(resolve(repoRoot, grillpointReportInput), "Grillpoint promotion readiness report");
  const primaryAsset = manifest.scene.assets.find((asset) => asset.role === "primary-raster-plate");
  if (!primaryAsset) throw new Error("Scene manifest is missing a primary raster plate asset.");

  const appScene = loadMvpSceneFromManifest(
    manifest,
    {
      [primaryAsset.id]: "__qa_inspector_verifier_raster_stub__",
    },
    evidenceFixture,
  );

  const failures = [
    ...collectTargetCoverageFailures(appScene, coverageReport),
    ...collectGrillpointContractFailures(appScene, grillpointReport),
  ];

  if (failures.length) {
    console.error(`FAIL QA inspector source-evidence verification: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log([
    "PASS QA inspector source-evidence verification:",
    `${coverageReport.targets.length} target(s) matched coverage readiness;`,
    `${evidenceFixture.records.length} evidence record(s) matched app QA visibility;`,
    `Grillpoint contract ${grillpointReport.reportId} remains app-inspectable and blocked for facade/geometry.`,
  ].join(" "));
}

function collectTargetCoverageFailures(appScene, coverageReport) {
  const failures = [];
  const appTargetsById = new Map(appScene.targets.map((target) => [target.id, target]));

  for (const coverageTarget of coverageReport.targets) {
    const appTarget = appTargetsById.get(coverageTarget.targetId);
    if (!appTarget) {
      failures.push(`coverage target "${coverageTarget.targetId}" is missing from app scene targets`);
      continue;
    }

    const qaRecords = appTarget.manifestQA.sourceEvidence;
    compareArray(
      failures,
      qaRecords.map((record) => record.id),
      coverageTarget.generatedEvidenceRecordIds,
      `${coverageTarget.targetId} app QA evidence record ids`,
    );
    compareArray(
      failures,
      uniqueStrings(qaRecords.map((record) => record.evidenceStrength)),
      coverageTarget.evidenceStrengths,
      `${coverageTarget.targetId} app QA evidence strengths`,
    );

    const coverageRecordsById = new Map(coverageTarget.evidenceQualityRecords.map((record) => [record.id, record]));
    for (const qaRecord of qaRecords) {
      const coverageRecord = coverageRecordsById.get(qaRecord.id);
      if (!coverageRecord) {
        failures.push(`${coverageTarget.targetId} app QA record "${qaRecord.id}" is missing from coverage evidenceQualityRecords`);
        continue;
      }

      compareValue(failures, qaRecord.evidenceStrength, coverageRecord.evidenceStrength, `${qaRecord.id}.evidenceStrength`);
      compareValue(failures, qaRecord.claimReadiness, coverageRecord.claimReadiness, `${qaRecord.id}.claimReadiness`);
      compareGateSummaries(failures, qaRecord.promotionGates, coverageRecord.promotionGates, `${qaRecord.id}.promotionGates`, {
        compareNeededEvidence: true,
      });
      compareBlockers(
        failures,
        collectPromotionBlockers(qaRecord.promotionGates),
        coverageRecord.promotionBlockers,
        `${qaRecord.id}.promotionBlockers`,
      );
    }
  }

  return failures;
}

function collectGrillpointContractFailures(appScene, grillpointReport) {
  const failures = [];
  const appTarget = appScene.targets.find((target) => target.id === grillpointReport.targetId);
  if (!appTarget) return [`Grillpoint report target "${grillpointReport.targetId}" is missing from app scene targets`];

  const appRecord = appTarget.manifestQA.sourceEvidence.find((record) => record.id === grillpointReport.evidenceRecordId);
  if (!appRecord) {
    failures.push(`Grillpoint app QA evidence is missing report record "${grillpointReport.evidenceRecordId}"`);
    return failures;
  }

  compareValue(failures, appRecord.claimReadiness, grillpointReport.claimReadiness, "Grillpoint report claimReadiness");
  compareValue(failures, grillpointReport.productCopyReady, false, "Grillpoint productCopyReady");
  compareGateSummaries(
    failures,
    appRecord.promotionGates,
    grillpointReport.currentPromotionGates,
    "Grillpoint report currentPromotionGates",
    {
      compareNeededEvidence: false,
    },
  );

  const blockedContractClaims = Object.entries(grillpointReport.currentPromotionGates)
    .filter(([, gate]) => gate.status === "blocked")
    .map(([claim]) => claim);
  const missingContractClaims = Object.keys(grillpointReport.missingEvidenceContract);
  compareArray(
    failures,
    missingContractClaims,
    blockedContractClaims,
    "Grillpoint missingEvidenceContract blocked claim coverage",
  );

  return failures;
}

function compareGateSummaries(failures, actualGates, expectedGates, label, options = {}) {
  for (const claim of PROMOTION_CLAIM_KEYS) {
    const actual = actualGates[claim];
    const expected = expectedGates[claim];
    if (!actual || !expected) {
      failures.push(`${label}.${claim} is missing from ${actual ? "expected" : "actual"} gates`);
      continue;
    }
    compareValue(failures, actual.status, expected.status, `${label}.${claim}.status`);
    if (options.compareNeededEvidence) {
      compareValue(failures, actual.neededEvidence ?? "", expected.neededEvidence ?? "", `${label}.${claim}.neededEvidence`);
    }
  }
}

function compareBlockers(failures, actualBlockers, expectedBlockers, label) {
  const actual = normalizeBlockers(actualBlockers);
  const expected = normalizeBlockers(expectedBlockers);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${label} mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function collectPromotionBlockers(gates) {
  return Object.entries(gates)
    .filter(([, gate]) => gate.status !== "allowed")
    .map(([claim, gate]) => ({
      claim,
      status: gate.status,
      neededEvidence: gate.neededEvidence,
    }));
}

function normalizeBlockers(blockers) {
  return blockers
    .map((blocker) => ({
      claim: blocker.claim,
      status: blocker.status,
      neededEvidence: blocker.neededEvidence ?? "",
    }))
    .sort((a, b) => a.claim.localeCompare(b.claim));
}

function compareArray(failures, actual, expected, label) {
  const actualSorted = uniqueStrings(actual);
  const expectedSorted = uniqueStrings(expected);
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(`${label} mismatch: expected ${expectedSorted.join(", ") || "(none)"}, got ${actualSorted.join(", ") || "(none)"}`);
  }
}

function compareValue(failures, actual, expected, label) {
  if (actual !== expected) failures.push(`${label} mismatch: expected "${expected}", got "${actual}"`);
}

function uniqueStrings(values) {
  return [...new Set(values)].sort();
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${label} at ${path}: ${error.message}`);
  }
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument "${arg}".`);
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}.`);
    options[key] = value;
    index += 1;
  }
  return options;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
