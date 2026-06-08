#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylePath = "src/styles.css";
const expansionPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";

const requiredRuntimeSnippets = [
  "qaScaffoldPreviewSeedAdapter",
  "qaScaffoldPreviewExpansionFixture",
  "buildQAScaffoldPreviewRenderRecords(qaScaffoldPreviewExpansionFixture, qaScaffoldPreviewSeedAdapter)",
  "filterQAScaffoldPreviewRecords(qaScaffoldPreviewRecords, qaScaffoldFamilyVisibility)",
  "buildQAScaffoldPreviewRuntimeAdapter(qaScaffoldPreviewExpansionFixture, visibleQAScaffoldPreviewRecords)",
  "QA scaffold family filters",
  "onToggleQAScaffoldFamily",
  "visibleQaOnlyRecordCount",
  "formatQAScaffoldFamilyVisibility",
  "4O-19 family controls",
  "child.visible = qaEnabled;",
  "QA mode required for 4O scaffold preview records.",
];

const requiredStyleSnippets = [
  ".phase4b-qa-filter-row",
  ".phase4b-qa-filter-row button[aria-pressed=\"true\"]",
  "pointer-events: auto;",
];

const forbiddenSnippets = [
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
  const expansion = JSON.parse(await readFile(resolve(repoRoot, expansionPath), "utf8"));

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing 4O-19 controls snippet: ${snippet}`);
  }

  for (const snippet of requiredStyleSnippets) {
    if (!styles.includes(snippet)) failures.push(`Styles missing 4O-19 snippet: ${snippet}`);
  }

  for (const snippet of forbiddenSnippets) {
    if (runtime.includes(snippet) || styles.includes(snippet)) failures.push(`Forbidden runtime/style snippet appears: ${snippet}`);
  }

  for (const family of ["container", "grounding", "height"]) {
    if (expansion.familyVisibilityDefaults?.[family] !== true) failures.push(`familyVisibilityDefaults.${family} must default true`);
    if (!runtime.includes(`"${family}"`)) failures.push(`Runtime missing family literal ${family}`);
  }

  if (!runtime.includes("qaEnabled ? `${totals.scaffoldPreviewVisible} visible / ${totals.scaffoldPreviewRendered} QA / ${totals.scaffoldPreviewNormalMode} normal` : \"QA off\"")) {
    failures.push("Review panel must expose visible / total / normal scaffold counts");
  }

  if (!runtime.includes("inspectedQAScaffoldPreviewRecords={qaEnabled ? inspectedQAScaffoldPreviewRecords : []}")) {
    failures.push("Inspector scaffold records must remain gated by QA mode");
  }

  if (!runtime.includes("visibleQAScaffoldPreviewRecords")) {
    failures.push("Runtime must derive visible QA scaffold records from family filters");
  }

  if (failures.length > 0) {
    console.error("4O-19 QA scaffold preview controls verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4O-19 QA scaffold family controls are QA-only and normal mode remains protected`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
