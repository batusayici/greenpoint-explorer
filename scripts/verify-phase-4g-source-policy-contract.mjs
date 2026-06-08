#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractPath = "docs/phase-4g-external-source-policy-coverage-audit-contract.md";

const requiredSnippets = [
  "Status: Batch 4G review artifact; accepted by Batu",
  "geometry sources can improve geometry confidence;",
  "facade imagery can support facade/frontage evidence review;",
  "neither lane proves business/storefront truth alone;",
  "Batu approval is required before access, audit execution, claim promotion, or production use.",
  "| Geometry confidence | NYC 3D, CityGML, 3DCityDB |",
  "| Facade evidence | Mapillary, KartaView |",
  "| Benchmark or narrow exception | Google 3D Tiles, Google Street View |",
  "| Visual-system acceleration | Qwen, Oxen |",
  "4G-A geometry audit fields:",
  "4G-B facade audit fields:",
  "facadeEvidenceSupport` with value `blocked_not_facade_evidence`",
  "businessStorefrontSupport` with value `blocked_not_business_or_storefront_evidence`",
  "geometryConfidenceSupport` with value `blocked_not_geometry_confidence_source`",
  "businessIdentitySupport` with value `blocked_not_business_identity_source`",
  "blocked_terms_or_access_unresolved",
];

const requiredUseCategories = [
  "Access",
  "Attribution",
  "Storage/cache",
  "Derivative use",
  "Extraction",
  "Benchmark use",
  "Render use",
  "Training/generation use",
  "Production use",
];

const requiredCommonFields = [
  "auditRecordId",
  "auditBatch",
  "sourceLane",
  "candidateSource",
  "sourceAccessStatus",
  "termsReviewStatus",
  "retrievalOrReviewDate",
  "reviewer",
  "corridorScope",
  "coverageScope",
  "allowedUses",
  "blockedUses",
  "attributionRequirement",
  "storageCachePolicy",
  "derivativeUsePolicy",
  "renderUsePolicy",
  "trainingUsePolicy",
  "productionUsePolicy",
  "claimSupportAllowed",
  "claimSupportBlocked",
  "normalModeExposure",
  "qaOnly",
  "reviewOnly",
  "unresolvedQuestions",
  "batuDecisionRequired",
];

const requiredBlockedClaims = [
  "storefront frontage",
  "storefront order",
  "entrance location",
  "tenant assignment",
  "business identity",
  "active status",
  "signage",
  "facade appearance",
  "material or color",
  "exact address placement",
  "production asset readiness",
  "public/product exactness",
];

const forbiddenPhrases = [
  "source access is approved",
  "source access approved",
  "ingestion is approved",
  "imagery storage is approved",
  "normal-mode exposure is approved",
  "production use is approved",
  "business linkage is approved",
  "storefront anchors are approved",
  "authoritative storefront",
  "authoritative frontage",
];

async function main() {
  const text = await readFile(resolve(repoRoot, contractPath), "utf8");
  const failures = [];

  for (const snippet of requiredSnippets) {
    if (!text.includes(snippet)) failures.push(`Missing required contract text: ${snippet}`);
  }

  for (const category of requiredUseCategories) {
    if (!text.includes(`| ${category} |`)) failures.push(`Missing use-category row: ${category}`);
  }

  for (const field of requiredCommonFields) {
    if (!text.includes(`\`${field}\``)) failures.push(`Missing common audit field: ${field}`);
  }

  for (const claim of requiredBlockedClaims) {
    if (!text.includes(claim)) failures.push(`Missing blocked claim boundary: ${claim}`);
  }

  for (const phrase of forbiddenPhrases) {
    if (text.toLowerCase().includes(phrase)) failures.push(`Forbidden promotion phrase appears: ${phrase}`);
  }

  assertSectionOrder(text, failures, [
    "## Purpose",
    "## Source Lanes",
    "## Allowed And Prohibited Uses",
    "## Claim Boundaries",
    "## Review-Only Coverage Audit Contract",
    "## Acceptance Criteria For Future Audit Opening",
    "## 4G Non-Authorization",
    "## Batu Review Questions",
  ]);

  if (failures.length > 0) {
    console.error(`4G source-policy contract verification failed for ${contractPath}:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${contractPath}: source lanes, use boundaries, audit fields, and non-authorization gates are present`);
}

function assertSectionOrder(text, failures, headings) {
  let previousIndex = -1;
  for (const heading of headings) {
    const index = text.indexOf(heading);
    if (index === -1) {
      failures.push(`Missing section: ${heading}`);
      continue;
    }
    if (index <= previousIndex) failures.push(`Section appears out of order: ${heading}`);
    previousIndex = index;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
