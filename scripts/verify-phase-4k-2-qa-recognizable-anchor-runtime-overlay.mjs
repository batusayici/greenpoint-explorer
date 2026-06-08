#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylePath = "src/styles.css";
const cuePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
const reportPath = "docs/reports/phase-4k-2-qa-recognizable-anchor-runtime-overlay.md";
const briefPath = "docs/CURRENT_EXECUTION_BRIEF.md";

const allowedCueCategories = [
  "corner_composition_cue",
  "sidewalk_street_cue",
  "subway_or_street_furniture_cue",
  "facade_rhythm_cue",
  "material_color_family_cue",
  "massing_silhouette_cue",
  "frontage_density_cue",
];

const requiredRuntimeSnippets = [
  "qaRecognizableAnchorCueFixture",
  "buildQARecognizableAnchorCueRenderRecords(qaRecognizableAnchorCueFixture, qaScaffoldPreviewExpansionFixture, qaFrontageCandidateFixture)",
  "filterQARecognizableAnchorCueRecords(qaRecognizableAnchorCueRecords, qaRecognizableCueCategoryVisibility)",
  "buildQARecognizableAnchorCueRuntimeAdapter(qaRecognizableAnchorCueFixture, visibleQARecognizableAnchorCueRecords)",
  "buildQARecognizableAnchorCueIndex(qaRecognizableAnchorCueAdapter)",
  "createQARecognizableAnchorCueLayer(object, qaRecognizableAnchorCueRecords)",
  "QA recognizable anchor cue category filters",
  "inspectedQARecognizableAnchorCueRecords={qaEnabled ? inspectedQARecognizableAnchorCueRecords : []}",
  "QA mode required for 4K recognizable anchor cue records.",
  "child.userData.stateRole === \"qaRecognizableAnchorCue\"",
  "child.userData.stateRole === \"qaRecognizableAnchorCueLabel\"",
  "child.visible = qaEnabled;",
  "4K cues: {qaRecognizableAnchorCueAdapter.summary.visibleQaOnlyRecordCount} visible / {qaRecognizableAnchorCueAdapter.summary.cueRecordCount} QA / {qaRecognizableAnchorCueAdapter.summary.normalModeRecordCount} normal",
];

const requiredStyleSnippets = [
  ".phase4b-swatch-recognizable-anchor",
  ".phase4b-side-recognizable-anchor",
  "#ffd36f",
  "#96c6b8",
  "#86a8ff",
  "#a7d879",
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
  "sourceUrl",
  "imageUrl",
];

async function main() {
  const failures = [];
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const styles = await readFile(resolve(repoRoot, stylePath), "utf8");
  const fixture = JSON.parse(await readFile(resolve(repoRoot, cuePath), "utf8"));
  const report = await readFile(resolve(repoRoot, reportPath), "utf8").catch(() => "");
  const brief = await readFile(resolve(repoRoot, briefPath), "utf8");

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4K-2 snippet: ${snippet}`);
  }

  for (const snippet of requiredStyleSnippets) {
    if (!styles.includes(snippet)) failures.push(`Styles missing 4K-2 snippet: ${snippet}`);
  }

  for (const snippet of forbiddenRuntimeSnippets) {
    if (runtime.includes(snippet) || styles.includes(snippet)) failures.push(`Forbidden runtime/style snippet appears: ${snippet}`);
  }

  for (const cueCategory of allowedCueCategories) {
    if (!fixture.cueCategoryAllowlist.includes(cueCategory)) failures.push(`Fixture missing allowed cue category ${cueCategory}`);
    if (!runtime.includes(`"${cueCategory}"`)) failures.push(`Runtime missing cue category literal ${cueCategory}`);
  }

  for (const record of fixture.cueRecords) {
    if (record.nonPromotionFlag !== true) failures.push(`${record.cueId} must remain non-promoted`);
    if (record.qaOnlyStatus !== "not_verified") failures.push(`${record.cueId} must remain not_verified`);
    if (!allowedCueCategories.includes(record.cueCategory)) failures.push(`${record.cueId} uses disallowed cue category`);
    for (const blocked of ["business", "tenant", "storefront", "facade", "sign", "entrance", "exact_address", "exact_frontage", "exact_height", "roof", "production", "public"]) {
      if (!record.blockedClaimCategories.includes(blocked)) failures.push(`${record.cueId} missing blocked category ${blocked}`);
    }
  }

  if (fixture.summary.normalModeRecordCount !== 0) failures.push("4K fixture must keep zero normal-mode records");
  if (fixture.summary.nonPromotedRecordCount !== fixture.summary.cueRecordCount) failures.push("4K fixture must keep all records non-promoted");
  if (fixture.summary.businessLinkCount !== 0) failures.push("4K fixture must keep zero business links");
  if (fixture.summary.exactClaimRecordCount !== 0) failures.push("4K fixture must keep zero exact claim records");
  if (fixture.summary.publicClaimRecordCount !== 0) failures.push("4K fixture must keep zero public claim records");
  if (fixture.summary.productionClaimRecordCount !== 0) failures.push("4K fixture must keep zero production claim records");

  verifyReport(report, failures);
  verifyBrief(brief, failures);

  if (failures.length > 0) {
    console.error("4K-2 QA recognizable anchor runtime overlay verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4K QA recognizable anchor overlay is QA-only with allowed cue-category filters and blocked claims intact`);
}

function verifyReport(report, failures) {
  const requiredSnippets = [
    "4K-2 QA runtime recognizable anchor overlay complete",
    "18 QA-only cue records",
    "4K cues: 18 visible / 18 QA / 0 normal",
    "cue category filters",
    "No normal-mode exposure occurred.",
    "No business, tenant, exact storefront, exact frontage, exact facade, sign, entrance, exact address, exact height, roof, production, public, or product claim was added.",
    "Ready for 4K-3 recognizability review only.",
  ];
  for (const snippet of requiredSnippets) {
    if (!report.includes(snippet)) failures.push(`4K-2 report missing snippet: ${snippet}`);
  }
}

function verifyBrief(brief, failures) {
  const originalHandoffSnippets = [
    "Current Execution Brief - Phase 4K-3 Open",
    "4K-2 is complete and verified.",
    "Current executable batch: `Batch 4K-3: Local Recognizability Review Pack`.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop after 4K-3.",
  ];
  const laterPhaseSnippets = [
    "Current Execution Brief - Phase 4K Complete At Review Gate",
    "4K-1 is complete and verified.",
    "4K-2 is complete and verified.",
    "4K-3 is complete and verified.",
    "Current executable batch: none.",
    "Pre-authorized queue: none.",
    "Hard Batu gate: stop.",
  ];

  const originalHandoffValid = originalHandoffSnippets.every((snippet) => brief.includes(snippet));
  const laterPhaseValid = laterPhaseSnippets.every((snippet) => brief.includes(snippet));
  if (!originalHandoffValid && !laterPhaseValid) {
    failures.push("Current brief must either preserve the 4K-2 -> 4K-3 handoff or record final 4K completion without promotion");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
