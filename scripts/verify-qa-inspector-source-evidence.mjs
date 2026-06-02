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
const REQUIRED_CONTRACT_MUST_NOT_CLAIMS = {
  storefrontFacade: [
    "exact facade",
    "production asset readiness",
  ],
  entranceFrontageGeometry: [
    "exact entrance position",
    "exact address placement",
    "production placement readiness",
  ],
};
const REQUIRED_LOCAL_VERIFIER_REJECTIONS = [
  "product_copy_ready while any required promotion gate is not allowed",
  "productCopyReady true while claimReadiness is not product_copy_ready",
  "allowed gate status with no supportingClaimIds",
  "allowed blocked-gate promotion while missingEvidenceContract remains unsatisfied",
  "blocked gate without a matching missingEvidenceContract entry",
];
const ACTIVE_SOURCE_EVIDENCE_GENERATOR_PATH = "scripts/ingest-source-evidence-fixture.mjs";
const ACTIVE_RAW_INPUT_PATHS = [
  "src/data/source-evidence/raw/grillpoint.phase-2e.raw.json",
  "src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json",
  "src/data/source-evidence/raw/official-locations.phase-2k.raw.json",
];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifestInput = options.manifest ?? "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
  const evidenceInput = options.evidence ?? "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
  const coverageInput = options.coverage ?? "src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json";
  const grillpointReportInput = options["grillpoint-report"]
    ?? "src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json";
  const runNegativeContractSelfTest = options["self-test-negative-contract"] === "true";

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
    ...collectPromotionReadinessReportFailures(grillpointReport),
  ];

  if (failures.length) {
    console.error(`FAIL QA inspector source-evidence verification: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  if (runNegativeContractSelfTest && !runNegativeContractGuardrailSelfTest(grillpointReport)) {
    process.exitCode = 1;
    return;
  }

  for (const line of buildFixtureMetadataLines({
    manifestInput,
    evidenceInput,
    coverageInput,
    grillpointReportInput,
    evidenceFixture,
    coverageReport,
    grillpointReport,
  })) {
    console.log(line);
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

function buildFixtureMetadataLines({
  manifestInput,
  evidenceInput,
  coverageInput,
  grillpointReportInput,
  evidenceFixture,
  coverageReport,
  grillpointReport,
}) {
  return [
    [
      "INFO fixture paths:",
      `generator=${ACTIVE_SOURCE_EVIDENCE_GENERATOR_PATH};`,
      `manifest=${manifestInput};`,
      `generatedEvidence=${evidenceInput};`,
      `coverage=${coverageInput};`,
      `grillpointReport=${grillpointReportInput}.`,
    ].join(" "),
    `INFO raw inputs: ${ACTIVE_RAW_INPUT_PATHS.join(", ")}.`,
    [
      "INFO fixture status:",
      `fixtureId=${evidenceFixture.fixtureId};`,
      `status=${evidenceFixture.status};`,
      `reviewedOn=${evidenceFixture.reviewedOn};`,
      `records=${evidenceFixture.records.length};`,
      `notes="${evidenceFixture.notes}".`,
    ].join(" "),
    [
      "INFO coverage readiness:",
      `targets=${coverageReport.summary.targetCount};`,
      `product_copy_ready=${coverageReport.summary.claimReadinessByTarget.product_copy_ready};`,
      `review_only=${coverageReport.summary.claimReadinessByTarget.review_only};`,
      `blocked=${coverageReport.summary.claimReadinessByTarget.blocked};`,
      `storefrontFacade.blocked=${coverageReport.summary.promotionGateStatusByTarget.storefrontFacade.blocked};`,
      `entranceFrontageGeometry.blocked=${coverageReport.summary.promotionGateStatusByTarget.entranceFrontageGeometry.blocked}.`,
    ].join(" "),
    ...evidenceFixture.records.map(formatEvidenceRecordMetadataLine),
    [
      "INFO Grillpoint contract:",
      `reportId=${grillpointReport.reportId};`,
      `rawInput=${grillpointReport.generatedFrom.rawInputPath};`,
      `outcome=${grillpointReport.outcome};`,
      `claimReadiness=${grillpointReport.claimReadiness};`,
      `productCopyReady=${grillpointReport.productCopyReady};`,
      `blockedContracts=${Object.keys(grillpointReport.missingEvidenceContract).join(",")}.`,
    ].join(" "),
  ];
}

function formatEvidenceRecordMetadataLine(record) {
  const blockers = collectPromotionBlockers(record.promotionGates).map((blocker) => `${blocker.claim}:${blocker.status}`);
  return [
    "INFO evidence record:",
    `id=${record.id};`,
    `targets=${record.targetIds.join(",")};`,
    `sourceRecords=${record.sourceRecordIds.join(",")};`,
    `sourceType=${record.sourceType};`,
    `usageStatus=${record.usageStatus};`,
    `evidenceStrength=${record.evidenceStrength};`,
    `claimReadiness=${record.claimReadiness};`,
    `blockers=${blockers.length ? blockers.join(",") : "none"}.`,
  ].join(" ");
}

function runNegativeContractGuardrailSelfTest(report) {
  const guardrail = "exact facade";
  const scenarios = [
    {
      label: `removing "${guardrail}"`,
      mutate(mutatedReport) {
        mutatedReport.missingEvidenceContract.storefrontFacade.mustNotClaim =
          mutatedReport.missingEvidenceContract.storefrontFacade.mustNotClaim.filter((item) => item !== guardrail);
      },
      expectedFailure: `Grillpoint missingEvidenceContract.storefrontFacade.mustNotClaim is missing "${guardrail}"`,
    },
    {
      label: "unsupported product_copy_ready promotion",
      mutate(mutatedReport) {
        mutatedReport.claimReadiness = "product_copy_ready";
        mutatedReport.productCopyReady = true;
        mutatedReport.promotionReadinessContract.currentReadinessState.claimReadiness = "product_copy_ready";
        mutatedReport.promotionReadinessContract.currentReadinessState.productCopyReady = true;
      },
      expectedFailure: "Grillpoint product_copy_ready is blocked by non-allowed promotion gates: storefrontFacade=blocked, entranceFrontageGeometry=blocked",
    },
    {
      label: "unsupported storefrontFacade gate promotion",
      mutate(mutatedReport) {
        mutatedReport.currentPromotionGates.storefrontFacade.status = "allowed";
      },
      expectedFailure: "Grillpoint currentPromotionGates.storefrontFacade cannot be allowed while missingEvidenceContract.storefrontFacade is currently unsatisfied",
    },
  ];

  for (const scenario of scenarios) {
    const mutatedReport = JSON.parse(JSON.stringify(report));
    scenario.mutate(mutatedReport);
    const failures = collectPromotionReadinessReportFailures(mutatedReport);
    if (!failures.includes(scenario.expectedFailure)) {
      console.error(`FAIL negative contract self-test: ${scenario.label} was not rejected as expected.`);
      for (const failure of failures) console.error(`- observed: ${failure}`);
      return false;
    }
  }

  console.log("PASS negative contract self-test: guardrail removal and unsupported promotion attempts were rejected.");
  return true;
}

function collectPromotionReadinessReportFailures(report) {
  const failures = [];
  compareValue(failures, report.schemaVersion, "place-promotion-readiness-report.v0.1", "Grillpoint report schemaVersion");
  compareValue(failures, report.outcome, "partial-promotion-category-only", "Grillpoint report outcome");
  compareValue(failures, report.claimReadiness, "review_only", "Grillpoint report claimReadiness");
  compareValue(failures, report.productCopyReady, false, "Grillpoint report productCopyReady");

  const blockedGateClaims = Object.entries(report.currentPromotionGates)
    .filter(([, gate]) => gate.status === "blocked")
    .map(([claim]) => claim);
  failures.push(...collectPromotionReadinessContractFailures(report, blockedGateClaims));
  failures.push(...collectReadinessTransitionFailures(report));
  compareArray(
    failures,
    Object.keys(report.missingEvidenceContract),
    blockedGateClaims,
    "Grillpoint missingEvidenceContract blocked gate keys",
  );

  for (const claim of blockedGateClaims) {
    const gate = report.currentPromotionGates[claim];
    const contract = report.missingEvidenceContract[claim];
    if (!contract) {
      failures.push(`Grillpoint missingEvidenceContract.${claim} is missing`);
      continue;
    }

    compareValue(failures, contract.requiredForGateStatus, "allowed", `Grillpoint missingEvidenceContract.${claim}.requiredForGateStatus`);
    compareValue(failures, contract.currentStatus, gate.status, `Grillpoint missingEvidenceContract.${claim}.currentStatus`);
    compareValue(failures, contract.currentlySatisfied, false, `Grillpoint missingEvidenceContract.${claim}.currentlySatisfied`);
    assertNonEmptyString(failures, contract.promotionBlockedReason, `Grillpoint missingEvidenceContract.${claim}.promotionBlockedReason`);
    assertNonEmptyStringArray(failures, contract.requiredRawInputTypes, `Grillpoint missingEvidenceContract.${claim}.requiredRawInputTypes`);
    assertNonEmptyStringArray(failures, contract.minimumRawFields, `Grillpoint missingEvidenceContract.${claim}.minimumRawFields`);
    assertNonEmptyStringArray(failures, contract.mustNotClaim, `Grillpoint missingEvidenceContract.${claim}.mustNotClaim`);

    for (const requiredGuardrail of REQUIRED_CONTRACT_MUST_NOT_CLAIMS[claim] ?? []) {
      if (!contract.mustNotClaim.includes(requiredGuardrail)) {
        failures.push(`Grillpoint missingEvidenceContract.${claim}.mustNotClaim is missing "${requiredGuardrail}"`);
      }
    }
  }

  for (const [claim, gate] of Object.entries(report.currentPromotionGates)) {
    const contract = report.missingEvidenceContract[claim];
    if (gate.status === "allowed" && gate.supportingClaimIds.length === 0) {
      failures.push(`Grillpoint currentPromotionGates.${claim} cannot be allowed without supportingClaimIds`);
    }
    if (gate.status === "allowed" && contract?.currentlySatisfied === false) {
      failures.push(`Grillpoint currentPromotionGates.${claim} cannot be allowed while missingEvidenceContract.${claim} is currently unsatisfied`);
    }
  }

  return failures;
}

function collectPromotionReadinessContractFailures(report, blockedGateClaims) {
  const failures = [];
  const contract = report.promotionReadinessContract;
  if (!contract || typeof contract !== "object") {
    failures.push("Grillpoint promotionReadinessContract is missing");
    return failures;
  }

  compareValue(failures, contract.contractId, "grillpoint-deli.phase-2u.promotion-readiness-contract", "Grillpoint promotionReadinessContract.contractId");
  compareValue(failures, contract.status, "review-only-local-contract", "Grillpoint promotionReadinessContract.status");
  compareValue(failures, contract.appliesToEvidenceRecordId, report.evidenceRecordId, "Grillpoint promotionReadinessContract.appliesToEvidenceRecordId");
  compareValue(failures, contract.productCopyReadyRequires.claimReadiness, "product_copy_ready", "Grillpoint promotionReadinessContract.productCopyReadyRequires.claimReadiness");
  compareValue(failures, contract.productCopyReadyRequires.allPromotionGateStatuses, "allowed", "Grillpoint promotionReadinessContract.productCopyReadyRequires.allPromotionGateStatuses");
  compareArray(
    failures,
    contract.productCopyReadyRequires.requiredPromotionGates,
    PROMOTION_CLAIM_KEYS,
    "Grillpoint promotionReadinessContract.productCopyReadyRequires.requiredPromotionGates",
  );
  compareValue(failures, contract.gatePromotionRequires.supportingClaimIds, "non-empty", "Grillpoint promotionReadinessContract.gatePromotionRequires.supportingClaimIds");
  compareValue(failures, contract.gatePromotionRequires.missingEvidenceContractSatisfied, true, "Grillpoint promotionReadinessContract.gatePromotionRequires.missingEvidenceContractSatisfied");
  compareValue(failures, contract.gatePromotionRequires.approvedRawEvidenceInput, true, "Grillpoint promotionReadinessContract.gatePromotionRequires.approvedRawEvidenceInput");
  compareValue(failures, contract.gatePromotionRequires.localVerifierPass, true, "Grillpoint promotionReadinessContract.gatePromotionRequires.localVerifierPass");
  compareValue(failures, contract.blockedOrReviewOnlyGateRequires.missingEvidenceContractEntry, true, "Grillpoint promotionReadinessContract.blockedOrReviewOnlyGateRequires.missingEvidenceContractEntry");
  compareValue(failures, contract.blockedOrReviewOnlyGateRequires.currentStatusNotAllowed, true, "Grillpoint promotionReadinessContract.blockedOrReviewOnlyGateRequires.currentStatusNotAllowed");
  compareValue(failures, contract.blockedOrReviewOnlyGateRequires.mustNotClaimGuardrails, "non-empty", "Grillpoint promotionReadinessContract.blockedOrReviewOnlyGateRequires.mustNotClaimGuardrails");
  compareArray(
    failures,
    contract.currentBlockedPromotionGates,
    blockedGateClaims,
    "Grillpoint promotionReadinessContract.currentBlockedPromotionGates",
  );
  compareValue(failures, contract.currentReadinessState.claimReadiness, report.claimReadiness, "Grillpoint promotionReadinessContract.currentReadinessState.claimReadiness");
  compareValue(failures, contract.currentReadinessState.productCopyReady, report.productCopyReady, "Grillpoint promotionReadinessContract.currentReadinessState.productCopyReady");
  assertNonEmptyString(failures, contract.currentReadinessState.reason, "Grillpoint promotionReadinessContract.currentReadinessState.reason");
  compareArray(
    failures,
    contract.localVerifierMustReject,
    REQUIRED_LOCAL_VERIFIER_REJECTIONS,
    "Grillpoint promotionReadinessContract.localVerifierMustReject",
  );

  return failures;
}

function collectReadinessTransitionFailures(report) {
  const failures = [];
  if (report.productCopyReady === true && report.claimReadiness !== "product_copy_ready") {
    failures.push("Grillpoint productCopyReady cannot be true unless claimReadiness is product_copy_ready");
  }

  if (report.productCopyReady !== true && report.claimReadiness !== "product_copy_ready") return failures;

  const blockedGates = PROMOTION_CLAIM_KEYS
    .filter((claim) => report.currentPromotionGates[claim].status !== "allowed")
    .map((claim) => `${claim}=${report.currentPromotionGates[claim].status}`);
  if (blockedGates.length) {
    failures.push(`Grillpoint product_copy_ready is blocked by non-allowed promotion gates: ${blockedGates.join(", ")}`);
  }

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

function assertNonEmptyStringArray(failures, value, label) {
  if (!Array.isArray(value) || !value.length) {
    failures.push(`${label} must be a non-empty array`);
    return;
  }
  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) failures.push(`${label} contains a non-string or empty item`);
  }
}

function assertNonEmptyString(failures, value, label) {
  if (typeof value !== "string" || !value.trim()) failures.push(`${label} must be a non-empty string`);
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
