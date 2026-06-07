import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import anchorCandidateFixture from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json" with { type: "json" };
import facadeEvidencePacket from "../src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json" with { type: "json" };

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manhattanEvidenceRoot = "docs/mvp-reference-images/greenpoint manhattan corner/";
const franklinEvidenceRoot = "docs/mvp-reference-images/greenpoint franklin  corner/";

main();

function main() {
  const failures = [];
  const records = facadeEvidencePacket.records ?? [];
  const candidates = anchorCandidateFixture.anchorCandidates ?? [];

  validateEvidencePaths(records, failures);
  validateAnchorCandidates(candidates, failures);
  validateMidCorridorBoundary(failures);

  if (failures.length) {
    throw new Error(`Phase 4D-6 corner evidence path/provenance reconciliation failed:\n- ${failures.join("\n- ")}`);
  }

  const counts = countRecordsByScope(records);
  const staleAfter = records.filter((record) => isStaleFlatEvidencePath(record.filePath)).length;
  const staleBefore = facadeEvidencePacket.summary?.pathReconciliation?.staleFlatPathCountBefore4d6 ?? "unknown";
  console.log(
    `Phase 4D-6 corner evidence paths verified (Manhattan=${counts.manhattan_greenpoint}, Franklin=${counts.franklin_greenpoint}, stale paths before=${staleBefore}, after=${staleAfter}).`,
  );
}

function validateEvidencePaths(records, failures) {
  const counts = countRecordsByScope(records);

  if (counts.manhattan_greenpoint !== 11) failures.push(`Expected 11 Manhattan evidence records, found ${counts.manhattan_greenpoint}.`);
  if (counts.franklin_greenpoint !== 11) failures.push(`Expected 11 Franklin evidence records, found ${counts.franklin_greenpoint}.`);
  if (counts.unresolved_unknown !== 0) failures.push(`Expected 0 unresolved evidence records, found ${counts.unresolved_unknown}.`);

  for (const record of records) {
    if (!record.captureProvenanceNotes) failures.push(`${record.evidenceId} is missing provenance notes.`);
    if (!Array.isArray(record.allowedUse) || !record.allowedUse.length) failures.push(`${record.evidenceId} is missing allowed use.`);
    if (!Array.isArray(record.disallowedUse) || !record.disallowedUse.length) failures.push(`${record.evidenceId} is missing disallowed use.`);
    if (!existsSync(resolve(repoRoot, record.filePath))) failures.push(`${record.evidenceId} references a missing repo-local evidence path.`);
    if (isStaleFlatEvidencePath(record.filePath)) failures.push(`${record.evidenceId} references a stale flat evidence path.`);

    if (record.cornerScope?.scopeId === "manhattan_greenpoint" && !record.filePath.startsWith(manhattanEvidenceRoot)) {
      failures.push(`${record.evidenceId} must resolve to the Manhattan corner evidence folder.`);
    }
    if (record.cornerScope?.scopeId === "franklin_greenpoint") {
      if (!record.filePath.startsWith(franklinEvidenceRoot)) {
        failures.push(`${record.evidenceId} must resolve to the Franklin corner evidence folder.`);
      }
      if (record.cornerScope?.notCorridorWideEvidence !== true) {
        failures.push(`${record.evidenceId} must mark Franklin evidence as not corridor-wide.`);
      }
      if (record.associatedCorridorSideOrGeometryContainer?.geometryContainerId !== null) {
        failures.push(`${record.evidenceId} must not link Franklin evidence to a geometry container.`);
      }
    }
  }

  const pathReconciliation = facadeEvidencePacket.summary?.pathReconciliation;
  if (pathReconciliation?.staleFlatPathCountAfter4d6 !== 0) failures.push("Facade evidence packet reports stale paths after 4D-6.");
  if (pathReconciliation?.manhattanEvidenceFolder !== manhattanEvidenceRoot) failures.push("Facade evidence packet reports the wrong Manhattan evidence folder.");
  if (pathReconciliation?.franklinEvidenceFolder !== franklinEvidenceRoot) failures.push("Facade evidence packet reports the wrong Franklin evidence folder.");
}

function validateAnchorCandidates(candidates, failures) {
  const candidateCounts = countCandidatesByScope(candidates);

  if (candidateCounts.manhattan_greenpoint !== 11) failures.push(`Expected 11 Manhattan anchor candidates, found ${candidateCounts.manhattan_greenpoint}.`);
  if (candidateCounts.franklin_greenpoint !== 11) failures.push(`Expected 11 Franklin anchor candidates, found ${candidateCounts.franklin_greenpoint}.`);
  if (anchorCandidateFixture.summary?.blockedCornerScopeCount !== 0) failures.push("Franklin should not remain a blocked missing-evidence corner after 4D-6.");
  if ((anchorCandidateFixture.blockedCornerScopes ?? []).length !== 0) failures.push("No blocked corner-scope records should remain after 4D-6.");

  for (const candidate of candidates) {
    if (candidate.qaOnly !== true) failures.push(`${candidate.anchorCandidateId} must remain QA-only.`);
    if (candidate.normalModeUse !== "not-rendered") failures.push(`${candidate.anchorCandidateId} must stay hidden from normal mode.`);
    if (candidate.associationStatus !== "unresolved") failures.push(`${candidate.anchorCandidateId} must remain unresolved.`);
    if (candidate.candidateGeometryContainerId !== null) failures.push(`${candidate.anchorCandidateId} must not link to a geometry container.`);
    if (candidate.cornerScope === "franklin_greenpoint" && candidate.associationStatus !== "unresolved") {
      failures.push(`${candidate.anchorCandidateId} Franklin candidate must be unresolved.`);
    }
  }
}

function validateMidCorridorBoundary(failures) {
  if (anchorCandidateFixture.geometryCoverage?.mid_corridor?.status !== "blocked_insufficient_evidence") {
    failures.push("Mid-corridor evidence must remain blocked_insufficient_evidence.");
  }
  if (anchorCandidateFixture.summary?.midCorridorAnchorCandidateCount !== 0) {
    failures.push("Mid-corridor anchor candidate count must remain zero.");
  }
}

function countRecordsByScope(records) {
  return {
    manhattan_greenpoint: records.filter((record) => record.cornerScope?.scopeId === "manhattan_greenpoint").length,
    franklin_greenpoint: records.filter((record) => record.cornerScope?.scopeId === "franklin_greenpoint").length,
    unresolved_unknown: records.filter((record) => record.cornerScope?.scopeId === "unresolved_unknown").length,
  };
}

function countCandidatesByScope(candidates) {
  return {
    manhattan_greenpoint: candidates.filter((candidate) => candidate.cornerScope === "manhattan_greenpoint").length,
    franklin_greenpoint: candidates.filter((candidate) => candidate.cornerScope === "franklin_greenpoint").length,
  };
}

function isStaleFlatEvidencePath(filePath) {
  return filePath.startsWith("docs/mvp-reference-images/") && !filePath.startsWith(manhattanEvidenceRoot) && !filePath.startsWith(franklinEvidenceRoot);
}
