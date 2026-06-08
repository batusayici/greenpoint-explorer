#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const stylePath = "src/styles.css";
const fixturePath = "src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json";

const requiredRuntimeSnippets = [
  "import corridorFacadeCueFixture from \"./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json\";",
  "const corridorFacadeCueIndex = useMemo(() => buildCorridorFacadeCueIndex(corridorFacadeCueFixture), []);",
  "createCorridorFacadeCueLayer(object, facadeCue, corridorFacadeCue)",
  "child.userData.stateRole === \"corridorFacadeCue\"",
  "const placeholderWidthScale = 0.52;",
  "opacity: 0.075",
  "4I Corridor Facade Cue",
  "QA-only; no storefront, business, exact facade, normal-mode, or production claim",
];

const runtimeHeaderSnippets = [
  "Batch 4I-4 / corridor cue legibility correction",
  "Batch 4K-2 / QA recognizable anchor overlay",
];

const forbiddenRuntimeSnippets = [
  "Batch 4E-5 / opaque endpoint facade volumes",
  "normalModeExposure: \"enabled\"",
  "normalModeUse: \"rendered\"",
  "canAffectNormalRuntime: true",
  "canConnectBusinessIdentity: true",
  "canCreateAuthoritativeStorefrontAnchors: true",
  "canClaimExactFrontage: true",
  "canCreateProductionAssets: true",
];

async function main() {
  const failures = [];
  const runtime = await readFile(resolve(repoRoot, runtimePath), "utf8");
  const styles = await readFile(resolve(repoRoot, stylePath), "utf8");
  const fixture = JSON.parse(await readFile(resolve(repoRoot, fixturePath), "utf8"));

  for (const snippet of requiredRuntimeSnippets) {
    if (!runtime.includes(snippet)) failures.push(`Runtime missing required snippet: ${snippet}`);
  }

  if (!runtimeHeaderSnippets.some((snippet) => runtime.includes(snippet))) {
    failures.push("Runtime missing either the original 4I header or a later approved runtime header");
  }

  if (!styles.includes(".phase4b-swatch-corridor-facade")) {
    failures.push("Styles missing 4I corridor facade swatch");
  }

  for (const snippet of forbiddenRuntimeSnippets) {
    if (runtime.includes(snippet) || JSON.stringify(fixture).includes(snippet)) {
      failures.push(`Forbidden runtime/fixture snippet appears: ${snippet}`);
    }
  }

  if (fixture.reviewOnly !== true || fixture.qaOnly !== true) failures.push("4I fixture must remain review-only and QA-only");
  if (fixture.normalModeExposure !== "blocked") failures.push("4I fixture normalModeExposure must remain blocked");
  if (fixture.productionUsePolicy !== "blocked") failures.push("4I fixture productionUsePolicy must remain blocked");
  if (fixture.summary.endpointEvidenceBackedRecordCount !== 6) failures.push("4I fixture must preserve six endpoint evidence-backed records");
  if (fixture.summary.midCorridorInsufficientEvidenceRecordCount < 24) failures.push("4I fixture must include mid-corridor insufficient-evidence coverage");
  if (fixture.summary.blockedNoEvidenceGapRecordCount < 1) failures.push("4I fixture must keep blocked/no-evidence gaps visible");
  if (fixture.summary.normalModeRecordCount !== 0) failures.push("4I fixture must have zero normal-mode records");
  if (fixture.summary.productionRecordCount !== 0) failures.push("4I fixture must have zero production records");
  if (fixture.summary.businessLinkageRecordCount !== 0) failures.push("4I fixture must have zero business-linkage records");
  if (fixture.summary.exactClaimRecordCount !== 0) failures.push("4I fixture must have zero exact-claim records");

  if (failures.length > 0) {
    console.error("4I QA runtime legibility verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${runtimePath}: 4I corridor facade cue layer is QA-only and normal mode remains protected`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
