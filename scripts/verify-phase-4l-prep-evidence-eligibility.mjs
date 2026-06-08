#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractPath = "src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-prep-qa-evidence-eligibility-contract.v0.1.json";
const planPath = "docs/phase-4l-prep-evidence-gap-to-cue-intake-plan.md";
const notePath = "docs/phase-4l-prep-qa-evidence-eligibility-contract.md";
const reportPath = "docs/reports/phase-4l-prep-review-gate-report.md";
const cuePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
const kReviewPath = "docs/reports/phase-4k-3-local-recognizability-review-pack.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const requiredCueCategories = [
  "corner_composition_cue",
  "sidewalk_street_cue",
  "subway_or_street_furniture_cue",
  "facade_rhythm_cue",
  "material_color_family_cue",
  "massing_silhouette_cue",
  "frontage_density_cue",
];

const required4KGaps = [
  "missing_mid_corridor_facade_evidence",
  "weak_corner_wrap_recognition",
  "weak_material_color_specificity",
  "weak_storefront_rhythm_specificity",
  "missing_street_furniture_evidence",
  "missing_subway_entrance_specificity",
  "missing_business_source_linkage",
  "insufficient_local_landmark_signal",
];

const requiredEvidenceNeeds = [
  "mid_corridor_facade_evidence",
  "side_return_corner_wrap_recognition",
  "facade_depth_setback_specificity",
  "material_color_specificity",
  "storefront_rhythm_specificity",
  "street_furniture_sidewalk_grounding",
  "subway_entrance_specificity",
  "distinct_evidence_records_per_facade_cue",
];

const allowedChangedPathPrefixes = [
  "docs/CURRENT_EXECUTION_BRIEF.md",
  "docs/MVP_EXECUTION_LEDGER.md",
  "docs/PLAN.md",
  "docs/phase-4-execution-roadmap.md",
  "docs/phase-4l-prep-evidence-gap-to-cue-intake-plan.md",
  "docs/phase-4l-prep-qa-evidence-eligibility-contract.md",
  "docs/reports/phase-4l-prep-review-gate-report.md",
  "scripts/verify-phase-4j-1-qa-frontage-candidates.mjs",
  "scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs",
  "scripts/verify-phase-4j-3-candidate-readiness-report.mjs",
  "scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs",
  "scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs",
  "scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs",
  "scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs",
  "scripts/verify-phase-4l-prep-evidence-eligibility.mjs",
  contractPath,
];

const forbiddenChangedPathParts = [
  "docs/mvp-reference-images/",
  "src/data/facade-evidence/",
  "src/data/facade-evidence-intake/",
  "src/data/source-audits/",
  "src/data/candidate-pois/",
  "src/data/business",
  "src/data/poi",
];

const forbiddenSnippets = [
  "evidence intake started",
  "external source accessed",
  "downloaded evidence",
  "business/source linkage started",
  "normal mode enabled",
  "ready for evidence-backed 4l qa corridor render",
  "readyForEvidenceBacked4LQACorridorRender\": true",
  "approved_evidence_backed",
  "businessName",
  "tenantName",
  "signText",
  "poiId",
  "sourceUrl",
  "imageUrl",
  "filePath",
  "publicRoute",
];

async function main() {
  const failures = [];
  const contractText = await readFile(resolve(repoRoot, contractPath), "utf8");
  const contract = JSON.parse(contractText);
  const plan = await readFile(resolve(repoRoot, planPath), "utf8");
  const note = await readFile(resolve(repoRoot, notePath), "utf8");
  const report = await readFile(resolve(repoRoot, reportPath), "utf8");
  const kReview = await readFile(resolve(repoRoot, kReviewPath), "utf8");
  const cues = JSON.parse(await readFile(resolve(repoRoot, cuePath), "utf8"));
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  assertEqual(contract.schemaVersion, "phase-4l-prep-qa-evidence-eligibility-contract.v0.1", "schemaVersion", failures);
  assertEqual(contract.phase, "4L-Prep", "phase", failures);
  assertEqual(contract.reviewOnly, true, "reviewOnly", failures);
  assertEqual(contract.planningOnly, true, "planningOnly", failures);
  assertEqual(contract.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(contract.runtimeRenderChange, "blocked_none", "runtimeRenderChange", failures);
  assertEqual(contract.claimPromotion, "blocked_none", "claimPromotion", failures);
  assertEqual(contract.derivedFrom4KFixturePath, cuePath, "derivedFrom4KFixturePath", failures);
  assertEqual(contract.derivedFrom4KReviewPath, kReviewPath, "derivedFrom4KReviewPath", failures);

  for (const [field, expected] of Object.entries({
    evidenceFilesIngested: false,
    externalSourcesAccessed: false,
    externalDataFetched: false,
    externalDataDownloaded: false,
    externalDataCached: false,
    externalDataIngested: false,
    externalDataConverted: false,
    externalImageryAccessed: false,
    sourceRecordsLinked: false,
    businessTenantSignPoiLinked: false,
    normalModeExposureAdded: false,
    qaCuePromotionAdded: false,
    runtimeRenderPromotionAdded: false,
  })) {
    assertEqual(contract.sourceAccessPolicy?.[field], expected, `sourceAccessPolicy.${field}`, failures);
  }

  assertArraySetEquals(contract.evidenceNeedCategories, requiredEvidenceNeeds, "evidenceNeedCategories", failures);
  assertArraySetEquals(cues.cueCategoryAllowlist, requiredCueCategories, "4K cueCategoryAllowlist", failures);

  const criteriaByCue = new Map((contract.cueEligibilityCriteria ?? []).map((criteria) => [criteria.cueCategory, criteria]));
  for (const cueCategory of requiredCueCategories) {
    const criteria = criteriaByCue.get(cueCategory);
    if (!criteria) {
      failures.push(`Missing eligibility criteria for cue category ${cueCategory}`);
      continue;
    }
    for (const field of ["eligibleState", "insufficientState", "blockedState"]) {
      if (typeof criteria[field] !== "string" || !criteria[field]) failures.push(`${cueCategory} missing ${field}`);
    }
    if (!Array.isArray(criteria.requiredEvidenceTypes) || criteria.requiredEvidenceTypes.length === 0) failures.push(`${cueCategory} must require evidence types`);
    for (const need of criteria.requiredEvidenceTypes ?? []) {
      if (!requiredEvidenceNeeds.includes(need)) failures.push(`${cueCategory} uses unknown evidence need ${need}`);
    }
  }

  const gapMap = new Map((contract.current4KGapToEvidenceNeedMap ?? []).map((entry) => [entry.gapCategory, entry]));
  for (const gap of required4KGaps) {
    if (!kReview.includes(`\`${gap}\``)) failures.push(`4K review report no longer includes expected gap ${gap}`);
    const entry = gapMap.get(gap);
    if (!entry) {
      failures.push(`Missing evidence-need mapping for 4K gap ${gap}`);
      continue;
    }
    if (!Array.isArray(entry.requiredEvidenceTypes) || entry.requiredEvidenceTypes.length === 0) failures.push(`${gap} must map to at least one evidence need`);
    for (const need of entry.requiredEvidenceTypes ?? []) {
      if (!requiredEvidenceNeeds.includes(need)) failures.push(`${gap} maps to unknown evidence need ${need}`);
    }
  }

  assertEqual(contract.reviewGateDecision?.readyForEvidenceBacked4LQACorridorRender, false, "reviewGateDecision.readyForEvidenceBacked4LQACorridorRender", failures);
  assertEqual(contract.reviewGateDecision?.decision, "not_ready", "reviewGateDecision.decision", failures);
  if (!Array.isArray(contract.reviewGateDecision?.missingEvidenceBatuWouldNeedToSupplyOrApprove) || contract.reviewGateDecision.missingEvidenceBatuWouldNeedToSupplyOrApprove.length < 8) {
    failures.push("Review gate must list exact missing evidence Batu would need to supply or approve");
  }

  verifySummary(contract, failures);
  verifyDocs(plan, note, report, failures);
  verifyForbiddenText(`${contractText}\n${plan}\n${note}\n${report}`, failures);
  verifyChangedPaths(failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4L-Prep evidence eligibility verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${contractPath}: 4L-Prep maps 4K gaps to cue evidence eligibility without intake, source access, linkage, promotion, or normal-mode exposure`);
}

function verifySummary(contract, failures) {
  const expected = {
    cueCategoryCount: requiredCueCategories.length,
    gapCategoryCount: required4KGaps.length,
    evidenceNeedCategoryCount: requiredEvidenceNeeds.length,
    eligibleStateCount: requiredCueCategories.length,
    insufficientStateCount: requiredCueCategories.length,
    blockedStateCount: requiredCueCategories.length,
    evidenceFilesIngestedCount: 0,
    externalSourceAccessCount: 0,
    downloadCount: 0,
    businessTenantSignPoiLinkCount: 0,
    qaCuePromotionCount: 0,
    normalModeExposureCount: 0,
    readyFor4LRenderCount: 0,
  };
  for (const [key, value] of Object.entries(expected)) {
    assertEqual(contract.summary?.[key], value, `summary.${key}`, failures);
  }
}

function verifyDocs(plan, note, report, failures) {
  const requiredSnippets = [
    "What evidence is needed before the 4K QA recognizability cues can become evidence-backed facade/corridor cues?",
    "does not ingest evidence",
    "Future external source candidates",
    "Not ready for evidence-backed 4L QA corridor render",
    "No evidence files were ingested.",
    "No external sources were accessed.",
    "No downloads, cache, ingestion, or conversion occurred.",
    "No business, tenant, sign, POI, or source-record linkage was introduced.",
    "No QA cues were promoted to factual claims.",
    "No normal-mode exposure was added.",
    "Stop here for Batu review.",
  ];
  const combined = `${plan}\n${note}\n${report}`;
  for (const snippet of requiredSnippets) {
    if (!combined.includes(snippet)) failures.push(`Docs missing required 4L-Prep snippet: ${snippet}`);
  }
}

function verifyForbiddenText(text, failures) {
  for (const snippet of forbiddenSnippets) {
    if (text.includes(snippet)) failures.push(`Forbidden 4L-Prep snippet appears: ${snippet}`);
  }
}

function verifyChangedPaths(failures) {
  let changed = [];
  try {
    const output = execFileSync("git", ["status", "--short", "--untracked-files=all"], { cwd: repoRoot, encoding: "utf8" });
    changed = output
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3).trim())
      .map((line) => line.replace(/^"|"$/g, ""));
  } catch {
    changed = [];
  }

  for (const changedPath of changed) {
    if (forbiddenChangedPathParts.some((part) => changedPath.includes(part))) {
      failures.push(`4L-Prep must not change evidence/source/business data path: ${changedPath}`);
    }
    if (!allowedChangedPathPrefixes.includes(changedPath)) {
      failures.push(`Unexpected changed path for bounded 4L-Prep packet: ${changedPath}`);
    }
  }
}

function verifyBrief(brief, failures) {
  const requiredSnippets = [
    "Current Execution Brief - Phase 4L-Prep Complete At Review Gate",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
    "4L-Prep did not start evidence intake, external source access, downloads, business/source linkage, normal-mode exposure, runtime render promotion, 4L render implementation, 4M, 4P, or claim promotion.",
  ];
  for (const snippet of requiredSnippets) {
    if (!brief.includes(snippet)) failures.push(`Current brief missing 4L-Prep gate snippet: ${snippet}`);
  }
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function assertArraySetEquals(actual, expected, label, failures) {
  if (!Array.isArray(actual)) {
    failures.push(`${label} must be an array`);
    return;
  }
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(`${label} expected ${JSON.stringify(expectedSorted)} but got ${JSON.stringify(actualSorted)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
