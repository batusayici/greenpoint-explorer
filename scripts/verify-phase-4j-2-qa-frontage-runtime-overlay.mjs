#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylePath = "src/styles.css";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json";
const reportPath = "docs/reports/phase-4j-2-qa-frontage-runtime-overlay.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedCandidateTypes = [
  "frontage_band_candidate",
  "bay_rhythm_candidate",
  "corner_wrap_candidate",
  "setback_depth_candidate",
];

const requiredRuntimeSnippets = [
  "qaFrontageCandidateFixture",
  "buildQAFrontageCandidateRenderRecords(qaFrontageCandidateFixture, qaScaffoldPreviewExpansionFixture)",
  "filterQAFrontageCandidateRecords(qaFrontageCandidateRecords, qaFrontageCandidateTypeVisibility)",
  "buildQAFrontageCandidateRuntimeAdapter(qaFrontageCandidateFixture, visibleQAFrontageCandidateRecords)",
  "buildQAFrontageCandidateIndex(qaFrontageCandidateAdapter)",
  "createQAFrontageCandidateLayer(object, qaFrontageCandidateRecords)",
  "QA frontage candidate type filters",
  "inspectedQAFrontageCandidateRecords={qaEnabled ? inspectedQAFrontageCandidateRecords : []}",
  "QA mode required for 4J frontage candidate records.",
  "child.userData.stateRole === \"qaFrontageCandidate\"",
  "child.userData.stateRole === \"qaFrontageCandidateLabel\"",
  "child.visible = qaEnabled;",
  "normal` : \"QA off\"",
];

const requiredStyleSnippets = [
  ".phase4b-swatch-frontage-candidate",
  "#ff8f70",
  "#91e4c3",
  "#9cc8ff",
];

const forbiddenRuntimeSnippets = [
  "normalModeExposure: \"enabled\"",
  "normalModeUse: \"rendered\"",
  "canAffectNormalRuntime: true",
  "canConnectBusinessIdentity: true",
  "canCreateAuthoritativeStorefrontAnchors: true",
  "canClaimExactFrontage: true",
  "canCreateProductionAssets: true",
  "businessName",
  "tenantName",
  "storefrontName",
  "signText",
  "exactAddress",
  "exactEntrance",
  "publicRoute",
];

async function main() {
  const failures = [];
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const styles = await readFile(resolve(repoRoot, stylePath), "utf8");
  const fixture = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4J-2 snippet: ${snippet}`);
  }

  for (const snippet of requiredStyleSnippets) {
    if (!styles.includes(snippet)) failures.push(`Styles missing 4J-2 snippet: ${snippet}`);
  }

  for (const snippet of forbiddenRuntimeSnippets) {
    if (runtime.includes(snippet) || styles.includes(snippet)) failures.push(`Forbidden runtime/style snippet appears: ${snippet}`);
  }

  for (const candidateType of allowedCandidateTypes) {
    if (!fixture.candidateTypeAllowlist.includes(candidateType)) failures.push(`Fixture missing allowed candidate type ${candidateType}`);
    if (!runtime.includes(`"${candidateType}"`)) failures.push(`Runtime missing candidate type literal ${candidateType}`);
  }

  for (const record of fixture.candidateRecords) {
    if (record.nonPromotionFlag !== true) failures.push(`${record.candidateId} must remain non-promoted`);
    if (record.qaOnlyStatus !== "not_verified") failures.push(`${record.candidateId} must remain not_verified`);
    if (!allowedCandidateTypes.includes(record.candidateType)) failures.push(`${record.candidateId} uses disallowed candidate type`);
    for (const blocked of ["business", "tenant", "storefront", "facade", "sign", "entrance", "exact_address", "exact_frontage", "exact_height", "roof", "production", "public"]) {
      if (!record.blockedClaimCategories.includes(blocked)) failures.push(`${record.candidateId} missing blocked category ${blocked}`);
    }
  }

  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4J-2 QA frontage runtime overlay verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4J QA frontage candidate overlay is QA-only with allowed candidate filters and blocked claims intact`);
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4J-2 QA runtime frontage candidate overlay complete",
    "22 QA-only candidate records",
    "4J candidates: 22 visible / 22 QA / 0 normal",
    "candidate type filters",
    "No normal-mode exposure occurred.",
    "No business, tenant, exact storefront, exact frontage, facade, sign, entrance, exact address, exact height, roof, production, public, or product claim was added.",
    "Ready for 4J-3 readiness reporting only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`4J-2 report missing snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const originalHandoffSnippets = [
    "Batch 4J-2: QA Runtime Frontage Candidate Overlay",
    "4J-2 is complete and verified.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];
  const laterPhaseSnippets = [
    "Current Execution Brief - Phase 4K Complete At Review Gate",
    "4J-2 is complete and verified.",
    "4J-3 is complete and verified.",
    "4K-3 is complete and verified.",
    "Current executable batch: none.",
    "Hard Batu gate: stop.",
  ];
  const finalPrepSnippets = [
    "Current Execution Brief - Phase 4L-Prep Complete At Review Gate",
    "4J-2 is complete and verified.",
    "4J-3 is complete and verified.",
    "4K-3 is complete and verified.",
    "4L-Prep is complete and verified.",
    "Current executable batch: none.",
    "Hard Batu gate: stop.",
  ];
  const finalLocalSnippets = [
    "Current Execution Brief - Phase 4L-Local Complete At Review Gate",
    "4J-2 is complete and verified.",
    "4J-3 is complete and verified.",
    "4K-3 is complete and verified.",
    "4L-Prep is complete and verified.",
    "4L-Local-4 is complete and verified.",
    "Current executable batch: none.",
    "Hard Batu gate: stop.",
  ];

  const originalHandoffValid = originalHandoffSnippets.every((snippet) => brief.includes(snippet));
  const laterPhaseValid = laterPhaseSnippets.every((snippet) => brief.includes(snippet));
  const finalPrepValid = finalPrepSnippets.every((snippet) => brief.includes(snippet));
  const finalLocalValid = finalLocalSnippets.every((snippet) => brief.includes(snippet));
  if (!originalHandoffValid && !laterPhaseValid && !finalPrepValid && !finalLocalValid) {
    failures.push("Current brief must either preserve the 4J-2 handoff or record later-phase completion without 4J promotion");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
