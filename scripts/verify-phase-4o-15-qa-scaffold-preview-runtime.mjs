#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylePath = "src/styles.css";
const adapterPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
const mappingPath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-13-existing-render-compatibility-mapping.v0.1.json";
const candidatePath = "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json";

const requiredRuntimeSnippets = [
  "import qaScaffoldPreviewSeedAdapter from \"./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json\";",
  "import qaScaffoldPreviewExpansionFixture from \"./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json\";",
  "const qaScaffoldPreviewIndex = useMemo(() => buildQAScaffoldPreviewIndex(qaScaffoldPreviewAdapter), [qaScaffoldPreviewAdapter]);",
  "addRuntimeObjects(scene, runtimeScene, facadeCueIndex, qaFacadeSliceIndex, evidenceFacadeCueIndex, corridorFacadeCueIndex, qaScaffoldPreviewIndex",
  "addQAScaffoldGroundingPreview(scene, runtimeScene, qaScaffoldPreviewAdapter.renderRecords, visualObjects);",
  "createQAScaffoldPreviewLayer(object, qaScaffoldPreviewRecords)",
  "child.userData.stateRole === \"qaScaffoldPreview\"",
  "QA scaffold preview",
  "exact height",
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
  const adapter = JSON.parse(await readFile(resolve(repoRoot, adapterPath), "utf8"));
  const mapping = JSON.parse(await readFile(resolve(repoRoot, mappingPath), "utf8"));
  const candidates = JSON.parse(await readFile(resolve(repoRoot, candidatePath), "utf8"));

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing required snippet: ${snippet}`);
  }
  if (!runtime.includes("child.visible = qaEnabled;") && !runtime.includes("child.visible = qaEnabled && qaLayerVisible;")) {
    failures.push("Runtime missing QA-only visibility toggle");
  }
  const originalRuntimeValid = runtime.includes("4O-15 QA scaffold preview");
  const laterRuntimeValid = runtime.includes("4O scaffold previews with 4O-19 family controls");
  if (!originalRuntimeValid && !laterRuntimeValid) {
    failures.push("Runtime must preserve original 4O-15 label or later 4O QA review label");
  }

  if (!styles.includes(".phase4b-swatch-scaffold-preview")) failures.push("Styles missing QA scaffold preview swatch");

  for (const snippet of forbiddenRuntimeSnippets) {
    if (runtime.includes(snippet)) failures.push(`Forbidden runtime snippet appears: ${snippet}`);
  }

  if (adapter.qaOnly !== true || adapter.reviewOnly !== true) failures.push("Adapter must remain QA-only and review-only");
  if (adapter.normalModeExposure !== "blocked") failures.push("Adapter normalModeExposure must remain blocked");
  if (adapter.summary.normalModeRecordCount !== 0) failures.push("Adapter must have zero normal-mode records");
  if (adapter.summary.publicInterfaceCount !== 0) failures.push("Adapter must have zero public-interface records");
  if (adapter.summary.moduleBoundaryChangeCount !== 0) failures.push("Adapter must have zero module-boundary changes");
  if (adapter.summary.renderedQaOnlyRecordCount !== adapter.renderRecords.length) failures.push("All adapter records must render only in QA mode");

  const candidateIds = new Set(candidates.candidateRecordOrder ?? []);
  const adapterCandidateIds = new Set((adapter.renderRecords ?? []).map((record) => record.derivedFromCandidateId));
  for (const candidateId of candidateIds) {
    if (!adapterCandidateIds.has(candidateId)) failures.push(`Runtime adapter missing candidate trace: ${candidateId}`);
  }

  const mappingIds = new Set((mapping.mappingRecords ?? []).map((record) => record.mappingId));
  for (const record of adapter.renderRecords ?? []) {
    if (!mappingIds.has(record.derivedFromMappingId)) failures.push(`${record.recordId} missing mapping trace`);
    if (record.renderStatus !== "rendered_qa_only_candidate_placeholder") failures.push(`${record.recordId} must remain a QA-only placeholder`);
    if (record.normalModeExposure !== "blocked") failures.push(`${record.recordId} must block normal mode`);
  }

  if (failures.length > 0) {
    console.error("4O-15 QA scaffold preview runtime verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4O scaffold preview renders through QA-only adapter records and preserves normal mode`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
